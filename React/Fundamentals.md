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

---

* __React Router__
  * A component that allows us to map a url path to a component
  * Within the Router we declare the routes to be rendered
  * Each route has a path property and a component property that allows us to map a path to a component
* __Axios__
  * Api used to send HTTP requests to different apis

## Setting up first React component with npm, webpack and babel

A React Component may be composed of the following:

* ui
* internal data
* lifecycle event

Every component is supposed to have a `render` method. The reason is that the `render` method returns the template for that component and it is necessary for a component to have a ui.

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

## Stateless Functional Components

__It is a great idea to separate container components from presentational components in React.__

Another advantage of using stateless functional components is that we don't need to consider `this`

## React Router v4

* `BrowserRouter` as Router - is the component between which all the routes are nested. Our most parent component.
* `Route` - the component that helps specify views for each component, has many small nuances one needs to be aware of
* `Link` - just a link with prop to.
* `NavLink` - has `activeClassName` prop, to apply a css class when active
* `Switch` - used to make sure only one of the Routes is active at any moment (useful for showing a route without a path for paths that are not handled aka 404)
  * instead of rendering all of the routes that are active, switch is gonna let only 1 route be active at a time

__*Route*__

* `path` - prop takes string for the url path at which component should be active in the view
  * Note: if a route has `path='/first'`, it’s component will be active for all paths that start with `/first`
  * to avoid the above, we need to prepend prop path with keyword exact
* `component` - takes a javascript expression referring to the component that one wants to link to the path
* `render` - this prop is useful when you don’t want to link the route to a component, but instead specify the JSX right there. This prop takes a value of a function that returns the JSX you wish this route to return. This is used mostly for the 404 pages I’m assuming, in a route that’s the last child of the switch component (and has no path prop value obviously).
* `exact` - prop makes sure the route is rendered/active only when the path matches exactly and not just partly

__*Link*__

This component is the basic anchor tag in react, except obviously it knows what component it originates in.

* `to` - prop takes the path to route to when the user clicks the link

__*NavLink*__

Composed of the component Link, except with additional functionality to make Links active when their path matches the current path.

* `activeClassName` - is the class that is applied to the NavLink component when the current path matches with the link’s path
* `exact` - this prop makes sure the activeClassName is applied only when the path has an exact match with the link’s path (not just partly, similar to the exact prop in routes)

__*Query Params*__

The `to` prop of the `Link` component of React Router accepts url path strings or an object with props:
* pathname: which takes a string for the link’s path
* search: takes a string beginning with ‘?’ for query params followed by the query param name value string

React Router’s Route component passes a few props to the component it’s linked with. One of the prop is `match` which is an object with a property `url` which contains the current url’s path. The `to` value of a `Link` that routes to a sub-path of the current url should be composed of the `this.props.match.url` property, so that the path can be changed later without affecting the link.

## Forms

* Controlled Component
  * The controlled way is when we bind the value of the input field to the state of that component
  * So when the user types in the value, the state updates and then changes the value of the input field
  * We can see the state change in real time as the user types in the React developer tool
  * React docs typically recommend that we deal with forms
  * This is called a controlled component because React is controlling the value of the specific input field
* Uncontrolled Component
  * The uncontrolled way is a little more traditional, where the user fills the input field
  * and the state doesn’t change till he presses submit (or a similar event)

## this.props.children

`props.children` is whatever is between the `<Opening>` and closing `</Opening>` blocks of a component.
