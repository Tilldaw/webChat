import { createMessageBox } from "./send";

let DB
let max = 0

export const openRequest = window.indexedDB.open('history')

openRequest.onupgradeneeded = e => {
  DB = openRequest.result;
  if (!DB.objectStoreNames.contains('history')) { // 创建记录表格
    const historyStore = DB.createObjectStore('history', { autoIncrement: true })
    openRequest.historyStore = historyStore
    historyStore.createIndex('createtTime', 'createtTime', { unique: false })
    historyStore.createIndex('value', 'value', { unique: false })
    historyStore.createIndex('className', 'className', { unique: false })
  }
}

openRequest.onsuccess = e => {
  DB = openRequest.result
  const objectStore = DB.transaction('history').objectStore('history') // 读取所有数据
  objectStore.openCursor(null, 'prev').onsuccess = e => {
    const cursor = e.target.result;
    if (cursor) { // 指针不为空
      if(max > 30) return // 读取最新的 30 条数据
      const { createtTime, value, className } = cursor.value
      console.log(cursor)
      const div = createMessageBox({ createtTime, msg: value, className})
      const content = document.getElementById('content')
      content.insertBefore(div, content.children[0])
      max ++
      content.scrollTo({ top: 99999, behavior: 'smooth'})
      cursor.continue()
    } 
  }
}

export const addHistory = ({ createtTime, value, className }) => {
  DB.transaction(['history'], 'readwrite')
    .objectStore('history')
    .add({ createtTime, value, className }).onsuccess = () => console.log('写入成功')
}
function read() {
  const transaction = DB.transaction(['history']);
  const objectStore = transaction.objectStore('history');
  const request = objectStore.get(1);

  request.onerror = function(event) {
    console.log('事务失败');
  };

  request.onsuccess = function( event) {
     if (request.result) {
       console.log('time: ' + request.result.time);
       console.log('value: ' + request.result.value);
      //  console.log('Email: ' + request.result.email);
     } else {
       console.log('未获得数据记录');
     }
  };
}

openRequest.onerror = e => {
  console.log('Error')
  console.log(e)
}
