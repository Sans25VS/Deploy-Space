import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import { Container, CssBaseline, TextField, Button, Box } from '@mui/material';
import TextList from './components/Textlist';
import Header from './components/Header';
import Footer from './components/Footer';
import './App.css';

const socket = io('http://localhost:5000');

const App = () => {
  const [texts, setTexts] = useState([]);
  const [user, setUser] = useState('defaultUser');
  const [newUser, setNewUser] = useState('');

  useEffect(() => {
    axios.get(`http://localhost:5000/getTexts/${user}`)
      .then(response => setTexts(response.data))
      .catch(error => console.error(error));

    socket.on('newText', (newText) => {
      setTexts(prevTexts => [...prevTexts, newText]);
    });

    return () => socket.off('newText');
  }, [user]);

  const handleUserChange = () => {
    if (newUser.trim() !== '') {
      setUser(newUser);
      setNewUser('');
    }
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <Header />
      <Container maxWidth="md" style={{ marginTop: '20px' }}>
        <h1>Saved Texts</h1>
        <Box display="flex" justifyContent="center" mb={2}>
          <TextField
            label="Enter User ID"
            variant="outlined"
            value={newUser}
            onChange={(e) => setNewUser(e.target.value)}
            style={{ marginRight: '10px' }}
          />
          <Button variant="contained" color="primary" onClick={handleUserChange}>
            Change User
          </Button>
        </Box>
        <TextList texts={texts} />
      </Container>
      <Footer />
    </React.Fragment>
  );
};

export default App;
