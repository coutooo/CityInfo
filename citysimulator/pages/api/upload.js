import React, { useState } from 'react';
import fetch from 'node-fetch';
import express from 'express';
import bodyParser from 'body-parser';

const app = express();

function Upload() {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Implement your file upload logic here
    console.log('File uploaded:', file);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" onChange={handleFileChange} />
      <button type="submit">Upload</button>
    </form>
  );
}

export default Upload;
