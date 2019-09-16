# 实现⼀个即时通讯 IM

## telnet 交流

Socket 实现

原理：Net 模块提供⼀个异步 API 能够创建基于流的 TCP 服务器，客户端与服务器建⽴连接后，服务器可以获得⼀个全双⼯ Socket 对象，服务器可以保存 Socket 对象列表，在接收某客户端消息时，推送给其他客户端。

```js
/**
 * 实现⼀个即时通讯IM：Socket实现
  原理：Net模块提供⼀个异步API能够创建基于流的TCP服务器，客户端与服务器建⽴连接后，服务器可以获得⼀个全双⼯Socket对象，服务器可以保存Socket对象列表，在接收某客户端消息时，推送给其他客户端。
 */
const net = require('net');

const chatServer = net.createServer();
const clientList = [];

chatServer.on('connection', (client) => {
  client.write('Hi!\n');
  clientList.push(client);

  client.on('data', (data) => {
    console.log('receive:', data.toString());
    clientList.forEach((v) => {
      v.write(data);
    });
  });
});

chatServer.listen(9000);
```

通过 Telnet 连接服务器:

```bash
// open several terminals: telnet localhost 9000
```

## http 浏览器聊天

1. 轮询方式：

```js
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

app.use(bodyParser.json());

const list = ['ccc', 'ddd'];

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, './index.html'));
});

app.get('/list', (req, res) => {
  res.end(JSON.stringify(list));
});

app.post('/send', (req, res) => {
  list.push(req.body.message);
  res.end(JSON.stringify(list));
});

app.post('/clear', (req, res) => {
  list.length = 0;
  res.end(JSON.stringify(list));
});

app.listen(3000);
```

```html
<html>
  <head>
    <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
    <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
  </head>

  <body>
    <div id="app">
      <h1>Open 2 tabs, one sends message; the one checks message sync status.</h1>
      <input v-model="message" />
      <button v-on:click="send">发送</button>
      <button v-on:click="clear">清空</button>
      <div v-for="item in list">{{item}}</div>
    </div>

    <script>
      const host = 'http://localhost:3000';

      var app = new Vue({
        el: '#app',
        data: {
          list: [],
          message: 'Hello Vue!',
        },
        methods: {
          send: async function() {
            let res = await axios.post(host + '/send', {
              message: this.message,
            });
            this.list = res.data;
          },
          clear: async function() {
            let res = await axios.post(host + '/clear');
            this.list = res.data;
          },
        },
        mounted: function() {
          // 轮询加载数据
          setInterval(async () => {
            const res = await axios.get(host + '/list');
            this.list = res.data;
          }, 2000);
        },
      });
    </script>
  </body>
</html>
```

**2. Socket.IO 实现**

安装： `npm install --save socket.io`

Socket.IO 库特点：

- 源于 HTML5 标准
- ⽀持优雅降级
  - WebSocket
  - WebSocket over FLash
  - XHR Polling
  - XHR Multipart Streaming
  - Forever Iframe
  - JSONP Polling

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Socket.IO chat</title>
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      body {
        font: 13px Helvetica, Arial;
      }

      form {
        background: #000;
        padding: 3px;
        position: fixed;
        bottom: 0;
        width: 100%;
      }

      form input {
        border: 0;
        padding: 10px;
        width: 90%;
        margin-right: 0.5%;
      }

      form button {
        width: 9%;
        background: rgb(130, 224, 255);
        border: none;
        padding: 10px;
      }

      #messages {
        list-style-type: none;
        margin: 0;
        padding: 0;
      }

      #messages li {
        padding: 5px 10px;
      }

      #messages li:nth-child(odd) {
        background: #eee;
      }
    </style>
  </head>

  <body>
    <ul id="messages"></ul>
    <form action=""><input id="m" autocomplete="off" /><button>Send</button></form>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.2.0/socket.io.js"></script>
    <script src="http://libs.baidu.com/jquery/2.1.1/jquery.min.js"></script>
    <script>
      $(function() {
        var socket = io();
        $('form').submit(function(e) {
          e.preventDefault(); // 避免表单提交行为
          socket.emit('chat message', $('#m').val());
          $('#m').val('');
          return false;
        });

        socket.on('chat message', function(msg) {
          $('#messages').append($('<li>').text(msg));
        });
      });
    </script>
  </body>
</html>
```

```js
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
  console.log('a user connected');

  //响应某用户发送消息
  socket.on('chat message', function(msg) {
    console.log('chat message:' + msg);

    // 广播给所有人
    io.emit('chat message', msg);
    // 广播给除了发送者外所有人
    // socket.broadcast.emit('chat message', msg)
  });

  socket.on('disconnect', function() {
    console.log('user disconnected');
  });
});

http.listen(3000, function() {
  console.log('listening on *:3000');
});
```
