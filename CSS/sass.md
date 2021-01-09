# scss vs sass

Sass 有两种后缀名文件：`.sass`和`.scss`。在同一个项目中，两种格式文件可以共存（不建议，最好统一为一种格式），但二者有各自的特点：

- sass 后缀的文件：使用类 Ruby 的语法，格式为空格缩进式，没有花括号，靠换行区分不同属性，格式要求比较严格。
- scss 后缀的文件：是 Sass3 引入的新语法，基本写法与 CSS 大致相同，所以对于专门做前端的同学来说，`.scss`后缀的文件是不二选择。

## 编译

### 编译方法

Sass 编译方式大概有三种：通过命令行编译（基础方法）、GUI 可视化图形同居编译及自动化编译。

1.  命令行编译

    - 单文件转换命令：

      ```shell
      sass style.scss style.css
      #把名为 style 的 Sass 文件转换为 CSS文件。
      ```

    - 单文件监听命令（添加`--watch`命令）：

      ```shell
      sass --watch style.scss:style.css
      #`--watch`参数加上之后，可以监测style这个文件的变化，更新保存之后自动编译。
      ```

    - 多文件（文件夹）监听命令

      ```shell
      sass --watch sass/main:dist/css
      #监视 sass 目录下 main 文件夹中的所有 Sass文件，并自动编译为CSS文件之后，放到dist/css目录下。
      ```

    - 逆向操作，css 文件转换为 sass/scs s 文件

      ```shell
      sass-convert style.css style.sass
      sass-convert style.css style.scss
      ```

