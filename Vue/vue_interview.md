# Vue interview

Reference: <https://www.jianshu.com/u/56b92d335d13>

### 关于 Vue 生命周期，下列选项不正确的是()[单选题]

- a. vue 实例从创建到销毁的过程，就是生命周期。
- b. 页面首次加载会触发 beforeCreate,created,beforeMount,mounted,beforeUpdate,updated
- c. created 标识完成数据观测，属性和方法的运算，初始化时间，\$el 属性还没有显示出来
- d. dom 渲染在 mounted 中就完成了

_答案解析：_

- b. 首次加载触发，beforeCreate,created,beforeMount,mounted beforeUpdate,updated 只有数据更新时候才会触发

### 对于 vue 中数据响应式原理说法，不正确的是()[多选题]

- a. 采用数据劫持方式，即 Object.defineProperty()劫持 data 中各个属性来实现数据响应式
- b. 视图中变化通过 watcher 更新 data 中的数据
- c. 若 data 中某个属性多次变化，watcher 仅会进入更新队列 1 次
- d. 通过变异过程进行依赖收集

_答案解析：_

- b. watcher 更新 UI 界面，不是更新数据
- d. 编译唯一目的是生成 render 函数，依赖收集只在各个组件初始化中过程收集依赖

### Vue 中组件参数传递，不正确的是()[单选]

- a. 子组件给父组件传值，使用 emit 方法
- b. 子组件使用 emit('someevent')派发事件,父组件使用@someevent 监听
- c. 祖孙组件之间可以使用 provide 和 inject 方式跨层级相互传值
- d. 度组件给子组件传值，子组件通过 props 接收数据

_答案解析：_

- c. 祖孙传值使用 provide 和 inject 方式是对的，但是错误在于这种方法都是单向的，无法互相传值（文字游戏）

### 关于 v-model 说法不正确的是()[单选]

- a. v-model 能够实现双向绑定
- b. v-model 本质上是语法糖，负责监听用户输入时间以及更新数据
- c. v-model 是内置指令，不能使用在自定义组件上
- d. 对 input 使用 v-model 实际上是指定其：value 和 input

_答案解析：_

- c. v-model 是可以使用在自定义组件上的， 子组件在 props 中通过 value 接收数据，通过\$emit('input')去派发事件

### 下列说法不正确的是哪项()[单选题]

- a. key 的作用是为了高效的更新虚拟 DOM
- b. 若指定了组件的 template 选项，render 函数不会执行
- c. 使用`vm.$nextTick`可以确获得 DOM 异步更新的结果
- d. 若没有 el 选项，`vm.$mount(dom)`可以将 Vue 实例挂载于指定元素上

_答案解析：_

- b. el 与 template 存在竞争关系，render 函数一定会执行，有 render 函数 template 会被忽略

Vue 推荐在绝大多数情况下使用 template 来创建你的 HTML 特殊情况下使用 render 函数(使用 JavaScript 的编程能力和创建 HTML)，它比 template 更接近编译器。

