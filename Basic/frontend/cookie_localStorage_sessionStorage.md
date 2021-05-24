# Cookie, localStorage, sessionStorage 区别

- 共同点：

  - localStorage 和 sessionStorage 和 cookie 共同点

    - 同域（同源策略）限制：同源策略：请求与响应的 协议、域名、端口都相同 则时同源，否则为 跨源/跨域
    - 存储的内容都会转为字符串格式
    - 都有存储大小限制

  - localStorage 和 sessionStorage 共同点

    - API 相同
    - 存储大小限制一样基本类似
    - 无个数限制

- 不同点

  - localStorage

    - 没有有效期，除非删除，否则一直存在
    - 同域下页面共享
    - 支持 storage 事件

  - sessionStorage

    - 浏览器关闭，自动销毁
    - 页面私有
    - 不支持 storage 事件

  - cookie

    - 浏览器也会在每次请求的时候主动组织所有域下的 cookie 到请求头 cookie 中，发送给服务器端
    - 浏览器会主动存储接收到的 set-cookie 头信息的值
    - 可以设置 http-only 属性为 true 来禁止客户端代码（js）修改该值
    - 可以设置有效期 (默认浏览器关闭自动销毁)(不同浏览器有所不同)
    - 同域下个数有限制，最好不要超过 50 个(不同浏览器有所不同)
    - 单个 cookie 内容大小有限制，最好不要超过 4000 字节(不同浏览器有所不同)

- cookie 在浏览器和服务器间来回传递。 sessionStorage 和 localStorage 不会
- cookie 有 secure 属性要求 HTTPS 传输
- cookie 属性有名，值，`max-age，path, domain，secure`
- cookie 默认有效期为浏览器会话，一旦用户关闭浏览器，数据就丢失，通过设置 `max-age=seconds` 属性告诉浏览器 cookie 有效期
- cookie 作用域通过文档源和文档路径来确定，通过 `path` 和 `domain` 进行配置，web 页面同目录或子目录文档都可访问
- 浏览器不能保存超过 300 个 cookie，单个服务器不能超过 20 个，每个 cookie 不能超过 `4k`。web storage 大小支持能达到 `5M`
- sessionStorage 和 localStorage 有更多丰富易用的接口
- sessionStorage 和 localStorage 各自独立的存储空间
- sessionStorage 在窗口关闭前有效，关闭窗口而非浏览器就会丢失数据。在新标签或窗口打开一个页面会初始化一个新的会话
- localStorage 的数据会一直存在，即使在浏览器被关闭以后。**localStorage 的修改会促发其他文档窗口的 update 事件，所以可以多窗口通信**

Storage 对象通常被当做普通 javascript 对象使用：通过设置属性来存取字符串值，也可以通过 `setItem(key, value)` 设置，`getItem(key)` 读取，`removeItem(key)` 删除，`clear()` 删除所有数据，`length` 表示已存储的数据项数目，`key(index)` 返回对应索引的 key

## Cookie

### Server Cookie

- koa 中 cookie 的使用

  - 储存 cookie 的值；

  ```js
  ctx.cookies.set(name, value, [options]);
  ```

  - 获取 cookie 的值

  ```js
  ctx.cookies.get(name, [options]);
  ```

  - options 常用设置
    - `maxAge` 一个数字表示从 Date.now() 得到的毫秒数
    - `expires` cookie 过期的 `Date`
    - `path` cookie 路径, 默认是`'/'`
    - `domain` cookie 域名
    - `secure` 安全 cookie 设置后只能通过 https 来传递 cookie
    - `httpOnly` 服务器可访问 cookie, 默认是 **true**
    - `overwrite` 一个布尔值，表示是否覆盖以前设置的同名的 cookie (默认是 **false**). 如果是 true, 在同一个请求中设置相同名称的所有 Cookie

#### 登录案例

- 验证用户名密码是否正确；
- 实现登录功能，通过记住我实现七天免登录；

### Client Cookie

设置 cookie：`document.cookie = 'name=qiu; max-age=9999; path=/; domain=domain; secure';`。**设置 `max-age=0` 可以删除指定 cookie**

- key 和 value 是包含在一个字符串中
- [name] 这个 name 为自己取的 cookie 名称，同名的值会覆盖
- domain 所属域名
- path 所属路径
- Expires/Max-Age 到期时间/持续时间 (单位是秒)
- http-only 是否只作为 http 时使用，如果为 true，那么客户端能够在 http 请求和响应中进行传输，但时客户端浏览器不能使用 js 去读取或修改
- 多个 key=value 使用 ; （分号）分隔

获取 cookie: `document.cookie`。返回值是当前域名下的所有 cookie，并按照某种格式组织的字符串: `key=value;key1=value1;......keyn=valuen`

