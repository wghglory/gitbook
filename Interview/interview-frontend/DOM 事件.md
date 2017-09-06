## 事件级别

```
DOM0: element.onclick = function(){}
DOM2: element.addEventListener('click', function(){}, false)
DOM3: element.addEventListener('keyup', function(){}, false)
```

## 事件模型

捕获（上到下）、冒泡（下到上）

## 事件流

捕获阶段 --> 目标阶段 --> 冒泡阶段

## 描述事件捕获流程

window --> document --> html (document.documentElement) --> body (document.body) --> ... --> target

## Event 对象常见应用

```javascript
event.preventDefault()
event.stopPropagation()
event.stopImmediatePropagation()  // 如果一个元素注册了多个点击事件，第一个事件触发时候想终止第二个事件处罚，在一个事件中调用此方法
event.target         // 被点击的子元素
event.currentTarget  // 事件委托的父级元素
```

## 自定义事件

```javascript
let ev = new Event('customEvent')
dom.addEventListener('customEvent', ()=>{})

// fire the event
dom.dispatchEvent(ev)
```

也可以使用 `new CustomEvent('name', obj)` 传递数据