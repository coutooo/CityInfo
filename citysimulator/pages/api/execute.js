// pages/api/execute.js

export default async function handler(req, res) {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method Not Allowed' });
    }
  
    const { text } = req.body;
    try {
        const response = await fetch('http://cityinfo-client:8080/execute', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text }),
        });
    
        const contentType = response.headers.get('Content-Type');
    
        let data;
        if (contentType && contentType.includes('application/json')) {
          data = await response.json();
        } else {
          // Handle non-JSON response here
          data = { message: await response.text() };
        }
    
        res.status(response.status).json(data);
      } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred' });
      }
    }
  