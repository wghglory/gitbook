# react interview

## Describe how events are handled in React. 事件在 React 中的处理方式

**In order to solve cross browser compatibility issues, your event handlers in React will be passed instances of _SyntheticEvent_**, which is React’s cross-browser wrapper around the browser’s native event. These synthetic events have the same interface as native events you’re used to, except they work identically across all browsers.

What’s mildly interesting is that React doesn’t actually attach events to the child nodes themselves. React will listen to all events at the top level using a single event listener. This is good for performance and it also means that React doesn’t need to worry about keeping track of event listeners when updating the DOM.

在 React 底层，主要对合成事件做了两件事：事件委托和自动绑定。

事件委托：React 的事件代理机制不会把事件处理函数直接绑定到真实的结点上，而是把所有事件绑定到结构的最外层，使用统一的事件监听器，这个事件监听器上维持了一个映射来保存所有组件内部的事件监听和处理函数。当事件发生时，首先被这个统一的事件监听器处理，然后在映射里找到真正的事件处理函数并调用。

自动绑定：在 React 组件中，每个方法的上下文都会指向该组件的实例，即自动绑定 this 为当前组件。在使用 ES6 class 和纯函数时，这种自动绑定就不存在了，需要我们手动绑定 this.bind() 方法、双冒号语法、构造器内声明、箭头函数。用 bind 写在 constructor 里面最好。直接写在 jsx 中在 re-render 会有重新绑定的问题。

## 组件的 render 函数何时被调用

- 组件 state 发生改变时会调用 render 函数，比如通过 setState 函数改变组件自身的 state 值
- 继承的 props 属性发生改变时也会调用 render 函数，即使改变的前后值一样
- React 生命周期中有个 componentShouldUpdate 函数，默认返回 true，即允许 render 被调用，我们也可以重写这个函数，判断是否应该调用 render 函数

## 调用 render 时 DOM 就一定会被更新吗

不一定更新。

React 组件中存在两类 DOM，render 函数被调用后， React 会根据 props 或者 state 重新创建一棵 virtual DOM 树，虽然每一次调用都重新创建，但因为创建是发生在内存中，所以很快不影响性能。而 virtual dom 的更新并不意味着真实 DOM 的更新，React 采用 diff 算法 将 virtual DOM 和真实 DOM 进行比较，找出需要更新的最小的部分，这时 Real DOM 才可能发生修改。

所以每次 state 的更改都会使得 render 函数被调用，但是页面 DOM 不一定发生修改。

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
<Twitter username="tylermcginnis33">
  {(user) => (user === null ? <Loading /> : <Badge info={user} />)}
</Twitter>
```

```javascript
import React, { Component } from 'react';
import fetchUser from 'twitter';
// fetchUser take in a username returns a promise which will resolve with that username's data.

class Twitter extends Component {
  // finish this
}
```

Take notice of what’s inside the opening and closing `<Twitter>` tags above. Instead of another component as you’ve probably seen before, the _Twitter_ component’s child is a function. What this means is that in the implementation of the _Twitter_ component, we’ll need to treat _props.children_ as a function.

```javascript
import React, { Component } from 'react';
import fetchUser from 'twitter';

class Twitter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
    };
  }

  componentDidMount() {
    fetchUser(this.props.username).then((user) => this.setState({ user }));
  }
  render() {
    return this.props.children(this.state.user);
  }
}
```

Notice that, just as I mentioned above, I treat _props.children_ as a function by invoking it and passing it the user.

What’s great about this pattern is that we’ve decoupled our parent component from our child component. The parent component manages the state and the consumer of the parent component can decide in which way they’d like to apply the arguments they receive from the parent to their UI.

To demonstrate this, let’s say in another file we want to render a _Profile_ instead of a _Badge_, because we’re using the render callback pattern, we can easily swap around the UI without changing our implementation of the parent (_Twitter_) component.

```javascript
<Twitter username="tylermcginnis33">
  {(user) => (user === null ? <Loading /> : <Profile info={user} />)}