看原理 (Vue 原理)[https://www.jianshu.com/p/c1b835e9ed86]

### 下列说法不正确的是哪项()[单选题]

- a. 使用`this.$parent`查找当前组件的父组件
- b. 使用`this.$children`按照顺序查找当前组件的直接子组件
- c. 使用`this.$root`查找根组件，并可以配合`$children`遍历全部组件
- d. 使用`this.$refs`查找命名子组件

_答案解析：_

- b. 查找的子组件不知道具体顺序

### 下列关于 vuex 描述，不正确的是哪项()[单选题]

- a. Vuex 是一个状态管理模式
- b. Vuex 主要用于多视图之间状态全局共享与管理
- c. 在 Vuex 中改变状态可以通过 mutaions 和 actions
- d. Vuex 通过 Vue 实现状态响应式，因此只能使用于 Vue

_答案解析：_ c 改变状态的是 mutations，actions 内部也是通过 context.commit 的 mutations 的方法

### 下列关于 vue-router 的描述，不正确的是()[单选题]

- a. vue-router 常用模式 hash 和 history
- b. 可以通过 addRoutes 方法动态添加路由
- c. 可以通过 beforeEnter 对单个组件进行路由守卫
- d. vue-router 借助 Vue 实现路由信息响应式，因此只能用于 Vue

_答案解析：_ c beforeEnter 是对单个路由的守卫，不是单个组件

### 关于 vue 服务器渲染，下列说法不正确的()[单选题]

- a. 通过服务器渲染，可以优化 SEO 抓取，提升首页加载速度
- b. 某些生命周期钩子函数 如(beforeCreate,created) 可以运行在服务端和客户端
- c. 服务器渲染的 vue.js 是同构开发，因为 vue 扩展库可以在服务端应用正常运行
- d. 组件渲染为服务端的 HTML 字符串，将他们直接发送到浏览器，最后在客户端上"激活"为可交互的应用

_答案解析：_ c 服务端是否可以使用 vue 扩展库没有明确的说明

### 关于 typescript 在 vue 中的应用，说法不正确的是()[单选题]

- a. 使用 typeScript 可以获得静态类型检查以及最新的 ECMAscript 特性
- b. typeScript 是 Javascript 类型的超集，它可以编译成纯 Javascript。意味着你完成可以使用 JS 语法编写 TS 代码
- c. 使用 Vue.extend({})方式声明组件不能获得 TypeScript 类型推断能力
- d. 基于类的 Vue 组件中如果要声明初始数据可以直接声明为实例的属性，如 `message:string='Hello'`

_答案解析：_

- c. Vue.extend({})可以声明组件

### 下列关于 vue 说法不正确的是()[单选题]

- a. vue 简单易上手，性能高效，还便于与第三方库或既有项目整合
- b. vue 构建的项目复杂度增加较快，仅适合中小型项目
- c. vue 基于组件构建应用，代码组织简洁，易理解，易维护
- d. vue 借助虚拟 DOM 实现跨平台，服务端渲染，以及性能良好的 DOM 更新策略

_答案解析：_ b Vue0 后优化了 watcher，以组件为单位添加 watcher，(数量降低了) 异步更新数据，（数据变化并非实时更新，每种数据仅仅进入更新队列 1 次）https://www.jianshu.com/p/463c7f7669df 最大程度精确了虚拟 DOM 树数据更新位置，(通过 diff 与 patch 实现 新旧虚拟 DOM 树比对，只对变化位置数据更新) 提高了渲染的性能所以可以使用在大型项目上了

### 下列关于 vue 原理哪些是正确的()[多选]

- a. Vue 中数据变更通知，通过拦截数组操作方法实现
- b. 编译器目标是创建渲染函数，渲染函数执行得到 VNODE 树
- c. 组件内 data 发生变化会通知其对应的 Watcher 执行异步更新
- d. patching 算法首先是进行同层级比较，可以执行的操作是节点的增加，删除和更新

_答案解析：_ abcd - a. 数组的 7 种拦截数据的方法

- push() 从数组末尾添加值。
- pop() 删除并返回数组的最后一个元素。
- shift() 把数组的第一个元素从其中删除，并返回第一个元素的值。
- unshift() 向数组的开头添加一个或更多元素，并返回新的长度。
- splice() 向/从数组中添加/删除项目，然后返回被删除的项目。
- sort() 对数组的元素进行排序。
- reverse() 用于颠倒数组中元素的顺序

* b. 正确，见 [Vue 原理摘录](https://www.jianshu.com/p/c1b835e9ed86)图 1

- c. 正确，见 [Vue 原理摘录](https://www.jianshu.com/p/c1b835e9ed86)图 1 触发了 setter 方法，通知对应组件的 watcher 执行异步更新

* d. 正确，参照网上牛人的[文章](https://links.jianshu.com/go?to=https%3A%2F%2Fblog.csdn.net%2FLL18781132750%2Farticle%2Fdetails%2F81480661)

### 什么是 mvvm

MVVM 是 Model-View-ViewModel 的缩写。mvvm 是一种设计思想。Model 层代表数据模型，也可以在 Model 中定义数据修改和操作的业务逻辑；View 代表 UI 组件，它负责将数据模型转化成 UI 展现出来，ViewModel 是一个同步 View 和 Model 的对象。

在 MVVM 架构下，View 和 Model 之间并没有直接的联系，而是通过 ViewModel 进行交互，Model 和 ViewModel 之间的交互是双向的， 因此 View 数据的变化会同步到 Model 中，而 Model 数据的变化也会立即反应到 View 上。

ViewModel 通过双向数据绑定把 View 层和 Model 层连接了起来，而 View 和 Model 之间的同步工作完全是自动的，无需人为干涉，因此开发者只需关注业务逻辑，不需要手动操作 DOM, 不需要关注数据状态的同步问题，复杂的数据状态维护完全由 MVVM 来统一管理。

### mvvm 和 mvc 区别？

mvc 和 mvvm 其实区别并不大。都是一种设计思想。主要就是 mvc 中 Controller 演变成 mvvm 中的 viewModel。mvvm 主要解决了 mvc 中大量的 DOM 操作使页面渲染性能降低，加载速度变慢，影响用户体验。和当 Model 频繁发生变化，开发者需要主动更新到 View 。

### vue 的优点是什么?

- 低耦合。视图（View）可以独立于 Model 变化和修改，一个 ViewModel 可以绑定到不同的"View"上，当 View 变化的时候 Model 可以不变，当 Model 变化的时候 View 也可以不变。
- 可重用性。你可以把一些视图逻辑放在一个 ViewModel 里面，让很多 view 重用这段视图逻辑。
- 独立开发。开发人员可以专注于业务逻辑和数据的开发（ViewModel），设计人员可以专注于页面设计，使用 Expression Blend 可以很容易设计界面并生成 xml 代码。
- 可测试。界面素来是比较难于测试的，而现在测试可以针对 ViewModel 来写。

### vue 生命周期的理解？

总共分为 8 个阶段创建前/后，载入前/后，更新前/后，销毁前/后。

- 创建前/后： 在 beforeCreate 阶段，vue 实例的挂载元素 el 还没有。
- 载入前/后：在 beforeMount 阶段，vue 实例的\$el 和 data 都初始化了，但还是挂载之前为虚拟的 dom 节点，dat- a. message 还未替换。在 mounted 阶段，vue 实例挂载完成，dat- a. message 成功渲染。
- 更新前/后：当 data 变化时，会触发 beforeUpdate 和 updated 方法。
- 销毁前/后：在执行 destroy 方法后，对 data 的改变不会再触发周期函数，说明此时 vue 实例已经解除了事件监听以及和 dom 的绑定，但是 dom 结构依然存在。

### 为什么 vue 中 data 必须是一个函数？

对象为引用类型，当重用组件时，由于数据对象都指向同一个 data 对象，当在一个组件中修改 data 时，其他重用的组件中的 data 会同时被修改；而使用返回对象的函数，由于每次返回的都是一个新对象（Object 的实例），引用地址不同，则不会出现这个问题。

### 组件之间的传值？

[vue-cli 笔记](https://www.jianshu.com/p/8b1641ae13e0)

### active-class 是哪个组件的属性？

vue-router 模块的 router-link 组件修改 router 按钮激活 class，一共 2 个地方，一个是在 router 的配置实例中 linkActiveClass，一个是在 router-link 标签上 active-class 优先级，标签上的权重更高

### 路由之间跳转？

- 声明式（标签跳转）
- 编程式（ js 跳转） router.push('index')

### 懒加载（按需加载路由）（常考）

webpack 中提供了 require.ensure()来实现按需加载。以前引入路由是通过 import 这样的方式引入，改为 const 定义的方式进行引入。

- 不进行页面按需加载引入方式：import home from '../../common/home.vue'
- 进行页面按需加载的引入方式：const home = r => require.ensure( [], () => r (require('../../common/home.vue')))

### vue-router 有哪几种导航钩子?

全局导航钩子

- router.beforeEach(to, from, next),
- router.beforeResolve(to, from, next),
- router.afterEach(to, from ,next) 单独路由独享组件
- beforeEnter 组件内钩子
- beforeRouteEnter,
- beforeRouteUpdate,
- beforeRouteLeave

### 自定义指令(v-check, v-focus) 的方法有哪些? 它有哪些钩子函数? 还有哪些钩子函数参数

- 全局定义指令：在 vue 对象的 directive 方法里面有两个参数, 一个是指令名称, 另一个是函数。
- 组件内定义指令：directives 钩子函数: bind(绑定事件出发)、inserted(节点插入时候触发)、update(组件内相关更新)
- 钩子函数参数： el、binding

### vue 的双向绑定的原理是什么(常考)

vue.js 是采用数据劫持结合发布者-订阅者模式的方式，通过 Object.defineProperty()来劫持各个属性的 setter，getter，在数据变动时发布消息给订阅者，触发相应的监听回调。具体步骤：第一步：需要 observe 的数据对象进行递归遍历，包括子属性对象的属性，都加上 setter 和 getter 这样的话，给这个对象的某个值赋值，就会触发 setter，那么就能监听到了数据变化

第二步：compile 解析模板指令，将模板中的变量替换成数据，然后初始化渲染页面视图，并将每个指令对应的节点绑定更新函数，添加监听数据的订阅者，一旦数据有变动，收到通知，更新视图

第三步：Watcher 订阅者是 Observer 和 Compile 之间通信的桥梁，主要做的事情是: 在自身实例化时往属性订阅器(dep)里面添加自己自身必须有一个 update()方法待属性变动 dep.notice()通知时，能调用自身的 update() 方法，并触发 Compile 中绑定的回调，则功成身退。

第四步：MVVM 作为数据绑定的入口，整合 Observer、Compile 和 Watcher 三者，通过 Observer 来监听自己的 model 数据变化，通过 Compile 来解析编译模板指令，最终利用 Watcher 搭起 Observer 和 Compile 之间的通信桥梁，达到数据变化 -> 视图更新；视图交互变化(input) -> 数据 model 变更的双向绑定效果。

### vuex 的 store 特性是什么

vuex 就是一个仓库，仓库里放了很多对象。其中 state 就是数据源存放地，对应于一般 vue 对象里面的 datastate 里面存放的数据是响应式的，vue 组件从 store 读取数据，若是 store 中的数据发生改变，依赖这相数据的组件也会发生更新它通过 mapState 把全局的 state 和 getters 映射到当前组件的 computed 计算属性

### vuex 的 getter 特性是什么

getter 可以对 state 进行计算操作，它就是 store 的计算属性虽然在组件内也可以做计算属性，但是 getters 可以在多给件之间复用如果一个状态只在一个组件内使用，是可以不用 getters

### vuex 的 mutation 特性是什么

action 类似于 muation, 不同在于：action 提交的是 mutation,而不是直接变更状态 action 可以包含任意异步操作 vue 中 ajax 请求代码应该写在组件的 methods 中还是 vuex 的 action 中如果请求来的数据不是要被其他组件公用，仅仅在请求的组件内使用，就不需要放入 vuex 的 state 里如果被其他地方复用，请将请求放入 action 里，方便复用，并包装成 promise 返回

### 不用 vuex 会带来什么问题

- 可维护性会下降，你要修改数据，你得维护 3 个地方
- 可读性下降，因为一个组件里的数据，你根本就看不出来是从哪里来的
- 增加耦合，大量的上传派发，会让耦合性大大的增加，本来 Vue 用 Component 就是为了减少耦合，现在这么用，和组件化的初衷相背

### vuex 原理

vuex 仅仅是作为 vue 的一个插件而存在，不像 Redux,MobX 等库可以应用于所有框架，vuex 只能使用在 vue 上，很大的程度是因为其高度依赖于 vue 的 computed 依赖检测系统以及其插件系统， vuex 整体思想诞生于 flux,可其的实现方式完完全全的使用了 vue 自身的响应式设计，依赖监听、依赖收集都属于 vue 对对象 Property set get 方法的代理劫持。最后一句话结束 vuex 工作原理，vuex 中的 store 本质就是没有 template 的隐藏着的 vue 组件；

### 使用 Vuex 只需执行 Vue.use(Vuex)，并在 Vue 的配置中传入一个 store 对象的示例，store 是如何实现注入的？美团

Vue.use(Vuex) 方法执行的是 install 方法，它实现了 Vue 实例对象的 init 方法封装和注入，使传入的 store 对象被设置到 Vue 上下文环境的 store 中。因此在 VueComponent 任意地方都能够通过 this.store 访问到该 store。

### state 内部支持模块配置和模块嵌套，如何实现的？美团

在 store 构造方法中有 makeLocalContext 方法，所有 module 都会有一个 local context，根据配置时的 path 进行匹配。所以执行如 dispatch('submitOrder', payload)这类 action 时，默认的拿到都是 module 的 local state，如果要访问最外层或者是其他 module 的 state，只能从 rootState 按照 path 路径逐步进行访问。

### 在执行 dispatch 触发 action(commit 同理)的时候，只需传入(type, payload)，action 执行函数中第一个参数 store 从哪里获取的？美团

store 初始化时，所有配置的 action 和 mutation 以及 getters 均被封装过。在执行如 dispatch('submitOrder', payload)的时候，actions 中 type 为 submitOrder 的所有处理方法都是被封装后的，其第一个参数为当前的 store 对象，所以能够获取到 { dispatch, commit, state, rootState } 等数据。

### Vuex 如何区分 state 是外部直接修改，还是通过 mutation 方法修改的？美团

Vuex 中修改 state 的唯一渠道就是执行 commit('xx', payload) 方法，其底层通过执行 this.\_withCommit(fn) 设置\_committing 标志变量为 true，然后才能修改 state，修改完毕还需要还原\_committing 变量。外部修改虽然能够直接修改 state，但是并没有修改\_committing 标志位，所以只要 watch 一下 state，state change 时判断是否\_committing 值为 true，即可判断修改的合法性。

### 调试时的"时空穿梭"功能是如何实现的？美团

devtoolPlugin 中提供了此功能。因为 dev 模式下所有的 state change 都会被记录下来，'时空穿梭' 功能其实就是将当前的 state 替换为记录中某个时刻的 state 状态，利用 store.replaceState(targetState) 方法将执行 this.\_vm.state = state 实现。
