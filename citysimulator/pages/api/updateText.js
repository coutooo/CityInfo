// pages/api/updateText.js
export default function handler(req, res) {
    if (req.method === 'POST') {
      const { text } = req.body;
  
      // Here, you can perform any necessary actions with the text, such as storing it in a database or processing it in some way
  
      const responseText = `Received: ${text}`;
  
      res.status(200).json({ message: responseText });
    } else {
      res.status(405).json({ message: 'Method Not Allowed' });
    }
  }
  