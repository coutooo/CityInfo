import React, { useState } from 'react';

function DownloadChunkPage() {
  const [chunkNumber, setChunkNumber] = useState('');
  const [fileName, setFileName] = useState('');
  const [message, setMessage] = useState('');

  const handleChunkChange = (event) => {
    setChunkNumber(event.target.value);
  };  

  const handleFileNameChange = (event) => {
    setFileName(event.target.value);
  };
  
  const handleDownload = async () => {
    
    // Add your logic here to handle the download
    console.log(`Downloading Chunk ${chunkNumber} of File ${fileName}`);

    const handleDownload = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/request_chunk/${chunkNumber}?filename=${fileName}`);
        if (response.ok) {
          // Download successful
          const blob = await response.blob();
          const downloadUrl = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = downloadUrl;
          a.download = `${fileName}-Chunk${chunkNumber}`;
          a.click();
        } else {
          // Download failed
          setMessage('Download failed. Please try again.');
        }
      } catch (error) {
        // Error handling
        setMessage('An error occurred. Please try again later.');
      }
    };
    
  };

  return (
    <div>
      <h1>Download Chunk</h1>
      <label>
        Chunk Number:
        <input type="text" value={chunkNumber} onChange={handleChunkChange} />
      </label>
      <br />
      <label>
        File Name:
        <input type="text" value={fileName} onChange={handleFileNameChange} />
      </label>
      <br />
      <progress value="100" max="100"> 100% </progress>
      <button onClick={handleDownload} style={{ padding: '10px 20px', borderRadius: '5px', background: '#4caf50', color: '#fff', border: 'none', cursor: 'pointer' }}>
        Upload
      </button>
      {message && <p>{message}</p>}
    </div>
  );
}

export default DownloadChunkPage;
