const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Allow your frontend origin for CORS
  },
});

const rooms = {}; // Track users in each room

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('create_room', (room) => {
    if (!rooms[room]) rooms[room] = [];
    rooms[room].push(socket.id);
    socket.join(room);
    socket.emit('room_created', room);
  });

  socket.on('join_room', (room) => {
    if (rooms[room]) {
      rooms[room].push(socket.id);
      socket.join(room);
      socket.emit('room_joined', room);
    } else {
      socket.emit('room_error', 'Room not found');
    }
  });

  socket.on('send_message', ({ room, encryptedMessage }) => {
    io.to(room).emit('receive_message', { sender: socket.id, encryptedMessage });
  });

  socket.on('disconnect', () => {
    for (const room in rooms) {
      rooms[room] = rooms[room].filter((id) => id !== socket.id);
      if (rooms[room].length === 0) delete rooms[room];
    }
  });
});

const PORT = 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
