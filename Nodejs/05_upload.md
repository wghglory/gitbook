# Upload

## Upload files with progress thru FormData by koa server

Refer <https://github.com/wghglory/node-webserver>:

public/formData2.html:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Document</title>
  </head>

  <body>
    <input type="file" class="myFile" />
    进度：
    <progress value="0" max="100"></progress>
    <span class="percent">0%</span>
    速度：<span class="speed">20b/s</span>
    <button>点击上传</button>
    <button>取消上传</button>
  </body>
  <script>
    let xhr = new XMLHttpRequest();
    let buttons = document.querySelectorAll('button');
    let startTime;
    let loaded;

    buttons[0].onclick = function() {
      let file = document.querySelector('.myFile').files[0];

      let form = new FormData();
      form.append('keyFile', file);

      xhr.open('post', '/upload2', true);
      xhr.onload = function() {
        console.log(xhr.responseText);
      };
      xhr.upload.onloadstart = function() {
        console.log('开始上传');
        startTime = new Date().getTime();
        loaded = 0;
      };
      xhr.upload.onprogress = function(evt) {
        let endTime = new Date().getTime();
        // 时间差；
        let dTime = (endTime - startTime) / 1000;
        // 当前时间内上传的文件大小
        let dloaded = evt.loaded - loaded;
        let speed = dloaded / dTime;
        let unit = 'b/s';
        startTime = new Date().getTime();
        loaded = evt.loaded;
        if (speed / 1024 > 1) {
          unit = 'kb/s';
          speed = speed / 1024;
        }
        if (speed / 1024 > 1) {
          unit = 'mb/s';
          speed = speed / 1024;
        }
        document.querySelector('.speed').innerHTML = speed.toFixed(2) + unit;
        // 当前文件上传的大小evt.loaded
        // 需要上传文件的大小
        let percent = (evt.loaded / evt.total) * 100;
        document.querySelector('progress').value = percent;
        document.querySelector('.percent').innerHTML = percent + '%';
      };
      xhr.upload.onload = function() {
        console.log('上传成功');
      };
      xhr.upload.onloadend = function() {
        console.log('上传完成');
      };
      xhr.upload.onabort = function() {
        console.log('取消上传');
      };
      xhr.send(form);
    };
    buttons[1].onclick = function() {
      xhr.abort();
    };
  </script>
</html>
```

koa-server2.js:

```javascript
const Koa = require('koa');
const Router = require('koa-router');
const koaBody = require('koa-body');

const fs = require('fs');

const data = require('./data.json');

const app = new Koa();

// http://localhost:3000/async.html to access files under public folder. Diff from koa-static-cache
app.use(require('koa-static')(__dirname + '/public'));

app.use(
  koaBody({
    multipart: true,
  }),
);

const router = new Router();

router.post('/upload2', (ctx, next) => {
  console.log(ctx.request.files);
  const fileData = fs.readFileSync(ctx.request.files.keyFile.path);
  fs.writeFileSync('public/upload/' + ctx.request.files.keyFile.name, fileData);
  ctx.body = '请求成功';
});

app.use(router.routes());
app.listen(3000);
```

> Note: fetch API currently doesn't support progress...

## Upload files by node server

```javascript
const http = require('http');
const fs = require('fs');
const path = require('path');

const chunk = [];
let size = 0;

const server = http.createServer((request, response) => {
  const { pathname } = require('url').parse(request.url);

  if (pathname === '/upload') {
    console.log('upload....');
    const fileName = request.headers['file-name'] ? request.headers['file-name'] : 'abc.png';
    const outputFile = path.resolve(__dirname, fileName);
    const fis = fs.createWriteStream(outputFile);

    // Buffer connect
    request.on('data', (data) => {
      chunk.push(data);
      size += data.length;
      console.log('data:', data, size);
    });
    request.on('end', () => {
      console.log('end...');
      const buffer = Buffer.concat(chunk, size);
      size = 0;
      fs.writeFileSync(outputFile, buffer);
      response.end();
    });

    // 流事件写入
    request.on('data', (data) => {
      console.log('data:', data);
      fis.write(data);
    });
    request.on('end', () => {
      fis.end();
      response.end();
    });

    request.pipe(fis);
    response.end();
  } else {
    const filename = pathname === '/' ? 'index.html' : pathname.substring(1);

    var type = (function(_type) {
      switch (
        _type // 扩展名
      ) {
        case 'html':
        case 'htm':
          return 'text/html charset=UTF-8';
        case 'js':
          return 'application/javascript charset=UTF-8';
        case 'css':
          return 'text/css charset=UTF-8';
        case 'txt':
          return 'text/plain charset=UTF-8';
        case 'manifest':
          return 'text/cache-manifest charset=UTF-8';
        default:
          return 'application/octet-stream';
      }
    })(filename.substring(filename.lastIndexOf('.') + 1));

    // 异步读取文件,并将内容作为单独的数据块传回给回调函数
    // 对于确实很大的文件,使用API fs.createReadStream()更好
    fs.readFile(path.resolve(__dirname, filename), function(err, content) {
      if (err) {
        // 如果由于某些原因无法读取文件
        response.writeHead(404, { 'Content-type': 'text/plain charset=UTF-8' });
        response.write(err.message);
      } else {
        // 否则读取文件成功
        response.writeHead(200, { 'Content-type': type });
        response.write(content); // 把文件内容作为响应主体
      }
      response.end();
    });
  }
});
server.listen(3000);
```

```html
<html>
  <head>
    <title>file test</title>
    <script>
      window.onload = function() {
        var files = document.getElementsByTagName('input'),
          len = files.length,
          file;
        for (var i = 0; i < len; i++) {
          file = files[i];
          if (file.type !== 'file') continue; // 不是文件类型的控件跳过
          file.onchange = function() {
            var _files = this.files;
            if (!_files.length) return;
            if (_files.length === 1) {
              // 选择单个文件
              var xhr = new XMLHttpRequest();
              xhr.open('POST', 'http://localhost:3000/upload');
              var filePath = files[0].value;
              xhr.setRequestHeader('file-name', filePath.substring(filePath.lastIndexOf('\\') + 1));
              xhr.send(_files[0]);
            } else {
            }
          };
        }
      };
    </script>
  </head>

  <body>
    <input id="file1" type="file" />

    <!-- <form action="/upload" method="POST">
      <input type="file" name='file'>
      <input type="text" name='name' value='abc'>
      <input type="submit" name='upload'>
    </form> -->
  </body>
</html>
```
