const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

// Keep track of connected users
const users = {};

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
  // Handle user joining
  socket.on('user joined', (username) => {
    users[socket.id] = username;
    socket.broadcast.emit('user joined', username);
    io.emit('user list', Object.values(users));
  });

  // Handle chat messages
  socket.on('chat message', (data) => {
    if (!data || typeof data.message !== 'string') return;
    const message = data.message.trim().slice(0, 500);
    if (!message) return;
    io.emit('chat message', {
      username: users[socket.id] || 'Anonymous',
      message,
      timestamp: new Date().toISOString(),
    });
  });

  // Handle typing indicator
  socket.on('typing', (isTyping) => {
    socket.broadcast.emit('typing', {
      username: users[socket.id],
      isTyping,
    });
  });

  // Handle user disconnect
  socket.on('disconnect', () => {
    const username = users[socket.id];
    if (username) {
      delete users[socket.id];
      io.emit('user left', username);
      io.emit('user list', Object.values(users));
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