</Twitter>
```

## Why would you use `React.Children.map(props.children, () => )` instead of `props.children.map(() => )`

It’s not guaranteed that _props.children_ will be an array.

Take this code for example:

```javascriptx
<Parent>
  <h1>Welcome.</h1>
</Parent>
```

Inside of Parent if we were to try to map over children using `props.children.map` it would throw an error because `props.children` is an object, not an array.

React only makes `props.children` an array if there are more than one child elements, like this:

```javascriptx
<Parent>
  <h1>Welcome.</h1>
  <h2>props.children will now be an array</h2>
</Parent>
```

This is why you want to favor `React.Children.map` because its implementation takes into account that _props.children_ may be an array or an object.

## What is the difference between _createElement_ and _cloneElement_

_createElement_ is what JSX gets transpiled to and is what React uses to create React Elements (object representations of some UI). _cloneElement_ is used in order to clone an element and pass it new props. They nailed the naming on these two 🙂.

## What is the second argument that can optionally be passed to _setState_ and what is its purpose

A callback function which will be invoked when setState has finished and the component is re-rendered.

setState is asynchronous, which is why it takes in a second callback function. Typically it’s best to use another lifecycle method rather than relying on this callback function, but it’s good to know it exists.

```javascript
this.setState({ username: 'tylermcginnis33' }, () =>
  console.log('setState has finished and the component has re-rendered.'),
);
```

## What is wrong with this code

```javascript
this.setState((prevState, props) => {
  return {
    streak: prevState.streak + props.count,
  };
});
```

Nothing is wrong with it 🙂. It’s rarely used and not well known, but you can also pass a function to **setState** that receives the previous state and props and returns a new state, just as we’re doing above. And not only is nothing wrong with it, but it’s also actively recommended if you’re setting state based on previous state.

## What is the difference between a _controlled_ component and an _uncontrolled_ component

- Controlled Component
  - The controlled way is when we bind the value of the input field to the state of that component
  - So when the user types in the value, the state updates and then changes the value of the input field
  - We can see the state change in real time as the user types in the React developer tool
  - React docs typically recommend that we deal with forms
  - This is called a controlled component because React is controlling the value of the specific input field
- Uncontrolled Component (using ref)
  - The uncontrolled way is a little more traditional, where the user fills the input field
  - and the state doesn’t change till he presses submit (or a similar event)

A large part of React is this idea of having components control and manage their own state.

What happens when we throw native HTML form elements (input, select, textarea, etc) into the mix? Should we have React be the “single source of truth” like we’re used to doing with React? Or should we allow that form data to live in the DOM like we’re used to typically doing with HTML form elements? These questions are at the heart of controlled vs uncontrolled components.

A **controlled** component is a component where React is in _control_ and is the single source of truth for the form data. As you can see below, _username_ doesn’t live in the DOM but instead lives in our component state. Whenever we want to update _username_, we call _setState_ as we’re used to.

```javascript
class ControlledForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
    };
  }
  updateUsername = (e) => {
    this.setState({
      username: e.target.value,
    });
  };
  handleSubmit = () => {};
  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input type="text" value={this.state.username} onChange={this.updateUsername} />
        <button type="submit">Submit</button>
      </form>
    );
  }
}
```

An **uncontrolled** component is where your form data is handled by the DOM, instead of inside your React component.

You use _ref_ to accomplish this.

```javascript
class UnControlledForm extends Component {
  handleSubmit = () => {
    console.log('Input Value: ', this.input.value);
  };
  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input type="text" ref={(input) => (this.input = input)} />
        <button type="submit">Submit</button>
      </form>
    );
  }
}
```

Though uncontrolled components are typically easier to implement since you just grab the value from the DOM using ref, it’s typically recommended that you favor controlled components over uncontrolled components. The main reasons for this are that **controlled components support instant field validation, allow you to conditionally disable/enable buttons, enforce input formats**, and are more “the React way”.

尽量用 controlled form。

## When to Use ref/uncontrolled components

- Managing focus, text selection, or media playback.
- Triggering imperative animations.
- Integrating with third-party DOM libraries.

Avoid using refs for anything that can be done declaratively. For example, instead of exposing `open()` and `close()` methods on a Dialog component, pass an `isOpen` prop to it.

## [Exposing DOM Refs to Parent Components](https://facebook.github.io/react/docs/refs-and-the-dom.html#when-to-use-refs)

In rare cases, you might want to have access to a child's DOM node from a parent component. This is generally not recommended because it breaks component encapsulation, but it can occasionally be useful for triggering focus or measuring the size or position of a child DOM node.

In such cases we recommend exposing a special prop on the child. The child would take a function prop with an arbitrary name (e.g. inputRef) and attach it to the DOM node as a ref attribute. This lets the parent pass its ref callback to the child's DOM node through the component in the middle.

This works both for classes and for functional components.

```javascript
function CustomTextInput(props) {
  return (
    <div>
      <input ref={props.inputRef} />
    </div>
  );
}

