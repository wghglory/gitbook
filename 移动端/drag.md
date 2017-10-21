# 移动端拖拽

```javascript
/**
 * 移动端拖拽
 * 元素绝对定位，父级相对定位
 * 如果父级为window，则可以只传一个参数，物体相对于window范围拖动
 * 传2个参数，则父级为第二个参数，物体相对于父级范围拖动
 * 参数为id值
 * @param {node} obj drag target
 * @param {node} parentNode
 */
JC.tools.drag = function(obj, parentNode) {
  var pWidth, pHeight;
  if (arguments.length == 1) {
    parentNode = window.self;
    pWidth = parentNode.innerWidth;
    pHeight = parentNode.innerHeight;
  } else {
    pWidth = parentNode.clientWidth;
    pHeight = parentNode.clientHeight;
  }
  obj.addEventListener('touchstart', function(event) {
    //当只有一个手指时              .
    if (event.touches.length === 1) {
      event.preventDefault();
    }
    var touch = event.targetTouches[0];
    var disX = touch.clientX - obj.offsetLeft,
      disY = touch.clientY - obj.offsetTop;
    var oWidth = obj.offsetWidth,
      oHeight = obj.offsetHeight;

    function moving(event) {
      var touch = event.targetTouches[0];
      obj.style.left = touch.clientX - disX + 'px';
      obj.style.top = touch.clientY - disY + 'px';
      //左侧
      if (obj.offsetLeft <= 0) {
        obj.style.left = 0;
      }
      //右侧
      if (obj.offsetLeft >= pWidth - oWidth) {
        obj.style.left = pWidth - oWidth + 'px';
      }
      //上面
      if (obj.offsetTop <= 0) {
        obj.style.top = 0;
      }
      //下面
      if (obj.offsetTop >= pHeight - oHeight) {
        obj.style.top = pHeight - oHeight + 'px';
      }
    }

    obj.addEventListener('touchmove', moving);

    obj.addEventListener('touchend', function() {
      obj.removeEventListener('touchmove', moving);
      obj.removeEventListener('touchend', moving);
    });
  });
};
```
