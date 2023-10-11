/* -*- Mode:C++; c-file-style:"gnu"; indent-tabs-mode:nil; -*- */
/**
 * Copyright (c) 2011-2015  Regents of the University of California.
 *
 * This file is part of ndnSIM. See AUTHORS for complete list of ndnSIM authors and
 * contributors.
 *
 * ndnSIM is free software: you can redistribute it and/or modify it under the terms
 * of the GNU General Public License as published by the Free Software Foundation,
 * either version 3 of the License, or (at your option) any later version.
 *
 * ndnSIM is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR
 * PURPOSE.  See the GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along with
 * ndnSIM, e.g., in COPYING.md file.  If not, see <http://www.gnu.org/licenses/>.
 **/

// ndn-grid.cpp

#include "ns3/core-module.h"
#include "ns3/network-module.h"
#include "ns3/point-to-point-module.h"
#include "ns3/point-to-point-layout-module.h"
#include "ns3/ndnSIM-module.h"
#include "/home/couto/Desktop/ndnSIM/ns-3/src/ndnSIM/apps/ndn-consumer-cbr.hpp"
#include "/home/couto/Desktop/ndnSIM/ns-3/src/ndnSIM/NFD/daemon/table/fib-entry.hpp"
#include "ns3/applications-module.h"
#include "ns3/ndnSIM/ndn-cxx/data.hpp"
#include "ns3/ndnSIM/ndn-cxx/name.hpp"

#include <iostream>
#include <string>
#include <exception>
#include "httplib.h" // Include the cpp-httplib header
#include <fstream>
#include <filesystem>
#include <sstream>
#include <map>
#include <vector>
#include <algorithm>
#include <iomanip>
#include <openssl/sha.h> // Requires OpenSSL for SHA-256 hashing
#include </home/couto/Desktop/ndnSIM/ns-3/src/ndnSIM/examples/json.hpp>
#include <openssl/evp.h> // For hashing using EVP


namespace ns3 {

  NS_LOG_COMPONENT_DEFINE("ndn.TestGrid");

/**
 * This scenario simulates a grid topology (using PointToPointGrid module)
 *
 * (consumer) -- ( ) ----- ( )
 *     |          |         |
 *    ( ) ------ ( ) ----- ( )
 *     |          |         |
 *    ( ) ------ ( ) -- (producer)
 *
 * All links are 1Mbps with propagation 10ms delay.
 *
 * FIB is populated using NdnGlobalRoutingHelper.
 *
 * Consumer requests data from producer with frequency 100 interests per second
 * (interests contain constantly increasing sequence number).
 *
 * For every received interest, producer replies with a data packet, containing
 * 1024 bytes of virtual payload.
 *
 * To run scenario and see what is happening, use the following command:
 *
 *     NS_LOG=ndn.Consumer:ndn.Producer ./waf --run=ndn-gridTest
 */

class MerkleTree {
private:
    std::vector<std::string> leaves;
    size_t num_levels;

    std::string computeParentHash(const std::string& left_child, const std::string& right_child) {
        std::string combined = left_child + right_child;
        return sha256(combined);
    }

    std::vector<std::string> computeNextLevel(const std::vector<std::string>& level) {
        std::vector<std::string> next_level;
        for (size_t i = 0; i < level.size(); i += 2) {
            std::string left_child = level[i];
            std::string right_child = (i + 1 < level.size()) ? level[i + 1] : level[i];
            std::string parent = computeParentHash(left_child, right_child);
            next_level.push_back(parent);
        }
        return next_level;
    }

public:
    MerkleTree() : num_levels(0) {}

    void add(const std::string& data) {
        std::string leaf = sha256(data);
        leaves.push_back(leaf);
    }

    std::string root() {
        if (leaves.empty()) {
            return "";
        }
        if (leaves.size() == 1) {
            return leaves[0];
        }

        std::vector<std::string> tree = leaves;
        num_levels = 0; // Reset the number of levels
        while (tree.size() > 1) {
            tree = computeNextLevel(tree);
            num_levels++;
        }
        return tree[0];
    }

    // Getter method to access the num_levels property
    size_t getNumLevels() const {
        return num_levels;
    }

