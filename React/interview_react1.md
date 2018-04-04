# React Fundamentals

## 思想

* **Composition**
  * React 是 MVC's V。组件包含了虚拟 DOM 来展示 UI
  * Components can be used to compose other components much like functional composition
  * Well defined components can be used between different projects
* **Declarative**
  * A declarative solution focusses on the WHAT rather than the HOW of the problem and uses the api that abstracts the how to do so.
* **Unidirectional Dataflow**
  * In react the state is stored in a component as opposed to the DOM (which is how it is with JQuery)
  * Hence the state is explicitly changed and that causes the DOM to re-render
  * The data flows from the state to the DOM and not the other way around
  * parent components pass data to children components with the help of props
* **Explicit Mutations**
  * Changing the state has to be done explicitly in React
  * Since changing the state of a component with `this.setState` renders it to the DOM
  * there is no need of adding event listeners or dirty checking
* **Just JavaScript**
  * React takes advantage of the JavaScript programming language’s functionality, api and capabilities (also functional style)

## React 解决了什么问题？思想？好在哪？

**a. React 实现了 Virtual DOM，diff 算法使得更新小量数据性能高**

在一定程度上提升了性能，尤其是在进行小量数据更新时。因为 DOM 操作是很耗性能的，而 Virtual DOM 是在内存中进行操作的，当数据发生变化时，通过 diff 算法 比较两棵树之间的变化，再进行必要的 DOM 更新，省去了不必要的高消耗的 DOM 操作。当然，这种性能优化主要体现在有小量数据更新的情况下。因为 React 的基本思维模式是每次有变动就重新渲染整个应用，简单想来就是直接重置 innerHTML，比如说在一个大型列表所有数据都变动的情况下，重置 innerHTML 还比较合理，但若是只有一行数据变了，它也需要重置整个 innerHTML，就会造成大量的浪费。而 Virtual DOM 虽然进行了 JS 层面的计算，但是比起 DOM 操作来说，简直不要太便宜。

