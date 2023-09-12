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

#include "ndn-consumer.hpp"
#include "ns3/ptr.h"
#include "ns3/log.h"
#include "ns3/simulator.h"
#include "ns3/packet.h"
#include "ns3/callback.h"
#include "ns3/string.h"
#include "ns3/boolean.h"
#include "ns3/uinteger.h"
#include "ns3/integer.h"
#include "ns3/double.h"

#include "utils/ndn-ns3-packet-tag.hpp"
#include "utils/ndn-rtt-mean-deviation.hpp"

#include <ndn-cxx/lp/tags.hpp>

#include <boost/lexical_cast.hpp>
#include <boost/ref.hpp>


#include <fstream>
#include "/home/couto/Desktop/ndnSIM/ns-3/src/ndnSIM/examples/httplib.h" // Include the cpp-httplib header
#include <filesystem>
#include <iostream>
#include <stdexcept>
#include <openssl/sha.h> // Requires OpenSSL for SHA-256 hashing
#include <openssl/evp.h> // For hashing using EVP
#include </home/couto/Desktop/ndnSIM/ns-3/src/ndnSIM/examples/json.hpp>
#include <map>

NS_LOG_COMPONENT_DEFINE("ndn.Consumer");

std::vector<uint8_t> m_receivedFileContent;
std::string m_receivedFileName;
std::string m_receivedGeralName;
int m_receivedNumberOfChunks;

std::string chunk_hashs[20]; // Define um array de caracteres (string) com tamanho 20
std::string chunk_names[20];



