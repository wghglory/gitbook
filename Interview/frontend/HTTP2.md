# [HTTP/2 Server Push with Node.js](https://blog.risingstack.com/node-js-http-2-push/?utm_source=RisingStack+Engineering&utm_campaign=4da07f1f69-EMAIL_CAMPAIGN_2017_08_21&utm_medium=email&utm_term=0_02a6a69990-4da07f1f69-474943753)

node 8.4 `--expose-http2`

server push: 通过 full request 和 多路响应大大减少请求响应时间。不像 http 1 时代 浏览器加载html，再分别加载里面的 js, css, image 资源。http 2 得多路响应、加上server push 甚至在浏览器没有向服务端发送请求时 服务端都能迅速返回所需要的资源。

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

In HTTP/1 the client sends a request to the server, which replies with the requested content, usually with an HTML file that contains links to many assets *(.js, .css, etc. files)*. As the browser processes this initial HTML file, it starts to resolve these links and makes separate requests to fetch them.

Check out the following image that demonstrates the process. Pay extra attention to the independent requests on the timeline and to the initiator of those requests:

![HTTP 1.1 in Node.js](https://blog-assets.risingstack.com/2017/08/http_1-in-nodejs.png)*HTTP/1 assets loading*

This is how HTTP/1 works, and this is how we develop our application for so many years. **Why change it now?**

**The problem with the current approach is that the user has to wait while the browser parses responses, discovers links and fetches assets. This delays rendering and increases load times. There are workarounds like inlining some assets, but it also makes the initial response bigger and slower.**

> This is where HTTP/2 Server Push capabilities come into the picture as the server can send assets to the browser before it has even asked for them.

Look at the following picture where the same website is served via HTTP/2. Check out the timeline and the initiator. You can see that **HTTP/2 multiplexing reduced the number of requests, and the assets were sent immediately together with the initial request.**

![HTTP/2 with Server Push in Node.js](https://blog-assets.risingstack.com/2017/08/http2-in-nodejs.png)*HTTP/2 with Server Push*

Let's see how you can use HTTP/2 Server Push today with Node.js and speed up your client's load time.

## HTTP/2 Server Push Example in Node.js

With requiring the built-in `http2` module, we can create our server just like we would do it with the `https` module.

The interesting part is that we push other resources when the `index.html` is requested:

```javascript
const http2 = require('http2')
const server = http2.createSecureServer(
  { cert, key },
  onRequest
)

function push (stream, filePath) {
  const { file, headers } = getFile(filePath)
  const pushHeaders = { [HTTP2_HEADER_PATH]: filePath }

  stream.pushStream(pushHeaders, (pushStream) => {
    pushStream.respondWithFD(file, headers)
  })
}

function onRequest (req, res) {
  // Push files with index.html
  if (reqPath === '/index.html') {
    push(res.stream, 'bundle1.js')
    push(res.stream, 'bundle2.js')
  }

  // Serve file
  res.stream.respondWithFD(file.fileDescriptor, file.headers)
}
```

This way the `bundle1.js` and `bundle2.js` assets will be sent to the browser even before it asks for them.

You can find the full example here: [https://github.com/RisingStack/http2-push-example](https://github.com/RisingStack/http2-push-example)

## HTTP/2 & Node

[HTTP/2 in @nodejs can help us at many points to optimize our client-server communication.](https://twitter.com/share?text=HTTP%2F2%20in%20%40nodejs%20can%20help%20us%20at%20many%20points%20to%20optimize%20our%20client-server%20communication.;url=https://blog.risingstack.com/node-js-http-2-push)

With Server Push, we can send assets to the browser before it has even asked for them to reduce the initial loading time for our users.