# HTTP 协议, 跨域

观察 HTTP 协议 `curl -v http://www.baidu.com`

创建 http server

```js
// http/http-server.js

const http = require('http');
const fs = require('fs');

const app = http.createServer((req, res) => {
  const { method, url } = req;

  if (method == 'GET' && url == '/') {
    fs.readFile('./http/index.html', (err, data) => {
      res.setHeader('Content-Type', 'text/html');
      res.end(data); // data is buffer
    });
  } else if (method == 'GET' && url == '/api/users') {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify([{ name: 'derek', age: 20 }]));
  }
});

module.exports = app;
```

express server

```js
// express server

const express = require('express');

const app = express();

app.use(express.static(__dirname + '/'));

// https://expressjs.com/zh-cn/guide/routing.html
app.get('/api/users', (req, res) => {
  res.json({ message: 'good from express server' });
});

module.exports = app;
```

以下 html 可以在上面 2 个 server 都运行成功。

```html
<!-- index.html -->

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Document</title>
  </head>

  <body>
    <h1 id="data"></h1>
    <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
    <script>
      // 也会请求接口
      const img = new Image();
      img.src = '/api/users?abc=123';

      (async () => {
        // 请求接口
        const res = await axios.get('/api/users');
        console.log('data', res.data);
        document.getElementById('data').innerText = JSON.stringify(res.data);
      })();
    </script>
  </body>
</html>
```

下面演示跨域问题，修改 html 内 axios 请求 endpoint 为 httpServer, 这样 express 就会面临跨域问题。

## 跨域：浏览器同源策略引起的接⼝调⽤问题 （协议 端⼝ host）

```diff
// index.html

( async () => {
+  axios.defaults.baseURL = 'http://localhost:4000';   // http server endpoint; express 跨域

  // 1. 简单请求
  const users = await axios.get( "/api/users" );
  document.getElementById( 'data' ).innerText = JSON.stringify( users.data );
} )();
```

express server running at port 3000, http server running at port 4000. Both can resolve index.html correctly at first.

If `axios.defaults.baseURL = 'http://localhost:4000';` is added inside index.html, this means all api requests go through port 4000, so express server will face CORS issue.

```
Access to XMLHttpRequest at 'http://localhost:4000/api/users' from origin 'http://localhost:3000' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.

VM1379:1 GET http://localhost:4000/api/users net::ERR_FAILED
```

### 常⽤解决⽅案：

1. JSONP(JSON with Padding)，前端+后端⽅案，绕过跨域

前端构造 script 标签请求指定 URL（由 script 标签发出的 GET 请求不受同源策略限制），服务器返 回⼀个函数执⾏语句，该函数名称通常由查询参 callback 的值决定，函数的参数为服务器返回的 json 数据。该函数在前端执⾏后即可获取数据。

2. 代理服务器

   请求同源服务器，通过该服务器转发请求⾄⽬标服务器，得到结果再转发给前端。 前端开发中测试服务器的代理功能就是采⽤的该解决⽅案，但是最终发布上线时如果 web 应⽤和接⼝服务器不在⼀起仍会跨域。

   开发阶段 proxy 代理模式：

   ```diff
   const express = require('express');
   + const proxy = require('http-proxy-middleware');

   const app = express();
   app.use(express.static(__dirname + '/'));

   + // 开发时候可以用“反向代理”来解决跨域，后端所有请求转发到 port 4000, 浏览器发送的是 port 3000
   + // 需要关闭前端 axios.defaults.baseURL = 'http://localhost:4000'; 这样一个 3000 请求由 node 转发给 4000，服务器之间没有跨域
   + app.use('/api', proxy({ target: 'http://localhost:4000', changeOrigin: true }));

   ```

3. **CORS(Cross Origin Resource Share)** - 跨域资源共享，后端⽅案，解决跨域

### 预检请求 preflight !!!

原理：cors 是 w3c 规范，真正意义上解决跨域问题。它需要服务器对请求进⾏检查并对响应头做相应处理， 从⽽允许跨域请求。

具体实现：

1. **响应简单请求**: 动词为 `get/post/head`，没有⾃定义请求头，Content-Type 是 `application/x-wwwform-urlencoded，multipart/form-data 或 text/plain`之⼀，通过添加以下响应头解决：

   localhost:3000 express index.html tries to request port 4000 http Server, http server finds that request comes from port 3000 not self 4000, so it won't return anything due to CORS. We can let httpServer backend allow any request from port 3000.

   ```js
   res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
   ```

