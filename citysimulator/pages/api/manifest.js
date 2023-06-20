import fetch from 'isomorphic-fetch';

export default async function handler(req, res) {
  const { file } = req.body;

  if (!file) {
    res.status(400).json({ error: 'Filename parameter is missing' });
    return;
  }

  try {
    //producer:5000
    const response = await fetch(`http://producer:5000/api/manifest?file=${file}`);
    if (response.ok) {
      const buffer = await response.buffer();
      console.log(buffer);
      res.send(buffer);
    } else {
      throw new Error('Error: ' + response.status);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to retrieve manifest' });
  }
}
