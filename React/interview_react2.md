# react interview

## Describe how events are handled in React. 事件在React中的处理方式

**In order to solve cross browser compatibility issues, your event handlers in React will be passed instances of *SyntheticEvent***, which is React’s cross-browser wrapper around the browser’s native event. These synthetic events have the same interface as native events you’re used to, except they work identically across all browsers.

What’s mildly interesting is that React doesn’t actually attach events to the child nodes themselves. React will listen to all events at the top level using a single event listener. This is good for performance and it also means that React doesn’t need to worry about keeping track of event listeners when updating the DOM.

在 React 底层，主要对合成事件做了两件事：事件委托和自动绑定。

事件委托：React的事件代理机制不会把事件处理函数直接绑定到真实的结点上，而是把所有事件绑定到结构的最外层，使用统一的事件监听器，这个事件监听器上维持了一个映射来保存所有组件内部的事件监听和处理函数。当事件发生时，首先被这个统一的事件监听器处理，然后在映射里找到真正的事件处理函数并调用。

自动绑定：在 React 组件中，每个方法的上下文都会指向该组件的实例，即自动绑定 this 为当前组件。在使用 ES6 class 和纯函数时，这种自动绑定就不存在了，需要我们手动绑定 this.bind() 方法、双冒号语法、构造器内声明、箭头函数。用 bind 写在 constructor 里面最好。直接写在 jsx 中在 re-render 会有重新绑定的问题。

## React 解决了什么问题？思想？好在哪？

**a. React 实现了 Virtual DOM，diff 算法使得更新小量数据性能高**

在一定程度上提升了性能，尤其是在进行小量数据更新时。因为 DOM 操作是很耗性能的，而 Virtual DOM 是在内存中进行操作的，当数据发生变化时，通过 diff 算法 比较两棵树之间的变化，再进行必要的 DOM 更新，省去了不必要的高消耗的 DOM 操作。当然，这种性能优化主要体现在有小量数据更新的情况下。因为 React的基本思维模式是每次有变动就重新渲染整个应用，简单想来就是直接重置 innerHTML，比如说在一个大型列表所有数据都变动的情况下，重置 innerHTML 还比较合理，但若是只有一行数据变了，它也需要重置整个 innerHTML，就会造成大量的浪费。而 Virtual DOM 虽然进行了 JS 层面的计算，但是比起DOM操作来说，简直不要太便宜。

> [为什么操作真实 DOM 比 React 更快？](https://www.zhihu.com/question/31809713)

**b. React的一个核心思想是声明式编程。**

命令式编程是解决做什么的问题，就像是下命令一样，关注于WHAT，做什么就调用对象 API。而声明式编程关注于 HOW 如何做才能得到结果。在React中，我们只需要关注“目前的状态是什么”，而不是探究“我如何做才能让页面变成目前的状态”。React 就是不断声明，然后在特定的参数下渲染 UI 界面。这种编程方式可以让我们的代码更容易被理解，从而易于维护。

**c. 组件化**

React 天生组件化，我们可以将一个大的应用分割成很多小组件，这样有好几个优势。首先组件化的代码像一棵树一样清楚干净，比起传统的面条式代码**可读性更高**；其次前端人员在开发过程中可以**并行开发组件而不影响**，大大提高了开发效率；最重要的是，组件化使得**复用性**大大提高，团队可以沉淀一些**公共组件或工具库**。

**d. 单向数据流**

在 React 中数据流是单向的，由父节点流向子节点，如果父节点的 props 发生了变化，那么 React 会递归遍历整个组件树，重新渲染所有使用该属性的子组件。这种单向的数据流一方面比较**清晰**不容易混乱，另一方面是比较好**维护**，出了**问题也比较好定位**。

## 组件的 render 函数何时被调用

- 组件 state 发生改变时会调用 render 函数，比如通过 setState 函数改变组件自身的 state 值
- 继承的 props 属性发生改变时也会调用 render 函数，即使改变的前后值一样
- React 生命周期中有个 componentShouldUpdate 函数，默认返回 true，即允许 render 被调用，我们也可以重写这个函数，判断是否应该调用 render 函数

## 调用 render 时 DOM 就一定会被更新吗

不一定更新。

React 组件中存在两类 DOM，render 函数被调用后， React 会根据 props 或者 state 重新创建一棵 virtual DOM 树，虽然每一次调用都重新创建，但因为创建是发生在内存中，所以很快不影响性能。而 virtual dom 的更新并不意味着真实 DOM 的更新，React 采用 diff算法 将 virtual DOM 和真实 DOM 进行比较，找出需要更新的最小的部分，这时 Real DOM 才可能发生修改。

所以每次 state 的更改都会使得 render 函数被调用，但是页面DOM不一定发生修改。

## 不同父节点的组件需要对彼此的状态进行改变时应该怎么实现

- lifting state to parent of A and B
- 用 Flux/Redux 管理状态

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
import React, { Component } from 'react'
import fetchUser from 'twitter'
// fetchUser take in a username returns a promise which will resolve with that username's data.

class Twitter extends Component {
  // finish this
}
```

Take notice of what’s inside the opening and closing `<Twitter>` tags above. Instead of another component as you’ve probably seen before, the *Twitter* component’s child is a function. What this means is that in the implementation of the *Twitter* component, we’ll need to treat *props.children* as a function.

```javascript
import React, { Component } from 'react'
import fetchUser from 'twitter'

class Twitter extends Component {
  constructor(props){
    super(props)
    this.state = {
      user: null
    }
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

## Why would you use `React.Children.map(props.children, () => )` instead of `props.children.map(() => )`

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
