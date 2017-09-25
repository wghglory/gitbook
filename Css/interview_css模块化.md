# css 模块化

​下面说的是多页面非 SPA，在模块化开发的过程中，每一个模块都是一个独立的小系统，有自己的 html, js, css。js 模块化很方便移植。但是css 的引入却是个问题。问题在于一个页面要使用这个模块，要么在头部用 link 标签引入对应的 css 文件，要么直接把模块的 css 放在全局 css进行打包；前者属于有的放矢，有效的保证了资源的利用，但是需要人工引入，不方便；后者直接放在全局，虽然实现了方便性，但也对于不需要此模块的页面增加了负担，也增加了css样式相互影响的风险。

几种 css 模块化实践:

## 1. style 标签位置，由于 scoped 不再被支持，淘汰

html 页面样式文件的引入主要有三种方式：

1. 直接通过 style 属性写在 html 标签内，也就是**行内样式**
1. 引入外部 css 文件的形式，也即**外联样式**
1. 通过 `<style></style>` 标签嵌入到 `<head>` 标签内，就是嵌入式

另一种方案：==_就是在 `<body>` 标签中放置 `<style scoped>` 标签，隔离其他区域的样式_==。然而现在连 firefox 55 版本后默认都不支持了，虽然可以开启。

W3C 关于 style 标签放置位置的规范，html5 中 块元素都可以包裹 style 标签。

`scoped`: **style加入此属性后，这些属性只会在当前包裹它的元素及其子元素内生效**，如果没有此属性，则会在全局生效。

如此一来，我们不仅实现了模块的移植便利，还很好的控制了模块的css作用范围，再也不用担心选择器冲突导致的各种样式混乱啦。

## 2. css @import 语法，和 scss less @import 一个思路，模块化思想第一步

首先我们知道 @import 很少用，有些缺点：

1. @import 的文件是额外请求的，所以页面加载的时候会有一小会儿的裸体（FOUC flash of unstyled content, 样式没加载进来），要等这些模块一个一个加载
1. 请求数太多，页面性能不佳，对服务器压力也会相对大一些。
1. 不同的浏览器以及不同的书写形式可能会有不同的加载顺序。

#### link 与 @import 的区别

* link 是 HTML方式， @import 是CSS方式
* link 最大限度支持并行下载，@import 过多嵌套导致串行下载，出现 FOUC
* @import 必须在样式规则之前，可以在css文件中引用其他文件
* 总体来说：link 优于 @import

```css
/*xxx 页面入口样式文件 style.css*/
@import './css/base.css';/*页面基础样式*/
@import './css/index.css';
@import './css/header.css';
@import './css/footer.css';
```

这样模块化避免大家修改一个或者几个大的 css。未来想换个 footer，把原先的 comment 掉，添加新的就好。还方面后续再换回来。删除某个模块也方便。

最好的办法就是把模块打包！这和js模块化一样的，模块化开发，然后**上线之前打包**，线上完美使用。

CSS Combo：CSS模块打包利器

1. 首先安装 `css combo`：`npm install -g css-combo`
1. 进入你所在的入口文件（本例为style.css）目录，输入：`csscombo style.css style.combo.css`

这样就会把 style.css 文件打包成 style.combo.css 文件

> 把所有的模块 import 都放在入口文件的最开始，方便管理。
>
> less, scss 和 css combo 解决的不是一类问题，less 更多的是把 css 编程化，css combo 只专注 css 模块打包。

不管用上面 css @import 还是 sass、less 通过 @import ，只能部分解决的 css 模块化的问题。

由于 css 是全局的，在被引入的文件和当前文件出现重名的情况下，前者样式就会被后者覆盖。在引入一些公用组件，或者多人协作开发同一页面的时候，就需要考虑样式会不会被覆盖，这很麻烦。

```scss
// file A
.name {
    color: red
}

// file B
@import "A.scss";
.name {
    color: green
}
```

css 全局样式的特点，导致 css 难以维护，所以需要一种 css "局部"样式的解决方案。也就是彻底的 css 模块化，@import 进来的 css 模块不能影响覆盖其他模块。

## 3. 实际项目解决方法，模块化思路

所有模块都有一个唯一的 id，模块内的所有样式的选择器前都会加上所在模块的 id，这样就避免了模块间的 css 样式到处跑了。或者通过在每个 class 名后带一个独一无二 hash 值，这样就不有存在全局命名冲突的问题了。这样就相当于伪造了"局部"样式。

```scss
// 原始样式 styles.css
.title {
  color: red;
}

// 原始模板 demo.html
import styles from 'styles.css';

<h1 class={styles.title}>
  Hello World
</h1>


// 编译后的 styles.css
.title_3zyde {
  color: red;
}

// 编译后的 demo.html
<h1 class="title_3zyde">
  Hello World
</h1>
```

