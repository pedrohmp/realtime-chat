import express from 'express'
import {Server} from 'socket.io';

const app = express();
const server = app.listen(3333, () => 'server running on port 3333')
const io = new Server(server, {cors: {origin: 'http://localhost:5173'}});

const connectedUsers = new Map();

io.on('connection', (socket) => {
  console.log('Usuario conectado!', socket.id)

  socket.on('disconnect', reason => {
    connectedUsers.delete(socket.id);
    io.emit('disconnect_user', Array.from(connectedUsers.values()));
  })

  socket.on('set_username', username => {
    socket.data.username = username
    connectedUsers.set(socket.id, username);
    io.emit('receive_user', Array.from(connectedUsers.values()))
  })

  socket.on('message', text => {
    io.emit('receive_message', {
      text,
      authorId: socket.id,
      author: socket.data.username,
      timestamp: new Date().getTime()
    })
  })
})


app.use(express.json())
