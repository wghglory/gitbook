# Money

```javascript
/**
 * 如何将浮点数点左边的数每三位添加一个逗号，如12000000.11转化为『12,000,000.11』?
 * @param {Number} num
 */
function commafy(num) {
  return (
    num &&
    num.toString().replace(/(\d)(?=(\d{3})+\.)/g, function($1, $2) {
      return $2 + ',';
    })
  );
}

/**
 *  数字转换成金钱，每三位加","。并且控制小数点保留位数
 * @param {Number} number  数字
 * @param {Number} digit  小数点后保留位数
 * toMoney(12345435.34, 2)
 */
function toMoney(number, digit) {
  digit = digit > 0 && digit <= 20 ? digit : 2;
  number = parseFloat((number + '').replace(/[^\d\.-]/g, '')).toFixed(digit) + ''; //更改这里n数也可确定要保留的小数位
  var l = number
      .split('.')[0]
      .split('')
      .reverse(),
    r = number.split('.')[1];
  t = '';
  for (i = 0; i < l.length; i++) {
    t += l[i] + ((i + 1) % 3 == 0 && i + 1 != l.length ? ',' : '');
  }
  return (
    t
      .split('')
      .reverse()
      .join('') +
    '.' +
    r.substring(0, 2)
  ); //保留2位小数  如果要改动 把substring 最后一位数改动就可
}
```
