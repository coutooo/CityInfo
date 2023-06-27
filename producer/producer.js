const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const cors = require('cors');
//const { MerkleTree } = require('merkletreejs');
//const CryptoJS = require("crypto-js");
const fetch = require('node-fetch');
const crypto = require('crypto');


app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
  origin: '*',
  credentials: true
}));


class MerkleTree {
  constructor() {
    this.leaves = [];
  }

  add(data) {
    const leaf = crypto.createHash('sha256').update(data).digest('hex');
    this.leaves.push(leaf);
  }

  getRoot() {
    if (this.leaves.length === 0) {
      return null;
    }
    if (this.leaves.length === 1) {
      return this.leaves[0];
    }

    let tree = this.leaves.slice();
    while (tree.length > 1) {
      tree = this.computeNextLevel(tree);
    }
    return tree[0];
  }

  computeNextLevel(level) {
    const nextLevel = [];
    let i = 0;
    while (i < level.length) {
      const leftChild = level[i];
      const rightChild = level[i + 1] || level[i];
      const parent = this.computeParentHash(leftChild, rightChild);
      nextLevel.push(parent);
      i += 2;
    }
    return nextLevel;
  }

  computeParentHash(leftChild, rightChild) {
    return crypto.createHash('sha256').update(leftChild + rightChild).digest('hex');
  }
}

app.get('/api/manifest', (req, res) => {
  const folderPath = __dirname+'/manifests';
  const originalFilename = req.query.file;
  const filename = "manifest_" + originalFilename;


  if (!filename) {
    res.status(400).json({ error: 'Filename parameter is missing' });
    return;
  }

  const filePath = searchManifestFile(folderPath, filename);
  if (filePath) {
    // Read the file contents and send it as the response
    const fileStream = fs.createReadStream(filePath);
    const chunks = [];

    fileStream.on('data', (chunk) => {
      chunks.push(chunk);
    });

    fileStream.on('end', () => {
      const fileBuffer = Buffer.concat(chunks);
      res.send(fileBuffer); // Send the file contents as the response
    });

    fileStream.on('error', (err) => {
      res.status(500).json({ error: 'Error reading file' });
    });
  } else {
    res.status(404).json({ error: 'Manifest file not found' });
  }
});

function searchManifestFile(folderPath, filename) {
  const absFolderPath = path.resolve(folderPath);

  function searchFiles(currentPath) {
    const files = fs.readdirSync(currentPath);

    for (const file of files) {
      const filePath = path.join(currentPath, file);
      const fileStat = fs.statSync(filePath);

      if (fileStat.isDirectory()) {
        // Recursively search subdirectories
        const subFolderPath = path.join(currentPath, file);
        const result = searchFiles(subFolderPath);
        if (result) {
          return result; // Return the file path if found
        }
      } else if (file === filename) {
        return filePath; // Return the file path
      }
    }

    return null; // Return null if the file was not found
  }

  return searchFiles(absFolderPath);
}



// Start the server
app.listen(3000, () => {
  console.log('Server listening on port 3000');
});

// functions dos chunks
function readFileChunks(filePath, chunkSize, fileName) {
  const fileData = fs.readFileSync(filePath);
  const fileSize = fileData.length;

  const chunks = [];
  let offset = 0;

  while (offset < fileSize) {
    const chunk = fileData.slice(offset, offset + chunkSize);
    chunks.push(chunk);
    offset += chunkSize;
  }

  const extension = path.extname(fileName); // Extract the extension from the file name
  const fileNameWithoutExtension = path.basename(fileName, extension); // Extract the file name without the extension

  saveFileChunks(chunks, fileNameWithoutExtension,__dirname+'/chunks',extension);

  return chunks;
}

function saveFileChunks(chunks, baseName, outputDir,extension) {
  for (let i = 0; i < chunks.length; i++) {
    const chunkFileName = `${baseName}#${i + 1}${extension}`;
    const chunkFilePath = `${outputDir}/${chunkFileName}`;
    fs.writeFileSync(chunkFilePath, chunks[i]);
  }
}

// Responds to a GET request for a chunk with the specified path
app.get("/api/request_chunk/:chunk_number", (req, res) => {
  const { chunk_number } = req.params;
  const { filename } = req.query;
  console.log(chunk_number);
  
  const filePath = path.join(__dirname,'data_files',filename);

  const chunkSize = 1024; // 1 kb

  // Read the requested chunk from the file
  const chunks = readFileChunks(filePath, chunkSize,filename);
  const chunkIndex = parseInt(chunk_number) - 1;
  const requestedChunk = chunks[chunkIndex];

  // Send the requested chunk back in the response
  const responseBuffer = Buffer.from(requestedChunk);
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Length', responseBuffer.length);

  console.log(responseBuffer)
  
  res.send(responseBuffer);
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
  const fileHash = crypto.createHash('sha256').update(fileContents).digest('hex');

  // Determine the number and size of the file's chunks
  const fileSize = file.size;
  const chunkSize = 1024;
  const numChunks = Math.ceil(fileSize / chunkSize);

  // Compute Merkle tree
  const leaves = [];
  for (let i = 0; i < fileContents.length; i += chunkSize) {
    const chunk = fileContents.slice(i, i + chunkSize);
    const chunkHash = crypto.createHash('sha256').update(chunk).digest('hex');
    leaves.push(chunkHash);
  }

  const merkleTree = new MerkleTree();
  leaves.forEach(leaf => merkleTree.add(leaf));

  const root = merkleTree.getRoot();

  // TODO: Obtain the comment from the request body
  // Add a new parameter for the comment argument
  const comment = (req.body.comment).replace(/\s/g, '_') ?? '';  // se nao exister fica em branco

  // Create the manifest object
  const manifest = {
    nome_ficheiro: file.originalname,
    merkle_tree: root,
    assinatura_do_ficheiro: fileHash,
    //assinatura_do_produtor: 'TODO', // Replace with producer's signature
    numero_de_chunks: numChunks,
    tamanho_dos_chunks: chunkSize,
    comentario: comment // Replace with comment
    };

  manifest.timestamp = new Date().toISOString();

  file_name = __dirname+'/manifests/'+"manifest_"+file.originalname;

  fs.writeFile(file_name, JSON.stringify(manifest), (err) => {
    if (err) throw err;
    console.log('The file has been saved!');
  });

  fileName = file.originalname;
  readFileChunks(file.path, chunkSize, fileName);

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
