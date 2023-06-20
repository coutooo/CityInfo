import { useState } from 'react';

export default function ManifestPage() {
  const [manifest, setManifest] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const file = event.target.filename.value;

    console.log(JSON.stringify({ file }));

    try {
      const response = await fetch(`/api/manifest`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ file: file }), // Pass file in the request body
      });

      if (response.ok) {
        const arrayBuffer = await response.arrayBuffer();
        const data = Buffer.from(arrayBuffer);
        console.log(data);

        const bufferArray = Array.from(new Uint8Array(arrayBuffer));
        const saveResponse = await fetch('/api/save-manifest', {
          method: 'POST',
          body: JSON.stringify({ filename: file, buffer: bufferArray }),
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (saveResponse.ok) {
          setManifest(data); // Set the manifest state with the file data
          setError(''); // Clear any previous error
        } else {
          throw new Error('Error: ' + saveResponse.status);
        }
      } else {
        throw new Error('Error: ' + response.status);
      }
    } catch (error) {
      console.log(error);
      setError('Failed to retrieve or save manifest');
      setManifest(''); // Clear the manifest state
    }
  };

  return (
    <div>
      <h1>Manifest Request Page</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="filename">Filename:</label>
        <input type="text" id="filename" name="filename" required />
        <br />
        <button type="submit">Get Manifest</button>
      </form>
      <div>{manifest}</div>
      <div>{error}</div>
    </div>
  );
}
