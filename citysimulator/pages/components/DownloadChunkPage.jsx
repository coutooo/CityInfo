import { useState } from 'react';

export default function DownloadChunkPage() {
  const [chunkNumber, setChunkNumber] = useState('');
  const [fileName, setFileName] = useState('');
  const [message, setMessage] = useState('');

  async function handleDownload() {
    if (!fileName || !chunkNumber) {
      setMessage('Please enter both the file name and the chunk number');
      return;
    }

    const response = await fetch(`http://producer:5000/api/request_chunk/${chunkNumber}?filename=${fileName}`);
    const data = await response.json();

    if (response.ok) {
      setMessage(data.message);
    } else {
      setMessage(`Error: ${data.message}`);
    }
  }

  return (
    <div>
      <h1>Download Chunk</h1>
      <label>
        File Name:
        <input type="text" value={fileName} onChange={(e) => setFileName(e.target.value)} />
      </label>
      <label>
        Chunk Number:
        <input type="text" value={chunkNumber} onChange={(e) => setChunkNumber(e.target.value)} />
      </label>
      <button onClick={handleDownload}>Download</button>
      {message && <p>{message}</p>}
    </div>
  );
}
