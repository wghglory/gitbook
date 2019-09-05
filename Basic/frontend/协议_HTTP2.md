# [HTTP/2 Server Push with Node.js](https://blog.risingstack.com/node-js-http-2-push/?utm_source=RisingStack+Engineering&utm_campaign=4da07f1f69-EMAIL_CAMPAIGN_2017_08_21&utm_medium=email&utm_term=0_02a6a69990-4da07f1f69-474943753)

node 8.4 `--expose-http2`

`server push`: 通过 full request 和 多路响应大大减少请求响应时间。不像 http 1 时代 浏览器加载 html，再分别加载里面的 js, css, image 资源。并且 http 1 每次浏览器从一个 domain 下载的资源数受限，chrome/firefox 最多同时下载 8 个。 http 2 的多路响应、加上 `server push` 甚至在浏览器没有向服务端发送请求时 服务端都能迅速返回所需要的资源。

---

Node.js 8.4.0 just arrived with the experimental support of HTTP/2, which you can enable by using the `--expose-http2` flag.

In this blog post, we will introduce the most important aspects of `HTTP/2 Server Push` and create a small Node.js app that gains benefit from using it.

## About HTTP/2

通过使用 full request and response multiplexing 多路传输 等措施 **减少延迟**！

The primary goals for HTTP/2 are to **reduce latency** by enabling full request and response multiplexing, minimize protocol overhead via efficient compression of HTTP header fields, and add support for request prioritization and server push.

To read more about HTTP/2 in general, check out the [Introduction to HTTP/2](https://developers.google.com/web/fundamentals/performance/http2/) article.

## Server Push

HTTP/2 Server Push allows the server to send assets to the browser before it has even asked for them.

> Before we jump into HTTP/2 let's take a look how it works with HTTP/1:

In HTTP/1 the client sends a request to the server, which replies with the requested content, usually with an HTML file that contains links to many assets _(.js, .css, etc. files)_. As the browser processes this initial HTML file, it starts to resolve these links and makes separate requests to fetch them.

Check out the following image that demonstrates the process. Pay extra attention to the independent requests on the timeline and to the initiator of those requests:

![HTTP 1.1 in Node.js](https://blog-assets.risingstack.com/2017/08/http_1-in-nodejs.png)_HTTP/1 assets loading_

This is how HTTP/1 works, and this is how we develop our application for so many years. **Why change it now?**

**The problem with the current approach is that the user has to wait while the browser parses responses, discovers links and fetches assets. This delays rendering and increases load times. There are workarounds like inlining some assets, but it also makes the initial response bigger and slower.**

> This is where HTTP/2 Server Push capabilities come into the picture as the server can send assets to the browser before it has even asked for them.

Look at the following picture where the same website is served via HTTP/2. Check out the timeline and the initiator. You can see that **HTTP/2 multiplexing reduced the number of requests, and the assets were sent immediately together with the initial request.**

![HTTP/2 with Server Push in Node.js](https://blog-assets.risingstack.com/2017/08/http2-in-nodejs.png)_HTTP/2 with Server Push_

Let's see how you can use HTTP/2 Server Push today with Node.js and speed up your client's load time.

## HTTP/2 Server Push Example in Node.js

With requiring the built-in `http2` module, we can create our server just like we would do it with the `https` module.

The interesting part is that we push other resources when the `index.html` is requested:

```javascript
const http2 = require('http2');
const server = http2.createSecureServer({ cert, key }, onRequest);

function push(stream, filePath) {
  const { file, headers } = getFile(filePath);
  const pushHeaders = { [HTTP2_HEADER_PATH]: filePath };

  stream.pushStream(pushHeaders, (pushStream) => {
    pushStream.respondWithFD(file, headers);
  });
}

function onRequest(req, res) {
  // Push files with index.html
  if (reqPath === '/index.html') {
    push(res.stream, 'bundle1.js');
    push(res.stream, 'bundle2.js');
  }

  // Serve file
  res.stream.respondWithFD(file.fileDescriptor, file.headers);
}
```

This way the `bundle1.js` and `bundle2.js` assets will be sent to the browser even before it asks for them.

You can find the full example here: [https://github.com/RisingStack/http2-push-example](https://github.com/RisingStack/http2-push-example)

## HTTP/2 & Node

[HTTP/2 in @nodejs can help us at many points to optimize our client-server communication.](https://twitter.com/share?text=HTTP%2F2%20in%20%40nodejs%20can%20help%20us%20at%20many%20points%20to%20optimize%20our%20client-server%20communication.;url=https://blog.risingstack.com/node-js-http-2-push)

With Server Push, we can send assets to the browser before it has even asked for them to reduce the initial loading time for our users.

---

\- 多路复⽤: 雪碧图、多域名 CDN、接⼝合并

\- 官⽅演示: <https://http2.akamai.com/demo>

\- 多路复⽤允许同时通过单⼀的 HTTP/2 连接发起多重的请求-响应消息；⽽ HTTP/1.1 协议中，浏览器客户端在同⼀时间，针对同⼀域名下的请求有⼀定数量限制。超过限制数⽬的请求会 被阻塞

\- ⾸部压缩: http/1.x 的 header 由于 cookie 和 user agent 很容易膨胀，⽽且每次都要重复发送。 http/2 使⽤ encoder 来减少需要传输的 header ⼤⼩，通讯双⽅各⾃ cache ⼀份 header ﬁelds 表，既避免了重复 header 的传输，⼜减⼩了需要传输的⼤⼩。⾼效的压 缩算法可以很⼤的压缩 header，减少发送包的数量从⽽降低延迟

\- 服务端推送: 在 HTTP/2 中，服务器可以对客户端的⼀个请求发送多个响应。举个例⼦，如果⼀个请 求请求的是 index.html，服务器很可能会同时响应 index.html、logo.jpg 以及 css 和 js ⽂件，因为它知道客户端会⽤到这些东⻄。这相当于在⼀个 HTML ⽂档内集合了所有的 资源

