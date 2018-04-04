# Cookie

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
    },
  };

  return cookieUtil;
})(window);
```