```javascript
var cookieUtil = (function(window, undefined) {
  var doc = window.document;

  var cookieUtil = {
    /**
     * 根据 opt 中设置的值设置cookie
     *
     * @param {Object} opt 包含cookie信息的对象，选项如下
     *   key {string} 需要设置的名字
     *   value {string} 需要设置的值
     *   maxAge {number} 有效期
     *   domain {string} domain
     *   path {string} path
     *   secure {boolean} secure
     *
     * @return {string} opt 对应的设置 cookie的字符串
     */
    setItem: function(opt) {
      var result = [];
      var str;

      if (opt.key) {
        result.push(encodeURIComponent(opt.key) + '=' + encodeURIComponent(opt.value));
        if ('maxAge' in opt) {
          result.push('max-age=' + opt.maxAge);
        }
        if ('domain' in opt) {
          result.push('domain=' + opt.domain);
        }
        if ('path' in opt) {
          result.push('path=' + opt.path);
        }
        if (opt.secure) {
          result.push('secure');
        }

        str = result.join('; ');
        doc.cookie = str;
      }
      return str;
    },

    /**
     * 从 cookie 读取指定 key 的值，如果key有多个值，返回数组，如果没有
     * 对应key，返回undefined
     *
     * @param {string} key 需要从 cookie 获取值得 key
     * @return {string|Array|undefined} 根据cookie数据返回不同值
     */
    getItem: function(key) {
      key = encodeURIComponent(key);

      var result;
      var pairs = doc.cookie.split('; ');
      var i, len, item, value;

      for (i = 0, len = pairs.length; i < len; ++i) {
        item = pairs[i];
        if (item.indexOf(key) === 0) {
          value = decodeURIComponent(item.slice(item.indexOf('=') + 1));
          if (typeof result === 'undefined') {
            result = value;
          } else if (typeof result === 'string') {
            result = [result];
            result.push(value);
          } else {
            result.push(value);
          }
        }
      }
      return result;
    },

    /**
     * 解析cookie返回对象，键值对为cookie存储信息
     *
     * @return {Object} 包含cookie信息的对象
     */
    getAll: function() {
      var obj = {};
      var i, len, item, key, value, pairs, pos;

      pairs = doc.cookie.split('; ');
      for (i = 0, len = pairs.length; i < len; ++i) {
        item = pairs[i].split('=');
        key = decodeURIComponent(item[0]);
        value = decodeURIComponent(item[1] ? item[1] : '');
        obj[key] = value;
      }
      return obj;
    },

    /**
     * 清除当前文档能访问的所有cookie
     *
     */
    clear: function() {
      var pairs = doc.cookie.split('; ');
      var i, len, item, key;

      for (i = 0, len = pairs.length; i < len; ++i) {
        item = pairs[i];
        key = item.slice(0, item.indexOf('='));
        doc.cookie = key + '=; max-age=0';
      }
    },
  };

  return cookieUtil;
})(window);
```

```javascript
// 设置cookie
function setCookie(name, value, options = {}) {
  let cookieData = `${name}=${value};`;
  for (let key in options) {
    let str = `${key}=${options[key]};`;
    cookieData += str;
  }
  document.cookie = cookieData;
}

// 获取Cookie
function getCookie(name) {
  let arr = document.cookie.split('; ');
  for (let i = 0; i < arr.length; i++) {
    let items = arr[i].split('=');
    if (items[0] == name) {
      return items[1];
    }
  }
  return '';
}
```

### 什么是 Cookie 隔离？（或者说：请求资源的时候不要让它带 cookie 怎么做）

如果静态文件都放在主域名下，那静态文件请求的时候都带有的 cookie 的数据提交给 server 的，非常浪费流量，所以不如隔离开。

因为 cookie 有域的限制，因此不能跨域提交请求，**故使用非主域名**的时候，请求头中就不会带有 cookie 数据，这样可以降低请求头的大小，降低请求时间，从而达到降低整体请求延时的目的。同时这种方式不会将 cookie 传入 Web Server，也减少了 Web Server 对 cookie 的处理分析环节，提高了 webserver 的 http 请求的解析速度。

## 本地缓存 localStorage, sessionStorage

- 设置

  `setItem(key, value)` 添加或更新（如果数据项中已存在该 key）数据项中指定 key 的 value

- 获取

  `getItem(key)` 获取数据项中指定 key 对应的 value

- 移出指定数据

  `removeItem(key)` 删除数据项中指定 key 的 value

- 清空所有数据

  `clear()` 清空所有数据项

```javascript
localStorage.setItem('x', 1); // storage x->1
localStorage.getItem('x'); // return value of x

// 枚举所有存储的键值对
for (var i = 0, len = localStorage.length; i < len; i++) {
  var name = localStorage.key(i);
  var value = localStorage.getItem(name);
}

localStorage.removeItem('x'); // remove x
localStorage.clear(); // remove all data
```

多个标签页通信主要是利用了 `localStorage` 的增删改事件监听

页面 A 发送事件:

```javascript
function sendMsg(text) {
  window.localStorage.setItem('msg', text);
}
```

页面 B 接收事件:

```javascript
window.addEventListener('storage', function(evt) {
  if (evt.key === 'msg') console.log(evt.newValue);
});
```

### Reference

- <https://github.com/wghglory/client-storage>
