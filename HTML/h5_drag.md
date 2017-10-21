# Drag and Drop 拖拽

在HTML5之前，如果要实现拖放效果，一般会使用 mousedown、mousemove 和 mouseup 三个事件进行组合来模拟出拖拽效果，比较麻烦。而HTML5规范实现了原生拖放功能，使得元素拖放的实现更加方便和高效。

默认情况下，图像、链接和文本是可以拖动的。文本只有在被选中的情况下才能拖动，而图像和链接在任何时候都可以拖动。

HTML5为所有的HTML元素规定了一个 draggable 属性，表示元素是否允许拖动。要想让其他元素也能被拖动，可以设置这个属性为 true。

---

A. 被拖动的**源对象**可以触发的事件

1. `ondragstart`：源对象开始被拖动
1. `ondrag`：源对象被拖动过程中(鼠标可能在移动也可能未移动)
1. `ondragend`：源对象被拖动结束

B. 拖动源对象可以进入到上方的**目标对象**可以触发的事件：

1. `ondragenter`：目标对象被源对象拖动着进入
1. `ondragover`：目标对象被源对象拖动着悬停在上方
1. `ondragleave`：源对象拖动着离开了目标对象
1. `ondrop`：源对象拖动着在目标对象上方释放/松手

C. 如何在拖动的源对象事件和目标对象事件间传递数据:

数据传递对象, 用于在源对象和目标对象的事件间传递数据: `e.dataTransfer`

1. 源对象上的事件处理中保存数据：`e.dataTransfer.setData(k, v);`

    > k-v 必须都是 string 类型

1. 目标对象上的事件处理中读取数据：`var v = e.dataTransfer.getData(k);`

---

## 实现拖放的步骤

### 创建一个可拖拽对象

#### 如果想要拖动某个元素，需要设置元素的 draggable 属性为 true。

```html
<img id="dragImg" draggable="true" />
```

#### 给 dragstart 设置一个事件监听器存储拖拽数据。

```javascript
document.getElementById("dragImg").addEventListener("dragstart", function(event) {
    // 存储拖拽数据和拖拽效果...
    event.dataTransfer.setData("Text", ev.target.id);
}, false);
```

### 放置对象

假设放置对象的DOM为：

```html
<div id="dragTarget"></div>
```

### dragenter 事件，用来确定放置目标是否接受放置。

如果放置被接受，那么这个事件必须取消。

```javascript
document.getElementById("dragTarget").addEventListener("dragenter", function(event) {
    // 阻止浏览器默认事件
    event.preventDefault();
}, false);
```

### dragover 事件，用来确定给用户显示怎样的反馈信息。

如果这个事件被取消，反馈信息（通常就是光标）就会基于 dropEffect 属性的值更新。

```javascript
document.getElementById("dragTarget").addEventListener("dragover", function(event) {
    // 阻止浏览器默认事件. ondragover 有一个默认行为！！！那就是当ondragover 触发时，ondrop 会失效！！！
    event.preventDefault();
}, false);
```

### 最后是drop事件，允许放置对象。

```javascript
document.getElementById("dragTarget").addEventListener("drop", function(event) {
    event.preventDefault();
    var data = event.dataTransfer.getData("Text");
    event.target.appendChild(document.getElementById(data));
}, false);
```

---

### 例子：

转载自：[http://www.w3school.com.cn/tiy/t.asp?f=html5_draganddrop](http://www.w3school.com.cn/tiy/t.asp?f=html5_draganddrop)

```html
<!DOCTYPE HTML>
<html>

<head>
  <style type="text/css">
    #dragTarget {
      width: 488px;
      height: 70px;
      padding: 10px;
      border: 1px solid #aaaaaa;
    }
  </style>
  <script type="text/javascript">
    function allowDrop(ev) {
      ev.preventDefault();
    }

    function drag(ev) {
      ev.dataTransfer.setData("Text", ev.target.id);
    }

    function drop(ev) {
      ev.preventDefault();
      var data = ev.dataTransfer.getData("Text");
      ev.target.appendChild(document.getElementById(data));
    }
  </script>
</head>

<body>
  <p>请把 W3School 的图片拖放到矩形中：</p>
  <div id="dragTarget" ondrop="drop(event)" ondragover="allowDrop(event)"></div>
  <br />
  <img id="dragImg" src="http://www.w3school.com.cn/i/w3school_banner.gif" draggable="true" ondragstart="drag(event)" />
</body>

</html>
```

## 拖放的相关事件

| 事件        | 产生事件的元素      | 描述               |
| --------- | ------------ | ---------------- |
| dragstart | 被拖放的元素       | 开始拖放操作           |
| drag      | 被拖放的元素       | 拖放过程中            |
| dragenter | 拖放过程中鼠标经过的元素 | 被拖放元素开始进入本元素的范围内 |
| dragover  | 拖放过程中鼠标经过的元素 | 被拖放元素正在本元素范围内移动  |
| dragleave | 拖放过程中鼠标经过的元素 | 被拖放元素离开本元素的范围    |
| drop      | 拖放的目标元素      | 有其他元素被拖放到本元素中    |
| dragend   | 拖放的对象元素      | 拖放操作结束           |

## DataTransfer对象的属性与方法

### DataTransfer对象的属性

| 属性            | 描述                                       |
| ------------- | ---------------------------------------- |
| dropEffect    | 表示拖放操作的视觉效果，允许对其进行值的设定。该效果必须在用effectAllowed属性指定的允许的视觉效果范围内，允许指定的值有：none、copy、link、move。 |
| effectAllowed | 用来指定当元素被拖放时所允许的视觉效果。可以指定的值有：none、copy、copyLink、copyMove、link、linkMove、all、uninitialize。 |
| files         | 返回表示被拖拽文件的 FileList。                     |
| types         | 存入数据的MIME类型。如果任意文件被拖拽，那么其中一个类型将会是字符串”Files”。 |

| 方法                                       | 描述                                       |
| ---------------------------------------- | ---------------------------------------- |
| void setData(DOMString format, DOMString data) | 向DataTransfer对象存入数据。                     |
| DOMString getData(DOMString data)        | 读取DataTransfer对象中的数据。                    |
| void clearData(DOMString format)         | 清除DataTransfer对象中的数据。如果省略参数format，则清除全部数据。 |
| void setDragImage(Element image, long x, long y) | 用img元素来设置拖放图标。                           |

## draggable 属性兼容性

![draggable 属性兼容性](http://static.zybuluo.com/dengzhirong/cxbopjk8ctuajycpdu6urmhm/image_1aq4irg51vpoq1j1mnaa9m1dbd9.png)
