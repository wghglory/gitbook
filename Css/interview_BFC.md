# 边距重叠解决方案(BFC -- block format context)

边距重叠包含父子、兄弟

父子关系，子元素高度100px，margin-top 10px，这时容器高度也是100px，如果想让容器高度也是110px，需要创建BFC，常见是给容器加上 overflow hidden

## 原理，渲染规则

* BFC 内部的盒会在垂直方向一个接一个排列（可以看作BFC中有一个的常规流），他们相互影响，可能会发生margin collapse；
* BFC 的区域不会与浮动元素重叠
* BFC 在页面上是一个独立的容器，外面元素和里面的元素不会相互影响。
* 计算 BFC 高度时浮动元素也会参与计算

## 如何创建 BFC

* float 不为 none
* position 不为 relative or static
* display 设为 inline-block, table-cell, table
* overflow hidden/auto (不是 visible 就行)

## 使用场景

清除浮动，其背后原理就是浮动元素也参与计算

```html
<!DOCTYPE html>
<html>

<head>
  <meta charset="utf-8">
  <title>CSS盒模型</title>
  <style media="screen">
    html * {
      margin: 0;
      padding: 0;
    }
  </style>
</head>

<body>
  <section class="box" id="sec">
    <style media="screen">
      #sec {
        background: #f00;
        /* overflow: hidden; */
      }

      .child {
        height: 100px;
        margin-top: 10px;
        background: yellow
      }
    </style>
    <article class="child"></article>
  </section>

  <hr style="padding: 20px 0;">
  <!-- BFC垂直方向边距重叠 -->

  <section id="margin">
    <style>
      #margin {
        background: pink;
        overflow: hidden;
      }

      #margin>p {
        margin: 5px auto 25px;
        background: red;
      }
    </style>
    <p>如果是3个p并列，他们margin重叠。解决办法，在其中一个p套上div，让他BFC，此时margin会相加 </p>
    <div style="overflow:hidden">
      <p>2</p>
    </div>
    <p>2</p>
    <p>3</p>
  </section>

  <hr style="padding: 20px 0;">
  <!-- BFC不与float重叠 -->
  <section id="layout">
    <style media="screen">
      #layout .left {
        float: left;
        width: 100px;
        height: 100px;
        background: pink;
      }

      #layout .right {
        height: 110px;
        background: #ccc;
        overflow: auto;
      }
    </style>
    <div class="left"></div>
    <div class="right"></div>
  </section>

  <hr style="padding: 20px 0;">
  <!-- BFC子元素即使是float也会参与计算 -->
  <section id="float">
    <style media="screen">
      #float {
        background: red;
        overflow: auto;
        /*float: left;*/
      }

      #float .float {
        float: left;
        font-size: 30px;
      }
    </style>
    <div class="float">我是浮动元素</div>
  </section>

</body>

</html>
```