1.  GUI 编译工具推荐国人自己开发的 Koala 工具，有中文版，上手也很简单。[戳这里看教程](http://www.w3cplus.com/preprocessor/sass-gui-tool-koala.html)

1.  自动化编译这里有很多途径实现。可以通过 webstorm、Sublime 等编辑器的相关插件实现，也可以借助 Gulp 等自动化构建工具来配置。

> Sass 其他命令
>
> 1.  sass -h 运行命令行帮助文档，可以获得所有的配置选项
> 1.  sass –style 指定编译后的 css 代码格式，后面可跟 4 种参数：nested，expanded，compact，compressed
> 1.  sass –sourcemap 表示开启 sourcemap 调试。开启之后，会生成一个后缀名为.css.map 的文件。不过现在基本都会默认生成此文件。

### 编译结果

像上面提到的，通过给命令`--style`后面添加不同的参数，会生成不同样式的 css 代码，这其实没有太多好说，但大家有没有想过一个问题，Sass 文件中的注释会被编译到 CSS 文件中么？这就要看`--style`命令后面是什么参数了，默认是`nested（嵌套式）`，而`expanded（展开式）`是 CSS 代码常见的格式。

[![Markdown](http://i1.piimg.com/583407/a1558f9d4383def4.png)](http://i1.piimg.com/583407/a1558f9d4383def4.png)

--Sass 中的注释有 3 种：--

1.  `//我是单行注释` 不会出现在编译之后任何格式的 CSS 文件中。
1.  `/-我是多行注释-/` 只会出现在编译之后代码格式为 expanded 的 CSS 文件中。
1.  `/-!我是强制注释-/` 会出现在任何代码格式的 CSS 文件中。

## 常用基本语法

## 1. 变量

变量是 Sass 中最基本的语法。凡是 css 属性的标准值（比如说 1px 或者 bold）可存在的地方，都可以替换为变量。之后，如果你需要一个不同的值，只需要改变这个变量的值，则所有引用此变量的地方生成的值都会随之改变。通过 --\$-\* 符号来定义，通过变量名称实现多处重复引用。

```scss
$box-color: red; //定义变量
ul {
  color: $box-color; //引用
}
li {
  background-color: $box-color; //引用
}

//编译后
ul {
  color: red;
}
li {
  background-color: red;
}
```

另外，变量的值也可以引用其他变量：

```scss
$highlight-color: #f90;
$highlight-border: 1px solid $highlight-color;

.selected {
  border: $highlight-border;
}

//编译后
.selected {
  border: 1px solid #f90;
}
```

## 2. 嵌套

Sass 支持选择器及属性嵌套，可以避免代码的重复书写。

### 2.1 选择器嵌套

```scss
div {
    h1 {
        color: #333;
    }
    p {
        margin-bottom: 1.4px;
        a {
            color: #999;
        }
    }
}

 /* 编译后 -/
div h1 { color: #333; }
div p { margin-bottom: 1.4px; }
div p a { color: #999; }
```

大多数情况下上面那种简单的嵌套都没问题。但如果你想要在嵌套的选择器里边应用一个类似于：hover 的伪类，就需要用到 --&-\* 这个连接父选择器的标识符。

```scss
div {
  p {
    margin-bottom: 1.4px;
    &:hover {
      color: #999;
    }
  }
}

//编译后：
div p {
  margin-bottom: 1.4px;
}
div p:hover {
  color: #999;
}
```

### 2.2 属性嵌套

示例 1：

```scss
div {
  border: {
    style: solid;
    width: 1px;
    color: #ccc;
  }
}

//编译后
div {
  border-style: solid;
  border-width: 1px;
  border-color: #ccc;
}
```

示例 2：

```scss
div {
  border: 1px solid #ccc {
    left: 0px;
    right: 0px;
  }
}

//编译后
div {
  border: 1px solid #ccc;
  border-left: 0px;
  border-right: 0px;
}
```

## 3. 代码重用之继承

使用选择器的继承，要使用关键词@extend，后面紧跟需要继承的选择器。

```scss
.class1 {
  border: 1px solid #333;
}

.class2 {
  @extend .class1;
  background-color: #999;
}

//编译后
.class1,
.class2 {
  border: 1px solid #333;
}

.class2 {
  background-color: #999;
}
```

如上示例，`.class2`不仅会继承`.class1`自身的所有样式，也会继承任何跟`.class1`有关的组合选择器样式，如下：

```scss
.class1 {
  border: 1px solid #333;
}
.class1 a {
  color: red;
}

.class2 {
  @extend .class1;
}

//编译后：
.class1,
.class2 {
  border: 1px solid #333;
}

.class1 a,
.class2 a {
  color: red;
}
```

## 4. 代码重用之 Mixin 混合器

sass 中使用@mixin 声明混合，可以传递参数，参数名以\$符号开始，多个参数以逗号分开，也可以给参数设置默认值。声明的@mixin 通过`@include + mixin 名称`来调用。

- 无参数 mixin 声明及调用：

  ```scss
  @mixin mixName {
    float: left;
    margin-left: 10px;
  }

  div {
    @include mixName;
  }

  //编译后：
  div {
    float: left;
    margin-left: 10px;
  }
  ```

- 带参数 mixin 声明及调用可以不给参数值直接写参数，如果给了值的话，就是参数的默认值，在调用的时候传入其他值就会把默认值覆盖掉。

  ```scss
  @mixin left($value: 10px) {
    float: left;
    margin-left: $value;
  }
  div {
    @include left(66px);
  }

  //编译后：
  div {
    float: left;
    margin-left: 66px;
  }
  ```

- 带多组数值参数的 mixin 声明及调用如果一个参数可以有多组值，如 box-shadow、transition 等，那么参数则需要在变量后加三个点表示，如\$variables…。

  ```scss
  @mixin mixName($shadow...) {
    box-shadow: $shadow;
  }

  .box {
    @include mixName(
      0 2px 2px rgba(0, 0, 0, 0.3),
      0 3px 3px rgba(0, 0, 0, 0.3),
      0 4px 4px rgba(0, 0, 0, 0.3)
    );
  }

  //编译后：
  .box {
    box-shadow: 0 2px 2px rgba(0, 0, 0, 0.3), 0 3px 3px rgba(0, 0, 0, 0.3),
      0 4px 4px rgba(0, 0, 0, 0.3);
  }
  ```

下面是一个实际应用中关于 CSS3 浏览器兼容的 mixin 使用示例：

```scss
@mixin transition($transition) {
  -webkit-transition: $transition;
  -moz-transition: $transition;
  -ms-transition: $transition;
  -o-transition: $transition;
  transition: $transition;
}
@mixin opacity($opacity) {
  opacity: $opacity;
  filter: alpha(opacity = $opacity * 100);
}

div {
  width: 100px;
  height: 100px;
  @include transition(all 0.5s);
  @include opacity(0.5);
}
ul {
  width: 50px;
  height: 50px;
  @include transition(all 1s);
  @include opacity(1);
}

//编译后
div {
  width: 100px;
  height: 100px;
  -webkit-transition: all 0.5s;
  -moz-transition: all 0.5s;
  -ms-transition: all 0.5s;
  -o-transition: all 0.5s;
  transition: all 0.5s;
  opacity: 0.5;
  filter: alpha(opacity=50);
}

ul {
  width: 50px;
  height: 50px;
  -webkit-transition: all 1s;
  -moz-transition: all 1s;
  -ms-transition: all 1s;
  -o-transition: all 1s;
  transition: all 1s;
  opacity: 1;
  filter: alpha(opacity=100);
}
```

## 5. 颜色函数

Sass 中集成了大量的颜色函数，让变换颜色更加简单直接。

```scss
$box-color: red;
ul {
  color: $box-color;
}
li {
  background-color: darken($box-color, 30%);
}

//编译后：
ul {
  color: red;
}
li {
  background-color: #660000;
}
```

> 其他颜色函数
>
> - lighten(#cc3, 10%) // #d6d65c
> - grayscale(#cc3) // #808080
> - complement(#cc3) // #33c

## 6. @import 引入

CSS 中原本就有不常用的`@import`语法，但是有两个弊端：

1.  引入语句一定要卸载代码最前面才会生效；
1.  影响性能。如果 A 文件要引入 B 文件，当浏览器读到 A 文件时会再去下载 B，阻塞进程。

而 Sass 中的`@import`会在生成 CSS 文件时就把引入的所有文件先导入进来，也就是所有相关的样式会被编译到同一个 CSS 文件中，无需发起额外的请求。当然，Sass 的`@import`也支持导入远程的 CSS 文件。那效果跟普通 CSS 导入样式文件一样，导入的 css 文件不会合并到编译后的文件中，而是以@import 方式存在。一般来说基础的文件命名需要以’\_’ 开头，如 `_partial.scss`。这种文件在导入的时候可以不写下划线及后缀，可写成@import “partial”。但是倒入 CSS 文件的话，就需要“文件名+后缀”了。

```scss
@import 'partial'; //导入名为“_partial.scss”的文件
@import 'toolbar.css'; //导入名toolbar.css”的文件

 {
  margin: 0;
  padding: 0;
}
```

### 原生的 CSS 导入

下列三种情况下会生成原生的 CSS@import：

1.  被导入文件的名字以. css 结尾；
1.  被导入文件的名字是一个 URL 地址（例如[http://www.sass.hk/css/css.css](http://www.sass.hk/css/css.css) ），由此可用谷歌字体 API 提供的相应服务；
1.  被导入文件的名字是 CSS 的 url() 值。

也就是说，你不能用 Sass 的 @import 直接导入一个原始的 CSS 文件，因为 sass 会认为你想用 CSS 原生的 @import。但是，因为 sass 的语法完全兼容 css，所以你可以把原始的 css 文件改名为.scss 后缀，即可直接导入了。

---

### 一. Sass/Scss、Less 是什么?

参考网站：<http://www.sasschina.com/guide>

Sass (Syntactically Awesome Stylesheets)是一种动态样式语言，Sass 语法属于缩排语法，比 css 比多出好些功能(如变量、嵌套、运算,混入(Mixin)、继承、颜色处理，函数等)，更容易阅读。

#### Sass 与 Scss 是什么关系?

Sass 的缩排语法，对于写惯 css 前端的 web 开发者来说很不直观，也不能将 css 代码加入到 Sass 里面，因此 sass 语法进行了改良，Sass 3 就变成了 Scss(sassy css)。与原来的语法兼容，只是用{}取代了原来的缩进。

Less 也是一种动态样式语言。对 CSS 赋予了动态语言的特性，如变量，继承，运算， 函数. Less 既可以在客户端上运行 (支持 IE 6+, Webkit, Firefox)，也可在服务端运行 (借助 Node.js)。

### 二. Sass/Scss 与 Less 区别

1.  编译环境不一样

    Sass 的安装需要 Ruby 环境，是在服务端处理的，而 Less 是需要引入 less.js 来处理 Less 代码输出 css 到浏览器，也可以在开发环节使用 Less，然后编译成 css 文件，直接放到项目中，也有 Less.app、SimpleLess、CodeKit.app 这样的工具，也有在线编译地址。

1.  变量符不一样，Less 是@，而 Scss 是\$

1.  变量插值方式不同

    在两种语言中，变量都可以以一定的方式插入到字符串中去，这个特性极为有用，但两种语言的插入方式不同，具体请看下例：

    ```scss
    //sass 中
    $direction: left;
    .myPadding {
      padding-#{$direction}: 20px;
    }
    ```

    ```less
    //less中
    @direction: left;
    .myPadding {
      padding-@{direction}: 20px;
    }
    ```

    ```css
    //编译后的css代码是相同的，如下：
    .myPadding {
      padding-left: 20px;
    }
    ```

1.  输出设置，Less 没有输出设置，Sass 提供 4 中输出选项：nested, compact, compressed 和 expanded。

    输出样式的风格可以有四种选择，默认为 nested

    - nested：嵌套缩进的 css 代码
    - expanded：展开的多行 css 代码
    - compact：简洁格式的 css 代码
    - compressed：压缩后的 css 代码

1.  Sass 支持条件语句，可以使用`if{} else{}, for{}`循环等等。而 Less 不支持。

    ```scss
    @if lightness($color) > 30% {
    } @else {
    }

    @for $i from 1 to 10 {
      .border-#{$i} {
        border: #{$i}px solid blue;
      }
    }
    ```

1.  引用外部 CSS 文件

    scss 引用的外部文件命名必须以\_开头, 如下例所示: 其中\_test1.scss、\_test2.scss、\_test3.scss 文件分别设置的 h1 h2 h3。文件名如果以下划线\_开头的话，Sass 会认为该文件是一个引用文件，不会将其编译为 css 文件

    ```scss
    // 源代码：
    @import '_test1.scss';
    @import '_test2.scss';
    @import '_test3.scss';

    // 编译后：
    h1 {
      font-size: 17px;
    }

    h2 {
      font-size: 17px;
    }

    h3 {
      font-size: 17px;
    }
    ```

    Less 引用外部文件和 css 中的@import 没什么差异。

1.  Sass 和 Less 的工具库不同

    - Sass 有工具库 Compass, 简单说，Sass 和 Compass 的关系有点像 Javascript 和 jQuery 的关系, Compass 是 Sass 的工具库。在它的基础上，封装了一系列有用的模块和模板，补充强化了 Sass 的功能。bootstrap v4

    - Less 有 UI 组件库 Bootstrap v3

### 三. 总结

不管是 Sass 还是 Less，都可以视为一种基于 CSS 之上的高级语言，其目的是使得 CSS 开发更灵活和更强大，Sass 的功能比 Less 强大，基本可以说是一种真正的编程语言了，Less 则相对清晰明了，易于上手，对编译环境要求比较宽松。