    // Function to calculate the SHA-256 hash of a given string
    std::string sha256(const std::string& input) {
        unsigned char hash[SHA256_DIGEST_LENGTH];
        SHA256_CTX sha256;
        SHA256_Init(&sha256);
        SHA256_Update(&sha256, input.c_str(), input.length());
        SHA256_Final(hash, &sha256);

        char hex[2 * SHA256_DIGEST_LENGTH + 1];
        for (int i = 0; i < SHA256_DIGEST_LENGTH; i++)
            sprintf(hex + 2 * i, "%02x", hash[i]);

        return std::string(hex);
    }
};

// Callback function to handle incoming data packets
void OnDataReceived(std::string context, const ndn::Data* data);

void OnInterestReceived(std::string context, const ndn::Interest* interest);

int runNDNSimulation(const std::string prefix){
      // Enable logging for ndn.Consumer and ndn.Producer modules
  LogComponentEnable("ndn.Consumer", LOG_LEVEL_INFO);
  LogComponentEnable("ndn.Producer", LOG_LEVEL_INFO);

  // Setting default parameters for PointToPoint links and channels
  Config::SetDefault("ns3::PointToPointNetDevice::DataRate", StringValue("1Mbps"));
  Config::SetDefault("ns3::PointToPointChannel::Delay", StringValue("10ms"));
  Config::SetDefault("ns3::DropTailQueue<Packet>::MaxSize", StringValue("10p"));

  // Creating 3x3 topology
  PointToPointHelper p2p;
  PointToPointGridHelper grid(3, 3, p2p);
  grid.BoundingBox(100, 100, 200, 200); // distancia em meters entre os nos

  // Install NDN stack on all nodes
  ndn::StackHelper ndnHelper;
  ndnHelper.InstallAll();

  // Set BestRoute strategy
  ndn::StrategyChoiceHelper::InstallAll("/", "/localhost/nfd/strategy/best-route");

  // Installing global routing interface on all nodes
  ndn::GlobalRoutingHelper ndnGlobalRoutingHelper;
  ndnGlobalRoutingHelper.InstallAll();

  // Getting containers for the consumer/producer
  Ptr<Node> producer = grid.GetNode(2, 2);
  NodeContainer consumerNodes;
  consumerNodes.Add(grid.GetNode(0, 0));

  // asks in execution the prefix name
  //std::cout << "Enter the prefix name: ";
  //std::string prefixName;
  //std::cin >> prefixName;
  //std::cout << "The prefix name is: " << prefixName << std::endl;
  // Install NDN applications
  //std::string prefix = prefixName; //"/aveiro";

// Create a Data packet with a specific Name
 // ndn::Name dataName("/aveiro");
 // ndn::shared_ptr<ndn::Data> dataPacket = std::make_shared<ndn::Data>(dataName);

  // Set the content of the Data packet
  //std::string content = "Hello, ndnSIM!";
  //dataPacket->setContent(reinterpret_cast<const uint8_t*>(content.c_str()), content.size());

  ndn::AppHelper consumerHelper("ns3::ndn::ConsumerCbr");
  consumerHelper.SetPrefix(prefix);
  consumerHelper.SetAttribute("Frequency", StringValue("10")); // 10 interests a second antes tava 100
  //consumerHelper.Install(consumerNodes);
  // Install the consumer application on the consumer node
  ApplicationContainer consumerApps = consumerHelper.Install(consumerNodes);
  consumerApps.Start(Seconds(0.0));

  //debug print este funfa
  NS_LOG_UNCOND("consumerApps.Get() = " << consumerApps.Get(0)); // pointer to the application
  NS_LOG_UNCOND("consumerApps.GetN() = " << consumerApps.GetN());// total number of applications in the container
  
  ndn::AppHelper producerHelper("ns3::ndn::Producer");
  producerHelper.SetPrefix(prefix);
  producerHelper.SetAttribute("PayloadSize", StringValue("1024"));
  // Set other attributes for Producer application, e.g., payload size
  ApplicationContainer producerApp = producerHelper.Install(producer);
  producerApp.Start(Seconds(0));

  NS_LOG_UNCOND("AQUIIIIIIIIIIIIIIIIIIIIII");
  // Add a callback to handle incoming data packets
  consumerApps.Get(0)->TraceConnectWithoutContext("DataReceived", MakeCallback(&OnDataReceived));

  NS_LOG_UNCOND("111111111111111111111111111111111");
  //producerApp.Get(0)->TraceConnectWithoutContext("InterestReceived", MakeCallback(&OnInterestReceived));
  producerApp.Get(0)->TraceConnectWithoutContext("InterestReceived", MakeCallback(&OnInterestReceived));



  // Add /prefix origins to ndn::GlobalRouter
  ndnGlobalRoutingHelper.AddOrigins(prefix, producer);

  NS_LOG_UNCOND("3333333333333333333333333");

  // Calculate and install FIBs

  // erro da aqui
  ndn::GlobalRoutingHelper::CalculateRoutes();

  NS_LOG_UNCOND("4444444444444444444444");

  Simulator::Stop(Seconds(20.0));

  // ndn::L3RateTracer::InstallAll("rate-trace.txt", Seconds(0.5));
  ndn::CsTracer::InstallAll("cs-trace.txt", Seconds(1));

  Simulator::Run();
  Simulator::Destroy();

  return 0;
}

void searchData();

void execute();

std::string handle_manifest_request(const std::string& file);

std::string handle_save_manifest(const std::string& filename, const std::string& buffer);

std::string calculateChunkHash(const std::string& filePath);

void handle_download(const std::string& filename, int start_chunk, int end_chunk);

std::string sha256(const std::string& str) {
    unsigned char hash[SHA256_DIGEST_LENGTH];
    SHA256_CTX sha256;
    SHA256_Init(&sha256);
    SHA256_Update(&sha256, str.c_str(), str.size());
    SHA256_Final(hash, &sha256);

    std::stringstream ss;
    for (int i = 0; i < SHA256_DIGEST_LENGTH; ++i) {
        ss << std::hex << std::setw(2) << std::setfill('0') << static_cast<int>(hash[i]);
    }

    return ss.str();
}

std::string download_chunk(const std::string& base_url, int chunk_number, const std::string& filename);

int
main(int argc, char* argv[])
{
    execute();
}

void OnDataReceived(std::string context, const ndn::Data* data) {
    // Log info to check if the callback is called
    NS_LOG_UNCOND("OnDataReceived called");

    NS_LOG_INFO("Received data packet for " << data->getName());

    std::cout << "Data Received: " << data->getName() << std::endl;
    // Add your code here to process the received data packet
    
}

void OnInterestReceived(std::string context, const ndn::Interest* interest) {
    // Process the received Interest packet here and send a Data packet in response
    NS_LOG_INFO("Received Interest packet for " << interest->getName());

    // Create a Data packet with the same name as the Interest
    ndn::shared_ptr<ndn::Data> dataPacket = std::make_shared<ndn::Data>(interest->getName());

    // Set the content of the Data packet (e.g., payload)
    //std::string content = "Hello, this is the content!";
    //dataPacket->setContent(reinterpret_cast<const uint8_t*>(content.c_str()), content.size());
}

void searchData() {
    const std::string url = "http://localhost:8080/execute";

    // Get the search filter from the user
    std::cout << "Filter Data in the Blockchain: ";
    std::string search;
    std::cin >> search;
    std::cout << "The search name is: " << search << std::endl;

    // Prepare the request text
    std::string text = "cityinfo showdata " + search;

    try {
        // Prepare the request body
        std::string jsonBody = "{\"text\":\"" + text + "\"}";

        // Create an httplib client and send the POST request
        httplib::Client cli("localhost", 8080);

        auto res = cli.Post(url.c_str(), jsonBody, "application/json");

        if (res && res->status == 200) {
            std::cout << "Response: " << res->body << std::endl;
        } else {
            std::cerr << "HTTP request failed with code: " << (res ? res->status : -1) << std::endl;
        }
    } catch (const std::exception& error) {
        std::cerr << "Error: " << error.what() << std::endl;
    }
}

void execute() {
    const std::string url = "http://localhost:8080/execute";
    const std::string text = "sawtooth keygen forum";

    try {
        // Prepare the request body in JSON format
        std::string jsonBody = "{\"text\":\"" + text + "\"}";

        // Prepare the request body in JSON format
        //nlohmann::json jsonBody = {
        //    {"text", text}
        //};

        // Create an httplib client and send the POST request
        httplib::Client cli("localhost", 8080);
        auto res = cli.Post(url.c_str(), jsonBody, "application/json");

        if (res && res->status == 200) {
            std::string content_type = res->get_header_value("Content-Type");
            std::string data;

            if (content_type.find("application/json") != std::string::npos) {
                // JSON response
                data = res->body;
            } else {
                // Handle non-JSON response here
                data = "{'message': '" + res->body + "'}";
            }

            std::cout << data << std::endl;
            std::cout << "Producer Registered..." << std::endl;
        } else {
            std::cerr << "HTTP request failed with code: " << (res ? res->status : -1) << std::endl;
        }
    } catch (const std::exception& error) {
        std::cerr << "Error: " << error.what() << std::endl;
    }

    // Input to continue the script
    std::cout << "Waiting for the producer upload...(PRESS ENTER)" << std::endl;
    std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n');

    while (true) {
        std::cout << "1. Search in Blockchain" << std::endl;
        std::cout << "2. Get Manifest" << std::endl;
        std::cout << "3. Download Chunks" << std::endl;
        std::cout << "4. Verify File Signature" << std::endl;
        std::cout << "0. Exit" << std::endl;

        std::string choice;
        std::cout << "Enter your choice (1-4): ";
        std::cin >> choice;

        if (choice == "1") {
            ns3::searchData();
        } else if (choice == "2") {
            std::string file;
            std::cout << "Enter the filename: ";
            std::cin >> file;
            ns3::handle_manifest_request(file);
        } else if (choice == "3") {
            std::string filename;
            int start_chunk, end_chunk;
            std::cout << "Filename: ";
            std::cin >> filename;
            std::cout << "Start Chunk: ";
            std::cin >> start_chunk;
            std::cout << "End Chunk: ";
            std::cin >> end_chunk;

            ns3::handle_download(filename, start_chunk, end_chunk);
        } else if (choice == "4") {
            std::string manifest_name;
            std::cout << "File Name: ";
            std::cin >> manifest_name;
            // checkSignatures(manifest_name);
        } else if (choice == "0") {
            break;
        } else {
            std::cout << "Invalid choice. Please try again." << std::endl;
        }
    }
}

std::string handle_manifest_request(const std::string& file) {
    if (file.empty()) {
        return "{'error': 'Filename parameter is missing'}";
    }

    try {
        // Create the URL for the GET request
        std::string url = "http://localhost:5000/api/manifest?file=" + file;

        // Create an httplib client and send the GET request
        httplib::Client cli("localhost", 5000);
        auto res = cli.Get(url.c_str());

        if (res && res->status == 200) {
            // Retrieve the buffer from the response content
            std::string buffer = res->body;

            // Call a function to handle saving the manifest
            ns3::handle_save_manifest(file, buffer);

            return buffer;
        } else {
            throw std::runtime_error("Error: " + std::to_string(res ? res->status : -1));
        }
    } catch (const std::exception& e) {
        std::cerr << e.what() << std::endl;
        return "{'error': 'Failed to retrieve manifest'}";
    }
}
std::string handle_save_manifest(const std::string& filename, const std::string& buffer) {
    if (filename.empty() || buffer.empty()) {
        return "{'error': 'Filename or buffer is missing'}";
    }

    try {
        std::filesystem::path output_dir = std::filesystem::current_path() / "manifests";
        std::filesystem::path file_path = output_dir / ("manifest_" + filename);

        // print file_path  
        //std::cout << "File Path: " << file_path << std::endl;

        std::ofstream file(file_path, std::ios::binary);
        if (file.is_open()) {
            file.write(buffer.c_str(), buffer.size());
            file.close();

            // print manifest
            std::cout << "Manifest: " << buffer << std::endl;

            return "{'message': 'Manifest file saved successfully'}";
        } else {
            throw std::runtime_error("Failed to open file for writing.");
        }
    } catch (const std::exception& e) {
        std::cerr << e.what() << std::endl;
        return "{'error': 'Failed to save manifest file'}";
    }
}
std::string calculateChunkHash(const std::string& filePath) {
    std::ifstream file(filePath, std::ios::binary);
    if (!file) {
        throw std::runtime_error("Error opening chunk file for reading.");
    }

    std::stringstream buffer;
    buffer << file.rdbuf();
    std::string chunkContent = buffer.str();

    return chunkContent; // Simply return the content of the chunk
}

void handle_download(const std::string& filename, int start_chunk, int end_chunk) {
    const std::string base_url = "http://localhost:5000/api/request_chunk";

    // Calculate Merkle tree root while downloading chunks
    MerkleTree merkle_tree;
    std::map<int, std::string> downloaded_chunks; // Dictionary to store the downloaded chunks

    // Retrieve the manifest file
    std::string manifest_name = "manifest_" + filename;
    std::string manifest_path = "manifests/" + manifest_name;

    std::ifstream manifest_file(manifest_path);
    if (!manifest_file) {
        throw std::runtime_error("Error opening manifest file for reading.");
    }

    nlohmann::json manifest_data;
    manifest_file >> manifest_data;


    std::string merkle_tree_rootManifest = manifest_data["merkle_tree"].get<std::string>();
    int merkle_tree_number_of_chunks = manifest_data["numero_de_chunks"].get<int>();


    for (int chunk_number = start_chunk; chunk_number <= end_chunk; ++chunk_number) {
        std::string chunk_filename = ns3::download_chunk(base_url, chunk_number, filename);

        if (!chunk_filename.empty()) {
            downloaded_chunks[chunk_number] = chunk_filename;

            // Calculate hash of the downloaded chunk
            std::string chunk_path = "downloads/" + chunk_filename;
            
            std::string chunk_hash = calculateChunkHash(chunk_path); // Use the MerkleTree class to calculate the hash

            chunk_hash = sha256(chunk_hash);

            std::string chunk_hash_manif = manifest_data["chunks_hashs"]["chunk_" + std::to_string(chunk_number - 1)].get<std::string>();

            if (chunk_hash == chunk_hash_manif) {
                std::cout << "Hash matches. The chunk " << chunk_number << " is unaltered." << std::endl;
            } else {
                std::cout << "Hash doesn't match. The chunk " << chunk_number << " has been modified or corrupted." << std::endl;
            }
            merkle_tree.add(chunk_hash);
        }
    }

    // Now you can call the root() function on the instance of MerkleTree
    std::string merkle_tree_rootTree = merkle_tree.root();
    std::cout << merkle_tree_rootManifest << std::endl;

    // Compare the Merkle tree root with the one from the manifest

    std::cout << merkle_tree_rootTree << std::endl;
    std::cout << merkle_tree_rootManifest << std::endl;
    if (merkle_tree_number_of_chunks == (end_chunk - start_chunk + 1)) {
        if (merkle_tree_rootTree == merkle_tree_rootManifest) {
            std::cout << "Merkle tree validation successful. The chunks are unaltered." << std::endl;
            std::cout << "Merkle Tree with " << merkle_tree.getNumLevels() << " levels" << std::endl;
        } else {
            std::cout << "Merkle tree validation failed. The chunks have been modified or corrupted." << std::endl;
        }
    }

    // Sort the downloaded chunks based on the chunk number
    std::vector<std::pair<int, std::string>> sorted_chunks(downloaded_chunks.begin(), downloaded_chunks.end());
    std::sort(sorted_chunks.begin(), sorted_chunks.end());

    // Create the output file by concatenating the downloaded chunks
    std::string output_path = "downloads/" + filename;
    std::ofstream output_file(output_path, std::ios::binary);
    if (!output_file) {
        throw std::runtime_error("Error opening output file for writing.");
    }

    for (const auto& entry : sorted_chunks) {
        int chunk_number = entry.first;
        const std::string& chunk_filename = entry.second;
        std::string chunk_path = "downloads/" + chunk_filename;

        std::ifstream chunk_file(chunk_path, std::ios::binary);
        if (!chunk_file) {
            throw std::runtime_error("Error opening chunk file for reading.");
        }

        output_file << chunk_file.rdbuf();

        if (merkle_tree_number_of_chunks == (end_chunk - start_chunk + 1)) {
            std::remove(chunk_path.c_str()); // Remove the individual chunk file after concatenating
        }
    }

    std::cout << "\nFile \"" << filename << "\" created successfully\n" << std::endl;
}

std::string download_chunk(const std::string& base_url, int chunk_number, const std::string& filename) {
    std::string url = base_url + "/" + std::to_string(chunk_number) + "?filename=" + filename;

    std::string prefix = "/aveiro";
    runNDNSimulation(prefix); // test
    // print url
    std::cout << "URL: " << url << std::endl;

    // httplib::Client client(base_url.c_str());
    // Create an httplib client and send the POST request
    httplib::Client cli("localhost", 5000);
    auto res = cli.Get(url.c_str());
    // Retrieve the manifest file
    std::string manifest_name = "manifest_" + filename;
    std::string manifest_path = "manifests/" + manifest_name;

    std::ifstream manifest_file(manifest_path);
    if (!manifest_file) {
        std::cerr << "Error opening manifest file for reading." << std::endl;
        return "";
    }

    // Read the JSON data from the manifest_file
    nlohmann::json manifest_data;
    manifest_file >> manifest_data;

    // Access the "chunks_hashs" object from the JSON data
    const nlohmann::json& index_hashes = manifest_data["chunks_hashs"];


    if (res && res->status == 200) {
        std::string chunk_filename = index_hashes["chunk_" + std::to_string(chunk_number - 1)].get<std::string>();
        std::string download_path = "downloads/" + chunk_filename;

        std::ofstream file(download_path, std::ios::binary);
        if (!file) {
            std::cerr << "Error opening file for writing." << std::endl;
            return "";
        }

        file << res->body;
        std::cout << "Chunk " << chunk_filename << " downloaded successfully" << std::endl;
        return chunk_filename;
    } else {
        std::cerr << "Error downloading chunk " << chunk_number << ": " << res.error() << std::endl;
        return "";
    } 
} 
}// namespace ns3

int
main(int argc, char* argv[])
{
  return ns3::main(argc, argv);
}
