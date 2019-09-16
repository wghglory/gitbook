# ES6 模版字符串遍历 json 数据生成 table

```javascript
// 上面代码中，模板字符串的变量之中，又嵌入了另一个模板字符串，使用方法如下。
const table = (addresses) => `
  <table>
    ${addresses
      .map(
        (addr) => `
        <tr><td>${addr.first}</td></tr>
        <tr><td>${addr.last}</td></tr>
      `,
      )
      .join('')}
  </table>
  `;

const data = [{ first: 'Jane', last: 'Bond' }, { first: 'Lars', last: 'Croft' }];
console.log(table(data));
```

最终生成：

```html
<table>
  <tr>
    <td>Jane</td>
  </tr>
  <tr>
    <td>Bond</td>
  </tr>
  <tr>
    <td>Lars</td>
  </tr>
  <tr>
    <td>Croft</td>
  </tr>
</table>
```
