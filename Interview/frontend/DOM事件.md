# DOM 事件

## 事件级别

```javascript
DOM0: element.onclick = function(){}
DOM2: element.addEventListener('click', function(){}, false)
DOM3: element.addEventListener('keyup', function(){}, false)
```

## 事件模型

捕获（上到下）、冒泡（下到上）

## 事件流

捕获阶段 --> 目标阶段 --> 冒泡阶段

**Capture**: When you clicked, browser knows a click event occurred. It starts from the `window` (lowest level/root of your website), then goes to `document`, then html root tag, then `body`, then `table`... its trying to reach as the lowest level of element as possible. This is called capture phase. (从上到下到达目标元素)

Target: When browser reach the lowest level of element. In this case, you have clicked on a table cell (table data) hence target would be `td` tag. Then browser checks whether you have any click handler attached to this element. If there is any, browser executes that click handler. This is called target phase. (执行目标元素的事件)

Bubbling: After firing click handler attached to `td`, browser walks toward root. One level upward and check whether there is any click handler attached with table row (`tr` element). If there is any it will execute that. Then it goes to `tbody, table, body, html, document, window`. In this stage its moving upward and this is called event bubbling or bubbling phase. (从目标元素向上直到 window, 所有注册的事件都会一次由内向外执行)

### 事件委托(event delegation)？为何有事件委托存在？它有什么好处？

You clicked on cell but all the event handler with parent elements will be fired. This is actually very powerful (check event delegation). 因为有事件冒泡，才会有事件委托出现。

好处：不需要循环为每个子元素 li 注册事件，节省空间和运算效率。第二如果不使用事件委托，添加新 li 时候还要为它注册事件，麻烦。用 `e.CurrentTarget` 获取父级元素。

## 描述事件捕获流程

window --> document --> html (document.documentElement) --> body --> ... --> target

## Event 对象常见应用

```javascript
event.preventDefault()
event.stopPropagation()
event.stopImmediatePropagation()  // 如果一个元素注册了多个点击事件，第一个事件触发时候想终止第二个事件触发，在一个事件中调用此方法。 prevent multiple event handler to be fired for an event?
event.target         // 被点击的子元素
event.currentTarget  // 绑定事件父级元素 https://jsfiddle.net/thisman/gkdeocd6/
```

## 自定义事件

浏览器：

```javascript
let ev = new Event('myEvent')
dom.addEventListener('myEvent', () => {})

// fire the event
dom.dispatchEvent(ev)
```

也可以使用 `new CustomEvent('name', obj)` 传递数据

Node端自定义事件：

```javascript
// 使用 EventEmitter 模块
const EventEmitter = require('events');

class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();
myEmitter.on('event', () => {
  console.log('an event occurred!');
});
myEmitter.emit('event');
```

## document.DOMContentLoaded, window.onload, document.readyState

1. The `DOMContentLoaded` event is fired when the initial HTML document has been completely loaded and parsed, **without waiting for stylesheets, images, and subframes to finish loading**.

    ```javascript
    document.addEventListener("DOMContentLoaded", function(event) {
      console.log("DOM fully loaded and parsed. Images might be loading");
    });

    for(var i=0; i<1000000000; i++)
    {} // this synchronous script is going to delay parsing of the DOM. So the DOMContentLoaded event is going to launch later.
    ```

1. The `load` event is fired when everything has finished loading.

    ```javascript
    window.addEventListener("load", function(event) {
      console.log("All resources finished loading!");
    });
    ```

1. The `Document.readyState` property of a document describes the loading state of the document.

    The readyState of a document can be one of following:

    * `loading`: The document is still loading.
    * `interactive`(`DOMContentLoaded`): The document has finished loading and the document has been parsed but sub-resources such as images, stylesheets and frames are still loading.
    * `complete`(`load`): The document and all sub-resources have finished loading. The state indicates that the load event is about to fire.

<https://developer.mozilla.org/en-US/docs/Web/API/Document/readyState>

### IE 和 Chrome 标准浏览器事件处理的解决办法(老题目，了解)

IE 只有事件只能在冒泡阶段触发。标准浏览器通过 `addEventListener('click', function(){}, true/false)` 来指定触发阶段。false 为冒泡阶段触发。

IE:

* `attachEvent('click', function(){})` 添加事件
* `detachEvent('click', function(){})` 删除事件

标准浏览器 DOM 中的事件对象

* type：获取事件类型
* target：事件目标
* `stopPropagation()` 阻止事件冒泡
* `preventDefault()` 阻止事件的默认行为

IE中的事件对象

* type：获取事件类型
* srcElement：事件目标
* `cancelBubble = true` 阻止事件冒泡
* `returnValue = false` 阻止事件的默认行为
