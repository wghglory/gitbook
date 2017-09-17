# 前端主流框架区别

## React

* Component-based
* MVC's V: small view library
* Virtual DOM: lightweight, representation of actual DOM in memory
* one way data flow
* manage state => UI updates automatically by React
* React is smart to update only necessary UI by comparing previous state and new state
* Presentational and Container Components

## Angular4

* MVVM: full framework with all the tooling
* Component-based too
* Typescript
* @Component has template or templateUrl, style or styleUrl. Styles work only in current component
* Data Validation
* Angular 拥有很多工具，也有大量复杂的语法

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