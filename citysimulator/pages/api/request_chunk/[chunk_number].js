import fetch from 'node-fetch';
import fs from 'fs';
import DownloadChunkPage from '../../components/DownloadChunkPage';
import { renderToString } from 'react-dom/server';
const path = require('path');

export default async function handler(req, res) {
  const { chunk_number } = req.query;

  const filename = 'file.pdf';
  // Make a request to the producer to request the chunk
  //const producerRes = await fetch(`http://producer:5000/api/request_chunk/${chunk_number}`);   // para usar local troca se producer por localhost
  const producerRes = await fetch(`http://producer:5000/api/request_chunk/${chunk_number}?filename=${filename}`);
  

  // Download and save the chunk
  const outputDir = path.join(__dirname,'..','..','..','..','..','downloads');
  //console.log(outputDir);
  //const outputDir = '/home/couto/Desktop/ndn_block_tests/citysimulator/downloads';

  const file_name = "file";  // meter isto dinamico ou meter "chunk"?

  const chunkFileName = `${file_name}#${chunk_number}.pdf`;
  const chunkFilePath = `${outputDir}/${chunkFileName}`;

  const arrayBuffer = await producerRes.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  fs.writeFileSync(chunkFilePath, buffer);  

  // Return a success message
  //res.status(200).json({ message: 'Chunk downloaded successfully' });
  const html = renderToString(<DownloadChunkPage />);
  res.status(200).send(`<!DOCTYPE html>${html}`);
}