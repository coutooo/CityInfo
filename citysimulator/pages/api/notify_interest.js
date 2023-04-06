import fetch from 'node-fetch';
import express from 'express';
import bodyParser from 'body-parser';

const app = express();

// Add the middleware
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));

export default async function handler(req, res) {
  const { file_name } = req.body;

  // Make a request to the producer to notify interest
  const producerRes = await fetch("http://producer:5000/api/notify_interest", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept-Encoding': 'gzip' // tell the server you accept gzip encoding
    },
    body: JSON.stringify({ file_name: file_name })
  });

  try {

    const producerJson = await producerRes.json();

    res.status(producerRes.status).json(producerJson);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  } 
}
