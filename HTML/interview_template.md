# Html template

默认隐层的，html parser 会解析检查他的 content 是否合法，并不会渲染他。template 有 content 属性。`var clonedNode = document.importNode(templateDOM.content, true)` 得到 clone 节点，再 appendChild 到相应父级中。

`<template>` element is a mechanism for holding client-side content that is not to be rendered when a page is loaded but may subsequently be instantiated during runtime using JavaScript.

Think of a template as a content fragment that is being stored for subsequent use in the document. While the parser does process the contents of the `<template>` element while loading the page, it does so only to ensure that those contents are valid; the element's contents are not rendered, however.

```html
<!-- Learn about this code on MDN: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template -->

<table id="productTable">
  <thead>
    <tr>
      <td>UPC_Code</td>
      <td>Product_Name</td>
    </tr>
  </thead>
  <tbody>
    <!-- existing data could optionally be included here -->
  </tbody>
</table>

<template id="productRow">
  <tr>
    <td class="record"></td>
    <td></td>
  </tr>
</template>
```

```javascript
// Test to see if the browser supports the HTML template element by checking
// for the presence of the template element's content attribute.
if ('content' in document.createElement('template')) {
  // Instantiate the table with the existing HTML tbody
  // and the row with the template
  var t = document.querySelector('#productRow'),
    td = t.content.querySelectorAll('td');
  td[0].textContent = '1235646565';
  td[1].textContent = 'Stuff';

  // Clone the new row and insert it into the table
  var tb = document.querySelector('tbody');
  var clone = document.importNode(t.content, true);
  tb.appendChild(clone);

  // Create a new row
  td[0].textContent = '0384928528';
  td[1].textContent = 'Acme Kidney Beans';

  // Clone the new row and insert it into the table
  var clone2 = document.importNode(t.content, true);
  tb.appendChild(clone2);
} else {
  // Find another way to add the rows to the table because
  // the HTML template element is not supported.
}
```
