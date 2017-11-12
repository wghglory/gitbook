# 前端主流框架区别

## React

* a library
* Component-based
* MVC's V: small view library
* JSX, transpiled to React.CreateElement, which returns Virtual DOM
* Virtual DOM: lightweight, representation of actual DOM in memory
* one way data flow
* manage state => UI updates automatically by React
* React is smart to update only necessary UI by comparing previous state and new state
* Presentational and Container Components
* many ways to do the same thing, like controlled/unControlled form
* May need Redux, mobx
* need other packages - react router, fetch/axios, enzyme, Jest
* Create react App CLI, which cannot generate components

ecosystem:

* react native
* material UI
* next.js
* mobx
* storybook
* react desktop
* react VR

## Angular4

* big framework, lots to learn
* slower but powerful, 拥有很多工具(http, Data Validation, rxjs, routing)，也有大量复杂的语法
* 2 way data binding
* testing utilities
* MVVM(angularJS): full framework with all the tooling
* Component-based too
* Typescript
* @Component has template or templateUrl, style or styleUrl. Styles work only in current component
* 默认支持 css 模块化
* clear ways to do things
* Angular 4 is faster than Angular 2
* Angular CLI, which can generate components, services

ecosystem:

* Ionic hybrid framework
* nativeScript
* Material Design
* Angular Universal
* @ngrx/store

## Vue.js

* Lightweight
* Like angular1 syntax
* 更加灵活的、（相对于 Angular）并不那么“专制”的解决方案。这允许你按照自己的想法来构建你的应用，而不是强制按照 Angular 规定的方式去做。它只是一个接口层，所以你可以将其作为页面的一个功能来使用，而非一个完整的 SPA。

### React 和 Vue.js 有一些相似的特征

1. 使用了虚拟 DOM
1. 提供了响应式、可组件化的视图组件
1. 关注核心库，像路由和全局状态管理则交由其他库来处理

Vue 双向数据绑定实现比 React 简单

## Scalability

* Angular is easy to scale thanks to its design as well as a powerful CLI.
* React claims to be more testable and therefore scalable than Vue and I think that is partly true.
* Vue being just behind react, it is a good choice however it lacks a list of best scaling practices, resulting in a lot of spaghetti code.

## size

* Vue is the smallest and contains a lot as well. Actually you might think it doesn’t matter, but say that to a cheap android 3g smartphone and I don’t think you will be so sure about it.
* react is bigger than Vue, but still smaller than angular. That’s all I’ve got to say.
* angular is way bigger, causing longer load times and performance issues on mobiles.

---

<https://www.zhihu.com/question/31809713>

**1. 原生 DOM 操作 vs. 通过框架封装操作。**

这是一个性能 vs. 可维护性的取舍。框架的意义在于为你掩盖底层的 DOM 操作，让你用更声明式的方式来描述你的目的，从而让你的代码更容易维护。没有任何框架可以比纯手动的优化 DOM 操作更快，因为框架的 DOM 操作层需要应对任何上层 API 可能产生的操作，它的实现必须是普适的。针对任何一个 benchmark，我都可以写出比任何框架更快的手动优化，但是那有什么意义呢？在构建一个实际应用的时候，你难道为每一个地方都去做手动优化吗？出于可维护性的考虑，这显然不可能。框架给你的保证是，你在不需要手动优化的情况下，我依然可以给你提供过得去的性能。

**2. 对 React 的 Virtual DOM 的误解。**

React 从来没有说过 “React 比原生操作 DOM 快”。React 的基本思维模式是每次有变动就整个重新渲染整个应用。如果没有 Virtual DOM，简单来想就是直接重置 innerHTML。在一个大型列表所有数据都变了的情况下，重置 innerHTML 其实是一个还算合理的操作... 真正的问题是在 “全部重新渲染” 的思维模式下，即使只有一行数据变了，它也需要重置整个 innerHTML，这时候显然就有大量的浪费。

- innerHTML:  render html string **O(template size)** + 重新创建所有 DOM 元素 **O(DOM size)**
- Virtual DOM: render Virtual DOM + diff **O(template size)** + 必要的 DOM 更新 **O(DOM change)**

Virtual DOM render + diff 显然比渲染 html 字符串要慢，但是！它依然是纯 js 层面的计算，比起后面的 DOM 操作来说，依然便宜了太多。可以看到，innerHTML 的总计算量不管是 js 计算还是 DOM 操作都是和整个界面的大小相关，但 Virtual DOM 的计算量里面，只有 js 计算和界面大小相关，DOM 操作是和数据的变动量相关的。为什么要有 Virtual DOM：它保证了 1）不管你的数据变化多少，每次重绘的性能都可以接受；2) 你依然可以用类似 innerHTML 的思路去写你的应用。

