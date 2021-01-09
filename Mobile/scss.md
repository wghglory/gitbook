# 移动端基础样式

\_mixin.scss:

```scss
//基础font-size
$font: 16;
//设计稿宽度
$screen: 750;
@function px2rem($n) {
  @return #{$n/($screen * $font/375)}rem;
}

@function calcPX($m, $n) {
  @return calc(#{$m} - #{$n/($screen * $font/375)}rem);
}

$backgroundGray: rgb(250, 250, 250);
$mainGreen: #00c993;
$borderGray: #eee;
$lightGray: #a4a7c0;
```

reset.scss: (pc, mobile both work)

```scss
@import 'mixin';

body,
p,
h1,
h2,
h3,
h4,
h5,
h6,
dl,
dd {
  margin: 0;
  padding: 0;
  font-size: px2rem(16);
}
ol,
ul {
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: px2rem(16);
}
a {
  text-decoration: none;
  font-size: px2rem(16);
  font-family: 'PingFang SC', sans-serif;
}
img {
  border: none;
  vertical-align: top;
} /*图片下没缝隙用vertical-align*/
th,
td {
  padding: 0;
}
table {
  border-collapse: collapse;
}
form {
  margin: 0;
}
input,
button {
  font-size: px2rem(16);
  margin: 0;
  padding: 0;
  vertical-align: top;
  outline: none;
  border: 0;
  font-weight: 200;
  -webkit-appearance: none;
}

@mixin placeholderMixin {
  color: $lightGray;
  font-size: px2rem(16);
  font-weight: 200;
  letter-spacing: 4px;
}
::-webkit-input-placeholder {
  /* WebKit browsers */
  @include placeholderMixin;
}
:-moz-placeholder {
  /* Mozilla Firefox 4 to 18 */
  @include placeholderMixin;
}
::-moz-placeholder {
  /* Mozilla Firefox 19+ */
  @include placeholderMixin;
}
:-ms-input-placeholder {
  /* Internet Explorer 10+ */
  @include placeholderMixin;
}
select {
  margin: 0;
}

textarea {
  margin: 0;
  padding: 0;
  resize: none;
  overflow: auto;
  outline: none;
  -webkit-appearance: none;
}

.clear {
  zoom: 1;
}
.clear:after {
  content: '';
  display: block;
  clear: both;
}
```

common.scss:

```scss
html,
body {
  height: 100%;
  font-family: 'PingFang SC', sans-serif;
}

.gray {
  background: rgb(250, 250, 250);
}

a:hover,
a:visited,
a:link,
a:active {
  color: #ffffff;
}

.flexbox {
  display: flex;
  justify-content: center;
  align-items: center;
}

.flexbox-vertical {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.container {
  height: 100%;
}

.show {
  display: block;
}

.hide {
  display: none;
}
```

---

在某个页面使用 mixin 定义的函数

```scss
@import 'mixin';

main {
  padding: 0 px2rem(15);
  padding-top: px2rem(45);
  height: calcPX(100%, 60);
  overflow-y: auto;
}
```

---

## Use gulp to build scss

```javascripton
"scripts": {
  "scss": "gulp watch"
},
"devDependencies": {
  "gulp": "^3.9.1",
  "gulp-autoprefixer": "^3.1.1",
  "gulp-sass": "^3.1.0",
  "gulp-uglify": "^2.1.2",
  "gulp-util": "^3.0.8",
}
```

gulpfile.js:

```javascript
var gulp = require('gulp');
// sass 插件var
var sass = require('gulp-sass');
// 给css3属性添加浏览器前缀插件
var autoprefixer = require('gulp-autoprefixer');

// 编译sass文件，添加css3属性浏览器前缀
gulp.task('sass', function() {
  return gulp
    .src('./scss/*.scss')
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(gulp.dest('./css'));
});

// 监控任务
gulp.task('watch', ['sass'], function() {
  gulp.watch('./scss/*.scss', ['sass']);
});
```
