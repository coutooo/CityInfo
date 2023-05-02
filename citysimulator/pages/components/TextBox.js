// components/TextBox.js
import { useState } from 'react';

const TextBox = () => {
  const [inputText, setInputText] = useState('');
  const [responseText, setResponseText] = useState('');

  const handleTextChange = (e) => {
    setInputText(e.target.value);
  };

  const handleButtonClick = async () => {
    console.log("estou aqui")
    try {
      const response = await fetch('http://cityinfo-client:8080/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: inputText }),
      });

      const data = await response.json();

      setResponseText(prevResponseText => prevResponseText + ' ' + data.message); // Update the responseText by accessing the previous state correctly.
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