### CSS Modules

实现上面的效果需要借助 Webpack, Browserify 等

CSS Modules 允许使用 `:global(.className)` 的语法，声明一个全局规则。凡是这样声明的 class，都不会被编译成哈希字符串。

```css
/* App.css 加入一个全局 class */

.title {
  color: red;
}

:global(.title) {
  color: green;
}
```

限制：

* You have to use camelCase CSS class names.
* You have to use styles object whenever constructing a className.
* Mixing CSS Modules and global CSS classes is cumbersome.
* Reference to an undefined CSS Module resolves to undefined without a warning.

#### webpack 1.x 与 CSS Modules

webpack 自带的 `css-loader` 组件，自带了 CSS Modules，通过简单的配置即可使用。

```json
{
    test: /\.css$/,
    loader: "css?modules&localIdentName=[name]__[local]--[hash:base64:5]"
}
```

命名规范是从 BEM 扩展而来。

* Block: 对应模块名 `[name]`
* Element: 对应节点名 `[local]`
* Modifier: 对应节点状态 `[hash:base64:5]`

使用 __ 和 -- 是为了区块内单词的分割节点区分开来。最终 class 名为 `styles__title--3zyde`。

### 在生产环境中使用

在实际生产中，结合 sass 使用会更加便利。以下是结合 sass 使用的 webpack 的配置文件。

```json
{
    test: /\.scss$/,
    loader: "style!css?modules&importLoaders=1&localIdentName=[name]__[local]--[hash:base64:5]!sass?sourceMap=true&sourceMapContents=true"
}
```

通常除了局部样式，还需要全局样式，比如 base.scss 等基础文件。将公用样式文件和组件样式文件分别放入到两个不同的目标下:

```
.
├── app
│   ├── styles               # 公用样式
│   │     ├── app.scss
│   │     └── base.scss
│   │
│   └── components           # 组件
          ├── Component.jsx  # 组件模板
          └── Component.scss # 组件样式
```

然后通过 webpack 配置，将在 `app/styles` 文件夹的外的(exclude) scss 文件"局部"化。

```json
{
    test: /\.scss$/,
    exclude: path.resolve(__dirname, 'app/styles'),
    loader: "style!css?modules&importLoaders=1&localIdentName=[name]__[local]--[hash:base64:5]!sass?sourceMap=true&sourceMapContents=true"
},
{
    test: /\.scss$/,
    include: path.resolve(__dirname, 'app/styles'),
    loader: "style!css?sass?sourceMap=true&sourceMapContents=true"
}
```

### 多个 class

#### 有时候，一个元素有多个 class 名，可以通过 `join(" ")` 或字符串模版的方式来给元素添加多个 class 名。

```jsx
// join-react.jsx
<h1 className={[styles.title,styles.bold].join(" ")}>
  Hello World
</h1>

// stringTemp-react.jsx
<h1 className={`${styles.title} ${styles.bold}`}>
  Hello World
</h1>
```

如果只写一个 class 就能把样式定义好，那么最好把所有样式写在一个 class 中。如果我们使用了多个 class 定义样式，通常会带一些一些逻辑判断。这个时候写起来就会麻烦不少。

#### 引入 [classnames](https://github.com/JedWatson/classnames)

即可以解决给元素写多个 class 名的问题，也可以解决写逻辑判断的麻烦问题。

```javascript
classNames('foo', 'bar'); // => 'foo bar'
classNames('foo', { bar: true }); // => 'foo bar'
classNames({ 'foo-bar': true }); // => 'foo-bar'
classNames({ 'foo-bar': false }); // => ''
classNames({ foo: true }, { bar: true }); // => 'foo bar'
classNames({ foo: true, bar: true }); // => 'foo bar'

// lots of arguments of various types
classNames('foo', { bar: true, duck: false }, 'baz', { quux: true }); // => 'foo bar baz quux'

// other falsy values are just ignored
classNames(null, false, 'bar', undefined, 0, 1, { baz: null }, ''); // => 'bar 1'
```

引入 CSS Modules 的样式模块，每个 class 每次都要写 `styles.xxx` 也是很麻烦，在《深入React技术栈》提到了 `react-css-modules` 的库，来减少代码的书写，感兴趣的同学可以研究下。

## reference

* <https://github.com/css-modules/css-modules>
* <https://github.com/ruanyf/css-modules-demos>
* <https://github.com/gajus/react-css-modules> (css-modules 限制)
* <https://github.com/gajus/babel-plugin-react-css-modules>