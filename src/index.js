const express = require('express')
const app = express()
const { Server } = require('socket.io')
const http = require('http')
const server = http.createServer(app)
const io = new Server(server)
const moment = require('moment')
let person = 0
const unreadMessage = []

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

app.get('/send', (req, res) => {
  res.sendFile(__dirname + '/send.js')
})

app.get('/indexexdDB', (req, res) => {
  res.sendFile(__dirname + '/indexexdDB.js')
})

app.get('/css', (req, res) => {
  res.sendFile(__dirname + '/index.css')
})

app.get('/favicon', (req, res) => {
  res.sendFile(__dirname + '/assets/favicon.svg')
})


io.on('connection', socket => {
  // 上号
  console.log('上号了', moment().format('HH:mm:s'))
  person ++
  io.emit('onLine', person) // 广播在线状态
  if(person === 2) { // 如果当前是 2 个人 那么推送未读消息并且清空未读消息
    unreadMessage.forEach(msg => io.emit('unRead', msg))
    unreadMessage.length = 0
  }
  // 消息发送
  socket.on('send', (msg) => {
    if(person === 1) unreadMessage.push(msg)
    io.emit('send', msg)
  })

  // 下线
  socket.on('disconnect', () => {
    console.log('下线了', moment().format('HH:mm:s'))
    person --
    io.emit('onLine', person)
  })
})

server.listen(80, () => {
  // console.log('start')
})