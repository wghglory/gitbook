# 移动端模态窗 modal

移动端当有 `fixed` 遮罩背景和弹出层时，在屏幕上滑动能够滑动背景下面的内容，这就是著名的滚动穿透问题

## 方案1

```css
body.modal-open,
html.modal-open {
  overflow: hidden;
  height: 100%;
}
```

页面弹出层上将 `.modal-open` 添加到 `html` 上，禁用 `html` 和 `body` 的滚动条

但是这个方案有两个缺点：

* 由于 html 和 body 的滚动条都被禁用，弹出层后页面的滚动位置会丢失，需要用 js 来还原
* 页面的背景还是能够有滚动的效果

## 方案2：js 之 touchmove + preventDefault

```javascript
modal.addEventListener('touchmove', function(e) {
  e.preventDefault();
}, false);
```

这样用 js 阻止滚动后看起来效果不错了，但是也有一个缺点：

弹出层里不能有其它需要滚动的内容（如大段文字需要固定高度，显示滚动条也会被阻止）

## 方案3：移动端滚动穿透问题完美解决方案 ✔️

```css
body.modal-open {
  position: fixed;
  width: 100%;
}
```

如果只是上面的 css，滚动条的位置同样会丢失。所以如果需要保持滚动条的位置需要用 js 保存滚动条位置，关闭的时候还原滚动位置。

```javascript
/**
  * ModalHelper helpers resolve the modal scrolling issue on mobile devices
  * https://github.com/twbs/bootstrap/issues/15852
  * requires document.scrollingElement polyfill https://uedsky.com/demo/src/polyfills/document.scrollingElement.js
  */
var ModalHelper = (function(bodyCls) {
  var scrollTop;
  return {
    afterOpen: function() {
      scrollTop = document.scrollingElement.scrollTop;
      document.body.classList.add(bodyCls);
      document.body.style.top = -scrollTop + 'px';
    },
    beforeClose: function() {
      document.body.classList.remove(bodyCls);
      // scrollTop lost after set position:fixed, restore it back.
      document.scrollingElement.scrollTop = scrollTop;
    }
  };
})('modal-open');
```

例子：

```html
<style>
body.modal-open {
  position: fixed;
  width: 100%;
}
.modal {
  background: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: none;
}
.modal-frame {
  position: absolute;
  left: 10%;
  right: 10%;
  top: 50%;
  transform: translateY(-50%);
  border: solid 1px #ddd;
  background: #fff;
  padding: 1em;
}
</style>
<main>
  <button>Open Modal</button>
</main>
<div id="modal" class="modal">
  <div class="modal-content">
    <div style="height:9em;overflow-y:auto;">
      这里是可滚动内容<br>
      Modal Content<br>
      Modal Content<br>
      Modal Content<br>
      Modal Content<br>
      Modal Content<br>
      Modal Content<br>
      Modal Content<br>
      Modal Content<br>
      Modal Content<br>
      Modal Content<br>
      Modal Content<br>
    </div>
  </div>
</div>
<script>
(function() {
  /**
   * ModalHelper helpers resolve the modal scrolling issue on mobile devices
   * https://github.com/twbs/bootstrap/issues/15852
   * requires document.scrollingElement polyfill https://github.com/yangg/scrolling-element
   */
  var ModalHelper = (function(bodyCls) {
    var scrollTop;
    return {
      afterOpen: function() {
        scrollTop = document.scrollingElement.scrollTop;
        document.body.classList.add(bodyCls);
        document.body.style.top = -scrollTop + 'px';
      },
      beforeClose: function() {
        document.body.classList.remove(bodyCls);
        // scrollTop lost after set position:fixed, restore it back.
        document.scrollingElement.scrollTop = scrollTop;
      }
    };
  })('modal-open');

  function openModal() {
    document.getElementById('modal').style.display = 'block';
    ModalHelper.afterOpen();
  }
  function closeModal() {
    ModalHelper.beforeClose();
    document.getElementById('modal').style.display = 'none';
  }

  document.querySelector('button').onclick = openModal;
  document.querySelector('#modal').onclick = closeModal;
})();
</script>
```

## reference

<https://uedsky.com/demo/modal-scroll.html>
