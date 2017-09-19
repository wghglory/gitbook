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

**Capture**: When you clicked, browser knows a click event occurred. It starts from the `window` (lowest level/root of your website), then goes to `document`, then html root tag, then `body`, then `table`... its trying to reach the the as lowest level of element as possible. This is called capture phase. (从上到下到达目标元素)

Target: When browser reach the lowest level of element. In this case, you have clicked on a table cell (table data) hence target would be `td` tag. Then browser checks whether you have any click handler attached to this element. If there is any, browser executes that click handler. This is called target phase. (执行目标元素的事件)

Bubbling: After firing click handler attached to `td`, browser walks toward root. One level upward and check whether there is any click handler attached with table row (`tr` element). If there is any it will execute that. Then it goes to `tbody, table, body, html, document, window`. In this stage its moving upward and this is called event bubbling or bubbling phase. (从目标元素向上直到 window, 所有注册的事件都会一次由内向外执行)

### 为何会有事件委托？它有什么好处？

You clicked on cell but all the event handler with parent elements will be fired. This is actually very powerful (check event delegation)

好处：不需要为每个子元素 li 注册事件。第二如果不使用事件委托，添加新 li 时候还要为它注册事件，麻烦。用 `e.CurrentTarget` 获取父级元素。

## 描述事件捕获流程

window --> document --> html (document.documentElement) --> body (document.body) --> ... --> target

## Event 对象常见应用

```javascript
event.preventDefault()
event.stopPropagation()
event.stopImmediatePropagation()  // 如果一个元素注册了多个点击事件，第一个事件触发时候想终止第二个事件处罚，在一个事件中调用此方法。 prevent multiple event handler to be fired for an event?
event.target         // 被点击的子元素
event.currentTarget  // 绑定事件父级元素 https://jsfiddle.net/thisman/gkdeocd6/
```

## 自定义事件

```javascript
let ev = new Event('customEvent')
dom.addEventListener('customEvent', () => {})

// fire the event
dom.dispatchEvent(ev)
```

也可以使用 `new CustomEvent('name', obj)` 传递数据

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