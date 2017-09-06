## What is React?

We care only about the state, once state changes, UI will be automatically updated by React. State and UI are separated

a library for building user interfaces. **a React element is an object representation of a DOM node**. It’s important to note that a React element isn’t actually the thing you’ll see on your screen, instead, it’s just an object representation of it. 

There’s a few reasons for this. 

1. JavaScript objects are lightweight — React can create and destroy these elements without too much overhead. 
2. React is able to analyze the object, diff it with the previous object representation to see what changed, and then update the actual DOM only where those changes occurred. This has some performance upsides to it.

**virtual DOM is a JavaScript representation of the actual DOM. React can keep track of the difference between the current virtual DOM (computed after some data changes), with the previous virtual DOM (computed befores some data changes). React then isolates the changes between the old and new virtual DOM and then only updates the real DOM with the necessary changes. Because manipulating the actual DOM can be complex, React is able to minimize manipulations to the actual DOM by keeping track of a virtual DOM and only updating the real DOM when necessary and with only the necessary changes**. By re-rendering the virtual DOM every time any state change occurs, React makes it easier to think about what state your application is in.

> Signal to notify our app some data has changed -> Re-render virtual DOM -> Diff previous virtual DOM with new virtual DOM -> Only update real DOM with necessary changes.

## [React优化Optimization](https://facebook.github.io/react/docs/optimizing-performance.html)

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

##### 3. Avoid Reconciliation, use `shouldComponentUpdate` or `pureComponent` but don't mutate data

Why not mutating data? Because `shouldComponentUpdate` or `pureComponent` does a shallow comparison of old and new values, and mutating data will make old data become new data (old === new). Then UI won't change.
 
React builds and maintains an internal representation of the rendered UI. It includes the React elements you return from your components. This representation lets React avoid creating DOM nodes and accessing existing ones beyond necessity, as that can be slower than operations on JavaScript objects. Sometimes it is referred to as a "virtual DOM", but it works the same way on React Native.

When a component's props or state change, React decides whether an actual DOM update is necessary by comparing the newly returned element with the previously rendered one. When they are not equal, React will update the DOM.

In some cases, your component can speed all of this up by overriding the lifecycle function `shouldComponentUpdate`, which is triggered before the re-rendering process starts. The default implementation of this function returns true, leaving React to perform the update.

If you know that in some situations your component doesn't need to update, you can return false from `shouldComponentUpdate` instead, to skip the whole rendering process, including calling `render()` on this component and below.

###### 4. looping thru -- add `key`

比如我们现在有个listComponent，每个item是个component，总共有很多10万个吧。新增一条数据时，如果不用`shouldComponentUpdate`也没加`key`，react会重新渲染10万个和这个新加的数据，性能弱。调用这个方法，react知道只去渲染这个新数据

```javascript
//当下一次props和当前不同时，return true，告诉react去更新重新渲染。注意这里逻辑必须简介，不然可能比react自动渲染的逻辑还费时
shouldComponentUpdate(nextProps, nextState){
  return this.props.name !== nextProps.name
}
```

## When to Use Refs

* Managing focus, text selection, or media playback.
* Triggering imperative animations.
* Integrating with third-party DOM libraries.

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

## [React.PureComponent](https://facebook.github.io/react/docs/react-api.html#react.purecomponent)

`React.PureComponent` is exactly like [`React.Component`](https://facebook.github.io/react/docs/react-api.html#react.component) but implements [`shouldComponentUpdate()`](https://facebook.github.io/react/docs/react-component.html#shouldcomponentupdate)with a shallow prop and state comparison.

If your React component's `render()` function renders the same result given the same props and state, you can use `React.PureComponent` for a performance boost in some cases.

> Note
>
> `React.PureComponent`'s `shouldComponentUpdate()` only shallowly compares the objects. If these contain complex data structures, it may produce false-negatives for deeper differences. Only extend `PureComponent` when you expect to have simple props and state, or use [`forceUpdate()`](https://facebook.github.io/react/docs/react-component.html#forceupdate) when you know deep data structures have changed. Or, consider using [immutable objects](https://facebook.github.io/immutable-js/) to facilitate fast comparisons of nested data.
>
> Furthermore, `React.PureComponent`'s `shouldComponentUpdate()` skips prop updates for the whole component subtree. Make sure all the children components are also "pure".


## React Benefits

#### just JavaScript: 

js原生方法入each、map遍历集合，无需ngRepeat

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