> [为什么操作真实 DOM 比 React 更快？](https://www.zhihu.com/question/31809713)

**b. React 的一个核心思想是声明式编程。**

命令式编程是解决做什么的问题，就像是下命令一样，关注于 WHAT，做什么就调用对象 API。而声明式编程关注于 HOW 如何做才能得到结果。在 React 中，我们只需要关注“目前的状态是什么”，而不是探究“我如何做才能让页面变成目前的状态”。React 就是不断声明，然后在特定的参数下渲染 UI 界面。这种编程方式可以让我们的代码更容易被理解，从而易于维护。

**c. 组件化**

React 天生组件化，我们可以将一个大的应用分割成很多小组件，这样有好几个优势。首先组件化的代码像一棵树一样清楚干净，比起传统的面条式代码**可读性更高**；其次前端人员在开发过程中可以**并行开发组件而不影响**，大大提高了开发效率；最重要的是，组件化使得**复用性**大大提高，团队可以沉淀一些**公共组件或工具库**。

**d. 单向数据流**

在 React 中数据流是单向的，由父节点流向子节点，如果父节点的 props 发生了变化，那么 React 会递归遍历整个组件树，重新渲染所有使用该属性的子组件。这种单向的数据流一方面比较**清晰**不容易混乱，另一方面是比较好**维护**，出了**问题也比较好定位**。

## [原理，diff](http://web.jobbole.com/84301/)

React diff 会帮助我们计算出 Virtual DOM 中真正变化的部分，并只针对该部分进行实际 DOM 操作，而非重新渲染整个页面，从而保证了每次操作更新后页面的高效渲染，因此 Virtual DOM 与 diff 是保证 React 性能口碑的幕后推手。而且 React 能够批处理虚拟 DOM 的刷新，在一个事件循环 (Event Loop)内的两次数据变化会被合并，例如你连续的先将节点内容从 A 变成 B，然后又从 B 变成 A，React 会认为 UI 不发生任何变化。尽管每一次都需要构造完整的虚拟 DOM 树，但是因为虚拟 DOM 是内存数据，性能是极高的，而对实际 DOM 进行操作的仅仅是 Diff 部分，因而能达到提高性能的目的。

传统 diff 算法通过循环递归对节点进行依次对比，算法复杂度达到 O(n^3)，其中 n 是树中节点的总数。

React 通过制定大胆的策略，将 O(n^3) 复杂度的问题转换成 O(n) 复杂度的问题。

diff 策略：

* tree diff: Web UI 中 DOM 节点跨层级的移动操作特别少，可以忽略不计。
* component diff: 拥有相同类的两个组件将会生成相似的树形结构，拥有不同类的两个组件将会生成不同的树形结构。
* element diff: 对于同一层级的一组子节点，它们可以通过唯一 id 进行区分。

### tree diff

对树进行分层比较，两棵树只会对同一层次的节点进行比较。

既然 DOM 节点跨层级的移动操作少到可以忽略不计，针对这一现象，React 通过 updateDepth 对 Virtual DOM 树进行层级控制，只会对相同颜色方框内的 DOM 节点进行比较，即同一个父节点下的所有子节点。当发现节点已经不存在，则该节点及其子节点会被完全删除掉，不会用于进一步的比较。这样只需要对树进行一次遍历，便能完成整个 DOM 树的比较。

![img](http://ww1.sinaimg.cn/mw690/0064cTs2jw1eybcfdla61j30g608c3zz.jpg)

分析至此，**大部分人可能都存在这样的疑问：如果出现了 DOM 节点跨层级的移动操作，React diff 会有怎样的表现呢**？是的，对此我也好奇不已，不如试验一番。

如下图，A 节点 (包括其子节点)整个被移动到 D 节点下，由于 React 只会简单的考虑同层级节点的位置变换，而对于不同层级的节点，只有创建和删除操作。当根节点发现子节点中 A 消失了，就会直接销毁 A；当 D 发现多了一个子节点 A，则会创建新的 A (包括子节点)作为其子节点。此时，React diff 的执行情况：**create A -> create B -> create C -> delete A**。

由此可发现，当出现节点跨层级移动时，并不会出现想象中的移动操作，而是以 A 为根节点的树被整个重新创建，这是一种影响 React 性能的操作，因此 **React 官方建议不要进行 DOM 节点跨层级的操作**。

> 注意：在开发组件时，保持稳定的 DOM 结构会有助于性能的提升。例如，可以通过 CSS 隐藏或显示节点，而不是真的移除或添加 DOM 节点。

![img](http://ww3.sinaimg.cn/mw690/0064cTs2jw1eybcfdlj19j30es08l74t.jpg)

### component diff

React 是基于组件构建应用的，对于组件间的比较所采取的策略也是简洁高效。

* 如果是同一类型的组件，按照原策略继续比较 virtual DOM tree。
* 如果不是，则将该组件判断为 dirty component，从而替换整个组件下的所有子节点。
* 对于同一类型的组件，有可能其 Virtual DOM 没有任何变化，如果能够确切的知道这点那可以节省大量的 diff 运算时间，因此 React 允许用户通过 shouldComponentUpdate() 来判断该组件是否需要进行 diff。

如下图，当 component D 改变为 component G 时，即使这两个 component 结构相似，一旦 React 判断 D 和 G 是不同类型的组件，就不会比较二者的结构，而是直接删除 component D，重新创建 component G 以及其子节点。虽然当两个 component 是不同类型但结构相似时，React diff 会影响性能，但正如 React 官方博客所言：不同类型的 component 是很少存在相似 DOM tree 的机会，因此这种极端因素很难在实现开发过程中造成重大影响的。

![img](http://ww1.sinaimg.cn/mw690/0064cTs2jw1eybcfdz53zj30f2064js4.jpg)

### element diff

当节点处于同一层级时，React diff 提供了三种节点操作，分别为：**INSERT_MARKUP** (插入)、**MOVE_EXISTING** (移动)和 **REMOVE_NODE** (删除)。

* **INSERT_MARKUP**，新的 component 类型不在老集合里， 即是全新的节点，需要对新节点执行插入操作。
* **MOVE_EXISTING**，在老集合有新 component 类型，且 element 是可更新的类型，generateComponentChildren 已调用 receiveComponent，这种情况下 prevChild=nextChild，就需要做移动操作，可以复用以前的 DOM 节点。
* **REMOVE_NODE**，老 component 类型，在新集合里也有，但对应的 element 不同则不能直接复用和更新，需要执行删除操作，或者老 component 不在新集合里的，也需要执行删除操作。

如下图，老集合中包含节点：A、B、C、D，更新后的新集合中包含节点：B、A、D、C，此时新老集合进行 diff 差异化对比，发现 B != A，则创建并插入 B 至新集合，删除老集合 A；以此类推，创建并插入 A、D 和 C，删除 B、C 和 D。 ![img](http://ww1.sinaimg.cn/mw690/0064cTs2jw1eybcfepy19j30e507f74r.jpg)

React 发现这类操作繁琐冗余，因为这些都是相同的节点，但由于位置发生变化，导致需要进行繁杂低效的删除、创建操作，其实只要对这些节点进行位置移动即可。

针对这一现象，React 提出优化策略：允许开发者对同一层级的同组子节点，添加唯一 key 进行区分，虽然只是小小的改动，性能上却发生了翻天覆地的变化！

新老集合所包含的节点，如下图所示，新老集合进行 diff 差异化对比，通过 key 发现新老集合中的节点都是相同的节点，因此无需进行节点删除和创建，只需要将老集合中节点的位置进行移动，更新为新集合中节点的位置，此时 React 给出的 diff 结果为：B、D 不做任何操作，A、C 进行移动操作，即可。

![img](http://ww3.sinaimg.cn/mw690/0064cTs2jw1eybcfer9bej30ef08igm9.jpg)

那么，如此高效的 diff 到底是如何运作的呢？让我们通过源码进行详细分析。

首先对新集合的节点进行循环遍历，for (name in nextChildren)，通过唯一 key 可以判断新老集合中是否存在相同的节点，if (prevChild === nextChild)，如果存在相同节点，则进行移动操作，但在移动前需要将当前节点在老集合中的位置与 lastIndex 进行比较，if (child.\_mountIndex < lastIndex)，则进行节点移动操作，否则不执行该操作。这是一种顺序优化手段，lastIndex 一直在更新，表示访问过的节点在老集合中最右的位置 (即最大的位置)，如果新集合中当前访问的节点比 lastIndex 大，说明当前访问节点在老集合中就比上一个节点位置靠后，则该节点不会影响其他节点的位置，因此不用添加到差异队列中，即不执行移动操作，只有当访问的节点比 lastIndex 小时，才需要进行移动操作。

以上图为例，可以更为清晰直观的描述 diff 的差异对比过程：

* 从新集合中取得 B，判断老集合中存在相同节点 B，通过对比节点位置判断是否进行移动操作，B 在老集合中的位置 B.\_mountIndex = 1，此时 lastIndex = 0，不满足 child.\_mountIndex < lastIndex 的条件，因此不对 B 进行移动操作；更新 lastIndex = Math.max(prevChild.\_mountIndex, lastIndex)，其中 prevChild.\_mountIndex 表示 B 在老集合中的位置，则 lastIndex ＝ 1，并将 B 的位置更新为新集合中的位置 prevChild.\_mountIndex = nextIndex，此时新集合中 B.\_mountIndex = 0，nextIndex++ 进入下一个节点的判断。
* 从新集合中取得 A，判断老集合中存在相同节点 A，通过对比节点位置判断是否进行移动操作，A 在老集合中的位置 A.\_mountIndex = 0，此时 lastIndex = 1，满足 child.\_mountIndex < lastIndex 的条件，因此对 A 进行移动操作 enqueueMove(this, child.\_mountIndex, toIndex)，其中 toIndex 其实就是 nextIndex，表示 A 需要移动到的位置；更新 lastIndex = Math.max(prevChild.\_mountIndex, lastIndex)，则 lastIndex ＝ 1，并将 A 的位置更新为新集合中的位置 prevChild.\_mountIndex = nextIndex，此时新集合中 A.\_mountIndex = 1，nextIndex++ 进入下一个节点的判断。
* 从新集合中取得 D，判断老集合中存在相同节点 D，通过对比节点位置判断是否进行移动操作，D 在老集合中的位置 D.\_mountIndex = 3，此时 lastIndex = 1，不满足 child.\_mountIndex < lastIndex 的条件，因此不对 D 进行移动操作；更新 lastIndex = Math.max(prevChild.\_mountIndex, lastIndex)，则 lastIndex ＝ 3，并将 D 的位置更新为新集合中的位置 prevChild.\_mountIndex = nextIndex，此时新集合中 D.\_mountIndex = 2，nextIndex++ 进入下一个节点的判断。
* 从新集合中取得 C，判断老集合中存在相同节点 C，通过对比节点位置判断是否进行移动操作，C 在老集合中的位置 C.\_mountIndex = 2，此时 lastIndex = 3，满足 child.\_mountIndex < lastIndex 的条件，因此对 C 进行移动操作 enqueueMove(this, child.\_mountIndex, toIndex)；更新 lastIndex = Math.max(prevChild.\_mountIndex, lastIndex)，则 lastIndex ＝ 3，并将 C 的位置更新为新集合中的位置 prevChild.\_mountIndex = nextIndex，此时新集合中 A.\_mountIndex = 3，nextIndex++ 进入下一个节点的判断，由于 C 已经是最后一个节点，因此 diff 到此完成。

以上主要分析新老集合中存在相同节点但位置不同时，对节点进行位置移动的情况，如果新集合中有新加入的节点且老集合存在需要删除的节点，那么 React diff 又是如何对比运作的呢？

以下图为例：

* 从新集合中取得 B，判断老集合中存在相同节点 B，由于 B 在老集合中的位置 B.\_mountIndex = 1，此时 lastIndex = 0，因此不对 B 进行移动操作；更新 lastIndex ＝ 1，并将 B 的位置更新为新集合中的位置 B.\_mountIndex = 0，nextIndex++进入下一个节点的判断。
* 从新集合中取得 E，判断老集合中不存在相同节点 E，则创建新节点 E；更新 lastIndex ＝ 1，并将 E 的位置更新为新集合中的位置，nextIndex++进入下一个节点的判断。
* 从新集合中取得 C，判断老集合中存在相同节点 C，由于 C 在老集合中的位置 C.\_mountIndex = 2，此时 lastIndex = 1，因此对 C 进行移动操作；更新 lastIndex ＝ 2，并将 C 的位置更新为新集合中的位置，nextIndex++ 进入下一个节点的判断。
* 从新集合中取得 A，判断老集合中存在相同节点 A，由于 A 在老集合中的位置 A.\_mountIndex = 0，此时 lastIndex = 2，因此不对 A 进行移动操作；更新 lastIndex ＝ 2，并将 A 的位置更新为新集合中的位置，nextIndex++ 进入下一个节点的判断。
* 当完成新集合中所有节点 diff 时，最后还需要对老集合进行循环遍历，判断是否存在新集合中没有但老集合中仍存在的节点，发现存在这样的节点 D，因此删除节点 D，到此 diff 全部完成。

![img](http://ww4.sinaimg.cn/mw690/0064cTs2jw1eybcff1kwaj30e508u0td.jpg)

当然，React diff 还是存在些许不足与待优化的地方，如下图所示，若新集合的节点更新为：D、A、B、C，与老集合对比只有 D 节点移动，而 A、B、C 仍然保持原有的顺序，理论上 diff 应该只需对 D 执行移动操作，然而由于 D 在老集合的位置是最大的，导致其他节点的 \_mountIndex < lastIndex，造成 D 没有执行移动操作，而是 A、B、C 全部移动到 D 节点后面的现象。

**在此，读者们可以讨论思考：如何优化上述问题？**

> 建议：在开发过程中，尽量减少类似将最后一个节点移动到列表首部的操作，当节点数量过大或更新操作过于频繁时，在一定程度上会影响 React 的渲染性能。

![img](http://ww4.sinaimg.cn/mw690/0064cTs2jw1eybcffmn0mj30f208gwf7.jpg)

### 总结

* React 通过制定大胆的 diff 策略，将 O(n3) 复杂度的问题转换成 O(n) 复杂度的问题；
* React 通过**分层求异**的策略，对 tree diff 进行算法优化；
* React 通过**相同类生成相似树形结构，不同类生成不同树形结构**的策略，对 component diff 进行算法优化；
* React 通过**设置唯一 key**的策略，对 element diff 进行算法优化；
* 建议，在开发组件时，保持稳定的 DOM 结构会有助于性能的提升；
* 建议，在开发过程中，尽量减少类似将最后一个节点移动到列表首部的操作，当节点数量过大或更新操作过于频繁时，在一定程度上会影响 React 的渲染性能。

## 组件化思想

组件，即封装起来的具有独立功能的 UI 部件。React 推荐以组件的方式去重新思考 UI 构成，将 UI 上每一个功能相对独立的模块定义成组件，然后将小的组件通过组合或者嵌套的方式构成大的组件，最终完成整体 UI 的构建。

如果说 MVC 的思想让你做到 **视图-数据-控制器** 的分离，那么组件化的思考方式则是带来了**UI 功能模块之间的分离**。

对于 MVC 开发模式来说，开发者将三者定义成不同的类，实现了表现，数据，控制的分离。对于 React 而言，则完全是一个新的思路，开发者从**功能的角度**出发，将 UI 分成不同的组件，每个组件都独立封装。在 React 中，你按照界面模块自然划分的方式来组织和编写你的代码，整个 UI 是一个通过小组件构成的大组件，每个组件只关心自己部分的逻辑，彼此独立。

React 组件特征：

1.  可组合(Composable)：一个组件易于和其它组件一起使用，或者嵌套在另一个组件内部
1.  可重用(Reusable)：每个组件都是具有独立功能的，它可以被使用在多个 UI 场景
1.  可维护(Maintainable)：每个小的组件仅仅包含自身的逻辑，更容易被理解和维护

## React Benefits

#### just JavaScript

js 原生方法入 each、map 遍历集合，无需 ngRepeat

#### Declarative

Design simple views for each state in your application, and React will efficiently update and render just the right components when your data changes. Declarative views make your code more predictable and easier to debug.

#### Component-Based

Since component logic is written in JavaScript instead of templates, you can easily pass rich data through your app and keep state out of the DOM. No string concatenation.

#### Reactive update

通过算法做最小改变，速度快

#### One way Unidirectional data flow

很容易知道数据所处的状态。Only cares about state, and UI will be updated based on state

#### Composition

Components can nest others, Using Composition instead of Inheritance.

## What is React

We care only about the state, once state changes, UI will be automatically updated by React. State and UI are separated

a library for building user interfaces. **a React element is an object representation of a DOM node**. It’s important to note that a React element isn’t actually the thing you’ll see on your screen, instead, it’s just an object representation of it.

There’s a few reasons for this.

1.  JavaScript objects are lightweight — React can create and destroy these elements without too much overhead.
1.  React is able to analyze the object, diff it with the previous object representation to see what changed, and then update the actual DOM only where those changes occurred. This has some performance upsides to it.

**virtual DOM is a JavaScript representation of the actual DOM. React can keep track of the difference between the current virtual DOM (computed after some data changes), with the previous virtual DOM (computed before some data changes). React then isolates the changes between the old and new virtual DOM and then only updates the real DOM with the necessary changes. Because manipulating the actual DOM can be complex, React is able to minimize manipulations to the actual DOM by keeping track of a virtual DOM and only updating the real DOM when necessary and with only the necessary changes**. By re-rendering the virtual DOM every time any state change occurs, React makes it easier to think about what state your application is in.

> Signal to notify our app some data has changed -> Re-render virtual DOM -> Diff previous virtual DOM with new virtual DOM -> Only update real DOM with necessary changes.

## 如何设计一个好组件

SOLID: single responsibility, open-close, 里式替换, Interface segregation(small interface), DI

组件的主要目的是为了更好的复用，所以在设计组件的时候需要遵循**高内聚低耦合**的原则。

* 可以通过遵循几种设计模式原则来达到高复用的目的，比如**单一职责原则：React 推崇的是“组合”而非“继承”**，所以在设计时尽量不设计大的组件，而是开发若干个单一功能的组件，重点就是每个组件只做一件事。
* **开放/封闭原则**，就是常说的对修改封闭，对扩展开放。在 React 中我们可以用高阶组件来实现。使用**高阶组件**来实现组件的复用。高阶组件就是一个包装了另一个 React 组件的 React 组件，它包括属性代理（高阶组件操控着传递给被包裹组件的属性）和反向继承（实际上高阶组件继承被包裹组件）。我们可以用高阶组件实现代码复用，逻辑抽象。
* 使用**容器组件来处理逻辑，展示组件来展示数据（也就是逻辑处理与数据展示分离）**。比如可以在容器组件中进行数据的请求与处理，然后将处理后的数据传递给展示组件，展示组件只负责展示，这样容器组件和展示组件就可以更好地复用了。
* 编写组件代码时要符合规范，总之就是要可读性强、复用性高、可维护性好。

## 如何对组件进行优化

* 使用上线构建（Production Build）：会移除脚本中不必要的报错和警告，减少文件体积
* 避免重绘：重写 `shouldComponentUpdate` 函数，手动控制是否应该调用 render 函数进行重绘
* 使用 Immutable Data 不修改数据，而是重新赋值数据。这样在检测数据对象是否发生修改方面会非常快，因为只需要检测对象引用即可，不需要挨个检测对象属性的更改
* 在渲染组件时尽可能添加 `key`，这样 virtual DOM 在对比的时候就更容易知道哪里是修改元素，哪里是新插入的元素

## [React 优化 Optimization](https://facebook.github.io/react/docs/optimizing-performance.html)

##### 1. Use the Production Build

Typically you’d use Webpack's **DefinePlugin** method to set `NODE_ENV` to **production**. This will strip out things like _propType validation and extra warnings_. On top of that, it’s also a good idea to **minify** your code because React uses **Uglify's** dead-code elimination to strip out development only code and comments, which will drastically reduce the size of your bundle. **TreeShaking**

```javascript
new webpack.DefinePlugin({
  'process.env': {
    NODE_ENV: JSON.stringify('production'),
  },
});
```

##### 2. Profiling Components with the Chrome Performance Tab

##### 3. Avoid Reconciliation, use `shouldComponentUpdate` or `PureComponent` but don't mutate data

In some cases, your component can speed all of this up by overriding the lifecycle function `shouldComponentUpdate`, which is triggered before the re-rendering process starts. The default implementation of this function returns true, leaving React to perform the update.

If you know that in some situations your component doesn't need to update, you can return false from `shouldComponentUpdate` instead, to skip the whole rendering process, including calling `render()` on this component and below.

###### 4. looping thru -- add `key`

比如我们现在有个 listComponent，每个 item 是个 component，总共有很多 10 万个吧。新增一条数据时，如果不用 `shouldComponentUpdate` 也没加 `key`，react 会重新渲染 10 万个和这个新加的数据，性能弱。

```javascript
//当下一次 props 和当前不同时，return true，告诉react去更新重新渲染。注意这里逻辑必须简洁，不然可能比react自动渲染的逻辑还费时
shouldComponentUpdate(nextProps, nextState){
  return this.props.name !== nextProps.name
}
```
