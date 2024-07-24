const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');

// Initialize app
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/textsaver', { useNewUrlParser: true, useUnifiedTopology: true });

// Schema and Model
const textSchema = new mongoose.Schema({
  user: String,
  text: String,
  url: String,
  timestamp: { type: Date, default: Date.now }
});

const Text = mongoose.model('Text', textSchema);

// Routes
app.post('/saveText', (req, res) => {
  const { user, text, url } = req.body;
  const newText = new Text({ user, text, url });
  newText.save().then(savedText => res.json(savedText));
});

app.get('/getTexts/:user', (req, res) => {
  Text.find({ user: req.params.user }).then(texts => res.json(texts));
});

// Socket.io for real-time updates
io.on('connection', (socket) => {
  console.log('New client connected');
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Start server
const PORT = 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
