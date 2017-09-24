## What happens when you call setState

The first thing React will do when setState is called is **merge the object you passed into setState into the current state of the component**. This will kick off a process called **reconciliation**. The end goal of reconciliation is to, in the most efficient way possible, update the UI based on this new state.

To do this, React will construct a new tree of React elements (which you can think of as an object representation of your UI). Once it has this tree, in order to figure out how the UI should change in response to the new state, React will diff this new tree against the previous element tree.

By doing this, React will then know the exact changes which occurred, and by knowing exactly what changes occurred, will able to minimize its footprint on the UI by only making updates where absolutely necessary.

## What’s the difference between an _Element_ and a _Component_ in React

Simply put, a React element describes what you want to see on the screen. Not so simply put, a React element is an object representation of some UI.

A React component is a function or a class which optionally accepts input and returns a React element (typically via JSX which gets transpiled to a `createElement` invocation).

For more info, check out [React Elements vs React Components](https://tylermcginnis.com/react-elements-vs-react-components/)

## When would you use a _Class Component_ over a _Functional Component_

If your component has state or a lifecycle method(s), use a Class component. Otherwise, use a Functional component.

## What are _refs_ in React and why are they important

Refs are an escape hatch which allow you to get direct access to a DOM element or an instance of a component. In order to use them you add a ref attribute to your component whose value is a callback function which will receive the underlying DOM element or the mounted instance of the component as its first argument.

```javascript
class UnControlledForm extends Component {
  handleSubmit = () => {
    console.log("Input Value: ", this.input.value)
  }
  render () {
    return (
      <form onSubmit={this.handleSubmit}>
        <input
          type='text'
          ref={(input) => this.input = input} />
        <button type='submit'>Submit</button>
      </form>
    )
  }
}
```

Above notice that our input field has a ref attribute whose value is a function. That function receives the actual DOM element of input which we then put on the instance in order to have access to it inside of the *handleSubmit* function.

It’s often misconstrued that you need to use a class component in order to use refs, but refs can also be used with functional components by leveraging closures in JavaScript.

```javascript
function CustomForm ({handleSubmit}) {
  let inputElement
  return (
    <form onSubmit={() => handleSubmit(inputElement.value)}>
      <input
        type='text'
        ref={(input) => inputElement = input} />
      <button type='submit'>Submit</button>
    </form>
  )
}
```

## What are _keys_ in React and why are they important

Keys are what help React keep track of what items have changed, been added, or been removed from a list.

```javascript
render () {
  return (
    <ul>
      {this.state.todoItems.map(({task, uid}) => {
        return <li key={uid}>{task}</li>
      })}
    </ul>
  )
}
```

It’s important that each key be unique among siblings.

We’ve talked a few times already about reconciliation and part of this reconciliation process is performing a diff of a new element tree with the most previous one.

Keys make this process more efficient when dealing with lists because React can use the key on a child element to quickly know if an element is new or if it was just moved when comparing trees. And not only do keys make this process more efficient. But without keys, React can’t know which local state corresponds to which item on move. So never neglect keys when mapping.

## If you created a React element like _Twitter_ below, what would the component definition of _Twitter_ look like

```javascript
<Twitter username='tylermcginnis33'>
  {(user) => user === null
    ? <Loading />
    : <Badge info={user} />}
</Twitter>
```

```javascript
import React, { Component, PropTypes } from 'react'
import fetchUser from 'twitter'
// fetchUser take in a username returns a promise which will resolve with that username's data.

class Twitter extends Component {
  // finish this
}
```

Take notice of what’s inside the opening and closing `<Twitter>` tags above. Instead of another component as you’ve probably seen before, the *Twitter* component’s child is a function. What this means is that in the implementation of the *Twitter* component, we’ll need to treat *props.children* as a function.

```javascript
import React, { Component, PropTypes } from 'react'
import fetchUser from 'twitter'

class Twitter extends Component {
  state = {
    user: null,
  }
  static propTypes = {
    username: PropTypes.string.isRequired,
  }
  componentDidMount () {
    fetchUser(this.props.username)
      .then((user) => this.setState({user}))
  }
  render () {
    return this.props.children(this.state.user)
  }
}
```

Notice that, just as I mentioned above, I treat *props.children* as a function by invoking it and passing it the user.

What’s great about this pattern is that we’ve decoupled our parent component from our child component. The parent component manages the state and the consumer of the parent component can decide in which way they’d like to apply the arguments they receive from the parent to their UI.

To demonstrate this, let’s say in another file we want to render a *Profile* instead of a *Badge*, because we’re using the render callback pattern, we can easily swap around the UI without changing our implementation of the parent (*Twitter*) component.

```javascript
<Twitter username='tylermcginnis33'>
  {(user) => user === null
    ? <Loading />
    : <Profile info={user} />}
</Twitter>
```

## What is the difference between a _controlled_ component and an _uncontrolled_component

A large part of React is this idea of having components control and manage their own state.

What happens when we throw native HTML form elements (input, select, textarea, etc) into the mix? Should we have React be the “single source of truth” like we’re used to doing with React? Or should we allow that form data to live in the DOM like we’re used to typically doing with HTML form elements? These questions are at the heart of controlled vs uncontrolled components.

A **controlled** component is a component where React is in *control* and is the single source of truth for the form data. As you can see below, *username* doesn’t live in the DOM but instead lives in our component state. Whenever we want to update *username*, we call *setState* as we’re used to.

```javascript
class ControlledForm extends Component {
  state = {
    username: ''
  }
  updateUsername = (e) => {
    this.setState({
      username: e.target.value,
    })
  }
  handleSubmit = () => {}
  render () {
    return (
      <form onSubmit={this.handleSubmit}>
        <input
          type='text'
          value={this.state.username}
          onChange={this.updateUsername} />
        <button type='submit'>Submit</button>
      </form>
    )
  }
}
```

An **uncontrolled** component is where your form data is handled by the DOM, instead of inside your React component.

You use *ref* to accomplish this.

```javascript
class UnControlledForm extends Component {
  handleSubmit = () => {
    console.log("Input Value: ", this.input.value)
  }
  render () {
    return (
      <form onSubmit={this.handleSubmit}>
        <input
          type='text'
          ref={(input) => this.input = input} />
        <button type='submit'>Submit</button>
      </form>
    )
  }
}
```

Though uncontrolled components are typically easier to implement since you just grab the value from the DOM using refs, it’s typically recommended that you favor controlled components over uncontrolled components. The main reasons for this are that controlled components support instant field validation, allow you to conditionally disable/enable buttons, enforce input formats, and are more “the React way”.

## In which lifecycle event do you make AJAX requests and why

AJAX requests should go in the **componentDidMount** lifecycle event.

There are a few reasons for this,

- Fiber, the next implementation of React’s reconciliation algorithm, will have the ability to start and stop rendering as needed for performance benefits. One of the trade-offs of this is that **componentWillMount**, the other lifecycle event where it might make sense to make an AJAX request, will be “non-deterministic”. What this means is that React may start calling *componentWillMount* at various times whenever it feels like it needs to. This would obviously be a bad formula for AJAX requests.
- You can’t guarantee the AJAX request won’t resolve before the component mounts. If it did, that would mean that you’d be trying to setState on an unmounted component, which not only won’t work, but React will yell at you for. Doing AJAX in componentDidMount will guarantee that there’s a component to update.

## What does _shouldComponentUpdate_ do and why is it important

Above we talked about reconciliation and what React does when setState is called. What **shouldComponentUpdate** does is it’s a lifecycle method that allows us to opt out of this reconciliation process for certain components (and their child components).

Why would we ever want to do this?

As mentioned above, “The end goal of reconciliation is to, in the most efficient way possible, update the UI based on new state.” If we know that a certain section of our UI isn’t going to change, there’s no reason to have React go through the trouble of trying to figure out if it should. By returning false from **shouldComponentUpdate**, React will assume that the current component, and all its child components, will stay the same as they currently are.

## How do you tell React to build in _Production_ mode and what will that do

Typically you’d use Webpack’s *DefinePlugin* method to set `NODE_ENV` to **production**. This will strip out things like propType validation and extra warnings. On top of that, it’s also a good idea to minify your code because React uses _Uglify’s_ dead-code elimination to strip out development only code and comments, which will drastically reduce the size of your bundle.

## Why would you use *`*React.Children.map(props.children, () => )*`* instead of *`*props.children.map(() => )*`

It’s not guaranteed that *props.children* will be an array.

Take this code for example:

```jsx
<Parent>
  <h1>Welcome.</h1>
</Parent>
```

Inside of Parent if we were to try to map over children using `props.children.map` it would throw an error because `props.children` is an object, not an array.

React only makes `props.children` an array if there are more than one child elements, like this:

```jsx
<Parent>
  <h1>Welcome.</h1>
  <h2>props.children will now be an array</h2>
</Parent>
```

This is why you want to favor `React.Children.map` because its implementation takes into account that *props.children* may be an array or an object.

## Describe how events are handled in React. 事件在React中的处理方式

In order to solve cross browser compatibility issues, your event handlers in React will be passed instances of *SyntheticEvent*, which is React’s cross-browser wrapper around the browser’s native event. These synthetic events have the same interface as native events you’re used to, except they work identically across all browsers.

What’s mildly interesting is that React doesn’t actually attach events to the child nodes themselves. React will listen to all events at the top level using a single event listener. This is good for performance and it also means that React doesn’t need to worry about keeping track of event listeners when updating the DOM.

在 React 底层，主要对合成事件做了两件事：事件委托和自动绑定。

事件委托：React的事件代理机制不会把事件处理函数直接绑定到真实的结点上，而是把所有事件绑定到结构的最外层，使用统一的事件监听器，这个事件监听器上维持了一个映射来保存所有组件内部的事件监听和处理函数。当事件发生时，首先被这个统一的事件监听器处理，然后在映射里找到真正的事件处理函数并调用。

自动绑定：在 React 组件中，每个方法的上下文都会指向该组件的实例，即自动绑定 this 为当前组件。在使用ES6 classes和纯函数时，这种自动绑定就不存在了，需要我们手动绑定this：bind方法、双冒号语法、构造器内声明、箭头函数。

## What is the difference between _createElement_ and _cloneElement_

*createElement* is what JSX gets transpiled to and is what React uses to create React Elements (object representations of some UI). *cloneElement* is used in order to clone an element and pass it new props. They nailed the naming on these two 🙂.

## What is the second argument that can optionally be passed to _setState_ and what is its purpose

A callback function which will be invoked when setState has finished and the component is re-rendered.

setState is asynchronous, which is why it takes in a second callback function. Typically it’s best to use another lifecycle method rather than relying on this callback function, but it’s good to know it exists.

```javascript
this.setState(
  { username: 'tylermcginnis33' },
  () => console.log('setState has finished and the component has re-rendered.')
)
```

## What is wrong with this code

```javascript
this.setState((prevState, props) => {
  return {
    streak: prevState.streak + props.count
  }
})
```

Nothing is wrong with it 🙂. It’s rarely used and not well known, but you can also pass a function to **setState** that receives the previous state and props and returns a new state, just as we’re doing above. And not only is nothing wrong with it, but it’s also actively recommended if you’re setting state based on previous state.

## React解决了什么问题？

**a. React 实现了Virtual DOM**

在一定程度上提升了性能，尤其是在进行小量数据更新时。因为DOM操作是很耗性能的，而Virtual DOM是在内存中进行操作的，当数据发生变化时，通过diff算法比较两棵树之间的变化，再进行必要的DOM更新，省去了不必要的高消耗的DOM操作。当然，这种性能优化主要体现在有小量数据更新的情况下。因为React的基本思维模式是每次有变动就重新渲染整个应用，简单想来就是直接重置innerHTML，比如说在一个大型列表所有数据都变动的情况下，重置innerHTML还比较合理，但若是只有一行数据变了，它也需要重置整个innerHTML，就会造成大量的浪费。而Virtual DOM虽然进行了JS层面的计算，但是比起DOM操作来说，简直不要太便宜。

> [为什么操作真实DOM比React更快？](https://www.zhihu.com/question/31809713)

**b. React的一个核心思想是声明式编程。**

命令式编程是解决做什么的问题，就像是下命令一样，关注于怎么做，而声明式编程关注于得到什么结果，在React中，我们只需要关注“目前的状态是什么”，而不是“我需要做什么让页面变成目前的状态”。React就是不断声明，然后在特定的参数下渲染UI界面。这种编程方式可以让我们的代码更容易被理解，从而易于维护。

**c. 组件化**

React天生组件化，我们可以将一个大的应用分割成很多小组件，这样有好几个优势。首先组件化的代码像一棵树一样清楚干净，比起传统的面条式代码可读性更高；其次前端人员在开发过程中可以并行开发组件而不影响，大大提高了开发效率；最重要的是，组件化使得复用性大大提高，团队可以沉淀一些公共组件或工具库。

**d. 单向数据流**

在React中数据流是单向的，由父节点流向子节点，如果父节点的props发生了变化，那么React会递归遍历整个组件树，重新渲染所有使用该属性的子组件。这种单向的数据流一方面比较清晰不容易混乱，另一方面是比较好维护，出了问题也比较好定位。

## 如何设计一个好组件

组件的主要目的是为了更好的复用，所以在设计组件的时候需要遵循高内聚低耦合的原则。

- 可以通过遵循几种设计模式原则来达到高复用的目的，比如单一职责原则：React推崇的是“组合”而非“继承”，所以在设计时尽量不设计大的组件，而是开发若干个单一功能的组件，重点就是每个组件只做一件事；开放/封闭原则，就是常说的对修改封闭，对扩展开放。在React中我们可以用高阶组件来实现。
- 使用高阶组件来实现组件的复用。高阶组件就是一个包装了另一个React组件的React组件，它包括属性代理（高阶组件操控着传递给被包裹组件的属性）和反向继承（实际上高阶组件继承被包裹组件）。我们可以用高阶组件实现代码复用，逻辑抽象。
- 使用容器组件来处理逻辑，展示组件来展示数据（也就是逻辑处理与数据展示分离）。比如可以在容器组件中进行数据的请求与处理，然后将处理后的数据传递给展示组件，展示组件只负责展示，这样容器组件和展示组件就可以更好地复用了。
- 编写组件代码时要符合规范，总之就是要可读性强、复用性高、可维护性好。

## 组件的render函数何时被调用

- 组件state发生改变时会调用render函数，比如通过setState函数改变组件自身的state值
- 继承的props属性发生改变时也会调用render函数，即使改变的前后值一样
- React生命周期中有个componentShouldUpdate函数，默认返回true，即允许render被调用，我们也可以重写这个函数，判断是否应该调用render函数

## 调用render时DOM就一定会被更新吗

不一定更新。

React组件中存在两类DOM，render函数被调用后， React会根据props或者state重新创建一棵virtual DOM树，虽然每一次调用都重新创建，但因为创建是发生在内存中，所以很快不影响性能。而 virtual dom的更新并不意味着真实DOM的更新，React采用diff算法将virtual DOM和真实DOM进行比较，找出需要更新的最小的部分，这时Real DOM才可能发生修改。

所以每次state的更改都会使得render函数被调用，但是页面DOM不一定发生修改。

## 组件的生命周期

组件生命周期有三种阶段：初始化阶段（Mounting）、更新阶段（Updating）、析构阶段（Unmouting）。

**初始化阶段：**

- constructor()：初始化state、绑定事件
- componentWillMount()：在render()之前执行，除了同构，跟constructor没啥差别
- render()：用于渲染DOM。如果有操作DOM或和浏览器打交道的操作，最好在下一个步骤执行。
- componentDidMount()：在render()之后立即执行，可以在这个函数中对DOM就进行操作，可以加载服务器数据，可以使用setState()方法触发重新渲染

**组件更新阶段：**

- componentWillReceiveProps(nextProps)：在已挂载的组件接收到新props时触发，传进来的props没有变化也可能触发该函数，若需要实现props变化才执行操作的话需要自己手动判断
- componentShouldUpdate(nextProps，nextState)：默认返回true，我们可以手动判断需不需要触发render，若返回false，就不触发下一步骤
- componentWillUpdate()：componentShouldUpdate返回true时触发，在render之前，可以在里面进行操作DOM
- render()：重渲染
- componentDidUpdate()：render之后立即触发

组件卸载阶段：

- componentWillUnmount()：在组件销毁之前触发，可以处理一些清理操作，如无效的timers等

## 在哪些生命周期中可以修改组件的state

- componentDidMount和componentDidUpdate
- constructor、componentWillMount中setState会发生错误：setState只能在mounted或mounting组件中执行
- componentWillUpdate中setState会导致死循环

## 不同父节点的组件需要对彼此的状态进行改变时应该怎么实现

- 在没有Flux之前，Facebook推荐使用事件机制，但是一旦应用中这种需求增多，事件和回调会满天飞
- 传递接口，就是需要root传递两个接口给A和B，当A想改变B的状态时，A调用root传递给它的接口，然后这个接口再调用root传给B的接口（这个方法也很不科学）
- 用Flux管理状态

## 如何对组件进行优化

- 使用上线构建（Production Build）：会移除脚本中不必要的报错和警告，减少文件体积
- 避免重绘：重写shouldComponentUpdate函数，手动控制是否应该调用render函数进行重绘
- 尽可能使用Immutable Data不修改数据，而是重新赋值数据。这样在检测数据对象是否发生修改方面会非常快，因为只需要检测对象引用即可，不需要挨个检测对象属性的更改
- 在渲染组件时尽可能添加key，这样virtual DOM在对比的时候就更容易知道哪里是修改元素，哪里是新插入的元素

## Component 与 Element 和 Instance 的区别

- Element其实是一个纯粹的Object对象，用于描述在屏幕上看到的DOM节点，这个对象包括type、props、key和ref属性，但不包括DOM方法（React.createElement()）
- Component是组件级别的类：接收参数并返回React元素的函数或类
- Instance：当使用ReactDOM.render()将一个组件渲染到一个具体的DOM元素中，返回的值就为一个实例
