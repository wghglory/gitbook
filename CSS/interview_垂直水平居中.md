# 盒子垂直水平居中

```css
/* 方法一 absolute transform/margin */
div {
  position: absolute;
  width: 500px;
  height: 300px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  /* 外边距为自身宽高的一半 margin: -150px 0 0 -250px; */
  background-color: pink;
}

/** 方法二 flex **/
.container {
  display: flex;
  align-items: center; /* 垂直居中 */
  justify-content: center; /* 水平居中 */
}

.container div {
  width: 100px;
  height: 100px;
  background-color: pink;
}

/** 方法三 absolute top right bottom left = 0 **/
div {
  position: absolute;
  width: 300px;
  height: 300px;
  margin: auto;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: pink;
}
```

对于文字使用 line-height === height 方式 span 和 文字 垂直对齐，`vertical-align: middle`

## 水平居中

<http://blog.jobbole.com/46574/>

- 给 div 设置一个宽度，然后添加 `margin: 0 auto` 属性

```css
div {
  width: 200px;
  margin: 0 auto;
}
```

面试说：对于文字，span 等 inline 元素，使用 `text-align center`，块级如果已知容器和孩子宽高，也可以通过 padding 挤出空间
