/*******************************************************************************
 * cityinfo-tp Transaction Processor written in C++.
 ******************************************************************************/

#include <ctype.h>
#include <string.h>

#include <log4cxx/logger.h>
#include <log4cxx/basicconfigurator.h>
#include <log4cxx/level.h>

#include <sawtooth_sdk/sawtooth_sdk.h>
#include <sawtooth_sdk/exceptions.h>

#include <cryptopp/sha.h>
#include <cryptopp/filters.h>
#include <cryptopp/hex.h>

#include <iostream>
#include <string>
#include <sstream>

#include <utility>
#include <list>
#include <vector>

#include <rapidjson/document.h>

using namespace log4cxx;

static log4cxx::LoggerPtr logger(log4cxx::Logger::getLogger
    ("cityinfo"));

static const std::string DEFAULT_VALIDATOR_URL = "tcp://validator:4004";
static const std::string cityinfo_FAMILY = "cityinfo";
static const std::string TRANSACTION_FAMILY_VERSION = "1.0";

// Helper function: To generate an SHA512 hash and return it as a hex
// encoded string.
static std::string sha512(const std::string& message) {
    std::string digest;
    CryptoPP::SHA512 hash;

    CryptoPP::StringSource hasher(message, true,
        new CryptoPP::HashFilter(hash,
          new CryptoPP::HexEncoder (
             new CryptoPP::StringSink(digest), false)));

    return digest;
}

// Helper function: Tokenize std::string based on a delimiter
std::vector<std::string> split(const std::string& str, char delimiter) {
    std::istringstream strStream(str);
    std::string token;
    std::vector<std::string> tokens;

    while (std::getline(strStream, token, delimiter)) {
        tokens.push_back(token);
    }
    return tokens;
}

// Helper function: extract CSV texts from the payload.
// For this transaction family, the payload is simply encoded as a CSV
// with texts for "action", "text", and optional "manifest".
void payloadToActionTextAndManifest(const std::string& str,
                                       std::string& action,
                                       std::string& text,
                                       std::string& manifest) {
    rapidjson::Document doc;
    doc.Parse(str.c_str());

    if (doc.HasParseError()) {
        std::string error = "Failed to parse payload JSON";
        throw sawtooth::InvalidTransaction(error);
    }

    if (doc.HasMember("action") && doc.HasMember("text")) {
        const rapidjson::Value& actionValue = doc["action"];
        const rapidjson::Value& textValue = doc["text"];

        if (actionValue.IsString() && textValue.IsString()) {
            action = actionValue.GetString();
            text = textValue.GetString();
        } else {
            std::string error = "Invalid payload: action or text field is not a string";
            throw sawtooth::InvalidTransaction(error);
        }
    } else {
        std::string error = "Invalid payload: missing action or text field";
        throw sawtooth::InvalidTransaction(error);
    }

    if (doc.HasMember("manifest") && !doc["manifest"].IsNull()) {
        const rapidjson::Value& manifestValue = doc["manifest"];

        if (manifestValue.IsString()) {
            manifest = manifestValue.GetString();
        } else {
            std::string error = "Invalid payload: manifest field is not a string";
            throw sawtooth::InvalidTransaction(error);
        }
    }
    else{
        manifest = "";
    }
}

/*******************************************************************************
 * cityinfoApplicator class
 *
 * Handles the processing of cityinfo transactions, which are either
 * "send", "withdraw", or "transfer" to a wallet.
 * "send", "get" number of free spaces.
 ******************************************************************************/
class cityinfoApplicator:  public sawtooth::TransactionApplicator {
 public:
    cityinfoApplicator(sawtooth::TransactionUPtr txn,
        sawtooth::GlobalStateUPtr state) :
        TransactionApplicator(std::move(txn), std::move(state)) { }

    // The Apply() function does most of the work for the transaction processor
    // by processing a transaction for the cityinfo transaction family.
    void Apply() {
        try {
            std::cout << "cityinfoApplicator::Apply\n";
            // Extract user's wallet public key from TransactionHeader
            std::string customer_pubkey = this->txn->header()->GetValue(
                sawtooth::TransactionHeaderSignerPublicKey);

            // Extract the payload from Transaction as a string
            const std::string& raw_data = this->txn->payload();

            std::string action;
            std::string text;
            std::string manifest_pubkey;

            // Extract texts from the payload.
            // For this transaction family, the payload is simply encoded
            // as as a simple CSV (action, text, manifest_pubkey).

            payloadToActionTextAndManifest(raw_data,
                                               action,
                                               text,
                                               manifest_pubkey);

            std::cout << "Got: " << action << " and " << text << "\n";

            // Validate the text
            if (text.size() <= 0) {
                std::string error = "Invalid action: '" + action
                                      + "' with text <= 0";
                throw sawtooth::InvalidTransaction(error);
            }

            // Choose what to do with text, based on action
            if (action == "send") {
                this->sendNgetdata(customer_pubkey, text, action);
            // Add your own action and a corresponding handler here
            // Also add the actions in the client app as well
            }else {
                std::string error = "Invalid action: '" + action + "'";
                throw sawtooth::InvalidTransaction(error);
            }
        } catch(sawtooth::InvalidTransaction& e) {
                throw;
        } catch(std::exception& e) {
            std::cerr << "Unexpected exception exiting: " << std::endl;
            std::cerr << e.what() << std::endl;
        } catch(...) {
            std::cerr << "Exiting due to unknown exception." << std::endl;
        }
    }