**3. MVVM vs. Virtual DOM**

相比起 React，其他 MVVM 系框架比如 AngularJS, Knockout 以及 Vue、Avalon 采用的都是数据绑定：通过 Directive/Binding 对象，观察数据变化并保留对实际 DOM 元素的引用，当有数据变化时进行对应的操作。**MVVM 的变化检查是数据层面的，而 React 的检查是 DOM 结构层面的。MVVM 的性能也根据变动检测的实现原理有所不同：Angularjs 的脏检查使得任何变动都有固定的 O(watcher count) 的代价；Knockout/Vue/Avalon 都采用了依赖收集，在 js 和 DOM 层面都是 O(change)：**

- 脏检查：scope digest **O(watcher count)** + 必要 DOM 更新 **O(DOM change)**
- 依赖收集：重新收集依赖 **O(data change)** + 必要 DOM 更新 **O(DOM change)**

**AngularJS 最不效率的地方在于任何小变动都有的和 watcher 数量相关的性能代价。但是！当所有数据都变了的时候，Angularjs 其实并不吃亏。依赖收集在初始化和数据变化的时候都需要重新收集依赖，这个代价在小量更新的时候几乎可以忽略，但在数据量庞大的时候也会产生一定的消耗**。

MVVM 渲染列表的时候，由于每一行都有自己的数据作用域，所以通常都是每一行有一个对应的 ViewModel 实例，或者是一个稍微轻量一些的利用原型继承的 "scope" 对象，但也有一定的代价。所以，MVVM 列表渲染的初始化几乎一定比 React 慢，因为创建 ViewModel / scope 实例比起 Virtual DOM 来说要昂贵很多。这里所有 MVVM 实现的一个共同问题就是在列表渲染的数据源变动时，尤其是当数据是全新的对象时，如何有效地复用已经创建的 ViewModel 实例和 DOM 元素。假如没有任何复用方面的优化，由于数据是 “全新” 的，MVVM 实际上需要销毁之前的所有实例，重新创建所有实例，最后再进行一次渲染！这就是为什么题目里链接的 AngularJS/knockout 实现都相对比较慢。相比之下，React 的变动检查由于是 DOM 结构层面的，即使是全新的数据，只要最后渲染结果没变，那么就不需要做无用功。

AngularJS 和 Vue 都提供了列表重绘的优化机制，也就是 “提示” 框架如何有效地复用实例和 DOM 元素。比如数据库里的同一个对象，在两次前端 API 调用里面会成为不同的对象，但是它们依然有一样的 uid。这时候你就可以提示 track by uid 来让 AngularJS 知道，这两个对象其实是同一份数据。那么原来这份数据对应的实例和 DOM 元素都可以复用，只需要更新变动了的部分。或者，你也可以直接 track by $index 来进行 “原地复用”：直接根据在数组里的位置进行复用。在题目给出的例子里，如果 AngularJS 实现加上 track by $index 的话，后续重绘是不会比 React 慢多少的。甚至在 dbmonster 测试中，AngularJS 和 Vue 用了 track by $index 以后都比 React 快: [dbmon**](https://link.zhihu.com/?target=http%3A//vuejs.github.io/js-repaint-perfs/) (注意 AngularJS 默认版本无优化，优化过的在下面）

顺道说一句，React 渲染列表的时候也需要提供 key 这个特殊 prop，本质上和 track-by 是一回事。

**4. 性能比较也要看场合**

在比较性能的时候，要分清楚初始渲染、小量数据更新、大量数据更新这些不同的场合。Virtual DOM、脏检查 MVVM、数据收集 MVVM 在不同场合各有不同的表现和不同的优化需求。Virtual DOM 为了提升小量数据更新时的性能，也需要针对性的优化，比如 shouldComponentUpdate 或是 immutable data。

- 初始渲染：Virtual DOM > 脏检查 >= 依赖收集
- 小量数据更新：依赖收集 >> Virtual DOM + 优化 > 脏检查（无法优化） > Virtual DOM 无优化
- 大量数据更新：脏检查 + 优化 >= 依赖收集 + 优化 > Virtual DOM（无法/无需优化）>> MVVM 无优化

不要天真地以为 Virtual DOM 就是快，diff 不是免费的，batching 么 MVVM 也能做，而且最终 patch 的时候还不是要用原生 API。在我看来 Virtual DOM 真正的价值从来都不是性能，而是它 1) 为函数式的 UI 编程方式打开了大门；2) 可以渲染到 DOM 以外的 backend，比如 ReactNative。