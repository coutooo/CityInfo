import { useState } from 'react';

export default function DownloadChunkPage() {
  const [chunkNumber, setChunkNumber] = useState('');
  const [message, setMessage] = useState('');

  async function handleDownload() {
    if (!chunkNumber) {
      setMessage('Please enter a chunk number');
      return;
    }

    const response = await fetch(`http://producer:5000/api/request_chunk/${chunk_number}`);
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
      {/*<label>
        Chunk Number:
        <input type="text" value={chunkNumber} onChange={(e) => setChunkNumber(e.target.value)} />
      </label>
  */}
      <progress value="100" max="100"> 100% </progress>
     {/* <button onClick={handleDownload}>Download</button>*/}
      {message && <p>{message}</p>}
    </div>
  );
}