 private:
    // Make a 70-character(35-byte) address to store and retrieve the state
    // The first 6 characters is the TF prefix, which is the  
    // first 6 characters of SHA-512("cityinfo"), 7e2664.
    std::string MakeAddress(const std::string& customer_pubkey) {
        return sha512(cityinfo_FAMILY).substr(0, 6) +
            sha512(customer_pubkey).substr(0, 64);
    }

    // Handle the cityinfo send action.
    // Overflow and underflow cases are ignored for this example
    void sendNgetdata(const std::string& customer_pubkey,
                     const std::string& request_text, const std::string& action) {
        // Generate the unique state address based on user's wallet public key
        auto address = this->MakeAddress(customer_pubkey);
        LOG4CXX_DEBUG(logger, "cityinfoApplicator::sendNgetdata Key: "
            << customer_pubkey
            << " Address: " << address);

        std::string stored_getdata_str;
        
        // Get the text stored at the state address for this wallet user
        if (this->state->GetState(&stored_getdata_str, address)) {
            std::cout << "Available getdata: " << stored_getdata_str << "\n";
            if (stored_getdata_str.size() != 0) {
                stored_getdata_str = stored_getdata_str;
            }
        } else {
            // If the state address doesn't exist we create a new account
            std::cout << "\nThis is the first time we send data."
                << "\nCreating a new account for user: "
                << customer_pubkey << std::endl;
        }

        // Increment stored text by send(n free spaces) text, extracted from txn payload
        
        if(stored_getdata_str.size() == 0)
        {
            // std::cout << "Hello WORLD" << std::endl;
            stored_getdata_str+= request_text;
        }
        else{
            // std::cout << "GRANDE ABRAco" << std::endl;
            stored_getdata_str+= ","+request_text;
        }

        LOG4CXX_DEBUG(logger, "Storing new available getdata: "
                               << stored_getdata_str<< " units");

        // Store the updated text in the user's unique state address
        this->state->SetState(address, stored_getdata_str);
    }
};

/*******************************************************************************
 * cityinfoHandler Class
 *
 * This class will be registered as the transaction processor handler
 * with validator
 * It sets the namespaceprefix, versions, TF and types of transactions
 * that can be handled by this TP - via the Apply method
 ******************************************************************************/
class cityinfoHandler: public sawtooth::TransactionHandler {
 public:
    // Generating a namespace prefix in the default constructor
    cityinfoHandler() {
        this->namespacePrefix = sha512(cityinfo_FAMILY).substr(0, 6);
        LOG4CXX_DEBUG(logger, "namespace:" << this->namespacePrefix);
    }

    std::string transaction_family_name() const {
        return std::string(cityinfo_FAMILY);
    }

    std::list<std::string> versions() const {
        return { TRANSACTION_FAMILY_VERSION };
    }

    std::list<std::string> namespaces() const {
        return { namespacePrefix };
    }

    sawtooth::TransactionApplicatorUPtr GetApplicator(
            sawtooth::TransactionUPtr txn,
            sawtooth::GlobalStateUPtr state) {
        return sawtooth::TransactionApplicatorUPtr(
            new cityinfoApplicator(std::move(txn), std::move(state)));
    }

 private:
    std::string namespacePrefix;
};

// Entry point function to setup and run the transaction processor.
int main(int argc, char** argv) {
    try {
        const std::string connectToValidatorUrl = DEFAULT_VALIDATOR_URL;

        // Set up a simple configuration that logs on the console.
        BasicConfigurator::configure();

        // Set logging verbosity to max
        logger->setLevel(Level::getAll());

        // Create a transaction processor

        // 1. connect to validator at connectToValidatorUrl
        sawtooth::TransactionProcessorUPtr processor(
            sawtooth::TransactionProcessor::Create(connectToValidatorUrl));

        // 2. create a transaction handler for our CityInfo TF
        sawtooth::TransactionHandlerUPtr transaction_handler(
            new cityinfoHandler());

        // 3. register the transaction handler with validator
        processor->RegisterHandler(
            std::move(transaction_handler));

        // 4. run the transaction processor
        processor->Run();

        return 0;
    } catch(std::exception& e) {
        std::cerr << "Unexpected exception exiting: " << std::endl;
        std::cerr << e.what() << std::endl;
    } catch(...) {
        std::cerr << "Exiting due to unknown exception." << std::endl;
    }

    return -1;
}
