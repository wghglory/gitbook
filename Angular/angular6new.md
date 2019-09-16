# Angular 6 new features

## 主要的新特性

按照官方的说法，Angular 6 体积将会更小、更加易于使用，同时运行速度也更快。当然，最重要的是，官方承诺平滑升级，没有破坏性变更。

主要新特性包括：

- Angular elements
- CDK
- Ivy renderer
- Bazel & Closure compiler
- ng update & ng add
- RXJS 6, Webpack 4, TypeScript 2.7 support

## Angular elements

Angular Elements 可以用来把组件打包成 Web Component，甚至可以用在非 Angular 项目里面。

## CDK

利用@angular/cdk，你可以基于 @angular/material 来构建自己的 UI 组件库。同时删除了对@angular/flex-layout 的依赖，因为 CDK 将会支持响应式设计。

## Ivy renderer

默认不会启用 Ivy 渲染引擎，如果你想用，需要手动修改编译参数。启用 Ivy 渲染引擎会带来很多好处：渲染速度更快、打包的体积更小，同时更加灵活。

（注：实际上这已经是第二次换渲染引擎了，第一次换到 Render2，这次换成了 Ivy，希望 Ivy 能带来让人眼前一亮的效果。）

## Bazel and Closure compiler

“作为一款高质量的工具， ABC (Angular + Bazel + Closure) 工程里面倾注了我们大量的努力，你可以利用它来构建高质量的 Angular 应用。 ”

Bazel 是 Google 内部一直使用的强大构建工具，根据 Brad Green 在上次演讲（[www.ngfans.net/topic/105/p…](https://link.juejin.im/?target=http%3A%2F%2Fwww.ngfans.net%2Ftopic%2F105%2Fpost) ）中提到的内容，Angular 项目组采用 Bazel 的原因是，为了让构建工具保持统一，同时也让外部公司能享受到 Google 内部构建工具带来的好处。

对于 Angular 来说，最看中的是 Bazel 的增量编译特性和编译速度，按照官方的说法，Bazel 的目标是：重新编译项目到浏览器能运行，只要 2 秒的时间。

Closure 也是 Google 内部一直使用的一款工具，它可以对 JS 代码进行压缩和优化，生成的包体积更小（比如典型的**死码消除**特性）、对 JS 引擎更加友好。

- 更详尽的演进路线点这里（英文，墙？）：[g.co/ng/abc](https://link.juejin.im/?target=http%3A%2F%2Fg.co%2Fng%2Fabc)
- Bazel 的官方网站点这里（英文，墙？）：[bazel.build/](https://link.juejin.im/?target=https%3A%2F%2Fbazel.build%2F)
- Closure 的详细介绍点这里（英文，墙？）：[developers.google.com/closure/com…](https://link.juejin.im/?target=https%3A%2F%2Fdevelopers.google.com%2Fclosure%2Fcompiler%2F)

## ng update & ng add

从 Angular CLI 1.7 开始你可以运行：

```bash
ng update
```

这样就可以自动更新 package.json 里面定义的依赖包，RxJS 和 TypeScript 版本也会自动更新。

另一个命令是：

```bash
ng add
```

这个命令用来帮助开发者给自己的应用增加新特性。例如，你可以把一款普通应用变成 Progressive Web Apps (PWA) ，你还可以一开始就指定应用的类型，而不是创建空白的项目。

## RXJS 6, Webpack 4 & TypeScript 2.7 support

升级到 RXJS 6 可以缩小打包的体积。

Angular 目前使用的 webpack 版本是 3.x，很快 webpack 4.x 就要来了，Angular CLI 已经做好了升级的准备。同样，升级到 webpack 新版本之后，可以利用 scope hosting 特性让编译之后的体积变得更小。

最后一点就是，Angular 6 将会升级 TypeScript 到 2.7 。

## Reference

- <http://baijiahao.baidu.com/s?id=1601056475936463734&wfr=spider&for=pc>
- <https://blog.csdn.net/lc_style/article/details/80292991> (Very good)
