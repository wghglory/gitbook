# 常见网站布局

## 已知高度的三列布局，左右宽度固定，中间自适应。(float, absolute, flex, table, grid)

```html
<!DOCTYPE html>
<html>

<head>
  <meta charset="utf-8">
  <title>Layout</title>
  <style media="screen">
    html * {
      padding: 0;
      margin: 0;
    }

    .layout article div {
      min-height: 100px;
    }
  </style>
</head>

<body>
  <h1>高度如果未知，flex 和 table 可以继续用。不改变代码情况下grid内容超出</h1>
  <!--浮动布局  -->
  <section class="layout float">
    <style media="screen">
      .layout.float .left {
        float: left;
        width: 300px;
        background: red;
      }

      .layout.float .center {
        background: yellow;
      }

      .layout.float .right {
        float: right;
        width: 300px;
        background: blue;
      }
    </style>
    <h1>三栏布局</h1>
    <article class="left-right-center">
      <div class="left"></div>
      <div class="right"></div>
      <div class="center">
        <h2>浮动解决方案</h2>
        <p>兼容性比较好，但脱离了文档流，需要清除浮动</p>
        1.这是三栏布局的浮动解决方案； 2.这是三栏布局的浮动解决方案； 3.这是三栏布局的浮动解决方案； 4.这是三栏布局的浮动解决方案； 5.这是三栏布局的浮动解决方案； 6.这是三栏布局的浮动解决方案；
      </div>
    </article>
  </section>

  <!-- 绝对布局 -->
  <section class="layout absolute">
    <style>
      .layout.absolute .left-center-right>div {
        position: absolute;
      }

      .layout.absolute .left {
        left: 0;
        width: 300px;
        background: red;
      }

      .layout.absolute .center {
        left: 300px;
        right: 300px;
        background: yellow;
      }

      .layout.absolute .right {
        right: 0;
        width: 300px;
        background: blue;
      }
    </style>
    <h1>三栏布局</h1>
    <article class="left-center-right">
      <div class="left"></div>
      <div class="center">
        <h2>绝对定位解决方案</h2>
        <p>快捷，但也脱离了文档流，导致里面的布局也会脱离文档流，整个布局并不实用。</p>
        1.这是三栏布局的浮动解决方案； 2.这是三栏布局的浮动解决方案； 3.这是三栏布局的浮动解决方案； 4.这是三栏布局的浮动解决方案； 5.这是三栏布局的浮动解决方案； 6.这是三栏布局的浮动解决方案；
      </div>
      <div class="right"></div>
    </article>
  </section>


  <!-- flexbox 布局 -->
  <section class="layout flexbox">
    <style>
      .layout.flexbox {
        margin-top: 110px;
      }

      .layout.flexbox .left-center-right {
        display: flex;
      }

      .layout.flexbox .left {
        width: 300px;
        background: red;
      }

      .layout.flexbox .center {
        flex: 1;
        background: yellow;
      }

      .layout.flexbox .right {
        width: 300px;
        background: blue;
      }
    </style>
    <h1>三栏布局</h1>
    <article class="left-center-right">
      <div class="left"></div>
      <div class="center">
        <h2>flexbox解决方案</h2>
        <p>解决float and absolute shortcomings</p>
        <p>当中间文字过多时，两侧高度会同中间div高度保持一致</p>
        1.这是三栏布局的浮动解决方案； 2.这是三栏布局的浮动解决方案； 3.这是三栏布局的浮动解决方案； 4.这是三栏布局的浮动解决方案； 5.这是三栏布局的浮动解决方案； 6.这是三栏布局的浮动解决方案；
      </div>
      <div class="right"></div>
    </article>
  </section>


  <!-- 表格布局 -->
  <section class="layout table">
    <style>
      .layout.table .left-center-right {
        width: 100%;
        height: 100px;
        display: table;
      }

      .layout.table .left-center-right>div {
        display: table-cell;
      }

      .layout.table .left {
        width: 300px;
        background: red;
      }

      .layout.table .center {
        background: yellow;
      }

      .layout.table .right {
        width: 300px;
        background: blue;
      }
    </style>
    <h1>三栏布局</h1>
    <article class="left-center-right">
      <div class="left"></div>
      <div class="center">
        <h2>表格布局解决方案</h2>
        <p>历史上评价不高，兼容性好</p>
        <p>当中间文字过多时，两侧高度会同中间div高度保持一致</p>
        1.这是三栏布局的浮动解决方案； 2.这是三栏布局的浮动解决方案； 3.这是三栏布局的浮动解决方案； 4.这是三栏布局的浮动解决方案； 5.这是三栏布局的浮动解决方案； 6.这是三栏布局的浮动解决方案；
      </div>
      <div class="right"></div>
    </article>
  </section>

  <!-- 网格布局 -->
  <section class="layout grid">
    <style>
      .layout.grid .left-center-right {
        width: 100%;
        display: grid;
        grid-template-rows: 100px;
        grid-template-columns: 300px auto 300px;
      }

      .layout.grid .left-center-right>div {}

      .layout.grid .left {
        width: 300px;
        background: red;
      }

      .layout.grid .center {
        background: yellow;
      }

      .layout.grid .right {
        background: blue;
      }
    </style>
    <h1>三栏布局</h1>
    <article class="left-center-right">
      <div class="left"></div>
      <div class="center">
        <h2>网格布局解决方案</h2>
        <p>可以做复杂事情，新解决方案，兼容性不好</p>
        1.这是三栏布局的浮动解决方案； 2.这是三栏布局的浮动解决方案； 3.这是三栏布局的浮动解决方案； 4.这是三栏布局的浮动解决方案； 5.这是三栏布局的浮动解决方案； 6.这是三栏布局的浮动解决方案；
      </div>
      <div class="right"></div>
    </article>
  </section>
</body>

</html>
```

