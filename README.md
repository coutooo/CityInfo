# cityinfo

Blockchain using Hyperledger Sawtooth to excange data in a city.

And a NEXTJS webapp


install

sawtooth
docker compose
docker engine
install npm
install node 14 at least
delete node_modules and npm cache clear --force -> npm install

# Build cityinfo-client image
docker build -t cityinfo-client .  -> dentro do pyclient
# Build cityinfo-processor image
docker build -t cityinfo-processor .  -> dentro do cxxprocessor
# Build producer image
docker build -t producer . -> dentro do producer
# Build nextjs-app image
docker build -t nextjs-app . -> dentro citysimulator

# Start the application using Docker Compose:
``` Running
sudo docker-compose -f docker-compose.yaml up --build
```

- http://localhost:3001/blockchain
 - register producer
 - showdata

- http://localhost:3001/manifest
 - get the manifest
  
- http://localhost:3001/upload
 - upload

- http://localhost:3001/FileDownloadPage
 - download file

# Additional (if using ndnSIM)
```
NS_LOG=ndn.Consumer:ndn.Producer ./waf --run=ndn-grid
```