2. **响应 preﬂight 请求**，需要响应浏览器发出的 options 请求（预检请求），并根据情况设置响应头：

   ```js
   else if ((method == 'GET' || method == 'POST') && url == '/api/books') {
       res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
       res.setHeader('Content-Type', 'application/json');
       res.end(JSON.stringify([{ name: 'art of work', year: 2019 }]));
     } else if (method == 'OPTIONS' && url == '/api/books') {
       res.writeHead(200, {
         'Access-Control-Allow-Origin': 'http://localhost:3000',
         'Access-Control-Allow-Headers': 'X-Token,Content-Type',
         'Access-Control-Allow-Methods': 'GET',
       });
       res.end();
     }
   ```

   index.html

   ```js
   // 2. 复杂请求 get，并且这不是简单请求，preflight OPTIONS
   const books = await axios.get('/api/books', { headers: { 'X-Token': 'xxx' } });
   document.getElementById('books').innerText = JSON.stringify(books.data);

   // 3. 复杂请求 post
   const bookPost = await axios.post('/api/books', 'a=1&b=3', {
     headers: {
       'Content-Type': 'application/x-www-form-urlencoded',
       'X-Token': 'xxx',
     },
   });
   console.log(bookPost.data);
   ```

3. **响应 preﬂight 请求 + cookie**，则请求变为 credential 请求：

   ```js
   // 4. 复杂请求带 cookie 跨域
     else if (method === 'POST' && url === '/api/employees') {
       // 只有当前端设置 axios.defaults.withCredentials = true，发送请求才会携带 cookie，后端才能拿到 cookie
       console.log('cookie', req.headers.cookie);

       // 预检options中和接⼝中均需添加
       res.setHeader('Access-Control-Allow-Credentials', 'true');
       res.setHeader('Set-Cookie', 'cookie1=va222;'); // 后端设置 cookie，浏览器会得到

       res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
       res.setHeader('Content-Type', 'application/json');
       res.end(JSON.stringify([{ name: 'Jordan', position: 'SF' }]));
     } else if (method === 'OPTIONS' && url === '/api/employees') {
       // 预检options中和接⼝中均需添加
       res.setHeader('Access-Control-Allow-Credentials', 'true');

       res.writeHead(200, {
         'Access-Control-Allow-Origin': 'http://localhost:3000',
         'Access-Control-Allow-Headers': 'X-Token,Content-Type',
         'Access-Control-Allow-Methods': 'GET',
       });
       res.end();
     }

   ```

   index.html

   ```js
   // 4. 复杂请求带 cookie
   axios.defaults.withCredentials = true;
   const employeePost = await axios.post(
     '/api/employees',
     { a: 1, b: 2 },
     {
       headers: {
         'X-Token': 'derek',
       },
     },
   );
   console.log(employeePost.data);
   ```

## bodyParser 原理

```js
// frontend

// 5. bodyParser demo
        const req1 = await axios.post( "/api/save", 'a=1&b=3', {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        } );
        const req2 = await axios.post( "/api/save", {
          a: 1,
          b: 2
        } );
        console.log( req1 );

// backend
// 5. bodyParser 原理
  else if (method === 'POST' && url === '/api/save') {
    let reqData = [];
    let size = 0;
    req.on('data', (data) => {
      console.log('>>>req on', data);
      reqData.push(data);
      size += data.length;
    });
    req.on('end', function() {
      console.log('end');
      const data = Buffer.concat(reqData, size);
      console.log('data:', size, data.toString());
      res.end(`form data:${data.toString()}`);
    });
  }

```

**koa 使用 bodyParser**:

```js
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');

const app = new Koa();

app.use(require('koa-static')(__dirname + '/'));

const router = require('koa-router')();

app.use(bodyParser());

/* bodyParser 原理
注释掉 app.use(bodyParser());，打开下面

app.use((ctx, next) => {
  const req = ctx.request.req;
  let reqData = [];
  let size = 0;
  req.on('data', (data) => {
    console.log('>>>req on', data);
    reqData.push(data);
    size += data.length;
  });
  req.on('end', function() {
    console.log('end');
    const data = Buffer.concat(reqData, size);
    console.log('data:', size, data.toString());
  });
  next();
}); */

router.post('/api/save', async (ctx, next) => {
  console.log('body', ctx.request.body);
  ctx.body = ctx.request.body;
});

router.get('/api/users', async (ctx, next) => {
  ctx.body = { message: 'users from express server' };
});

router.get('/api/books', async (ctx, next) => {
  ctx.body = { message: 'books from express server' };
});

router.post('/api/books', async (ctx, next) => {
  ctx.body = { message: 'POST a book from express server' };
});

router.post('/api/employees', async (ctx, next) => {
  ctx.body = { message: 'POST an employee from express server' };
});

app.use(router.routes());

app.listen(3000);
```

## Spider

原理：服务端模拟客户端发送请求到⽬标服务器获取⻚⾯内容并解析，获取其中关注部分的数据。

```js
const originRequest = require('request');
const cheerio = require('cheerio');
const iconv = require('iconv-lite');

function request(url, callback) {
  const options = {
    url: url,
    encoding: null,
  };
  originRequest(url, options, callback);
}

for (let i = 100553; i < 100563; i++) {
  const url = `https://www.dy2018.com/i/${i}.html`;
  request(url, function(err, res, body) {
    const html = iconv.decode(body, 'gb2312');
    const $ = cheerio.load(html);
    console.log($('.title_all h1').text());
  });
}
```
