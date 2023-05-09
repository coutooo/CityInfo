import React, { useState } from 'react';

function Upload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [comment, setComment] = useState('');

  const handleFileSelect = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('comment', comment); // add the comment to the form data

    try {
      const response = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h2>Upload a File</h2>
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="fileInput" style={{ marginRight: '10px' }}>
          Select a file:
        </label>
        <input
          type="file"
          id="fileInput"
          onChange={handleFileSelect}
          style={{ padding: '5px 10px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
      </div>
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="commentInput" style={{ marginRight: '10px' }}>
          Comment:
        </label>
        <input
          type="text"
          id="commentInput"
          value={comment}
          onChange={handleCommentChange}
          style={{ padding: '5px 10px', borderRadius: '5px', border: '1px solid #ccc', width: '300px' }}
        />
      </div>
      <button onClick={handleUpload} style={{ padding: '10px 20px', borderRadius: '5px', background: '#4caf50', color: '#fff', border: 'none', cursor: 'pointer' }}>
        Upload
      </button>
    </div>
  );  
}

export default Upload;
