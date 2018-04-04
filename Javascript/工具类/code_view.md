# 页面展示相关 Helper

```javascript
/**
 * 获取元素左上角 相对浏览器左上角（0，0）元素的坐标
 * @param {object} element
 *
 * @return {object} 元素左上角相对浏览器（0，0）坐标和元素宽高(包括 padding，border)
 */
function getPosition(element) {
  var rect = element.getBoundingClientRect();
  return { x: rect.left, y: rect.top, width: rect.width, height: rect.height };

  // let top = 0;
  // let left = 0;
  // while (element) {
  //   top += element.offsetTop;
  //   left += element.offsetLeft;
  //   element = element.offsetParent;
  // }
  // return {
  //   top,
  //   left
  // };
}

/**
 * 查询指定窗口的视口尺寸，如果不指定窗口，查询当前窗口尺寸
 **/
function getViewportSize(w) {
  w = w || window;

  // IE9及标准浏览器中可使用此标准方法
  if ('innerHeight' in w) {
    return {
      width: w.innerWidth,
      height: w.innerHeight,
    };
  }

  var d = w.document;

  // IE 8及以下浏览器在标准模式下
  if (document.compatMode === 'CSS1Compat') {
    return {
      width: d.documentElement.clientWidth,
      height: d.documentElement.clientHeight,
    };
  }

  // IE8及以下浏览器在怪癖模式下
  return {
    width: d.body.clientWidth,
    height: d.body.clientHeight,
  };
}

/**
 * 获取指定window中滚动条的偏移量，如未指定则获取当前 window 滚动条偏移量
 *
 * @param {window} w 需要获取滚动条偏移量的窗口
 * @return {Object} obj.x为水平滚动条偏移量,obj.y为竖直滚动条偏移量
 */
function getScrollOffset(w) {
  w = w || window;
  // 如果是标准浏览器
  if (w.pageXOffset != null) {
    return {
      x: w.pageXOffset,
      y: w.pageYOffset,
    };
  }

  // 老版本IE，根据兼容性不同访问不同元素
  var d = w.document;
  if (d.compatMode === 'CSS1Compat') {
    return {
      x: d.documentElement.scrollLeft,
      y: d.documentElement.scrollTop,
    };
  }

  return {
    x: d.body.scrollLeft,
    y: d.body.scrollTop,
  };
}
```
