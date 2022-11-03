const socket = io()
const mosi = ['暂无消息', 'A', 'B' , 'C' , 'D', 'E', 'F', 'G']
const btn = document.getElementById('btn')
const text = document.getElementById('text')
const content = document.getElementById('content')
const header = document.getElementById('header')
const onlineState = document.getElementById('onlineState')
const clear = document.getElementById('clear')
let value
let timer
let canSend = true
let msgTotal = 0
// 聊天记录
const viewHistory = () => {
  const history = localStorage.getItem('history') ?? null
  if(history) {
    content.innerHTML = history
    content.scrollTop = 99999
  }
}
// 保存聊天记录
const saveRecord = () => {
  const history = content.innerHTML
  localStorage.setItem('history', history)
}
// 清除聊天记录
const clearHistory = () => {
  localStorage.setItem('history', '')
  content.innerHTML = null
  window.onbeforeunload = null
}
clear.addEventListener('click', clearHistory)
// 发送
const send = () => {
  if(!canSend) return
  canSend = false
  const message = text.innerHTML
  if(!message) return
  socket.emit('send', message)
  value = message
  text.innerHTML = null
}
// 发送消息事件
text.addEventListener('keydown', e => e.key === 'Enter' && send())
text.addEventListener('keyup', e => {
  if(e.key !== 'Enter') return
  canSend = true
  text.innerHTML = null
})
btn.addEventListener('click', send)
// 接收消息
socket.on('send', msg => {
  const div = document.createElement('div')
  div.classList = value !== msg ? 't' : 'w'
  div.innerHTML = `<div class='span'>${msg}</div>`
  content.appendChild(div)
  content.scrollTop = 99999 // 发送消息后滚动条滚动至 五条九
  text.setAttribute('contenteditable', true)
  text.focus()
  if(value === msg || document.visibilityState === 'visible') return
  msgTotal ++ // 消息计数器
  document.title = mosi[msgTotal] ?? 'so much' // title 提醒
})
// 查看在线状态
socket.on('onLine', person => {
  if(person > 1) return onlineState.innerHTML = '来咯'
  onlineState.innerHTML = '对方不在线'
})
// title 消息提醒
document.addEventListener('visibilitychange', () => {
  if(document.visibilityState !== 'visible') return
  msgTotal = 0
  document.title = mosi[msgTotal]
})
window.onbeforeunload = saveRecord
window.onload = viewHistory
