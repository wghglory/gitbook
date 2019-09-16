# 元素显示与隐藏的方案

```css
/* 首选 */
.hidden {
  position: absolute;
  top: -9999em;
}

.hidden {
  position: absolute;
  visibility: hidden;
}

.hidden {
  display: none;
}
```

对于 `position`，如果元素之前没有过 position 属性那就没问题，如果之前就是 absolute、relative 尽量不用

对于 `display`，需要判断之前元素是 `inline-block or block`

要想让屏幕阅读器等辅助设备也能明白显示和隐藏，只能用 `position top` 方法 （可用性隐藏）。但如果被隐藏元素是 a, input，这样的隐藏方式会在用户点击 tab 时产生扰乱，🐟 和 🐻 不可得兼。

使用 absolute 隐藏是会产生重绘 repaint 而不会产生强烈的回流 reflow。而使用 `display:none` 不仅会重绘，还会产生回流（DOM 节点删除增加），DOM 影响范围越广，回流越强烈。所以，就 JavaScript 交互的呈现性能上来讲，使用 absolute 隐藏是要优于 display 相关隐藏的。(reflow --> repaint)

- 方案 1 对应的 js

  ```javascript
  dom.style.position = 'static';

  // or

  dom.classList.remove('hidden'); //better
  ```

- 方案 2 对应的 js

  ```javascript
  dom.style.position = 'static';
  dom.style.visibility = 'visible';
  ```
