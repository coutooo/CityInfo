import { useState } from 'react';

const TextBox = () => {
  const [inputText, setInputText] = useState('');
  const [responseText, setResponseText] = useState('');

  const handleTextChange = (e) => {
    setInputText(e.target.value);
  };

  const handleButtonClick = async () => {
    console.log('estou aqui');
    try {
      const response = await fetch('/api/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: inputText }),
      });

      const data = await response.json();

      setResponseText((prevResponseText) => prevResponseText + ' ' + data.message);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <input type="text" value={inputText} onChange={handleTextChange} />
      <button onClick={handleButtonClick}>Send</button>
      <p>{responseText}</p>
    </div>
  );
};

export default TextBox;
