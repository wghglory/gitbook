# 移动端 touch 事件

## touch 事件中的 touches、targetTouches 和 changedTouches

- `touches`: 当前**屏幕**上所有触摸点的列表
- `targetTouches`: 当前**对象**上所有触摸点的列表
- `changedTouches`: **涉及当前(引发)事件**的触摸点的列表

通过一个例子来区分一下触摸事件中的这三个属性：

1.  用一个手指接触屏幕，触发事件，此时这三个属性有相同的值。
1.  用第二个手指接触屏幕，此时，touches 有两个元素，每个手指触摸点为一个值。当两个手指触摸相同元素时，targetTouches 和 touches 的值相同，否则 targetTouches 只有一个值。changedTouches 此时只有一个值，为第二个手指的触摸点，因为第二个手指是引发事件的原因
1.  用两个手指同时接触屏幕，此时 changedTouches 有两个值，每一个手指的触摸点都有一个值
1.  手指滑动时，三个值都会发生变化
1.  一个手指离开屏幕，touches 和 targetTouches 中对应的元素会同时移除，而 changedTouches 仍然会存在元素。
1.  手指都离开屏幕之后，touches 和 targetTouches 中将不会再有值，changedTouches 还会有一个值，此值为最后一个离开屏幕的手指的接触点。

### 触点坐标选取

- `touchstart` 和 `touchmove` 使用: `e.targetTouches[0].pageX` 或 `(jquery)e.originalEvent.targetTouches[0].pageX`
- `touchend` 使用: `e.changedTouches[0].pageX` 或 `(jquery)e.originalEvent.changedTouches[0].pageX`

## touchmove 事件对象的获取

想要在 `touchmove:function(e, 参数一)` 加一个参数，结果直接使用 `e.preventDefault()` 就会 e 报错，处理方法为使用 `arguments[0]` 获取 `event` 参数

```javascript
obj.addEventListener('touchmove', function(e, 参数一) {
  var e = arguments[0];
  e.preventDefault();
});
```

## 为何不用 click 以及 tap 由来

用过 Zepto 或 KISSY 等移动端 js 库的人肯定对 tap 事件不陌生，我们做 PC 页面时绑定 click，相应地手机页面就绑定 tap。但原生的 touch 事件本身是没有 tap 的，js 库里提供的 tap 事件都是模拟出来的。

**手机上响应 click 事件会有 300ms 的延迟，浏览器在 touchend 后会等待约 300ms，原因是判断用户是否有双击（double tap）行为。如果没有 tap 行为，则触发 click 事件，而双击过程中就不适合触发 click 事件了**。

**Zepto tap 就是为了解决 click 300ms 延迟而产生的**。tap 事件是模拟出来的，Zepto 对 singleTap 事件的处理：在 touchend 响应 250ms 无操作后，则触发 singleTap。

## 点击穿透的场景

我们经常会看到“弹窗/浮层”这种东西

![modal](https://segmentfault.com/img/bVqjI1?_=5447378)

整个容器里有一个底层元素的 div，和一个弹出层 modal div

```html
<div class="container">
  <div id="underLayer">底层元素</div>

  <div id="popupLayer">
    <div class="layer-title">弹出层</div>
    <div class="layer-action">
      <button class="btn" id="closePopup">关闭</button>
    </div>
  </div>
</div>
<div id="bgMask"></div>
```

然后为底层元素绑定 click 事件，而弹出层的关闭按钮绑定 tap 事件。

```javascript
// hide modal
$('#closePopup').on('tap', function(e) {
  $('#popupLayer').hide();
  $('#bgMask').hide();
});

// 底层有 click 事件，或者底层是个 a, input
$('#underLayer').on('click', function() {
  alert('underLayer clicked');
});
```

zepto 的 tap 通过兼听绑定在 document 上的 touch 事件来完成 tap 事件的模拟的，tap 事件是冒泡到 document 上触发的。而在冒泡到 document 之前，用户手的接触屏幕(touchstart)和离开屏幕(touchend)是会触发 click 事件的。因为 click 事件有延迟触发，所以在执行完 tap 事件之后，modal 组件马上就隐藏了，此时 click 事件还在延迟的 300ms 之中。当 300ms 到来的时候，click 到的其实是 modal 下方的元素，如果正下方的元素绑定的有 click 事件此时便会触发，如果没有绑定 click 事件的话就当没 click，但是正下方的是 input 输入框(或者选择框或者单选复选框)，点击默认聚焦而弹出输入键盘，这就是常出现的“点透”的情况。

### 解决“点透”问题

1.  引入 `fastclick.js`，因为 `fastclick` 源码不依赖其他库所以你可以在原生的 js 前直接加上。<https://github.com/ftlabs/fastclick>。思路是取消 click 事件（参看源码 164-173 行），用 touchend 模拟快速点击行为（参看源码 521-610 行）。

    ```javascript
    window.addEventListener(
      'load',
      function() {
        FastClick.attach(document.body);
      },
      false,
    );
    ```

1.  用 touchend 代替 tap 事件并阻止掉 touchend 的默认行为

    ```javascript
    $('#layer').on('touchend', function(event) {
      //很多处理比如隐藏什么的任务
      event.preventDefault();
    });
    ```

1.  延迟一定的时间(300ms+)来处理事件。（可以和 fadeInIn/fadeOut 等动画结合使用，可以做出过度效果）

    ```javascript
    $('#layer').on('tap', function(event) {
      setTimeout(function() {
        //程序处理
      }, 320);
    });
    ```

1.  遮挡(╮(╯﹏╰)╭)。动态地在触摸位置生成一个透明的元素，这样当上层元素消失而延迟的 click 来到时，它点击到的是那个透明的元素，也不会“穿透”到底下。在一定的 timeout 后再将生成的透明元素移除。

1.  pointer-events 是 CSS3 中的属性(比较麻烦且有缺陷，不建议使用)

    auto：效果和没有定义 pointer-events 属性相同，鼠标不会穿透当前层。 none：元素不再是鼠标事件的目标，鼠标不再监听当前元素。但是如果它的子元素设置了 pointer-events 为其它值，比如 auto，鼠标还是会监听这个子元素的。

    ```javascript
    $('#closePopup').on('tap', function(e) {
      $('#popupLayer').hide();
      $('#bgMask').hide();

      // close button tap 时下层元素不被监听
      $('#underLayer').css('pointer-events', 'none');

      // 下层元素恢复监听
      setTimeout(function() {
        $('#underLayer').css('pointer-events', 'auto');
      }, 400);
    });
    ```

## reference

- <http://www.cnblogs.com/yexiaochai/p/3462657.html>
- 对于需要同时绑定 tap 和 touchmove 的元素：<https://segmentfault.com/a/1190000005791890>
