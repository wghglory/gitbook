# React 生命周期

![react component's life cycle events](http://i.imgur.com/3LkFtGd.png)

![lifecycle](http://images2017.cnblogs.com/blog/1106982/201708/1106982-20170811224737742-1564011484.jpg)

## 组件的生命周期

组件生命周期有三种阶段：初始化阶段（Mounting）、更新阶段（Updating）、析构阶段（Unmouting）。

**初始化阶段：**

- `constructor()`：初始化 state、绑定事件
- `componentWillMount()`：在 `render()` 之前执行，除了同构，跟 constructor 没啥差别
- `render()`：用于渲染 DOM。如果有操作 DOM 或和浏览器打交道的操作，最好在下一个步骤执行。
- `componentDidMount()`：在 `render()` 之后立即执行，可以在这个函数中对 DOM 就进行操作，可以加载服务器数据，可以使用 `setState()` 方法触发重新渲染

**组件更新阶段：**

- `componentWillReceiveProps(nextProps)`：在已挂载的组件接收到新 props 时触发，传进来的 props 没有变化也可能触发该函数，若需要实现 props 变化才执行操作的话需要自己手动判断
- `componentShouldUpdate(nextProps，nextState)`：默认返回 true，我们可以手动判断需不需要触发 render，若返回 false，就不触发下一步骤
- `componentWillUpdate()`：`componentShouldUpdate` 返回 true 时触发，在 render 之前，可以在里面进行操作 DOM
- `render()`：重渲染
- `componentDidUpdate()`：render 之后立即触发

组件卸载阶段：

- `componentWillUnmount()`：在组件销毁之前触发，可以处理一些清理操作，如无效的 timers 等

## 在哪些生命周期中可以修改组件的 state(setState)

- `componentDidMount` 和 `componentDidUpdate`
- constructor、componentWillMount 中 setState 会发生错误：setState 只能在 mounted 或 mounting 组件中执行
- componentWillUpdate 中 setState 会导致死循环

## In which lifecycle event do you make AJAX requests and why

AJAX requests should go in the **componentDidMount** lifecycle event.

- **Fiber**, the next implementation of React’s reconciliation algorithm, will have the ability to start and stop rendering as needed for performance benefits. One of the trade-offs of this is that **componentWillMount**, the other lifecycle event where it might make sense to make an AJAX request, will be “non-deterministic”. What this means is that React may start calling _componentWillMount_ at various times whenever it feels like it needs to. This would obviously be a bad formula for AJAX requests.
- You can’t guarantee the AJAX request won’t resolve before the component mounts. If it did, that would mean that you’d be trying to setState on an unmounted component, which not only won’t work, but React will yell at you for. Doing AJAX in componentDidMount will guarantee that there’s a component to update.

## What does _shouldComponentUpdate_ do and why is it important

Above we talked about reconciliation and what React does when setState is called. What **shouldComponentUpdate** does is it’s a lifecycle method that allows us to opt out of this reconciliation process for certain components (and their child components).

Why would we ever want to do this?

As mentioned above, “The end goal of reconciliation is to, in the most efficient way possible, update the UI based on new state.” If we know that a certain section of our UI isn’t going to change, there’s no reason to have React go through the trouble of trying to figure out if it should. By returning false from **shouldComponentUpdate**, React will assume that the current component, and all its child components, will stay the same as they currently are.

## Mounting Lifecycle

When a component gets mounted to the DOM or unmounted from it.

> 只能在 `componentDidMount` 中 发送异步请求、setState

The _mounting lifecycle_ consists of methods that are invoked when a component is mounted or unmounted. In other words, these methods allow you to **initially set up state, make API calls, start and stop timers, manipulate the rendered DOM, initialize third-party libraries, and more**.

The mounting lifecycle is slightly different depending upon whether you use ES6 class syntax or `React.createClass` to create components. When you use `createClass`, `getDefaultProps` is invoked first to obtain the component's properties. Next, `getInitialState` is invoked to initialize the state.

ES6 classes do not have these methods. Instead, default props are obtained and sent to the constructor as an argument. **The `constructor` is where the state is initialized**. Both ES6 class constructors and `getInitialState` have access to the properties and, if required, can use them to help define the initial state.

### componentWillMount

I don't think it's good to setState in `componentWillMount`

I don't believe the 3rd judgement. If the api is too fast and returns the data even before component get mounted, setState won't work, although this is unlikely to happen.

- Calling `setState` before the component has rendered will not kick off the updating lifecycle.
- Calling `setState` after the component has been rendered will kick off the updating lifecycle.
- Note: with new React, you cannot make API calls in `componentWillMount`

### componentDidMount, componentWillUnmount

- `componentDidMount` is invoked just after the component has rendered
- `componentWillUnmount` is invoked just before the component is unmounted.

1.  **`componentDidMount` is the only good place to make API requests**. This method is invoked after the component has rendered, so any `setState` calls from this method will kick off the updating lifecycle and re-render the component.

1.  `componentDidMount` is also a good place to **initialize any third-party JavaScript that requires a DOM**. For instance, you may want to incorporate a drag-and-drop library or a library that handles touch events. Typically, these libraries require a DOM before they can be initialized.

1.  To start **background processes like intervals or timers**. Any processes started in `componentDidMount` or `componentWillMount` can be cleaned up in **`componentWillUnmount`**. You don't want to leave background processes running when they are not needed.

## Updating Lifecycle

When a component receives new data and later.

The _updating lifecycle_ is a series of methods that are invoked ==when a component's state changes or when new properties are received from the parent.== This lifecycle can be used to incorporate JavaScript before the component updates or to interact with the DOM after the update. Additionally, **it can be used to improve the performance of an application because it gives you the ability to cancel unnecessary updates.**

The updating lifecycle kicks off every time `setState` is called. Calling `setState` within the updating lifecycle other than `componentWillReceiveProps` will cause an infinite recursive loop that results in a stack overflow error. Therefore, **`setState` can only be called in `componentWillReceiveProps`**, which allows the component to update state when its properties are updated.

### componentWillReceiveProps(nextProps)

Triggered when the component receives new props from its parent component. _This is the only method where `setState` can be called._

当组件传入的 props 发生变化时调用.例如：父组件状态改变，给子组件传入了新的 prop 值。用于组件 props 变化后，更新 state。

### shouldComponentUpdate(nextProps, nextState)

It's the update lifecycle's gatekeeper -- a predicate that can call off the update. This method can be used to ==improve performance== by only allowing necessary updates.

### componentWillUpdate(nextProps, nextState)

Invoked just before the component updates. Similar to `componentWillMount`, only it is invoked before each update occurs.

### componentDidUpdate(prevProps, prevState)

Invoked just after the update takes place, after the call to `render`. It is invoked after each update.

---

Parent.js

```jsx
import React, { Component } from 'react';
import Child from './Child';

export default class App extends Component {
  constructor(props) {
    super(props);
    console.log('Parent - constructor');

    this.state = {
      number: 100,
    };

    this.addHandler = this.addHandler.bind(this);
  }

  addHandler() {
    this.setState((prevState) => ({
      number: prevState.number + 1,
    }));
  }

  componentWillMount() {
    console.log('Parent - componentWillMount');
  }

  componentDidMount() {
    console.log('Parent - componentDidMount');
  }

  render() {
    console.log('Parent - render');

    return (
      <div>
        <button onClick={this.addHandler}>{this.state.number}</button>
        <Child number={this.state.number} />
      </div>
    );
  }

  shouldComponentUpdate(nextProps, nextState) {
    console.log('Parent - shouldComponentUpdate');
    return true;
  }

  componentWillReceiveProps(nextProps) {
    console.log('Parent - componentWillReceiveProps');
  }

  componentWillUpdate(nextProps, nextState) {
    console.log('Parent - componentWillUpdate');
  }

  componentDidUpdate(prevProps, prevState) {
    console.log('Parent - componentDidUpdate');
  }

  componentWillUnmount() {
    console.log('Parent - componentWillUnmount');
  }
}
```

Child.js

```jsx
import React, { Component } from 'react';

export default class Child extends Component {
  constructor(props) {
    super(props);
    console.warn('Child - constructor');
  }

  componentWillMount() {
    console.warn('Child - componentWillMount');
  }

  componentDidMount() {
    console.warn('Child - componentDidMount');
  }

  render() {
    console.warn('Child - render');

    return <div>Props from Parent: {this.props.number}</div>;
  }

  shouldComponentUpdate(nextProps, nextState) {
    console.warn('Child - shouldComponentUpdate');
    return true;
  }

  componentWillReceiveProps(nextProps) {
    console.warn('Child - componentWillReceiveProps');
  }

  componentWillUpdate(nextProps, nextState) {
    console.warn('Child - componentWillUpdate');
  }

  componentDidUpdate(prevProps, prevState) {
    console.warn('Child - componentDidUpdate');
  }

  componentWillUnmount() {
    console.warn('Child - componentWillUnmount');
  }
}
```

Initial load:

![initialLoad](http://om1o84p1p.bkt.clouddn.com/initialLoad.png)

点击 parent button：

![parentStateChange](http://om1o84p1p.bkt.clouddn.com/parentStateChange.png)
