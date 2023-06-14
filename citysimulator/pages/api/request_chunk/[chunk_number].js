// pages/api/request_chunk/[chunk_number].js
import fetch from 'node-fetch';
import fs from 'fs';
import DownloadChunkPage from '../../components/DownloadChunkPage';
import { renderToString } from 'react-dom/server';
const path = require('path');

export default async function handler(req, res) {
  const { chunk_number } = req.query;
  const { filename } = req.query;

  // Make a request to the producer to request the chunk
  const producerRes = await fetch(`http://producer:5000/api/request_chunk/${chunk_number}?filename=${filename}`);

  // Download and save the chunk
  const outputDir = path.join(__dirname, '..', '..', '..', '..', '..', 'downloads');
  const extension = path.extname(filename); // Extract the extension from the file name
  const fileNameWithoutExtension = path.basename(filename, extension); // Extract the file name without the extension
  const chunkFileName = `${fileNameWithoutExtension}#${chunk_number}${extension}`;
  const chunkFilePath = path.join(outputDir, chunkFileName);

  const arrayBuffer = await producerRes.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  fs.writeFileSync(chunkFilePath, buffer);

  // Return a success message
  const html = renderToString(<DownloadChunkPage />);
  res.status(200).send(`<!DOCTYPE html>${html}`);
}
