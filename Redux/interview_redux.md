# Redux 从设计到源码

## Redux 是什么？

Redux 是 JavaScript 状态容器，能提供可预测化的状态管理。

它认为：

- Web 应用是一个状态机，视图与状态是一一对应的。
- 所有的状态，保存在一个对象里面。

我们先来看看“状态容器”、“视图与状态一一对应”以及“一个对象”这三个概念的具体体现。

![dw topic](https://tech.meituan.com/img/redux-design-code/%E7%8A%B6%E6%80%81%E5%AE%B9%E5%99%A8.png)

如上图，Store 是 Redux 中的状态容器，它里面存储着所有的状态数据，每个状态都跟一个视图一一对应。

Redux 也规定，一个 State 对应一个 View。只要 State 相同，View 就相同，知道了 State，就知道 View 是什么样，反之亦然。

比如，当前页面分三种状态：loading（加载中）、success（加载成功）或者 error（加载失败），那么这三个就分别唯一对应着一种视图。

现在我们对“状态容器”以及“视图与状态一一对应”有所了解了，那么 Redux 是怎么实现可预测化的呢？我们再来看下 Redux 的工作流程。

![dw topic](https://tech.meituan.com/img/redux-design-code/Redux%E5%B7%A5%E4%BD%9C%E6%B5%81%E7%A8%8B.png)

首先，我们看下几个核心概念：

- Store：保存数据的地方，你可以把它看成一个容器，整个应用只能有一个 Store。
- State：Store 对象包含所有数据，如果想得到某个时点的数据，就要对 Store 生成快照，这种时点的数据集合，就叫做 State。
- Action：State 的变化，会导致 View 的变化。但是，用户接触不到 State，只能接触到 View。所以，State 的变化必须是 View 导致的。Action 就是 View 发出的通知，表示 State 应该要发生变化了。
- Action Creator：View 要发送多少种消息，就会有多少种 Action。如果都手写，会很麻烦，所以我们定义一个函数来生成 Action，这个函数就叫 Action Creator。
- Reducer：Store 收到 Action 以后，必须给出一个新的 State，这样 View 才会发生变化。这种 State 的计算过程就叫做 Reducer。Reducer 是一个函数，它接受 Action 和当前 State 作为参数，返回一个新的 State。
- dispatch：是 View 发出 Action 的唯一方法。

然后我们过下整个工作流程：

1.  首先，用户（通过 View）发出 Action，发出方式就用到了 dispatch 方法。
2.  然后，Store 自动调用 Reducer，并且传入两个参数：当前 State 和收到的 Action，Reducer 会返回新的 State
3.  State 一旦有变化，Store 就会调用监听函数，来更新 View。

到这儿为止，一次用户交互流程结束。可以看到，在整个流程中数据都是单向流动的，这种方式保证了流程的清晰。

## 为什么要用 Redux？

前端复杂性的根本原因是大量无规律的交互和异步操作。

变化和异步操作的相同作用都是改变了当前 View 的状态，但是它们的无规律性导致了前端的复杂，而且随着代码量越来越大，我们要维护的状态也越来越多。

我们很容易就对这些状态何时发生、为什么发生以及怎么发生的失去控制。那么怎样才能让这些状态变化能被我们预先掌握，可以复制追踪呢？

这就是 Redux 设计的动机所在。

Redux 试图让每个 State 变化都是可预测的，将应用中所有的动作与状态都统一管理，让一切有据可循。

![dw topic](https://tech.meituan.com/img/redux-design-code/redux%E4%B9%8B%E5%89%8D.png)

如上图所示，如果我们的页面比较复杂，又没有用任何数据层框架的话，就是图片上这个样子：交互上存在父子、子父、兄弟组件间通信，数据也存在跨层、反向的数据流。

这样的话，我们维护起来就会特别困难，那么我们理想的应用状态是什么样呢？看下图：

![dw topic](https://tech.meituan.com/img/redux-design-code/redux%E4%B9%8B%E5%90%8E.png)

架构层面上讲，我们希望 UI 跟数据和逻辑分离，UI 只负责渲染，业务和逻辑交由其它部分处理，从数据流向方面来说, 单向数据流确保了整个流程清晰。

我们之前的操作可以复制、追踪出来，这也是 Redux 的主要设计思想。

综上，Redux 可以做到：

- 每个 State 变化可预测。
- 动作与状态统一管理。

## Redux 思想追溯

Redux 作者在 Redux.js 官方文档 Motivation 一章的最后一段明确提到：

> Following in the steps of Flux, CQRS, and Event Sourcing , Redux attempts to make state mutations predictable by imposing certain restrictions on how and when updates can happen.

我们就先了解下 Flux、CQRS、ES（Event Sourcing 事件溯源）这几个概念。

### 什么是 ES？

- 不是保存对象的最新状态，而是保存对象产生的事件。
- 通过事件追溯得到对象最新状态。

举个例子：我们平常记账有两种方式，直接记录每次账单的结果或者记录每次的收入/支出，那么我们自己计算的话也可以得到结果，ES 就是后者。

![dw topic](https://tech.meituan.com/img/redux-design-code/ES.png)

与传统增删改查关系式存储的区别：

- 传统的增删是以结果为导向的数据存储，ES 是以过程为导向存储。
- CRUD 是直接对库进行操作。
- ES 是在库里存了一系列事件的集合，不直接对库里记录进行更改。

优点：

- 高性能：事件是不可更改的，存储的时候并且只做插入操作，也可以设计成独立、简单的对象。所以存储事件的成本较低且效率较高，扩展起来也非常方便。
- 简化存储：事件用于描述系统内发生的事情，我们可以考虑用事件存储代替复杂的关系存储。
- 溯源：正因为事件是不可更改的，并且记录了所有系统内发生的事情，我们能用它来跟踪问题、重现错误，甚至做备份和还原。

缺点：

- 事件丢失：因为 ES 存储都是基于事件的，所以一旦事件丢失就很难保证数据的完整性。
- 修改时必须兼容老结构：指的是因为老的事件不可变，所以当业务变动的时候新的事件必须兼容老结构。

### CQRS（Command Query Responsibility Segregation）是什么？

顾名思义，“命令与查询职责分离”-->”读写分离”。

![dw topic](https://tech.meituan.com/img/redux-design-code/CQRS.png)

整体的思想是把 Query 操作和 Command 操作分成两块独立的库来维护，当事件库有更新时，再来同步读取数据库。

看下 Query 端，只是对数据库的简单读操作。然后 Command 端，是对事件进行简单的存储，同时通知 Query 端进行数据更新，这个地方就用到了 ES。

优点：

- CQ 两端分离，各自独立。
- 技术代码和业务代码完全分离。

缺点：

- 强依赖高性能可靠的分布式消息队列。

### Flux 是什么？

Flux 是一种架构思想，下面过程中，数据总是“单向流动”，任何相邻的部分都不会发生数据的“双向流动”，这保证了流程的清晰。Flux 的最大特点，就是数据的“单向流动”。

![dw topic](https://tech.meituan.com/img/redux-design-code/Flux.png)

1.  用户访问 View。
2.  View 发出用户的 Action。
3.  Dispatcher 收到 Action，要求 Store 进行相应的更新。
4.  Store 更新后，发出一个“change”事件。

介绍完以上之后，我们来整体做一下对比。

#### CQRS 与 Flux

相同：当数据在 write side 发生更改时，一个更新事件会被推送到 read side，通过绑定事件的回调，read side 得知数据已更新，可以选择是否重新读取数据。

差异：在 CQRS 中，write side 和 read side 分属于两个不同的领域模式，各自的逻辑封装和隔离在各自的 Model 中，而在 Flux 里，业务逻辑都统一封装在 Store 中。

#### Redux 与 Flux

Redux 是 Flux 思想的一种实现，同时又在其基础上做了改进。Redux 还是秉承了 Flux 单向数据流、Store 是唯一的数据源的思想。

![dw topic](https://tech.meituan.com/img/redux-design-code/Redux%E4%B8%8EFlux.png)

最大的区别：

1.  Redux 只有一个 Store。

Flux 中允许有多个 Store，但是 Redux 中只允许有一个，相较于 Flux，一个 Store 更加清晰，容易管理。Flux 里面会有多个 Store 存储应用数据，并在 Store 里面执行更新逻辑，当 Store 变化的时候再通知 controller-view 更新自己的数据；Redux 将各个 Store 整合成一个完整的 Store，并且可以根据这个 Store 推导出应用完整的 State。

同时 Redux 中更新的逻辑也不在 Store 中执行而是放在 Reducer 中。单一 Store 带来的好处是，所有数据结果集中化，操作时的便利，只要把它传给最外层组件，那么内层组件就不需要维持 State，全部经父级由 props 往下传即可。子组件变得异常简单。

1.  Redux 中没有 Dispatcher 的概念。

Redux 去除了这个 Dispatcher，使用 Store 的 Store.dispatch()方法来把 action 传给 Store，由于所有的 action 处理都会经过这个 Store.dispatch()方法，Redux 聪明地利用这一点，实现了与 Koa、RubyRack 类似的 Middleware 机制。Middleware 可以让你在 dispatch action 后，到达 Store 前这一段拦截并插入代码，可以任意操作 action 和 Store。很容易实现灵活的日志打印、错误收集、API 请求、路由等操作。

除了以上，Redux 相对 Flux 而言还有以下特性和优点：

1.  文档清晰，编码统一。
2.  逆天的 DevTools，可以让应用像录像机一样反复录制和重放。

目前，美团外卖后端管理平台的上单各个模块已经逐步替换为 React+Redux 开发模式，流程的清晰为错误追溯和代码维护提供了便利，现实工作中也大大提高了人效。

# 源码分析

查看源码的话先从 GitHub 把这个地址上拷下来，切换到 src 目录，如下图：

![dw topic](https://tech.meituan.com/img/redux-design-code/reduxSource.png)

看下整体结构：

其中 utils 下面的 Warning.js 主要负责控制台错误日志的输出，我们直接忽略 index.js 是入口文件，createStore.js 是主流程文件，其余 4 个文件都是辅助性的 API。

我们先结合下流程分析下对应的源码。

![dw topic](https://tech.meituan.com/img/redux-design-code/reduxUse.png)

首先，我们从 Redux 中引入 createStore 方法，然后调用 createStore 方法，并将 Reducer 作为参数传入，用来生成 Store。为了接收到对应的 State 更新，我们先执行 Store 的 subscribe 方法，将 render 作为监听函数传入。然后我们就可以 dispatchaction 了，对应更新 view 的 State。

那么我们按照顺序看下对应的源码：

## 入口文件 index.js

![dw topic](https://tech.meituan.com/img/redux-design-code/index.png)

入口文件，上面一堆检测代码忽略，看红框标出部分，它的主要作用相当于提供了一些方法，这些方法也是 Redux 支持的所有方法。

然后我们看下主流程文件：createStore.js。

## 主流程文件：createStore.js

![dw topic](https://tech.meituan.com/img/redux-design-code/createStore.png)

createStore 主要用于 Store 的生成，我们先整理看下 createStore 具体做了哪些事儿。

首先，一大堆类型判断先忽略，可以看到声明了一系列函数，然后执行了 dispatch 方法，最后暴露了 dispatch、subscribe……几个方法。这里 dispatch 了一个 init Action 是为了生成初始的 State 树。

我们先挑两个简单的函数看下，getState 和 replaceReducer，其中 getState 只是返回了当前的状态。replaceReducer 是替换了当前的 Reducer 并重新初始化了 State 树。这两个方法比较简单，下面我们在看下其它方法。

![dw topic](https://tech.meituan.com/img/redux-design-code/otherMethod.png)

订阅函数的主要作用是注册监听事件，然后返回取消订阅的函数，它把所有的订阅函数统一放一个数组里，只维护这个数组。

为了实现实时性，所以这里用了两个数组来分别处理 dispatch 事件和接收 subscribe 事件。

store.subscribe()方法总结：

- 入参函数放入监听队列
- 返回取消订阅函数

再来看下 store.dispatch()-->分发 action，修改 State 的唯一方式。

![dw topic](https://tech.meituan.com/img/redux-design-code/dispatch.png)

store.dispatch()方法总结：

- 调用 Reducer，传参（currentState，action）。
- 按顺序执行 listener。
- 返回 action。

到这儿的话，主流程我们就讲完了，下面我们讲下几个辅助的源码文件。

## bindActionCreators.js

bindActionCreators 把 action creators 转成拥有同名 keys 的对象，使用 dispatch 把每个 action creator 包装起来，这样可以直接调用它们。

![dw topic](https://tech.meituan.com/img/redux-design-code/bindActionCreators.png)

实际情况用到的并不多，惟一的应用场景是当你需要把 action creator 往下传到一个组件上，却不想让这个组件觉察到 Redux 的存在，而且不希望把 Redux Store 或 dispatch 传给它。

## combineReducers.js-->用于合并 Reducer

![dw topic](https://tech.meituan.com/img/redux-design-code/combineReducers.png)

这个方法的主要功能是用来合并 Reducer，因为当我们应用比较大的时候 Reducer 按照模块拆分看上去会比较清晰，但是传入 Store 的 Reducer 必须是一个函数，所以用这个方法来作合并。代码不复杂，就不细讲了。它的用法和最后的效果可以看下上面左侧图。

## compose.js-->用于组合传入的函数

![dw topic](https://tech.meituan.com/img/redux-design-code/compose.png)

compose 这个方法，主要用来组合传入的一系列函数，在中间件时会用到。可以看到，执行的最终结果是把各个函数串联起来。

## applyMiddleware.js-->用于 Store 增强

中间件是 Redux 源码中比较绕的一部分，我们结合用法重点看下。

首先看下用法：

```
const store = createStore(reducer,applyMiddleware(…middlewares))
or
const store = createStore(reducer,{},applyMiddleware(…middlewares))
```

可以看到，是将中间件作为 createStore 的第二个或者第三个参数传入，然后我们看下传入之后实际发生了什么。

![dw topic](https://tech.meituan.com/img/redux-design-code/applyMiddleware.png)

从代码的最后一行可以看到，最后的执行代码相当于 applyMiddleware(…middlewares)(createStore)(reducer,preloadedState)然后我们去 applyMiddleware 里看它的执行过程。

![dw topic](https://tech.meituan.com/img/redux-design-code/ing.png)

可以看到执行方法有三层，那么对应我们源码看的话最终会执行最后一层。最后一层的执行结果是返回了一个正常的 Store 和一个被变更过的 dispatch 方法，实现了对 Store 的增强。

这里假设我们传入的数组 chain 是［f,g,h］，那么我们的 dispatch 相当于把原有 dispatch 方法进行 f,g,h 层层过滤，变成了新的 dispatch。

由此的话我们可以推出中间件的写法：因为中间件是要多个首尾相连的，需要一层层的“加工”，所以要有个 next 方法来独立一层确保串联执行，另外 dispatch 增强后也是个 dispatch 方法，也要接收 action 参数，所以最后一层肯定是 action。

再者，中间件内部需要用到 Store 的方法，所以 Store 我们放到顶层，最后的结果就是：

![dw topic](https://tech.meituan.com/img/redux-design-code/middleware.png)

看下一个比较常用的中间件 redux－thunk 源码，关键代码只有不到 10 行。

![dw topic](https://tech.meituan.com/img/redux-design-code/thunk.png)

作用的话可以看到，这里有个判断：如果当前 action 是个函数的话，return 一个 action 执行，参数有 dispatch 和 getState，否则返回给下个中间件。

这种写法就拓展了中间件的用法，让 action 可以支持函数传递。

我们来总结下这里面的几个疑点。

#### Q1：为什么要嵌套函数？为何不在一层函数中传递三个参数，而要在一层函数中传递一个参数，一共传递三层？

因为中间件是要多个首尾相连的，对 next 进行一层层的“加工”，所以 next 必须独立一层。那么 Store 和 action 呢？Store 的话，我们要在中间件顶层放上 Store，因为我们要用 Store 的 dispatch 和 getState 两个方法。action 的话，是因为我们封装了这么多层，其实就是为了作出更高级的 dispatch 方法，是 dispatch，就得接受 action 这个参数。

#### Q2：middlewareAPI 中的 dispatch 为什么要用匿名函数包裹呢？

我们用 applyMiddleware 是为了改造 dispatch 的，所以 applyMiddleware 执行完后，dispatch 是变化了的，而 middlewareAPI 是 applyMiddleware 执行中分发到各个 middleware，所以必须用匿名函数包裹 dispatch，这样只要 dispatch 更新了，middlewareAPI 中的 dispatch 应用也会发生变化。

#### Q3: 在 middleware 里调用 dispatch 跟调用 next 一样吗？

因为我们的 dispatch 是用匿名函数包裹，所以在中间件里执行 dispatch 跟其它地方没有任何差别，而执行 next 相当于调用下个中间件。

到这儿为止，源码部分就介绍完了，下面总结下开发中的最佳实践。

# 最佳实践

[官网](http://cn.redux.js.org/index.html)中对最佳实践总结的很到位，我们重点总结下以下几个:

- 用对象展开符增加代码可读性。
- 区分 smart component（know the State）和 dump component（完全不需要关心 State）。
- component 里不要出现任何 async calls，交给 action creator 来做。
- Reducer 尽量简单，复杂的交给 action creator。
- Reducer 里 return state 的时候，不要改动之前 State，请返回新的。
- immutable.js 配合效果很好（但同时也会带来强侵入性，可以结合实际项目考虑）。
- action creator 里，用 promise/async/await 以及 Redux-thunk（redux-saga）来帮助你完成想要的功能。
- action creators 和 Reducer 请用 pure 函数。
- 请慎重选择组件树的哪一层使用 connected component(连接到 Store)，通常是比较高层的组件用来和 Store 沟通，最低层组件使用这防止太长的 prop chain。
- 请慎用自定义的 Redux-middleware，错误的配置可能会影响到其他 middleware.
- 有些时候有些项目你并不需要 Redux（毕竟引入 Redux 会增加一些额外的工作量）
