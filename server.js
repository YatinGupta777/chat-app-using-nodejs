const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const app = express();
const server = http.createServer(app);
const io = socketio(server);

//Set static folder
app.use(express.static(path.join(__dirname, 'public'))); //Join current dir with public folder

const botName = 'Chatcord Bot';

// Run when client connects
io.on('connection', socket => {
  console.log('New WS Connection...');

  //Welcome current user
  socket.emit('message', formatMessage(botName, 'Welcome to chatcord')); // This will emit to only the user

  //Broadcast when a user connects
  socket.broadcast.emit('message', 'A user has joined the chat'); // This will broadcast to everybody that is connected except the user

  //Run when client disconnects
  socket.on('disconnect', () => {
    io.emit('message', 'A user has left the chat'); //'message' means as message
  });

  //   io.emit(); //send to everybody

  // Listen to chat msg
  socket.on('chatMessage', msg => {
    io.emit('message', msg);
  });
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
