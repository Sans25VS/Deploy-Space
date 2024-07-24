import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

const App = () => {
  const [texts, setTexts] = useState([]);
  const [user, setUser] = useState('defaultUser');

  useEffect(() => {
    axios.get(`http://localhost:5000/getTexts/${user}`)
      .then(response => setTexts(response.data))
      .catch(error => console.error(error));
    
    socket.on('newText', (newText) => {
      setTexts(prevTexts => [...prevTexts, newText]);
    });

    return () => socket.off('newText');
  }, [user]);

  return (
    <div>
      <h1>Saved Texts</h1>
      <ul>
        {texts.map((text, index) => (
          <li key={index}>
            {text.text} {text.url && <a href={text.url} target="_blank" rel="noopener noreferrer">(URL)</a>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