class Parent extends React.Component {
  render() {
    return <CustomTextInput inputRef={(el) => (this.inputElement = el)} />;
  }
}
```

> In the example above, Parent passes its ref callback as an inputRef prop to the CustomTextInput, and the CustomTextInput passes the same function as a special `ref` attribute to the `<input>`. As a result, `this.inputElement` in Parent will be set to the DOM node corresponding to the `<input>` element in the CustomTextInput.
>
> Note that the name of the inputRef prop in the above example has no special meaning, as it is a regular component prop. However, using the ref attribute on the `<input>` itself is important, as it tells React to attach a `ref` to its DOM node.

## [React.PureComponent](https://facebook.github.io/react/docs/react-api.html#react.Purecomponent)

`React.PureComponent` is exactly like `React.Component` but implements `shouldComponentUpdate()` with a shallow prop and state comparison.

If your React component's `render()` function renders the same result given the same props and state, you can use `React.PureComponent` for a performance boost in some cases.

> Note
>
> `React.PureComponent`'s `shouldComponentUpdate()` only shallowly compares the objects. If these contain complex data structures, it may produce false-negatives for deeper differences. Only extend `PureComponent` when you expect to have simple props and state, or use [`forceUpdate()`](https://facebook.github.io/react/docs/react-component.html#forceupdate) when you know deep data structures have changed. Or, consider using [immutable objects](https://facebook.github.io/immutable-js/) to facilitate fast comparisons of nested data.
>
> Furthermore, `React.PureComponent`'s `shouldComponentUpdate()` skips prop updates for the whole component subtree. Make sure all the children components are also "pure".

## Setting up first React component with npm, webpack and babel

A React Component may be composed of the following:

- ui
- internal data
- lifecycle event

Every component is supposed to have a `render` method. The reason is that the `render` method returns the template for that component and it is necessary for a component to have a UI.

We need to tell ReactDOM to which element the components should be rendered to. You usually have to use `ReactDOM.render` only once in your applications because rendering the most parent element will render all the children as well.

**JSX is converted to `React.createElement` methods** which describes what you see on the screen (notice only describes, doesn’t mean that it is what we see). `React.createElement` **returns an object representation of the DOM node. It is also called virtual DOM node.**

React interprets JSX and transforms it into lightweight javascript objects which are used to create a virtual DOM. Changes in the virtual dom are tracked on only the necessary updates are rendered to the DOM.

`React.createElement` takes 3 arguments:

- element type: `div`, `span`, component
- properties object
- children (multiple)

When React encounters a component in any of the above arguments, it replaces that with what the components `React.createElement` returns. Hence when rendering the most parent component using ReactDOM, the entire virtual DOM is created.

This invocation of `React.createElement` to create a virtual DOM node only happens while using `ReactDOM.render` and while changing state using `setState`.

The process looks something like this,

**Signal to notify our app some data has changed -> re-render virtual dom -> diff previous virtual dom with new virtual dom -> only update real dom with necessary changes.** This gives react performance ups.

## this.props.children

`props.children` is whatever is between the `<Opening>` and closing `</Opening>` blocks of a component.
