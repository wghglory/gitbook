/**
 * 判断一个对象是否是数组，参数不是对象或者不是数组，返回false
 *
 * @param {Object} obj 需要测试是否为数组的对象
 * @return {Boolean} 传入参数是数组返回true，否则返回false
 */
// 如果浏览器支持 Array.isArray() 可以直接判断否则需进行必要判断
function isArray(obj) {
  if (typeof obj === 'object') {
    return Object.prototype.toString.call(obj) === '[object Array]';
  }
  return false;

  // return obj instanceof Array; //method 2
  // return obj.constructor == Array; //method 3
}

/**
 * 判断对象是否为函数，如果当前运行环境对可调用对象（如正则表达式）的 typeof 返回' function'，采用通用方法，否则采用优化方法
 *
 * @param {Any} arg 需要检测是否为函数的对象
 * @return {boolean} 如果参数是函数，返回true，否则false
 */
function isFunction(arg) {
  if (arg) {
    if (typeof /./ !== 'function') {
      return typeof arg === 'function';
    } else {
      return Object.prototype.toString.call(arg) === '[object Function]';
    }
  }
  return false;
}

/**
 * 解析一个 url 并生成 window.location 对象中包含的域
 * console.log(parseUrl('http://google.com?s=fdf&g=guang'));
 *
 * location:
 * {
 *      href: '包含完整的url',
 *      origin: '包含协议到pathname之前的内容',
 *      protocol: 'url使用的协议，包含末尾的:',
 *      username: '用户名', // 暂时不支持
 *      password: '密码',  // 暂时不支持
 *      host: '完整主机名，包含:和端口',
 *      hostname: '主机名，不包含端口'
 *      port: '端口号',
 *      pathname: '服务器上访问资源的路径/开头',
 *      search: 'query string，?开头',
 *      hash: '#开头的fragment identifier'
 * }
 *
 * @param {string} url 需要解析的url
 * @return {Object} 包含url信息的对象
 */
function parseUrl(url) {
  var result = {};
  var keys = ['href', 'origin', 'protocol', 'host', 'hostname', 'port', 'pathname', 'search', 'hash'];
  var i, len;
  var regexp = /(([^:]+:)\/\/(([^:\/\?#]+)(:\d+)?))(\/[^?#]*)?(\?[^#]*)?(#.*)?/;

  var match = regexp.exec(url);

  if (match) {
    for (i = keys.length - 1; i >= 0; --i) {
      result[keys[i]] = match[i] ? match[i] : '';
    }
  }

  return result;
}

/**
 * 忽略大小写后的安字符串名字排序。在 node 读取文件夹中文件时，排序忽略英文大小写
 * @param {array} arr
 */
export function sortByAlphaIgnoreCase(arr) {
  arr.sort((a, b) => {
    return a.localeCompare(b, undefined /* Ignore language */, {
      sensitivity: 'base'
    });
  });
}

/**
 * 深拷贝 deepClone，也可以用 lodash 里面的
 */
function deepClone(obj) {
  let temp = Array.isArray(obj) ? [] : {};
  for (let key in obj) {
    //是否有嵌套对象
    temp[key] = typeof obj[key] === 'object' ? deepClone(obj[key]) : obj[key];
  }
  return temp;
}

/**
 * var a = {
    name: 'qiu',
    birth: new Date(),
    pattern: /qiu/gim,
    container: document.body,
    hobbys: ['book', new Date(), /aaa/gim, 111]
  };

  var b = deepClone(a)
 * @param {object} obj
 */
function deepClone(obj) {
  var _toString = Object.prototype.toString;

  // null, undefined, non-object, function
  if (!obj || typeof obj !== 'object') {
    return obj;
  }

  // DOM Node
  if (obj.nodeType && 'cloneNode' in obj) {
    return obj.cloneNode(true);
  }

  // Date
  if (_toString.call(obj) === '[object Date]') {
    return new Date(obj.getTime());
  }

  // RegExp
  if (_toString.call(obj) === '[object RegExp]') {
    var flags = [];
    if (obj.global) {
      flags.push('g');
    }
    if (obj.multiline) {
      flags.push('m');
    }
    if (obj.ignoreCase) {
      flags.push('i');
    }

    return new RegExp(obj.source, flags.join(''));
  }

  var result = Array.isArray(obj) ? [] : obj.constructor ? new obj.constructor() : {};

  for (var key in obj) {
    result[key] = deepClone(obj[key]);
  }

  return result;
}
