# queryString

```javascript
/**
 * @param {object} data
 * 表单数据装配成 queryString
 */
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

/**
 * usage:
 *  query string: ?foo=lorem&bar=&baz
    var foo = getParameterByName('foo'); // "lorem"
    var bar = getParameterByName('bar'); // "" (present with empty value)
    var baz = getParameterByName('baz'); // "" (present with no value)
    var qux = getParameterByName('qux'); // null (absent)
  Note: If a parameter is present several times (?foo=lorem&foo=ipsum),
  you will get the first value (lorem).

  method 2: `URLSearchParams`
  var searchParams = new URLSearchParams(window.location.search); //?anything=123
  console.log(searchParams.get("anything")) //123

  method 3:
  import queryString from 'query-string';
  queryString.parse('?playerOneName=wghglory&playerTwoName=ff');  // {playerOneName: "wghglory", playerTwoName: "ff"}
 * @param {string} name
 * @param {string} url
 */
function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

/**
 * 解析query string转换为对象，一个key有多个值时生成数组
 *
 * @param {String} query 需要解析的query字符串，开头可以是?，
 * console.log(parseQuery('sourceid=chrome-instant&ion=1&espv=2&ie=UTF-8'));
 * 按照application/x-www-form-urlencoded编码
 * @return {Object} 参数解析后的对象
 */
function parseQuery(query) {
  var result = {};

  // 如果不是字符串返回空对象
  if (typeof query !== 'string') {
    return result;
  }

  // 去掉字符串开头可能带的?
  if (query.charAt(0) === '?') {
    query = query.substring(1);
  }

  var pairs = query.split('&');
  var pair;
  var key, value;
  var i, len;

  for (i = 0, len = pairs.length; i < len; ++i) {
    pair = pairs[i].split('=');
    // application/x-www-form-urlencoded编码会将' '转换为+
    key = decodeURIComponent(pair[0]).replace(/\+/g, ' ');
    value = decodeURIComponent(pair[1]).replace(/\+/g, ' ');

    // 如果是新key，直接添加
    if (!(key in result)) {
      result[key] = value;
    } else if (isArray(result[key])) {
      // 如果key已经出现一次以上，直接向数组添加value
      result[key].push(value);
    } else {
      // key第二次出现，将结果改为数组
      var arr = [result[key]];
      arr.push(value);
      result[key] = arr;
    } // end if-else
  } // end for

  return result;
}
```
