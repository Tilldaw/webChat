const socket = io()
const mosi = ['暂无消息', 'A', 'B' , 'C' , 'D', 'E', 'F', 'G']
const btn = document.getElementById('btn')
const text = document.getElementById('text')
const content = document.getElementById('content')
const header = document.getElementById('header')
const onlineState = document.getElementById('onlineState')
const clear = document.getElementById('clear')
const mark = document.getElementById('mark')
const markImg = document.getElementById('markImg')
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
  localStorage.removeItem('unRead')
  localStorage.setItem('history', history)
}
// 清除聊天记录
const clearHistory = () => {
  localStorage.setItem('history', '')
  content.innerHTML = null
  window.onbeforeunload = () => localStorage.removeItem('unRead')
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
  localStorage.setItem('unRead', 'true')
  btn.style.transform = text.innerHTML ? 'scale(1)' : 'scale(0)'
}
// 发送消息事件
text.addEventListener('keydown', e => e.key === 'Enter' && send())
text.addEventListener('keyup', e => {
  btn.style.transform = text.innerHTML ? 'scale(1)' : 'scale(0)'
  if(e.key !== 'Enter') return
  canSend = true
  text.innerHTML = null
  btn.style.transform = text.innerHTML ? 'scale(1)' : 'scale(0)'
})
btn.addEventListener('click', send)
// 创建消息盒子
const createMessageBox = msg => {
  const div = document.createElement('div')
  div.classList = value !== msg ? 't' : 'w'
  const date = new Date()
  const hours = date.getHours()
  const minutes = date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes()
  const seconds = date.getSeconds() > 9 ? date.getSeconds() : '0' + date.getSeconds()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const title = `${month}月${day}号 ${hours}:${minutes}:${seconds}`
  div.innerHTML = `<div class='span' title='${title}'>${msg}</div>`
  return div
}
// 接收消息
socket.on('send', msg => {
  const div = createMessageBox(msg)
  content.appendChild(div)
  setTimeout(() => content.scrollTo({ top: 99999, behavior: 'smooth'}), 0) // 来消息之后让他在渲染之后滚动
  text.setAttribute('contenteditable', true)
  text.focus()
  if(value === msg || document.visibilityState === 'visible') return
  msgTotal ++ // 消息计数器
  document.title = mosi[msgTotal] ?? 'so much' // title 提醒
})
// 接收未读消息
socket.on('unRead', msg => {
  const onLine = localStorage.getItem('unRead')
  if(onLine) return
  const div = createMessageBox(msg)
  content.appendChild(div)
  content.scrollTop = 99999 // 接收未读消息后滚动条滚动至 五条九
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
// 图片放大
content.addEventListener('dblclick', e => {
  if(e.target.nodeName !== 'IMG') return
  markImg.src = e.target.src
  mark.style.transform = 'scale(1)'
})
mark.addEventListener('click', () => {
  mark.style.transform = 'scale(0)'
})
// title 消息提醒
document.addEventListener('visibilitychange', () => {
  if(document.visibilityState !== 'visible') return
  msgTotal = 0
  document.title = mosi[msgTotal]
})
window.onbeforeunload = saveRecord
window.onload = viewHistory
