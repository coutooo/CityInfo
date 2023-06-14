import { useState } from 'react';
import axios from 'axios';

const FileDownloadPage = () => {
  const [filename, setFilename] = useState('');
  const [startChunk, setStartChunk] = useState(1);
  const [endChunk, setEndChunk] = useState(1);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);

    const base_url = 'http://localhost:3001/api/request_chunk';

    for (let chunkNumber = startChunk; chunkNumber <= endChunk; chunkNumber++) {
      const url = `${base_url}/${chunkNumber}?filename=${filename}`;

      try {
        const response = await axios.get(url);

        if (response.status === 200) {
          console.log(`Chunk ${chunkNumber} downloaded successfully`);
          // Save the file using the appropriate logic for your environment
        } else {
          console.log(`Error downloading chunk ${chunkNumber}: ${response.data}`);
        }
      } catch (error) {
        console.log(`Error downloading chunk ${chunkNumber}: ${error.message}`);
      }
    }

    setIsDownloading(false);
  };

  return (
    <div>
      <h1>File Downloader</h1>
      <label>
        Filename:
        <input
          type="text"
          value={filename}
          onChange={(e) => setFilename(e.target.value)}
        />
      </label>
      <br />
      <label>
        Start Chunk:
        <input
          type="number"
          value={startChunk}
          onChange={(e) => setStartChunk(parseInt(e.target.value))}
        />
      </label>
      <br />
      <label>
        End Chunk:
        <input
          type="number"
          value={endChunk}
          onChange={(e) => setEndChunk(parseInt(e.target.value))}
        />
      </label>
      <br />
      <button onClick={handleDownload} disabled={!filename || endChunk < startChunk || isDownloading}>
        {isDownloading ? 'Downloading...' : 'Download'}
      </button>
    </div>
  );
};

export default FileDownloadPage;
