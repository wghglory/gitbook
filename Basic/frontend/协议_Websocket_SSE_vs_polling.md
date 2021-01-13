# HTTP, Ajax Polling, Ajax Long polling, Websocket, Comet, SSE

## Regular HTTP

1. A client requests a webpage from a server.
1. The server calculates the response
1. The server sends the response to the client.

![HTTP](https://i.stack.imgur.com/TK1ZG.png)

## Ajax Polling:

1. A client requests a webpage from a server using regular HTTP (see HTTP above).
1. The requested webpage executes JavaScript which requests a file from the server at regular intervals (e.g. 0.5 seconds).
1. The server calculates each response and sends it back, just like normal HTTP traffic.

![Ajax Polling](https://i.stack.imgur.com/qlMEU.png)

## Ajax Long-Polling:

1. A client requests a webpage from a server using regular HTTP (see HTTP above).
1. The requested webpage executes JavaScript which requests a file from the server.
1. The server does not immediately respond with the requested information but waits until there's **new** information available.
1. When there's new information available, the server responds with the new information.
1. The client receives the new information and immediately sends another request to the server, re-starting the process.

![Ajax Long-Polling](https://i.stack.imgur.com/zLnOU.png)

长轮询: 与简单轮询相似，只是在服务端在没有新的返回数据情况下不会立即响应，而会挂起，直到有数据或即将超时。

优点：实现也不复杂，同时相对轮询，节约带宽。

缺点：所以还是存在占用服务端资源的问题，虽然及时性比轮询要高，但是会在没有数据的时候在服务端挂起，所以会一直占用服务端资源，处理能力变少。

应用：一些早期的对及时性有一些要求的应用：web IM 聊天。

## HTML5 Server Sent Events (SSE) / EventSource:

<https://developer.mozilla.org/en-US/docs/Web/API/EventSource>

1. A client requests a webpage from a server using regular HTTP (see HTTP above).
1. The requested webpage executes javascript which opens a connection to the server.
1. The server sends an event to the client when there's new information available.

- Real-time traffic from server to client, mostly that's what you'll need
- You'll want to use a server that has an event loop
- Not possible to connect with a server from another domain
- If you want to read more, I found these very useful: [(article)](https://developer.mozilla.org/en-US/docs/Server-sent_events/Using_server-sent_events) , [(article)](http://html5doctor.com/server-sent-events/#api) , [(article)](http://www.html5rocks.com/en/tutorials/eventsource/basics/) , [(tutorial)](http://jaxenter.com/tutorial-jsf-2-and-html5-server-sent-events-42932.html).

![HTML5 SSE](https://i.stack.imgur.com/ziR5h.png)

EventSource 不是一个新鲜的技术，正式一点应该叫`Server-sent events`，即 `SSE`。

webpack hot reloading 就是基于 SSE。

EventSource **本质上还是 HTTP，基于流**，通过 response 流实时推送服务器信息到客户端。

新创建的 EventSource 对象拥有如下属性：

| 属性             | 描述                                                                     |
| ---------------- | ------------------------------------------------------------------------ |
| url(只读)        | es 对象请求的服务器 url                                                  |
| readyState(只读) | es 对象的状态，初始为 0，包含 CONNECTING(0)，OPEN(1)，CLOSED(2) 三种状态 |
| withCredentials  | 是否允许带凭证等，默认为 false，即不支持发送 cookie                      |

服务端实现`/hello`接口，需要返回类型为 `text/event-stream`的响应头。

```javascript
// 服务端：
var http = require('http');

http
  .createServer(function(req, res) {
    if (req.url === '/hello') {
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      });
      setInterval(function() {
        // res.write('data: ' + new Date() + '\n\n');
        res.write('event: abc\ndata: ' + new Date() + '\n\n');
      }, 1000);
    }
  })
  .listen(8888);
```

我们注意到，为了避免缓存，Cache-Control 特别设置成了 no-cache，为了能够发送多个 response， Connection 被设置成了 keep-alive。发送数据时，请务必保证服务器推送的数据以 `data:` 开始，以`\n\n`结束，否则推送将会失败(约定的)。

以上，服务器每隔 1s 主动向客户端发送当前时间戳，为了接受这个信息，客户端需要监听服务器。如下：

```javascript
// 客户端:
// 新建一个EventSource对象
const es = new EventSource('/hello'); // hello 是服务端支持 EventSource 的接口

es.addEventListener('open', function() {
  console.log('开启了');
});

// 默认如果没有在服务端声明 event: xxx
// es.onmessage = function(e) {
//   console.log(e.data); // 打印服务器推送的信息
// };

es.addEventListener('abc', (e) => {
  const data = JSON.parse(e.data);
  box.innerHTML += `<p>${data}</p>`;
});
```

如下是消息推送的过程：

![response size不断增加](http://louiszhai.github.io/docImages/hot-replace01.gif)

![接收消息](http://louiszhai.github.io/docImages/hot-replace02.gif)

你以为 es 只能监听 message 事件吗？并不是，message 只是缺省的事件类型。实际上，它可以监听任何指定类型的事件。

```javascript
// 事件类型可以随你定义
es.addEventListener(
  '####',
  function(e) {
    console.log('####:', e.data);
  },
  false,
);
```

服务器发送不同类型的事件时，需要指定 event 字段。

```javascript
res.write('event: ####\n');
res.write('data: 这是一个自定义的####类型事件\n');
res.write('data: 多个data字段将被解析成一个字段\n\n');
```

如下所示：

![####消息](http://louiszhai.github.io/docImages/hot-replace04.png)

可以看到，服务端指定 event 事件名为”####”后，客户端触发了对应的事件回调，同时服务端设置的多个 data 字段，客户端使用换行符连接成了一个字符串。

不仅如此，事件流中还可以混合多种事件，请看我们是怎么收到消息的，如下：

![混合消息](http://louiszhai.github.io/docImages/hot-replace03.gif)

除此之外，es 对象还拥有另外 3 个方法: `onopen()`、`onerror()`、`close()`，请参考如下实现。

```javascript
es.onopen = function(e) {
  // 链接打开时的回调
  console.log('当前状态readyState:', es.readyState); // open 时readyState===1
};
es.onerror = function(e) {
  // 出错时的回调(网络问题,或者服务下线等都有可能导致出错)
  console.log(es.readyState); // 出错时readyState===0
  es.close(); // 出错时，chrome浏览器会每隔3秒向服务器重发原请求,直到成功. 因此出错时，可主动断开原连接.
};
```

使用 EventSource 技术实时更新网页信息十分高效。实际使用中，我们几乎不用担心兼容性问题，主流浏览器都了支持 EventSource，当然，除了掉队的 IE 系。对于不支持的浏览器，其 PolyFill 方案请参考[HTML5 Cross Browser Polyfills](https://github.com/Modernizr/Modernizr/wiki/HTML5-Cross-Browser-Polyfills#eventsource)。

#### SSE 配合 CORS 实现跨域

另外，如果需要支持跨域调用，请设置响应头 `Access-Control-Allow-Origin: '*'`。

如需支持发送 cookie，请设置响应头 `Access-Control-Allow-Origin: req.headers.origin` 和 `Access-Control-Allow-Credentials: true`，并且创建 es 对象时，需要明确指定是否发送凭证。如下：

```javascript
var es = new EventSource('/message', {
  withCredentials: true,
}); // 创建时指定配置才是有效的
// es.withCredentials = true; // 与ajax不同，这样设置是无效的
```

## HTML5 WebSockets

1. A client requests a webpage from a server using regular http (see HTTP above).
1. The requested webpage executes JavaScript which opens a connection with the server.
1. The server and the client can now send each other messages when new data (on either side) is available.

- Real-time traffic from the server to the client **and** from the client to the server
- You'll want to use a server that has an event loop
- With WebSockets it is possible to connect with a server from another domain.
- It is also possible to use a third party hosted websocket server, for example [Pusher](http://pusher.com/) or [others](http://www.leggetter.co.uk/real-time-web-technologies-guide). This way you'll only have to implement the client side, which is very easy!
- If you want to read more, I found these very useful: ([article](http://www.developerfusion.com/article/143158/an-introduction-to-websockets/)) , [(article)](https://developer.mozilla.org/en-US/docs/WebSockets/Writing_WebSocket_client_applications) ([tutorial](http://net.tutsplus.com/tutorials/javascript-ajax/start-using-html5-websockets-today/)) .

![HTML5 WebSockets](https://i.stack.imgur.com/CgDlc.png)

WebSocket 是基于 **TCP 的全双工通讯**的协议，它与 EventSource 有着本质上的不同.(前者基于 TCP，后者依然基于 HTTP)

WebSocket 使用和 HTTP 相同的 TCP 端口，默认为 80， 统一资源标志符为 ws，运行在 TLS 之上时，默认使用 443，统一资源标志符为 wss。它通过 `101 switch protocol` 进行一次 TCP 握手，即**从 HTTP 协议切换成 WebSocket 通信协议**。

相对于 HTTP 协议，WebSocket 拥有如下优点：

- 全双工，实时性更强。
- 相对于 http 携带完整的头部，WebSocket 请求头部明显减少。
- 保持连接状态，不用再验权了。
- 二进制支持更强，Websocket 定义了二进制帧，处理更轻松。
- Websocket 协议支持扩展，可以自定义的子协议，如 `permessage-deflate` 扩展。

#### **Frame**

**WebSocket 协议基于 Frame 而非 Stream**（EventSource 是基于 Stream 的）。因此其传输的数据都是 Frame（帧）。如下便是 Frame 的结构：

```
 0                   1                   2                   3
 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
+-+-+-+-+-------+-+-------------+-------------------------------+
|F|R|R|R| opcode|M| Payload len |    Extended payload length    |
|I|S|S|S|  (4)  |A|     (7)     |             (16/64)           |
|N|V|V|V|       |S|             |   (if payload len==126/127)   |
| |1|2|3|       |K|             |                               |
+-+-+-+-+-------+-+-------------+ - - - - - - - - - - - - - - - +
|     Extended payload length continued，if payload len == 127  |
+ - - - - - - - - - - - - - - - +-------------------------------+
|                               |Masking-key，if MASK set to 1  |
+-------------------------------+-------------------------------+
| Masking-key (continued)       |          Payload Data         |
+-------------------------------- - - - - - - - - - - - - - - - +
:                     Payload Data continued ...                :
+ - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - +
|                     Payload Data continued ...                |
+---------------------------------------------------------------+
```

第一个字节包含 FIN、RSV、Opcode。

- FIN：size 为 1bit，标示是否最后一帧。`%x0`表示还有后续帧，`%x1`表示这是最后一帧。

- RSV1、2、3，每个 size 都是 1bit，默认值都是 0，如果没有定义非零值的含义，却出现了非零值，则 WebSocket 链接将失败。

- Opcode，size 为 4bits，表示『payload data』的类型。如果收到未知的 opcode，连接将会断开。已定义的 opcode 值如下：

  ```
  %x0:	代表连续的帧
  %x1:	文本帧
  %x2:	二进制帧
  %x3~7:	预留的非控制帧
  %x8:	关闭握手帧
  %x9:	ping帧，后续心跳连接会讲到
  %xA:	pong帧，后续心跳连接会讲到
  %xB~F:	预留的非控制帧
  ```

第二个字节包含 Mask、Payload len。

- Mask：size 为 1bit，标示『payload data』是否添加掩码。所有从客户端发送到服务端的帧都会被置为 1，如果置 1，`Masking-key`便会赋值。

  ```
  //若 server 是一个 WebSocket 服务端实例
  //监听客户端消息
  server.on('message', function(msg, flags) {
    console.log('client say: %s', msg);
    console.log('mask value:', flags.masked);// true，进一步佐证了客户端发送到服务端的Mask帧都会被置为1
  });
  //监听客户端pong帧响应
  server.on('pong', function(msg, flags) {
    console.log('pong data: %s', msg);
    console.log('mask value:', flags.masked);// true，进一步佐证了客户端发送到服务端的Mask帧都会被置为1
  });
  ```

- Payload len：size 为 7bits，即使是当做无符号整型也只能表示 0~127 的值，所以它不能表示更大的值，因此规定”Payload data”长度小于或等于 125 的时候才用来描述数据长度。如果`Payload len==126`，则使用随后的 2bytes（16bits）来存储数据长度。如果`Payload len==127`，则使用随后的 8bytes（64bits）来存储数据长度。

以上，扩展的 Payload len 可能占据第三至第四个或第三至第十个字节。紧随其后的是”Mask-key”。

- Mask-key：size 为 0 或 4bytes（32bits），默认为 0，与前面 Mask 呼应，从客户端发送到服务端的帧都包含 4bytes（32bits）的掩码，一旦掩码被设置，所有接收到的”payload data”都必须与该值以一种算法做异或运算来获取真实值。
- Payload data：size 为”Extension data” 和 “Application data” 的总和，一般”Extension data”数据为空。
- Extension data：默认为 0，如果扩展被定义，扩展必须指定”Extension data”的长度。
- Application data：占据”Extension data”之后剩余帧的空间。

关于 Frame 的更多理论介绍不妨读读 [学习 WebSocket 协议—从顶层到底层的实现原理（修订版）](https://github.com/abbshr/abbshr.github.io/issues/22)。

关于 Frame 的数据帧解析不妨读读 [WebSocket(贰) 解析数据帧](https://www.web-tinker.com/article/20306.html) 及其后续文章。

#### **建立连接**

```javascript
// 新建一个ws对象十分简单
let ws = new WebSocket('ws://127.0.0.1:10103/'); // 本地使用10103端口进行测试
```

新建的 WebSocket 对象如下所示：

![Websocket对象](http://louiszhai.github.io/docImages/hot-replace09.png)

这中间包含了一次 Websocket 握手的过程，我们两步去理解。

第一步，客户端请求。

![Websocket Request](http://louiszhai.github.io/docImages/hot-replace05.png)

这是一个 GET 请求，主要字段如下：

```
Connection: Upgrade
Upgrade: websocket
Sec-WebSocket-Key:61x6lFN92sJHgzXzCHfBJQ==
Sec-WebSocket-Version:13
```

Connection 字段指定为 Upgrade，表示客户端希望连接升级。

Upgrade 字段设置为 websocket，表示希望升级至 Websocket 协议。

Sec-WebSocket-Key 字段是随机字符串，服务器根据它来构造一个 SHA-1 的信息摘要。

Sec-WebSocket-Version 表示支持的 Websocket 版本。RFC6455 要求使用的版本是 13。

甚至我们可以从请求截图里看出，Origin 是`file://`，而 Host 是`127.0.0.1:10103`，明显不是同一个域下，但依然可以请求成功，说明 Websocket 协议是不受同源策略限制的(同源策略限制的是 http 协议)。

第二步，服务端响应。

![Websocket Response](http://louiszhai.github.io/docImages/hot-replace07.png)

Status Code: 101 Switching Protocols 表示 Websocket 协议通过 101 状态码进行握手。

Sec-WebSocket-Accept 字段是由 Sec-WebSocket-Key 字段加上特定字符串”258EAFA5-E914-47DA-95CA-C5AB0DC85B11”，计算 SHA-1 摘要，然后再 base64 编码之后生成的. 该操作可避免普通 http 请求，被误认为 Websocket 协议。

Sec-WebSocket-Extensions 字段表示服务端对 Websocket 协议的扩展。

以上，WebSocket 构造器不止可以传入 url，还能传入一个可选的协议名称字符串或数组。

```javascript
ws = new WebSocket('ws://127.0.0.1:10103/', ['abc', 'son_protocols']);
```

#### **服务端实现**

ws 是一个 nodejs 版的 WebSocketServer 实现。使用 `npm install ws` 即可安装。

```javascript
var WebSocketServer = require('ws').Server,
  server = new WebSocketServer({ port: 10103 });

server.on('connection', function(s) {
  s.on('message', function(msg) {
    //监听客户端消息
    console.log('client say: %s', msg);
  });
  s.send('server ready!'); // 连接建立好后，向客户端发送一条消息
});
```

以上，`new WebSocketServer()` 创建服务器时如需权限验证，请指定 `verifyClient` 为验权的函数。

```javascript
server = new WebSocketServer({
  port: 10103,
  verifyClient: verify,
});

function verify(info) {
  console.log(Object.keys(info)); // [ 'origin', 'secure', 'req' ]
  console.log(info.orgin); // "file://"
  return true; // 返回true时表示验权通过，否则客户端将抛出"HTTP Authentication failed"错误
}
```

以上，`verifyClient` 指定的函数只有一个形参，若为它显式指定两个形参，那么第一个参数同上 info，第二个参数将是一个`cb`回调函数。该函数用于显式指定拒绝时的 HTTP 状态码等，它默认拥有 3 个形参，依次为：

- result，布尔值类型，表示是否通过权限验证。
- code，数值类型，若 result 值为 false 时，表示 HTTP 的错误状态码。
- name，字符串类型，若 result 值为 false 时，表示 HTTP 状态码的错误信息。

```javascript
// 若verify定义如下
function verify(info, cb) {
  //一旦拥有第二个形参，如果不调用，默认将通过验权
  cb(false, 401, '权限不够'); // 此时表示验权失败，HTTP状态码为401，错误信息为"权限不够"
  return true; // 一旦拥有第二个形参，响应就被cb接管了，返回什么值都不会影响前面的处理结果
}
```

除了`port` 和 `verifyClient`设置外，其它设置项及更多 API，请参考文档 [ws-doc](https://github.com/websockets/ws/blob/master/doc/ws.md)。

#### **发送和监听消息**

接下来，我们来实现消息收发。如下是客户端发送消息。

```javascript
ws.onopen = function(e) {
  // 可发送字符串，ArrayBuffer 或者 Blob数据
  ws.send('client ready!');
};
```

客户端监听信息。

```javascript
ws.onmessage = function(e) {
  console.log('server say:', e.data);
};
```

如下是浏览器的运行截图。

![message](http://louiszhai.github.io/docImages/hot-replace06.png)

消息的内容都在 Frames 栏，第一条彩色背景的信息是客户端发送的，第二条是服务端发送的。两条消息的长度都是 13。

如下是 Timing 栏，不止是 WebSocket，包括 EventSource，都有这样的黄色高亮警告。

![Websocket Request](http://louiszhai.github.io/docImages/hot-replace08.png)

该警告说明：请求还没完成。实际上，直到一方连接 close 掉，请求才会完成。

#### **关闭连接**

说到 close，ws 的 close 方法比 es 的略复杂。

语法：_close(short code，string reason);_

close 默认可传入两个参数。code 是数字，表示关闭连接的状态号，默认是 1000，即正常关闭。（code 取值范围从 0 到 4999，其中有些是保留状态号，正常关闭时只能指定为 1000 或者 3000~4999 之间的值，具体请参考[CloseEvent - Web APIs](https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent#Status_codes)）。reason 是 UTF-8 文本，表示关闭的原因（文本长度需小于或等于 123 字节）。

由于 code 和 reason 都有限制，因此该方法可能抛出异常，建议 catch 下.

```javascript
try {
  ws.close(1001, 'CLOSE_GOING_AWAY');
} catch (e) {
  console.log(e);
}
```

ws 对象还拥有 onclose 和 onerror 监听器，分别监听关闭和错误事件。（注：EventSource 没有 onclose 监听）

#### **拥有的属性**

ws 的 readyState 属性拥有 4 个值，比 es 的 readyState 的多一个 CLOSING 的状态。

| 常量       | 描述         | EventSource(值) | WebSocket(值) |
| ---------- | ------------ | --------------- | ------------- |
| CONNECTING | 连接未初始化 | 0               | 0             |
| OPEN       | 连接已就绪   | 1               | 1             |
| CLOSING    | 连接正在关闭 | -               | 2             |
| CLOSED     | 连接已关闭   | 2               | 3             |

另外，除了两种都有的 url 属性外，WebSocket 对象还拥有更多的属性。

| 属性           | 描述                                              |
| -------------- | ------------------------------------------------- |
| binaryType     | 被传输二进制内容的类型，有 blob, arraybuffer 两种 |
| bufferedAmount | 待传输的数据的长度                                |
| extensions     | 表示服务器选用的扩展                              |
| protocol       | 指的是构造器第二个参数传入的子协议名称            |

#### **文件上传**

以前一直是使用 ajax 做文件上传，实际上，Websocket 上传文件也是一把好刀. 其 send 方法可以发送 String，ArrayBuffer，Blob 共三种数据类型，发送二进制文件完全不在话下。

由于各个浏览器对 Websocket 单次发送的数据有限制，所以我们需要将待上传文件切成片段去发送。如下是实现。

```html
<input type="file" id="file" />

<script>
  const ws = new WebSocket('ws://127.0.0.1:10103/');// 连接服务器
  const fileSelect = document.getElementById('file');
  const size = 1024 * 128;// 分段发送的文件大小(字节)
  let curSize, total, file, fileReader;

  fileSelect.onchange = function() {
    file = this.files[0];// 选中的待上传文件
    curSize = 0;// 当前已发送的文件大小
    total = file.size;// 文件大小
    ws.send(file.name);// 先发送待上传文件的名称
    fileReader = new FileReader();// 准备读取文件
    fileReader.onload = loadAndSend;
    readFragment();// 读取文件片段
  };

  function loadAndSend() {
    if (ws.bufferedAmount > size * 5) {
      // 若发送队列中的数据太多,先等一等
      setTimeout(loadAndSend，4);
      return;
    }
    ws.send(fileReader.result);// 发送本次读取的片段内容
    curSize += size;// 更新已发送文件大小
    curSize < total ? readFragment() : console.log('upload succeeded!');// 下一步操作
  }

  function readFragment() {
    const blob = file.slice(curSize, curSize + size);// 获取文件指定片段
    fileReader.readAsArrayBuffer(blob);// 读取文件为ArrayBuffer对象
  }
</script>
```

server(node):

```javascript
var WebSocketServer = require('ws').Server,
  server = new WebSocketServer({ port: 10103 }), // 启动服务器
  fs = require('fs');

server.on('connection', function(wsServer) {
  var fileName,
    i = 0; // 变量定义不可放在全局,因每个连接都不一样,这里才是私有作用域
  server.on('message', function(data, flags) {
    // 监听客户端消息
    if (flags.binary) {
      // 判断是否二进制数据
      var method = i++ ? 'appendFileSync' : 'writeFileSync';
      // 当前目录下写入或者追加写入文件(建议加上try语句捕获可能的错误)
      fs[method]('./' + fileName, data, 'utf-8');
    } else {
      // 非二进制数据则认为是文件名称
      fileName = data;
    }
  });
  wsServer.send('server ready!'); // 告知客户端服务器已就绪
});
```

运行效果如下：

![Websocket upload](http://louiszhai.github.io/docImages/hot-replace10.png)

上述测试代码中没有过多涉及服务器的存储过程。通常，服务器也会有缓存区上限，如果客户端单次发送的数据量超过服务端缓存区上限，那么服务端也需要多次读取。

#### **心跳连接**

生产环境下上传一个文件远比本地测试来得复杂。实际上，从客户端到服务端，中间存在着大量的网络链路，如路由器，防火墙等等。一份文件的上传要经过中间的层层路由转发，过滤。这些中间链路可能会认为一段时间没有数据发送，就自发切断两端的连接。这个时候，由于 TCP 并不定时检测连接是否中断，而通信的双方又相互没有数据发送，客户端和服务端依然会一厢情愿的信任之前的连接，长此以往，将使得大量的服务端资源被 WebSocket 连接占用。

正常情况下，TCP 的四次挥手完全可以通知两端去释放连接。但是上述这种普遍存在的异常场景，将使得连接的释放成为梦幻。

为此，早在 websocket 协议实现时，设计者们便提供了一种 Ping/Pong Frame 的心跳机制。一端发送 Ping Frame，另一端以 Pong Frame 响应。这种 Frame 是一种特殊的数据包，它只包含一些元数据，能够在不影响原通信的情况下维持住连接。

根据规范[RFC 6455](https://tools.ietf.org/html/rfc6455#section-5.5.2)，Ping Frame 包含一个值为 9 的 opcode，它可能携带数据。收到 Ping Frame 后，Pong Frame 必须被作为响应发出。Pong Frame 包含一个值为 10 的 opcode，它将包含与 Ping Frame 中相同的数据。

借助 ws 包，服务端可以这么来发送 Ping Frame。

```javascript
wsServer.ping();
```

同时，需要监听客户端响应的 pong Frame.

```javascript
wsServer.on('pong', function(data, flags) {
  console.log(data); // ""
  console.log(flags); // { masked: true，binary: true }
});
```

以上，由于 Ping Frame 不带数据，因此作为响应的 Pong Frame 的 data 值为空串。遗憾的是，目前浏览器只能被动发送 Pong Frame 作为响应（[Sending websocket ping/pong frame from browser](http://stackoverflow.com/questions/10585355/sending-websocket-ping-pong-frame-from-browser)），无法通过 JS API 主动向服务端发送 Ping Frame。因此对于 web 服务，可以采取服务端主动 ping 的方式，来保持住链接。实际应用中，服务端还需要设置心跳的周期，以保证心跳连接可以一直持续。同时，还应该有重发机制，若连续几次没有收到心跳连接的回复，则认为连接已经断开，此时便可以关闭 Websocket 连接了。

#### **Socket.IO**

WebSocket 出世已久，很多优秀的大神基于此开发出了各式各样的库。其中 [Socket.IO](http://socket.io/) 是一个非常不错的开源 WebSocket 库，旨在抹平浏览器之间的兼容性问题。它基于 Node.js，支持以下方式优雅降级：

- Websocket
- Adobe® Flash® Socket
- AJAX long polling
- AJAX multipart streaming
- Forever Iframe
- JSONP Polling

### **小结**

EventSource，本质依然是 HTTP，基于流，它仅提供服务端到客户端的单向文本数据传输，不需要心跳连接，连接断开会持续触发重连。

WebSocket 双全工通信方式，基于 TCP 协议，基于帧 frame，它提供双向数据传输，支持二进制，需要心跳连接，连接断开不会重连。

EventSource 更轻量和简单，WebSocket 支持性更好（因其支持 IE10+）。通常来说，使用 EventSource 能够完成的功能，使用 WebSocket 一样能够做到，反之却不行，使用时若遇到连接断开或抛错，请及时调用各自的`close` 方法主动释放资源。

## Comet:

Comet is a collection of techniques prior to HTML5 which use streaming and long-polling to achieve real time applications. Read more on [wikipedia](http://en.wikipedia.org/wiki/Comet_%28programming%29) or [this](http://www.ibm.com/developerworks/web/library/wa-reverseajax1/index.html) article.
