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
docker build -t cityinfo-client .  -> dentro do pyclient
docker build -t cityinfo-processor .  -> dentro do cxxprocessor
docker build -t producer . -> dentro do producer
docker build -t nextjs-app . -> dentro citysimulator

sudo docker-compose -f docker-compose.yaml up --build

http://localhost:3001/blockchain
-register producer
-showdata
http://localhost:3001/manifest
- ir buscar o manifesto
http://localhost:3001/upload
-fazer upload
http://localhost:3001/FileDownloadPage
-download file