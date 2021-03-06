# XMLHttpRequest

- ajax 的基本使用

  - 新建 XMLHttpRequest 对象；

    ```javascript
    let xhr = new XMLHttpRequest();
    ```

  - 配置请求参数

    ```javascript
    xhr.open('get', '/checkUser', true); //true是异步，false是同步
    ```

  - 接收返还值

    ```javascript
    let xhr = new XMLHttpRequest();
    xhr.open('get', '/xml', true);

    // 重写content-type；
    xhr.overrideMimeType('text/xml');

    xhr.onload = function() {
      console.log(xhr.responseText);
      console.log(xhr.responseXML); // xml #document
      console.log(xhr.response);
      let name = xhr.responseXML.getElementsByTagName('name')[1].innerHTML;
      console.log(name);
    };
    xhr.send();
    ```

    ```javascript
    xhr.onload = function() {
      let res = JSON.parse(xhr.responseText); // json
    };
    ```

- 发送服务器

  ```javascript
  xhr.send();
  ```

- get 注意点

- get 通过 params 传参
- get 和 queryString 的问题,通过 url 传参

- post 注意点

- 发送数据时候需要设置 http 正文头格式；

  ```js
  xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded'); //默认编码
  xhr.setRequestHeader('Content-type', 'multipart/form-data'); //二进制编码
  xhr.setRequestHeader('Content-type', 'application/json'); //json编码
  ```

- 获取头部信息；
  - getAllResponseHeaders 或者是 getResponseHeader

## Introduction

- `readyState`: 表示请求状态的整数，取值:
  - UNSENT（0）: 对象已创建
  - OPENED（1）: open()成功调用，在这个状态下，可以为 xhr 设置请求头，或者使用 send()发送请求
  - HEADERS_RECEIVED(2): 所有重定向已经自动完成访问，并且最终响应的 HTTP 头已经收到
  - LOADING(3): 响应体正在接收
  - DONE(4): 数据传输完成或者传输产生错误
- `onreadystatechange`: readyState 改变时调用的函数
- `status`: 服务器返回的 HTTP 状态码（如，200， 404）
- `statusText`: 服务器返回的 HTTP 状态信息（如，OK，No Content）
- `responseText`: 作为字符串形式的来自服务器的完整响应
- `responseXML`: Document 对象，表示服务器的响应解析成的 XML 文档
- `abort()`: 取消异步 HTTP 请求
- `getAllResponseHeaders()`: 返回一个字符串，包含响应中服务器发送的全部 HTTP 报头。每个报头都是一个用冒号分隔开的名/值对，并且使用一个回车/换行来分隔报头行
- `getResponseHeader(headerName)`: 返回 headName 对应的报头值
- `open`(method, url, asynchronous [, user, password]): 初始化准备发送到服务器上的请求。method 是 HTTP 方法，不区分大小写；url 是请求发送的相对或绝对 URL；asynchronous 表示请求是否异步；user 和 password 提供身份验证
- `setRequestHeader`(name, value): 设置 HTTP 报头
- `send`(body): 对服务器请求进行初始化。参数 body 包含请求的主体部分，对于 POST 请求为键值对字符串；对于 GET 请求，为 null

---

`XMLHttpRequest` 是用于 HTTP 协议的，因此 FTP 或 `file:` 协议不能使用 `XMLHttpRequest`。

setRequestHeader 有一些请求头是你不能指定的。`XMLHttpRequest` 会帮你设定。不能通过 `setRequestHeader()` 指定的头有:

- Accept-Charset
- Accept-Encoding
- Connection
- Content-Length
- Cookie
- Cookie2
- Content-Transfer-Encoding
- TE
- Date
- Trailer
- Expect
- Transfer-Encoding
- Host
- Upgrade
- Keep-Alive
- User-Agent
- Referrer
- Via

```javascript
function postMessage(msg) {
  var request = new XMLHttpRequest(); // New request
  request.open('POST', '/log.php');
  request.setRequestHeader('Content-Type', 'text/plain;charset=UTF-8'); // 必须在 `open()` 后、 `send()` 之前调用
  request.send(msg);
  // The request is done. We ignore any response or any error.
}
```

## 接收响应

通过 `XMLHttpRequest` 对象的属性或方法获取响应的信息:

- `status` 和 `statusText` 分别以数字和文本形式返回 HTTP 状态，如 `200` 和 `“OK”`。
- 响应头可以通过 `getResponseHeader()` 和 `getAllResponseHeaders()` 获取。 `XMLHttpRequest` 会自动处理 cookies，因此当你传 “Set-Cookie” 或 “Set-Cookie2” 给 `getResponseHeader()` 得到的是 null。
- `responseText` 是响应的字符串形式，`responseXML` 是文档形式。

