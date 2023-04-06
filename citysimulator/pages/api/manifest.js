import fetch from 'node-fetch';
import express from 'express';
import bodyParser from 'body-parser';

const app = express();

export default async function handler(req, res) {
  const { file_path, chunk_size } = req.body;

  // Make a request to the producer to create a manifest
  const producerRes = await fetch('http://producer:5000/api/manifest', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ file_path, chunk_size })
  });

  const producerJson = await producerRes.json();

  // Return the response from the producer to the client
  res.status(producerRes.status).json(producerJson);
}
