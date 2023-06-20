import path from 'path';
import fs from 'fs';

export default async function saveManifestHandler(req, res) {
  const { filename, buffer } = req.body;

  if (!filename || !buffer) {
    res.status(400).json({ error: 'Filename or buffer is missing' });
    return;
  }

  try {
    const outputDir = path.join(process.cwd(), 'manifests');
    const filePath = path.join(outputDir, "manifest_"+filename);

    const bufferData = Buffer.from(buffer);

    fs.writeFileSync(filePath, bufferData);

    res.status(200).json({ message: 'Manifest file saved successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to save manifest file' });
  }
}
