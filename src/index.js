const express = require('express')
const app = express()
const { Server } = require('socket.io')
const http = require('http')
const server = http.createServer(app)
const io = new Server(server)
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})
io.on('connection', socket => {
  console.log('连接了', new Date())
  socket.on('disconnect', () => {
    console.log('离开了', new Date())
  })
  socket.on('send', (msg) => {
    io.emit('send', msg)
  })
})
server.listen(80, () => {
  console.log('start')
})