## 三栏垂直分布，上下固定，移动端常见

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
  <style>
    html * {
      margin: 0;
      padding: 0;
    }

    html,
    body {
      height: 100%;
    }
    /* position fixed
    header, footer {
      height: 100px;
      width: 100%;
      background: #ccc;
      position: fixed;
    }

    header {
      top: 0
    }

    footer {
      bottom: 0
    }

    section {
      height: calc(100% - 200px);
      background: yellow;
      padding: 100px 0;
    } */


    /*flex 布局*/
    body {
      display: flex;
      justify-content: flex-start;
      flex-direction: column;
    }

    header,
    footer {
      background: #ccc;
      height: 100px;
    }

    section {
      background: yellow;
      flex: 1;
    }
  </style>
</head>

<body>
  <header>移动端常见，我是导航</header>
  <section>
    <p>中间部分，自适应高度</p>
    <p>中间部分，自适应高度</p>
    <p>中间部分，自适应高度</p>
    <p>中间部分，自适应高度</p>
    <p>中间部分，自适应高度</p>
    <p>中间部分，自适应高度</p>
    <p>中间部分，自适应高度</p>
    <p>中间部分，自适应高度</p>
    <p>中间部分，自适应高度</p>
  </section>
  <footer>我是页面底部</footer>
</body>

</html>
```

## 两行，头固定，下面自适应高度

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
  <style>
    html,
    body {
      height: 100%;
    }

    body {
      display: flex;
      flex-direction: column;
    }

    header {
      /* height: 100px; */
      flex-basis: 100px;
      background: #ccc;
    }

    section{
      flex: 1;
      background: #312;
    }
  </style>
</head>

<body>
  <header>移动端常见，我是导航</header>
  <section>
    <p>中间部分，自适应高度</p>
    <p>中间部分，自适应高度</p>
    <p>中间部分，自适应高度</p>
    <p>中间部分，自适应高度</p>
    <p>中间部分，自适应高度</p>
    <p>中间部分，自适应高度</p>
    <p>中间部分，自适应高度</p>
    <p>中间部分，自适应高度</p>
    <p>中间部分，自适应高度</p>
  </section>
</body>

</html>
```

## 两列，左侧固定宽，右侧自适应宽度

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
  <style>
    html,
    body {
      height: 100%;
    }

    body {
      display: flex;
    }

    aside {
      flex-basis: 100px;
      background: #ccc;
    }

    section {
      flex: 1;
    }
  </style>
</head>

<body>
  <aside>侧边栏固定</aside>
  <section>
    <p>自适应宽度</p>
    <p>自适应宽度</p>
    <p>自适应宽度</p>
    <p>自适应宽度</p>
    <p>自适应宽度</p>
    <p>自适应宽度</p>
    <p>自适应宽度</p>
    <p>自适应宽度</p>
    <p>自适应宽度</p>
  </section>
</body>

</html>
```