`XMLHttpRequest` 一般是异步的。`send()` 方法调用后立即返回。表示响应的属性和方法要等到收到响应后才有效。要判断响应是否就绪，需要监听 **readystatechange** 事件（或 XHR2 **progress** 事件）。

`readyState` 属性是一个整数，表示 HTTP 请求的状态。规范定义了一些常量，但老的浏览器，包括 IE8 未定义，因此很多时候直接使用数字。

- `UNSENT` 或 `0`:`open()` 尚未被调用
- `OPENED` 或 `1`:`open()` 已经被调用
- `HEADERS_RECEIVED` 或 `2`:头部已经收到
- `LOADING` 或 `3`:响应正文正在被接收
- `DONE` 或 `4`:响应完成

理论上，每当 `readyState` 属性改变都会触发 `readystatechange` 事件。实际中，`readyState` 变到 0 或 1 可能不触发。`send()` 调用后一般会触发一次，即使 `readyState` 仍为 `OPENED`。一些浏览器在 `LOADING` 状态会触发多个事件，算进度反馈。所有浏览器当状态变为 4 时都会触发 `readystatechange`。

监听 `readystatechange` 事件的方法是设置 `XMLHttpRequest` 对象的 `onreadystatechange` 属性。也可以用 `addEventListener()`。

```javascript
function getText(url, callback) {
  var request = new XMLHttpRequest();
  request.open('GET', url);
  request.onreadystatechange = function() {
    if (request.readyState === 4 && request.status === 200) {
      var type = request.getResponseHeader('Content-Type');
      if (type.match(/^text/)) callback(request.responseText);
    }
  };
  request.send(null); // Send the request now
}
```

## 解码响应

响应若是文本，可以通过 `responseText` 属性获取。

如果服务器发送的是 XML 或 XHTML 文档，你可以通过 `responseXML` 属性获取解析后的版本。该属性的值是一个 `Document` 对象。

服务器还可以响应结构化的数据，如 JSON 编码的字符串。只能用 `JSON.parse()` 解析 `responseText` 了。

服务器可能响应二进制数据（如图片）。`responseText` 属性只用于文本，不能用于处理二进制响应。XHR2 定义了一种处理二进制响应的方法，但目前尚没有浏览器支持。

如果服务器响应未设置正确的 MIME 类型，`XMLHttpRequest` 对象不会解析并设置 `responseXML` 属性。如果服务器错误的设置了 content-type 的 `charset` 参数， `XMLHttpRequest` 解码会出错。为此，XHR2 定义了一个 `overrideMimeType()` 方法，你如果你知道响应的 MIME，在调用 `send()` 前调用 `overrideMimeType()`，让 `XMLHttpRequest` 忽略响应的 content-type 头。

```javascript
// Don't process the response as an XML document
request.overrideMimeType('text/plain; charset=utf-8');
```

### xml 处理

```javascript
// client
let xhr = new XMLHttpRequest();
xhr.open('get', '/xml', true);

// 重写content-type
xhr.overrideMimeType('text/xml');

xhr.onload = function() {
  console.log(xhr.responseText);
  console.log(xhr.responseXML); // xml #document
  console.log(xhr.response);
  let name = xhr.responseXML.getElementsByTagName('name')[1].innerHTML;
  console.log(name); // react入门
};
xhr.send();
```

```javascript
// server
router.get('/xml', (ctx, next) => {
  ctx.set('content-type', 'text/xml');
  ctx.body = `<?xml version='1.0' encoding='utf-8' ?>
                <books>
                    <nodejs>
                        <name>nodejs实战</name>
                        <price>56元</price>
                    </nodejs>
                    <react>
                        <name>react入门</name>
                        <price>50元</price>
                    </react>
                </books>
            `;
});
```

## 对请求正文进行编码

### Form-encoded 请求

编码表单数据的方法是:对每个表单项的键与值分别进行正常的 URI 编码（特殊字符由十六进制字符替代），用等号分割键值、用 `&` 分割表单项: `find=pizza&zipcode=02134&radius=1km`

这种格式的数据的 MIME 为:`application/x-www-form-urlencoded`。当你发送这类数据时，必须将请求头 `Content-Type` 设为该值。

把一个对象按表单编码:

```javascript
function encodeFormData(data) {
  if (!data) return '';
  var pairs = [];
  for (var name in data) {
    if (!data.hasOwnProperty(name)) continue;
    if (typeof data[name] === 'function') continue;
    var value = data[name].toString();
    name = encodeURIComponent(name.replace(' ', '+'));
    value = encodeURIComponent(value.replace(' ', '+'));
    pairs.push(name + '=' + value);
  }
  return pairs.join('&');
}
```

