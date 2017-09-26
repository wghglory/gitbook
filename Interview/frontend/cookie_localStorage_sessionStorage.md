# Cookie, localStorage, sessionStorage 区别

* cookie 在浏览器和服务器间来回传递。 sessionStorage 和 localStorage不会
* cookie 有 secure 属性要求 HTTPS 传输
* cookie 属性有名，值，max-age，path, domain，secure
* cookie 默认有效期为浏览器会话，一旦用户关闭浏览器，数据就丢失，通过设置 max-age=seconds 属性告诉浏览器 cookie 有效期
* cookie 作用域通过文档源和文档路径来确定，通过 path 和 domain 进行配置，web页面同目录或子目录文档都可访问
* 浏览器不能保存超过300个 cookie，单个服务器不能超过20个，每个 cookie 不能超过4k。web storage 大小支持能达到5M
* sessionStorage 和 localStorage 有更多丰富易用的接口
* sessionStorage 和 localStorage 各自独立的存储空间
* sessionStorage 在窗口关闭前有效，关闭窗口而非浏览器就会丢失数据。在新标签或窗口打开一个页面会初始化一个新的会话
* localStorage 的数据会一直存在，即使在浏览器被关闭以后。localStorage 的修改会促发其他文档窗口的 update 事件，所以可以多窗口通信

Storage 对象通常被当做普通 javascript 对象使用：通过设置属性来存取字符串值，也可以通过 `setItem(key, value)`设置，`getItem(key)`读取，`removeItem(key)`删除，`clear()`删除所有数据，`length`表示已存储的数据项数目，`key(index)`返回对应索引的key

## cookie

通过cookie保存数据的方法为：`document.cookie = 'name=qiu; max-age=9999; path=/; domain=domain; secure';`。设置 max-age 为0可以删除指定cookie

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
        } // end if
      } // end for
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
    }
  };

  return cookieUtil;
})(window);
```

### 什么是Cookie 隔离？（或者说：请求资源的时候不要让它带cookie怎么做）

如果静态文件都放在主域名下，那静态文件请求的时候都带有的 cookie 的数据提交给 server 的，非常浪费流量，所以不如隔离开。

因为 cookie 有域的限制，因此不能跨域提交请求，**故使用非主域名**的时候，请求头中就不会带有 cookie 数据，这样可以降低请求头的大小，降低请求时间，从而达到降低整体请求延时的目的。同时这种方式不会将 cookie 传入 Web Server，也减少了 Web Server 对 cookie的处理分析环节，提高了 webserver 的 http 请求的解析速度。

## localStorage

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

多个标签页通信主要是利用了 localStorage 的增删改事件监听

页面A发送事件:

```javascript
function sendMsg(text) {
    window.localStorage.setItem('msg', text);
}
```

页面B接收事件:

```javascript
window.addEventListener('storage', function (evt) {
    if(evt.key === 'msg')
       console.log(evt.newValue);
});
```