const express = require('express')
const app = express()
const { Server } = require('socket.io')
const http = require('http')
const server = http.createServer(app)
const io = new Server(server)
const moment = require('moment')
let person = 0

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

app.get('/send', (req, res) => {
  res.sendFile(__dirname + '/send.js')
})

app.get('/css', (req, res) => {
  res.sendFile(__dirname + '/index.css')
})

app.get('/favicon', (req, res) => {
  res.sendFile(__dirname + '/assets/favicon.svg')
})

io.on('connection', socket => {
  console.log('上号了', moment().format('HH:mm:s'))
  person ++
  io.emit('onLine', person)
  socket.on('disconnect', () => {
    console.log('下线了', moment().format('HH:mm:s'))
    person --
    io.emit('onLine', person)
  })
  socket.on('send', (msg) => {
    io.emit('send', msg)
  })
})

server.listen(80, () => {
  // console.log('start')
})