表单编码的数据还可以用于 GET 请求，附加到 GET 请求的查询串上:

```javascript
request.open('GET', url + '?' + encodeFormData(data));
```

### JSON 编码的请求

```javascript
request.send(JSON.stringify(data));
```

### 上传文件

利用 FormData 来实现文件上传

- 创建 FormData 对象

- 监控上传进度

  upload 事件

  - onloadstart 上传开始
  - onprogress 数据传输进行中
    - evt.total: 需要传输的总大小；
    - evt.loaded: 当前上传的文件大小；
  - onabort 上传操作终止
  - onerror 上传失败
  - onload 上传成功
  - onloadend 上传完成（不论成功与否）

> Refer **/Nodejs/05_upload.md**

HTTP 表单总是能发送文件。但直到最近，XHR2 API 才允许通过传 `File` 对象到 `send()` 方法上传文件。

获得 `File` 对象的方法。`<input type="file">` 元素有一个 `files` 属性，是一个类数组的对象，含有 `File` 对象。拖放 API 通过 `dataTransfer.files` 属性提供类似结构。

`File` 类型是 `Blob` 的子类型。XHR2 实际允许通过 `send()` 方法发送任何 `Blob` 对象。若你不显式设置，`Blob` 的 `type` 属性会被用于设置 `Content-Type`。如果你要上传二进制数据，可以将其转换为 `Blob` 后上传。

### multipart/form-data 请求

若表单既有文件又有其他元素，浏览器无法使用普通的表单编码，要使用一种特殊的 `Content-Type`: `multipart/form-data`。这种编码使用一个较长的边界字符串将请求分割成多个部分。

XHR2 定义了一个新的 `FormData` API，使得发送 multipart 请求变得简单。首先通过 `FormData()` 构造器创建 `FormData` 对象。然后通过 `append()` 方法添加一个个 “parts”，可以是字符串、`File` 或 `Blob` 对象。最后将 `FormData` 对象传入 `send()` 方法。

## HTTP 进度事件

XHR2 草案定义了一个新的事件模型。多数现代浏览器支持。使用新的事件模型后就不必再使用 `readyState` 属性判断请求状态了。

触发顺序如下。当 `send()` 被调用，触发 **loadstart** 事件。在服务器响应下载的过程中 **而不是上传过程中！！**， `XMLHttpRequest` 触发多个 **progress** 事件，一般每 50 毫秒一次。请求完成后，触发 **load** 事件。

完成的请求不一定成功。**load** 事件的处理器需要检查返回的状态码。有三种可能的错误。若请求超时，触发 **timeout** 事件。若请求被放弃，触发 **abort** 事件。其他错误，如“太多重定向），触发 **error** 事件。

对于一个请求，**load**、 **abort**、 **timeout** 和 **error** 这四个事件，浏览器只会触发其中一个。XHR2 草案规定上述四个事件触发后，要再触发一个 **loadend** 事件。

可以通过 `XMLHttpRequest` 的 `addEventListener()` 方法注册这些事件的处理器。若只需要一个处理器，可以设置相应的处理器属性，如 `onprogress`、 `onload` 等。

进度事件的事件对象，除了一般 `Event` 对象的属性，如 `type`、`timestamp`。

- `loaded` 属性是已传输的字节数。
- `total` 属性是要传输的总的字节数，来自 `Content-Length` 头。若响应没有该头，该值为 0。`lengthComputable` 属性，布尔，用于判断到底知不知道响应的长度。

**上述是下载的传输，而不是指上传的传输** 这几个属性对于计算已加载的百分比:

```javascript
request.onprogress = function(e) {
  if (e.lengthComputable)
    progress.innerHTML = Math.round((100 * e.loaded) / e.total) + '% Complete';
};
```

## 上传进度事件

XHR2 允许监控上传 HTTP 请求的进度。`XMLHttpRequest` 的 `upload` 属性是一个对象，有自己的 `addEventListener()` 方法，以及进度事件属性，如 `onprogress` 和 `onload`。

例如，对于一个 `XMLHttpRequest` 对象 `x`，设置 `x.onprogress` 属性监听响应的下载进度。设置 `x.upload.onprogress` 监听请求的上传进度。

## 放弃请求与超时

调用 `XMLHttpRequest` 对象的 `abort()` 方法可以取消正在进行的请求。并且在 `XHR2` 中调用 `abort()` 方法会触发 `abort` 事件。

XHR2 定义了一个 `timeout` 属性，指定超时（毫秒）后自动放弃请求，并触发 `timeout` 事件。目前还没有浏览器支持这一点。但我们可以通过 `setTimeout()` 和 `abort()` 自己模拟。
