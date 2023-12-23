# cityinfo

Blockchain using Hyperledger Sawtooth to excange data in a city.

and nextwebapp


install

sawtooth
docker compose
docker engine
install npm
install node 14 at least
apagar node_modules, e npm cache clear --force -> npm install

dar build nas imagens
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

http://localhost:3001/blockchain
-register producer
-showdata
http://localhost:3001/manifest
- ir buscar o manifesto
http://localhost:3001/upload
-fazer upload
http://localhost:3001/FileDownloadPage
-download file

#Additional (if using ndnSIM)
```
NS_LOG=ndn.Consumer:ndn.Producer ./waf --run=ndn-grid
```
