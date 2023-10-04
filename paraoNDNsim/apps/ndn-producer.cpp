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

#include "ndn-producer.hpp"
#include "ns3/log.h"
#include "ns3/string.h"
#include "ns3/uinteger.h"
#include "ns3/packet.h"
#include "ns3/simulator.h"

#include "model/ndn-l3-protocol.hpp"
#include "helper/ndn-fib-helper.hpp"

#include <memory>

#include <fstream>
#include <iostream> // For error handling
#include <filesystem>

NS_LOG_COMPONENT_DEFINE("ndn.Producer");

namespace ns3 {
namespace ndn {

std::string urlDecode(const std::string &input) {
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

NS_OBJECT_ENSURE_REGISTERED(Producer);

TypeId
Producer::GetTypeId(void)
{
  static TypeId tid =
    TypeId("ns3::ndn::Producer")
      .SetGroupName("Ndn")
      .SetParent<App>()
      .AddConstructor<Producer>()
      .AddAttribute("Prefix", "Prefix, for which producer has the data", StringValue("/"),
                    MakeNameAccessor(&Producer::m_prefix), MakeNameChecker())
      .AddAttribute("ChunkNumber",
                    "Number of chunks to produce (0 - unlimited)",
                    UintegerValue(0),
                    MakeUintegerAccessor(&Producer::m_chunkNumber),
                    MakeUintegerChecker<uint32_t>())
      .AddAttribute(
         "Postfix",
         "Postfix that is added to the output data (e.g., for adding producer-uniqueness)",
         StringValue("/"), MakeNameAccessor(&Producer::m_postfix), MakeNameChecker())
      .AddAttribute("PayloadSize", "Virtual payload size for Content packets", UintegerValue(1024),
                    MakeUintegerAccessor(&Producer::m_virtualPayloadSize),
                    MakeUintegerChecker<uint32_t>())
      .AddAttribute("Freshness", "Freshness of data packets, if 0, then unlimited freshness",
                    TimeValue(Seconds(0)), MakeTimeAccessor(&Producer::m_freshness),
                    MakeTimeChecker())
      .AddAttribute(
         "Signature",
         "Fake signature, 0 valid signature (default), other values application-specific",
         UintegerValue(0), MakeUintegerAccessor(&Producer::m_signature),
         MakeUintegerChecker<uint32_t>())
      .AddAttribute("KeyLocator",
                    "Name to be used for key locator.  If root, then key locator is not used",
                    NameValue(), MakeNameAccessor(&Producer::m_keyLocator), MakeNameChecker());
  return tid;
}

Producer::Producer()
{
  NS_LOG_FUNCTION_NOARGS();
}

// inherited from Application base class.
void
Producer::StartApplication()
{
  NS_LOG_FUNCTION_NOARGS();
  App::StartApplication();

  for(int i = 1; i<= m_chunkNumber;i++)
  {
    size_t dotPos = m_prefix.toUri().rfind('.');

    std::string extension = (dotPos != std::string::npos) ? m_prefix.toUri().substr(dotPos) : "";

    std::string m_prefixWithoutExtension = m_prefix.toUri();
    // Remove the extension from the m_prefix
    if (!extension.empty()) {
        m_prefixWithoutExtension = m_prefix.toUri().substr(0, dotPos);
    }
    std::string prefix = "/" + m_prefixWithoutExtension + "#" + std::to_string(i) + extension;
    FibHelper::AddRoute(GetNode(), prefix, m_face, 0);
  }
  
}

void
Producer::StopApplication()
{
  NS_LOG_FUNCTION_NOARGS();

  App::StopApplication();
}

void
Producer::OnInterest(shared_ptr<const Interest> interest)
{
  App::OnInterest(interest); // tracing inside

  NS_LOG_FUNCTION(this << interest);


  // print estou aqui
  std::cout << "Estou aqui" << '\n';

  if (!m_active)
    return;

  Name dataName(interest->getName());
  // dataName.append(m_postfix);
  // dataName.appendVersion();

  auto data = make_shared<Data>();
  data->setName(dataName);
  data->setFreshnessPeriod(::ndn::time::milliseconds(m_freshness.GetMilliSeconds()));

  // data->setContent(make_shared< ::ndn::Buffer>(m_virtualPayloadSize));

  std::filesystem::path cwd = std::filesystem::current_path() / "producer_files";

  std::string dataNameDecoded = urlDecode(dataName.getPrefix(-1).toUri());

  //print dataName
  std::cout << "Data name is " << dataNameDecoded << '\n';

  // Define the full path to the file.
  std::string filePath = cwd.string() + dataNameDecoded;

  std::cout << "File path is " << filePath << '\n';

  // Read the content of the file and set it as the Data packet's content.
  std::ifstream inputFile(filePath, std::ios::binary); // Open the file in binary mode.
  if (inputFile)
  {
      // Determine the file's size.
      inputFile.seekg(0, std::ios::end);
      size_t fileSize = inputFile.tellg();
      inputFile.seekg(0, std::ios::beg);

      // Create a buffer to hold the file's content.
      ::ndn::Buffer contentBuffer(fileSize);

      // Read the file into the buffer.
      inputFile.read(reinterpret_cast<char*>(contentBuffer.data()), fileSize);

      // Set the buffer as the Data packet's content.
      data->setContent(contentBuffer);

      // Close the file.
      inputFile.close();
  }
  else
  {
      // Handle the case where the file couldn't be opened.
      NS_LOG_ERROR("Failed to open file");
      // Optionally, you can set an error response in the Data packet.
      // data->setNackReason(::ndn::lp::NackReason::NETWORK_ERROR);
  }

  SignatureInfo signatureInfo(static_cast< ::ndn::tlv::SignatureTypeValue>(255));

  if (m_keyLocator.size() > 0) {
    signatureInfo.setKeyLocator(m_keyLocator);
  }

  data->setSignatureInfo(signatureInfo);

  ::ndn::EncodingEstimator estimator;
  ::ndn::EncodingBuffer encoder(estimator.appendVarNumber(m_signature), 0);
  encoder.appendVarNumber(m_signature);
  data->setSignatureValue(encoder.getBuffer());

  NS_LOG_INFO("node(" << GetNode()->GetId() << ") responding with Data: " << data->getName());

  // to create real wire encoding
  data->wireEncode();

  m_transmittedDatas(data, this, m_face);
  m_appLink->onReceiveData(*data);
}

} // namespace ndn
} // namespace ns3
