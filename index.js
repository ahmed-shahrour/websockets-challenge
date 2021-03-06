const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

let onlineUsers = {};

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on('chat message', (nickname, msg) => {
    onlineUsers[nickname] = socket.id;
    io.emit('chat message', nickname, msg);
    console.log('message: ' + nickname, msg);
  });

  socket.on('typing', function (data) {
    socket.broadcast.emit('typing', data);
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});
