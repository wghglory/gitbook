# React Fundamentals

## 思想

* __Composition__
  * React 是 MVC's V。组件包含了虚拟 DOM 来展示 UI
  * Components can be used to compose other components much like functional composition
  * Well defined components can be used between different projects
* __Declarative__
  * A declarative solution focusses on the WHAT rather than the HOW of the problem and uses the api that abstracts the how to do so.
* __Unidirectional Dataflow__
  * In react the state is stored in a component as opposed to the DOM (which is how it is with JQuery)
  * Hence the state is explicitly changed and that causes the DOM to re-render
  * The data flows from the state to the DOM and not the other way around
  * parent components pass data to children components with the help of props
* __Explicit Mutations__
  * Changing the state has to be done explicitly in React
  * Since changing the state of a component with `this.setState` renders it to the DOM
  * there is no need of adding event listeners or dirty checking
* __Just JavaScript__
    * React takes advantage of the JavaScript programming language’s functionality, api and capabilities (also functional style)

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

1. JavaScript objects are lightweight — React can create and destroy these elements without too much overhead.
1. React is able to analyze the object, diff it with the previous object representation to see what changed, and then update the actual DOM only where those changes occurred. This has some performance upsides to it.

**virtual DOM is a JavaScript representation of the actual DOM. React can keep track of the difference between the current virtual DOM (computed after some data changes), with the previous virtual DOM (computed before some data changes). React then isolates the changes between the old and new virtual DOM and then only updates the real DOM with the necessary changes. Because manipulating the actual DOM can be complex, React is able to minimize manipulations to the actual DOM by keeping track of a virtual DOM and only updating the real DOM when necessary and with only the necessary changes**. By re-rendering the virtual DOM every time any state change occurs, React makes it easier to think about what state your application is in.

> Signal to notify our app some data has changed -> Re-render virtual DOM -> Diff previous virtual DOM with new virtual DOM -> Only update real DOM with necessary changes.

## [React 优化 Optimization](https://facebook.github.io/react/docs/optimizing-performance.html)

##### 1. Use the Production Build

默认情况下，React 将会在开发模式，很缓慢，不建议用于生产。要在生产模式下使用 React，设置环境变量 NODE_ENV 为 production （使用 webpack's DefinePlugin）。例如：

```javascript
new webpack.DefinePlugin({
  "process.env": {
    NODE_ENV: JSON.stringify("production")
  }
});
```

##### 2. Profiling Components with the Chrome Performance Tab

##### 3. Avoid Reconciliation, use `shouldComponentUpdate` or `PureComponent` but don't mutate data

In some cases, your component can speed all of this up by overriding the lifecycle function `shouldComponentUpdate`, which is triggered before the re-rendering process starts. The default implementation of this function returns true, leaving React to perform the update.

If you know that in some situations your component doesn't need to update, you can return false from `shouldComponentUpdate` instead, to skip the whole rendering process, including calling `render()` on this component and below.

###### 4. looping thru -- add `key`

比如我们现在有个 listComponent，每个 item 是个 component，总共有很多10万个吧。新增一条数据时，如果不用`shouldComponentUpdate` 也没加 `key`，react 会重新渲染10万个和这个新加的数据，性能弱。

```javascript
//当下一次 props 和当前不同时，return true，告诉react去更新重新渲染。注意这里逻辑必须简洁，不然可能比react自动渲染的逻辑还费时
shouldComponentUpdate(nextProps, nextState){
  return this.props.name !== nextProps.name
}
```

## When to Use ref

* Managing focus, text selection, or media playback.
* Triggering imperative animations.
* Integrating with third-party DOM libraries.

Avoid using refs for anything that can be done declaratively. For example, instead of exposing `open()` and `close()` methods on a Dialog component, pass an `isOpen` prop to it.

## Forms

* Controlled Component
  * The controlled way is when we bind the value of the input field to the state of that component
  * So when the user types in the value, the state updates and then changes the value of the input field
  * We can see the state change in real time as the user types in the React developer tool
  * React docs typically recommend that we deal with forms
  * This is called a controlled component because React is controlling the value of the specific input field
* Uncontrolled Component (using ref)
  * The uncontrolled way is a little more traditional, where the user fills the input field
  * and the state doesn’t change till he presses submit (or a similar event)

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
    return (
      <CustomTextInput
        inputRef={el => this.inputElement = el}
      />
    );
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

* ui
* internal data
* lifecycle event

Every component is supposed to have a `render` method. The reason is that the `render` method returns the template for that component and it is necessary for a component to have a UI.

We need to tell ReactDOM to which element the components should be rendered to. You usually have to use `ReactDOM.render` only once in your applications because rendering the most parent element will render all the children as well.

**JSX is converted to `React.createElement` methods** which describes what you see on the screen (notice only describes, doesn’t mean that it is what we see). `React.createElement` **returns an object representation of the DOM node. It is also called virtual DOM node.**

React interprets JSX and transforms it into lightweight javascript objects which are used to create a virtual DOM. Changes in the virtual dom are tracked on only the necessary updates are rendered to the DOM.

`React.createElement` takes 3 arguments:

* element type: `div`, `span`, component
* properties object
* children (multiple)

When React encounters a component in any of the above arguments, it replaces that with what the components `React.createElement` returns. Hence when rendering the most parent component using ReactDOM, the entire virtual DOM is created.

This invocation of `React.createElement` to create a virtual DOM node only happens while using `ReactDOM.render` and while changing state using `setState`.

The process looks something like this,

**Signal to notify our app some data has changed -> re-render virtual dom -> diff previous virtual dom with new virtual dom -> only update real dom with necessary changes.** This gives react performance ups.

## this.props.children

`props.children` is whatever is between the `<Opening>` and closing `</Opening>` blocks of a component.