namespace ns3 {
namespace ndn {
std::string nameDecode(const std::string &input) {
  std::string decoded;
  for (size_t i = 0; i < input.size(); ++i) {
      if (input[i] == '%' && i + 2 < input.size()) {
          int hex1 = input[i + 1];
          int hex2 = input[i + 2];
          if (isxdigit(hex1) && isxdigit(hex2)) {
              char decodedChar = static_cast<char>((hex1 % 32 + 9) % 25 * 16 + (hex2 % 32 + 9) % 25);
              decoded += decodedChar;
              i += 2;
          }
          else {
              // Invalid URL encoding, keep '%' as is
              decoded += input[i];
          }
      }
      else {
          decoded += input[i];
      }
  }
  return decoded;
}
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


// Define a map to store Merkle trees for each m_receivedGeralName
std::map<std::string, MerkleTree> merkleTrees;

std::string calculateChunkHash(const std::string& filePath) {
    //print filePath
    std::cout << "File path is " << filePath << '\n';
    std::ifstream file(filePath, std::ios::binary);
    if (!file) {
        throw std::runtime_error("Error opening chunk file for reading.");
    }

    std::stringstream buffer;
    buffer << file.rdbuf();
    std::string chunkContent = buffer.str();

    return chunkContent; // Simply return the content of the chunk
}

void PrintReceivedFileContent()
{
    // Check if we have received any content
    if (m_receivedFileContent.empty())
    {
        NS_LOG_ERROR("Received empty content.");
        return;
    }

    // m_receivedFileContent name
    std::cout << "Received content name: " << m_receivedFileName << std::endl;

    // Define a filename to save the received content
    std::string m_receivedFileNamePath = "/home/couto/Desktop/ndnSIM/ns-3/downloads" + m_receivedFileName; // You can use any filename you prefer
    std::string m_receivedGeralNamePath = "/home/couto/Desktop/ndnSIM/ns-3/downloads/" + m_receivedGeralName; // You can use any filename you prefer
    // Open a local file for writing the received content
    std::ofstream outputFile(m_receivedFileNamePath, std::ios::binary);
    if (!outputFile)
    {
        NS_LOG_ERROR("Failed to open file for writing: " << m_receivedFileNamePath);
        return;
    }

    // Write the received content to the local file
    outputFile.write(reinterpret_cast<const char*>(m_receivedFileContent.data()), m_receivedFileContent.size());
    outputFile.close();

    // Print a message to the console indicating the file received and saved
    NS_LOG_INFO("Received and saved file: " << m_receivedFileNamePath);

    // You can also add code here to further process or display the received content as needed
    // Calculate Merkle tree root while downloading chunks  
    MerkleTree merkle_tree;

    // Retrieve the manifest file
    std::string manifest_name = "manifest_" + m_receivedGeralName;
    std::string manifest_path = "/home/couto/Desktop/ndnSIM/ns-3/manifests/" + manifest_name;

    // print manifest_path
    std::cout << "Manifest path is " << manifest_path << '\n';  

    std::ifstream manifest_file(manifest_path);
    if (!manifest_file) {
        throw std::runtime_error("Error opening manifest file for reading.");
    }

    nlohmann::json manifest_data;
    manifest_file >> manifest_data; 


    std::string merkle_tree_rootManifest = manifest_data["merkle_tree"].get<std::string>();
    int merkle_tree_number_of_chunks = manifest_data["numero_de_chunks"].get<int>();

    int chunk_number = m_receivedNumberOfChunks;

    std::string chunk_hash = calculateChunkHash(m_receivedFileNamePath); // Use the MerkleTree class to calculate the hash

    std::string prefix = m_receivedFileName;

    //print prefix
    std::cout << "Prefix is " << prefix << '\n';

    chunk_hash = sha256(chunk_hash);

    std::string chunk_hash_manif = manifest_data["chunks_hashs"]["chunk_" + std::to_string(chunk_number - 1)].get<std::string>();

    // print chunk_hash
    std::cout << "Chunk hash is " << chunk_hash << '\n';
    // print chunk_hash_manif
    std::cout << "Chunk hash from manifest is " << chunk_hash_manif << '\n';
    if (chunk_hash == chunk_hash_manif) {
        std::cout << "Hash matches. The chunk " << chunk_number << " is unaltered." << std::endl;
    } else {
        std::cout << "Hash doesn't match. The chunk " << chunk_number << " has been modified or corrupted." << std::endl;
    }
    // guardar chunk_hashs[chunk_number] = chunk_hash
    chunk_hashs[chunk_number] = chunk_hash;
    chunk_names[chunk_number] = m_receivedFileName;

    // Store or update the Merkle tree for the specific m_receivedGeralName
    merkleTrees[m_receivedGeralName] = merkle_tree;

    if (merkle_tree_number_of_chunks == chunk_number) {

      // Retrieve the corresponding Merkle tree for this m_receivedGeralName
      MerkleTree& currentMerkleTree = merkleTrees[m_receivedGeralName];

      for(int i = 0; i < merkle_tree_number_of_chunks; i++) {
        std::cout << "Chunk " << i + 1 << " hash is " << chunk_hashs[i + 1] << '\n';
        currentMerkleTree.add(chunk_hashs[i + 1]);
      }
      // Now you can call the root() function on the instance of MerkleTree
      std::string merkle_tree_rootTree = currentMerkleTree.root();

      // Compare the Merkle tree root with the one from the manifest

      std::cout << merkle_tree_rootTree << std::endl;
      std::cout << merkle_tree_rootManifest << std::endl;
        if (merkle_tree_rootTree == merkle_tree_rootManifest) {
            std::cout << "Merkle tree validation successful. The chunks are unaltered." << std::endl;
            std::cout << "Merkle Tree with " << currentMerkleTree.getNumLevels() << " levels" << std::endl;
        } else {
            std::cout << "Merkle tree validation failed. The chunks have been modified or corrupted." << std::endl;
        }



        // ------------------------------ CRIAR FILE com os chunks------------------------------
      // Create the output file by concatenating the downloaded chunks
      std::ofstream output_file(m_receivedGeralNamePath, std::ios::binary);

      //print output_path
      std::cout << "Output Path: " << m_receivedGeralNamePath << std::endl;
      if (!output_file) {
          throw std::runtime_error("Error opening output file for writing.");
      }
      for(int i = 1;i<=chunk_number;i++){
        std::cout << "Chunk " << i  << " hash is " << chunk_hashs[i] << '\n';
        std::string chunk_path = "/home/couto/Desktop/ndnSIM/ns-3/downloads/" + chunk_names[i];
        
        std::ifstream chunk_file(chunk_path, std::ios::binary);
          if (!chunk_file) {
              throw std::runtime_error("Error opening chunk file for reading.");
          }

          output_file << chunk_file.rdbuf();

          if (merkle_tree_number_of_chunks == chunk_number) {
              std::remove(chunk_path.c_str()); // Remove the individual chunk file after concatenating
          }

      }
      std::cout << "\nFile \"" << m_receivedGeralName << "\" created successfully\n" << std::endl;
      }
}

NS_OBJECT_ENSURE_REGISTERED(Consumer);

TypeId
Consumer::GetTypeId(void)
{
  static TypeId tid =
    TypeId("ns3::ndn::Consumer")
      .SetGroupName("Ndn")
      .SetParent<App>()
      .AddAttribute("StartSeq", "Initial sequence number", IntegerValue(0),
                    MakeIntegerAccessor(&Consumer::m_seq), MakeIntegerChecker<int32_t>())

      .AddAttribute("Prefix", "Name of the Interest", StringValue("/"),
                    MakeNameAccessor(&Consumer::m_interestName), MakeNameChecker())
      .AddAttribute("LifeTime", "LifeTime for interest packet", StringValue("2s"),
                    MakeTimeAccessor(&Consumer::m_interestLifeTime), MakeTimeChecker())

      .AddAttribute("RetxTimer",
                    "Timeout defining how frequent retransmission timeouts should be checked",
                    StringValue("50ms"),
                    MakeTimeAccessor(&Consumer::GetRetxTimer, &Consumer::SetRetxTimer),
                    MakeTimeChecker())

      .AddAttribute("FileName",
                    "Name of the file to request",
                    StringValue(""),
                    MakeStringAccessor(&Consumer::m_fileName),
                    MakeStringChecker())
      .AddAttribute("ChunkNumber",
                    "Number of the chunk to request",
                    IntegerValue(0),
                    MakeIntegerAccessor(&Consumer::m_chunkNumber),
                    MakeIntegerChecker<int32_t>())
      .AddTraceSource("LastRetransmittedInterestDataDelay",
                      "Delay between last retransmitted Interest and received Data",
                      MakeTraceSourceAccessor(&Consumer::m_lastRetransmittedInterestDataDelay),
                      "ns3::ndn::Consumer::LastRetransmittedInterestDataDelayCallback")

      .AddTraceSource("FirstInterestDataDelay",
                      "Delay between first transmitted Interest and received Data",
                      MakeTraceSourceAccessor(&Consumer::m_firstInterestDataDelay),
                      "ns3::ndn::Consumer::FirstInterestDataDelayCallback");

  return tid;
}

Consumer::Consumer()
  : m_rand(CreateObject<UniformRandomVariable>())
  , m_seq(0)
  , m_seqMax(0) // don't request anything
{
  NS_LOG_FUNCTION_NOARGS();

  m_rtt = CreateObject<RttMeanDeviation>();
}

void
Consumer::SetRetxTimer(Time retxTimer)
{
  m_retxTimer = retxTimer;
  if (m_retxEvent.IsRunning()) {
    // m_retxEvent.Cancel (); // cancel any scheduled cleanup events
    Simulator::Remove(m_retxEvent); // slower, but better for memory
  }

  // schedule even with new timeout
  m_retxEvent = Simulator::Schedule(m_retxTimer, &Consumer::CheckRetxTimeout, this);
}

Time
Consumer::GetRetxTimer() const
{
  return m_retxTimer;
}

void
Consumer::CheckRetxTimeout()
{
  Time now = Simulator::Now();

  Time rto = m_rtt->RetransmitTimeout();
  // NS_LOG_DEBUG ("Current RTO: " << rto.ToDouble (Time::S) << "s");

  while (!m_seqTimeouts.empty()) {
    SeqTimeoutsContainer::index<i_timestamp>::type::iterator entry =
      m_seqTimeouts.get<i_timestamp>().begin();
    if (entry->time + rto <= now) // timeout expired?
    {
      uint32_t seqNo = entry->seq;
      m_seqTimeouts.get<i_timestamp>().erase(entry);
      OnTimeout(seqNo);
    }
    else
      break; // nothing else to do. All later packets need not be retransmitted
  }

  m_retxEvent = Simulator::Schedule(m_retxTimer, &Consumer::CheckRetxTimeout, this);
}

// Application Methods
void
Consumer::StartApplication() // Called at time specified by Start
{
  NS_LOG_FUNCTION_NOARGS();

  // do base stuff
  App::StartApplication();

  ScheduleNextPacket();
}

void
Consumer::StopApplication() // Called at time specified by Stop
{
  NS_LOG_FUNCTION_NOARGS();

  // cancel periodic packet generation
  Simulator::Cancel(m_sendEvent);

  // cleanup base stuff
  App::StopApplication();
}

void
Consumer::SendPacket()
{
  if (!m_active)
    return;

  NS_LOG_FUNCTION_NOARGS();

  uint32_t seq = std::numeric_limits<uint32_t>::max(); // invalid

  while (m_retxSeqs.size()) {
    seq = *m_retxSeqs.begin();
    m_retxSeqs.erase(m_retxSeqs.begin());
    break;
  }

  if (seq == std::numeric_limits<uint32_t>::max()) {
    if (m_seqMax != std::numeric_limits<uint32_t>::max()) {
      if (m_seq >= m_seqMax) {
        return; // we are totally done
      }
    }

    seq = m_seq++;
  }

  //
  shared_ptr<Name> nameWithSequence = make_shared<Name>(m_interestName);
  nameWithSequence->appendSequenceNumber(seq);
  //

  // shared_ptr<Interest> interest = make_shared<Interest> ();
  shared_ptr<Interest> interest = make_shared<Interest>();
  interest->setNonce(m_rand->GetValue(0, std::numeric_limits<uint32_t>::max()));
  interest->setName(*nameWithSequence);
  interest->setCanBePrefix(false);
  time::milliseconds interestLifeTime(m_interestLifeTime.GetMilliSeconds());
  interest->setInterestLifetime(interestLifeTime);

  // NS_LOG_INFO ("Requesting Interest: \n" << *interest);
  NS_LOG_INFO("> Interest for " << seq);

  WillSendOutInterest(seq);

  m_transmittedInterests(interest, this, m_face);
  m_appLink->onReceiveInterest(*interest);

  ScheduleNextPacket();
}

///////////////////////////////////////////////////
//          Process incoming packets             //
///////////////////////////////////////////////////

void
Consumer::OnData(shared_ptr<const Data> data)
{
  if (!m_active)
    return;

  App::OnData(data); // tracing inside

  NS_LOG_FUNCTION(this << data);

  // NS_LOG_INFO ("Received content object: " << boost::cref(*data));

  // Retrieve the content from the Data packet
  const ::ndn::Block& contentBlock = data->getContent();
  const uint8_t* contentPtr = contentBlock.value();
  size_t contentSize = contentBlock.value_size();

  // Store the received content in the member variable
  m_receivedFileContent.assign(contentPtr, contentPtr + contentSize);

  // Extract and store the real file name from the Data packet's Name
  const Name& dataName = data->getName();
  if (dataName.size() > 0)
  {
      m_receivedFileName = nameDecode(dataName.getPrefix(-1).toUri()); // Assuming the real file name is the last component of the Name
      m_receivedGeralName = m_fileName;
      m_receivedNumberOfChunks = m_chunkNumber;
      // print m_receivedGeralName
      std::cout << "Received geral name is " << m_receivedGeralName << '\n';
      // You can adjust the index (-1) based on your naming convention.
  }
  else
  {
      m_receivedFileName = "unknown_file"; // Set a default name if the Name doesn't contain a valid file name component.
  }

  // Print or process the received content as needed
  PrintReceivedFileContent();

  // This could be a problem......
  uint32_t seq = data->getName().at(-1).toSequenceNumber();
  NS_LOG_INFO("< DATA for " << seq);

  int hopCount = 0;
  auto hopCountTag = data->getTag<lp::HopCountTag>();
  if (hopCountTag != nullptr) { // e.g., packet came from local node's cache
    hopCount = *hopCountTag;
  }
  NS_LOG_DEBUG("Hop count: " << hopCount);

  SeqTimeoutsContainer::iterator entry = m_seqLastDelay.find(seq);
  if (entry != m_seqLastDelay.end()) {
    m_lastRetransmittedInterestDataDelay(this, seq, Simulator::Now() - entry->time, hopCount);
  }

  entry = m_seqFullDelay.find(seq);
  if (entry != m_seqFullDelay.end()) {
    m_firstInterestDataDelay(this, seq, Simulator::Now() - entry->time, m_seqRetxCounts[seq], hopCount);
  }

  m_seqRetxCounts.erase(seq);
  m_seqFullDelay.erase(seq);
  m_seqLastDelay.erase(seq);

  m_seqTimeouts.erase(seq);
  m_retxSeqs.erase(seq);

  m_rtt->AckSeq(SequenceNumber32(seq));
}

void
Consumer::OnNack(shared_ptr<const lp::Nack> nack)
{
  /// tracing inside
  App::OnNack(nack);

  NS_LOG_INFO("NACK received for: " << nack->getInterest().getName()
              << ", reason: " << nack->getReason());
}

void
Consumer::OnTimeout(uint32_t sequenceNumber)
{
  NS_LOG_FUNCTION(sequenceNumber);
  // std::cout << Simulator::Now () << ", TO: " << sequenceNumber << ", current RTO: " <<
  // m_rtt->RetransmitTimeout ().ToDouble (Time::S) << "s\n";

  m_rtt->IncreaseMultiplier(); // Double the next RTO
  m_rtt->SentSeq(SequenceNumber32(sequenceNumber),
                 1); // make sure to disable RTT calculation for this sample
  m_retxSeqs.insert(sequenceNumber);
  ScheduleNextPacket();
}

void
Consumer::WillSendOutInterest(uint32_t sequenceNumber)
{
  NS_LOG_DEBUG("Trying to add " << sequenceNumber << " with " << Simulator::Now() << ". already "
                                << m_seqTimeouts.size() << " items");

  m_seqTimeouts.insert(SeqTimeout(sequenceNumber, Simulator::Now()));
  m_seqFullDelay.insert(SeqTimeout(sequenceNumber, Simulator::Now()));

  m_seqLastDelay.erase(sequenceNumber);
  m_seqLastDelay.insert(SeqTimeout(sequenceNumber, Simulator::Now()));

  m_seqRetxCounts[sequenceNumber]++;

  m_rtt->SentSeq(SequenceNumber32(sequenceNumber), 1);
}

} // namespace ndn
} // namespace ns3
