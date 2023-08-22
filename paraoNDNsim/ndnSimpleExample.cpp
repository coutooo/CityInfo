#include "ns3/core-module.h"
#include "ns3/network-module.h"
#include "ns3/ndnSIM-module.h"

#include "ns3/point-to-point-module.h"
#include "ns3/point-to-point-layout-module.h"

#include <sys/socket.h>
#include <netinet/in.h>

// Global variable to store the received prefixes
std::vector<std::string> receivedPrefixes;

namespace ns3 {

// Function to handle incoming prefixes from Python script
void receivePrefixes(int port) {
    int serverSocket = socket(AF_INET, SOCK_STREAM, 0);
    if (serverSocket == -1) {
        std::cerr << "Error creating socket" << std::endl;
        return;
    }

    sockaddr_in serverAddress;
    serverAddress.sin_family = AF_INET;
    serverAddress.sin_addr.s_addr = INADDR_ANY;
    serverAddress.sin_port = htons(port);

    if (bind(serverSocket, (struct sockaddr*)&serverAddress, sizeof(serverAddress)) == -1) {
        std::cerr << "Error binding socket" << std::endl;
        return;
    }

    if (listen(serverSocket, 1) == -1) {
        std::cerr << "Error listening on socket" << std::endl;
        return;
    }

    while (true) {
        int clientSocket = accept(serverSocket, nullptr, nullptr);
        if (clientSocket == -1) {
            std::cerr << "Error accepting connection" << std::endl;
            continue;
        }

        char buffer[1024];
        ssize_t bytesRead = recv(clientSocket, buffer, sizeof(buffer), 0);
        if (bytesRead <= 0) {
            close(clientSocket);
            continue;
        }

        std::string receivedPrefix(buffer, bytesRead);
        receivedPrefixes.push_back(receivedPrefix);
        
        // Print the received prefixes
        std::cout << "Received prefix: " << receivedPrefix << std::endl;

        close(clientSocket);
    }
}

NS_LOG_COMPONENT_DEFINE("SimpleNDNExample");

void onData(std::shared_ptr<const ndn::Data> data) {
    NS_LOG_INFO("Received Data: " << data->getName());
    // Process the received data here
}

void onInterest(std::shared_ptr<const ndn::Interest> interest) {
    NS_LOG_INFO("Received Interest: " << interest->getName());
    // Process the received interest here and send Data if available
}   

int main(int argc, char* argv[]) {
    // Start a thread to receive incoming prefixes
    int port = 12345; // Change to the desired port number
    std::thread receiveThread(receivePrefixes, port);
    receiveThread.detach();

    std::string end = "end";

    CommandLine cmd;
    cmd.Parse(argc, argv);

    while (receivedPrefixes.empty()) {
        // Wait until "end" prefix is received or the vector is empty
    }
    while (receivedPrefixes.back() != end) {
        // Wait until "end" prefix is received or the vector is empty
    }

    
    // Create nodes
    Ptr<Node> node = CreateObject<Node>();

    // Install NDN stack on the node
    ndn::StackHelper ndnHelper;
    ndnHelper.Install(node);

    for (int i = 0; i < receivedPrefixes.size()-1; ++i) {

        // Set up consumer
        ndn::AppHelper consumerHelper("ns3::ndn::ConsumerCbr");
        consumerHelper.SetPrefix(receivedPrefixes[i]);
        consumerHelper.SetAttribute("Frequency", StringValue("10")); // 1 interest per second
        consumerHelper.Install(node);

        // Set up producer
        ndn::AppHelper producerHelper("ns3::ndn::Producer");
        producerHelper.SetPrefix(receivedPrefixes[i]);
        producerHelper.Install(node);
    }

    // Set up FIB
    ndn::GlobalRoutingHelper ndnGlobalRoutingHelper;
    ndnGlobalRoutingHelper.InstallAll();

    // Connect consumers and producers to the network
    PointToPointHelper p2p;
    p2p.Install(node, node);

    // Set up callback functions for data and interests
    ndn::AppDelayTracer::Install(node, "app-delays-trace.txt");
    ndn::AppDelayTracer::InstallAll("app-delays-trace-all.txt");
    ndn::L3RateTracer::Install(node, "rate-trace.txt", Seconds(1.0));
    ndn::L3RateTracer::InstallAll("rate-trace-all.txt", Seconds(1.0));
    ndn::GlobalRoutingHelper::CalculateRoutes();


    Simulator::Stop(Seconds(10.0));

    // Run simulation
    Simulator::Run();
    Simulator::Destroy();

    return 0;
}

} // namespace ns3

int main(int argc, char* argv[]) {
    return ns3::main(argc, argv);
}
