const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const cors = require('cors');
const { MerkleTree } = require('merkletreejs');
const CryptoJS = require("crypto-js");
const fetch = require('node-fetch');


app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
  origin: '*',
  credentials: true
}));

// Responds to a GET request for a manifest with the specified number of chunks and size
app.get("/api/manifest", (req, res) => {
  const { chunks, size } = req.query;
  const manifest = {
    chunks: [],
  };
  for (let i = 0; i < chunks; i++) {
    manifest.chunks.push(`chunk-${i}`);
  }
  console.log(manifest);
  res.json(manifest);
});

// Function to get manifest
function Manifest(chunk_name,num_chunks,chunks_size){
  
  chunks = num_chunks;
  size = chunks_size;
  const manifest = {
    path : '/home/couto/Desktop//CityInfo/citysimulator/data_files/file.pdf',
    //chunks: [],
    chunks : [],
    chunks_num : num_chunks,
    chunk_size: chunks_size,
  };
  for (let i = 0; i < chunks; i++) {
    manifest.chunks.push(`${chunk_name}#${i+1}`);
  }
  //console.log(manifest);
  //res.json(manifest);
  return manifest;
};


// functions dos chunks
function readFileChunks(filePath, chunkSize) {
  const fileData = fs.readFileSync(filePath);
  const fileSize = fileData.length;

  const chunks = [];
  let offset = 0;

  while (offset < fileSize) {
    const chunk = fileData.slice(offset, offset + chunkSize);
    chunks.push(chunk);
    offset += chunkSize;
  }

  saveFileChunks(chunks, 'file',__dirname+'/chunks');

  return chunks;
}

function saveFileChunks(chunks, baseName, outputDir) {
  for (let i = 0; i < chunks.length; i++) {
    const chunkFileName = `${baseName}#${i + 1}.pdf`;
    const chunkFilePath = `${outputDir}/${chunkFileName}`;
    fs.writeFileSync(chunkFilePath, chunks[i]);
  }
}
//--------------------

// Responds to a GET request for a chunk with the specified path
app.get("/api/request_chunk/:chunk_number", (req, res) => {
  const { chunk_number } = req.params;
  console.log(chunk_number);
  
  const filePath = path.join(__dirname,'data_files','file.pdf');

  const chunkSize = 1024; // 1 kb

  // Read the requested chunk from the file
  const chunks = readFileChunks(filePath, chunkSize);
  const chunkIndex = parseInt(chunk_number) - 1;
  const requestedChunk = chunks[chunkIndex];

  // Send the requested chunk back in the response
  const responseBuffer = Buffer.from(requestedChunk);
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Length', responseBuffer.length);

  console.log(responseBuffer)
  
  res.send(responseBuffer);
});

// Responds to a POST request to notify interest in a chunk with the specified path in json format
app.post("/api/notify_interest", (req, res) => {

  const { file_name } = req.body;

  console.log(file_name);

  const manifest = Manifest(file_name,7,1024);

  console.log(manifest);

  res.status(200).json({ manifest } );
});

// Set up multer storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __dirname+'/data_files') // change the directory to wherever you want to save uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
});

// Create multer upload object
const upload = multer({ storage: storage });

// Responds to a POST request to upload a file
app.post("/api/upload", upload.single('file'), (req, res) => {
  console.log("uploadinnnngggg");
  const { file } = req;
  console.log(file);

  // Read the file and compute its hash
  const fileContents = fs.readFileSync(file.path).toString();
  const fileHash = CryptoJS.SHA256(fileContents).toString(CryptoJS.enc.Hex);

  // compute the Merkle tree
  const leaves = fileContents.match(/.{1,1024}/g).map(x => CryptoJS.SHA256(x).toString());

  // compute the Merkle root
  const tree = new MerkleTree(leaves, CryptoJS.SHA256);
  const root = tree.getRoot().toString('hex');

  // TODO: Sign the file and obtain the producer's signature

  // Determine the number and size of the file's chunks
  const fileSize = file.size;
  const chunkSize = 1024;
  const numChunks = Math.ceil(fileSize / chunkSize);

  // TODO: Obtain the comment from the request body
  // Add a new parameter for the comment argument
  const comment = req.body.comment ?? '';  // se nao exister fica em branco

  // Create the manifest object
  const manifest = {
    nome_ficheiro: file.originalname,
    merkle_tree: root,
    assinatura_do_ficheiro: fileHash,
    assinatura_do_produtor: 'TODO', // Replace with producer's signature
    numero_de_chunks: numChunks,
    tamanho_dos_chunks: chunkSize,
    comentario: comment // Replace with comment
    };

  manifest.timestamp = new Date().toISOString();

  file_name = "/project/cityinfo/producer/manifests/manifest_"+file.originalname;

    fs.writeFile(file_name, JSON.stringify(manifest), (err) => {
      if (err) throw err;
      console.log('The file has been saved!');
    });

    const text = "cityinfo send \"" + JSON.stringify(manifest) + "\" forum";

    fetch('http://cityinfo-client:8080/execute', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    })
      .then(response => response.text())
      .then(output => console.log(output))
      .catch(error => console.error(error))


    //print manifest
    console.log(manifest);
  // TODO: Save the manifest to a file or database

  res.status(200).json({ message: "File uploaded successfully" });
});



const port = 5000;
app.listen(port, () => {
  console.log(`Producer API listening at http://producer:${port}`);
});
