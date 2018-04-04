# Passing store

## Provider from `react-redux` ✅

React Redux is a library that contains some tools to help ease the complexity involved with implicitly passing the store via context. Redux does not require that you use this library. However, using React Redux reduces your code’s complexity and may help you build apps a bit faster.

`react-redux` supplies us with a component that we can use to set up our store in the context, the _provider_. We can wrap any React element with the provider and that element’s children will have access to the store via context.

Instead of setting up the store as a context variable in the `App` component, we can keep the `App` component stateless:

```javascript
import { Menu, NewColor, Colors } from './containers';

const App = () => (
  <div className="app">
    <Menu />
    <NewColor />
    <Colors />
  </div>
);

export default App;
```

The provider adds the store to the context and updates the `App` component when actions have been dispatched. The provider expects a single child component:

```javascript
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import App from './components/App';
import storeFactory from './store';

const store = storeFactory();

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('react-container'),
);
```

The provider requires that we pass the store as a property. It adds the store to the context so that it can be retrieved by any child of the `App` component. Simply using the provider can save us some time and simplify our code.

Once we’ve incorporated the provider, we can retrieve the store via context in child container components. However, React Redux provides us with another way to quickly create container components that work with the provider: the `connect` function.

## Explicitly Passing the Store

The first, and most logical, way to incorporate the store into your UI is to pass it down the component tree explicitly as a property. This approach is simple and works very well for smaller apps that only have a few nested components.

Let’s take a look at how we can incorporate the store into the color organizer. In the _./index.js_ file, we will render an `App` component and pass it the store:

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import storeFactory from './store';

const store = storeFactory();

const render = () =>
  ReactDOM.render(<App store={store} />, document.getElementById('react-container'));

store.subscribe(render);
render();
```

This is the _./index.js_ file. In this file, we create the store with the `storeFactory` and render the `App` component into the document. When the `App` is rendered the store is passed to it as a property. Every time the store changes, the `render` function will be invoked, which efficiently updates the UI with new state data.

Now that we have passed the store to the `App`, we have to continue to pass it down to the child components that need it:

```javascript
import AddColorForm from './AddColorForm';
import SortMenu from './SortMenu';
import ColorList from './ColorList';

const App = ({ store }) => (
  <div className="app">
    <SortMenu store={store} />
    <AddColorForm store={store} />
    <ColorList store={store} />
  </div>
);

export default App;
```

The `App` component is our root component. It captures the store from props and explicitly passes it down to its child components. The store is passed to the `SortMenu`, `AddColorForm`, and `ColorList` components as a property.

Now that we have passed the store from the `App`, we can use it inside the child components. Remember we can read state from the store with `store.getState`, and we can dispatch actions to the store with `store.dispatch`.

From the `AddColorForm` component, we can use the store to dispatch `ADD_COLOR` actions. When the user submits the form, we collect the color and the title from refs and use that data to create and dispatch a new `ADD_COLOR` action:

```javascript
import { PropTypes, Component } from 'react';
import { addColor } from '../actions';

const AddColorForm = ({ store }) => {
  let _title, _color;

  const submit = (e) => {
    e.preventDefault();
    store.dispatch(addColor(_title.value, _color.value));
    _title.value = '';
    _color.value = '#000000';
    _title.focus();
  };

  return (
    <form className="add-color" onSubmit={submit}>
      <input ref={(input) => (_title = input)} type="text" placeholder="color title..." required />
      <input ref={(input) => (_color = input)} type="color" required />
      <button>ADD</button>
    </form>
  );
};

AddColorForm.propTypes = {
  store: PropTypes.object,
};

export default AddColorForm;
```

From this component, we import the necessary action creator, `addColor`. When the user submits the form, we’ll dispatch a new `ADD_COLOR` action directly to the store using this action creator.

The `ColorList` component can use the store’s `getState` method to obtain the original colors and sort them appropriately. It can also dispatch `RATE_COLOR` and `REMOVE_COLOR` actions directly as they occur:

```javascript
import { PropTypes } from 'react';
import Color from './Color';
import { rateColor, removeColor } from '../actions';
import { sortFunction } from '../lib/array-helpers';

const ColorList = ({ store }) => {
  const { colors, sort } = store.getState();
  const sortedColors = [...colors].sort(sortFunction(sort));
  return (
    <div className="color-list">
      {colors.length === 0 ? (
        <p>No Colors Listed. (Add a Color)</p>
      ) : (
        sortedColors.map((color) => (
          <Color
            key={color.id}
            {...color}
            onRate={(rating) => store.dispatch(rateColor(color.id, rating))}
            onRemove={() => store.dispatch(removeColor(color.id))}
          />
        ))
      )}
    </div>
  );
};

ColorList.propTypes = {
  store: PropTypes.object,
};

export default ColorList;
```

The store has been passed all the way down the component tree to the `ColorList` component. This component interacts with the store directly. When colors are rated or removed, those actions are dispatched to the store.

The store is also used to obtain the original colors. Those colors are duplicated and sorted according to the store’s `sort` property and saved as `sortedColors`. `sortedColors` is then used to create the UI.

This approach is great if your component tree is rather small, like this color organizer. The drawback of using this approach is that we have to explicitly pass the store to child components, which means slightly more code and slightly more headaches than with other approaches. Additionally, the `SortMenu`, `AddColorForm`, and `ColorList` components require this specific store. It would be hard to reuse them in another application.

## Passing the Store via Context

In the last section, we created a store and passed it all the way down the component tree from the `App` component to the `ColorList` component. This approach required that we pass the store through every component that comes between the `App` and the `ColorList`.

Let’s say we have some cargo to move from Washington, DC, to San Francisco, CA. We could use a train, but that would require that we lay tracks through at least nine states so that our cargo can travel to California. This is like explicitly passing the store down the component tree from the root to the leaves. You have to “lay tracks” through every component that comes between the origin and the destination. If using a train is like explicitly passing the store through props, then implicitly passing the store via context is like using a jet airliner. When a jet flies from DC to San Francisco, it flies over at least nine states—no tracks required.

Similarly, we can take advantage of a React feature called _context_ that allows us to pass variables to components without having to explicitly pass them down through the tree as properties.[1](https://www.safaribooksonline.com/library/view/learning-react-1st/9781491954614/ch09.html#idm140391583665072) Any child component can access these context variables.

If we were to pass the store using context in our color organizer app, the first step would be to refactor the `App` component to hold context. The `App` component will also need to listen to the store so that it can trigger a UI update every time the state changes:

```javascript
import { PropTypes, Component } from 'react';
import SortMenu from './SortMenu';
import ColorList from './ColorList';
import AddColorForm from './AddColorForm';
import { sortFunction } from '../lib/array-helpers';

class App extends Component {
  getChildContext() {
    return {
      store: this.props.store,
    };
  }

  componentWillMount() {
    this.unsubscribe = store.subscribe(() => this.forceUpdate());
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    const { colors, sort } = store.getState();
    const sortedColors = [...colors].sort(sortFunction(sort));
    return (
      <div className="app">
        <SortMenu />
        <AddColorForm />
        <ColorList colors={sortedColors} />
      </div>
    );
  }
}

App.propTypes = {
  store: PropTypes.object.isRequired,
};

App.childContextTypes = {
  store: PropTypes.object.isRequired,
};

export default App;
```

First, adding context to a component requires that you use the `getChildContext` lifecycle function. It will return the object that defines the context. In this case, we add the store to the context, which we can access through props.

Next, you will need to specify `childContextTypes` on the component instance and define your context object. This is similar to adding `propTypes` or `defaultProps` to a component instance. However, for context to work, you must take this step.

At this point, any children of the `App` component will have access to the store via the context. They can invoke `store.getState` and `store.dispatch` directly. The final step is to subscribe to the store and update the component tree every time the store updates state. This can be achieved with the mounting lifecycle functions (see [“Mounting Lifecycle”](https://www.safaribooksonline.com/library/view/learning-react-1st/9781491954614/ch07.html#mounting_lifecycle)). In `componentWillMount`, we can subscribe to the store and use `this.forceUpdate` to trigger the updating lifecycle, which will re-render our UI. In `componentWillUnmount`, we can invoke the `unsubscribe` function and stop listening to the store. Because the `App` component itself triggers the UI update, there is no longer a need to subscribe to the store from the entry _./index.js_ file; we are listening to store changes from the same component that adds the store to the context, `App`.

Let’s refactor the `AddColorForm` component to retrieve the store and dispatch the `ADD_COLOR` action directly:

```javascript
const AddColorForm = (props, { store }) => {
  let _title, _color;

  const submit = (e) => {
    e.preventDefault();
    store.dispatch(addColor(_title.value, _color.value));
    _title.value = '';
    _color.value = '#000000';
    _title.focus();
  };

  return (
    <form className="add-color" onSubmit={submit}>
      <input ref={(input) => (_title = input)} type="text" placeholder="color title..." required />
      <input ref={(input) => (_color = input)} type="color" required />
      <button>ADD</button>
    </form>
  );
};

AddColorForm.contextTypes = {
  store: PropTypes.object,
};
```

The context object is passed to stateless functional components as the second argument, after props. We can use object destructuring to obtain the store from this object directly in the arguments. In order to use the store, we must define `contextTypes` on the `AddColorForm` instance. This is where we tell React which context variables this component will use. This is a required step. Without it, the store cannot be retrieved from the context.

Let’s take a look at how to use context in a component class. The `Color` component can retrieve the store and dispatch `RATE_COLOR` and `REMOVE_COLOR` actions directly:

```javascript
import { PropTypes, Component } from 'react';
import StarRating from './StarRating';
import TimeAgo from './TimeAgo';
import FaTrash from 'react-icons/lib/fa/trash-o';
import { rateColor, removeColor } from '../actions';

class Color extends Component {
  render() {
    const { id, title, color, rating, timestamp } = this.props;
    const { store } = this.context;
    return (
      <section className="color" style={this.style}>
        <h1 ref="title">{title}</h1>
        <button onClick={() => store.dispatch(removeColor(id))}>
          <FaTrash />
        </button>
        <div className="color" style={{ backgroundColor: color }} />
        <TimeAgo timestamp={timestamp} />
        <div>
          <StarRating
            starsSelected={rating}
            onRate={(rating) => store.dispatch(rateColor(id, rating))}
          />
        </div>
      </section>
    );
  }
}

Color.contextTypes = {
  store: PropTypes.object,
};

Color.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  rating: PropTypes.number,
};

Color.defaultProps = {
  rating: 0,
};

export default Color;
```

`ColorList` is now a component class, and can access context via `this.context`. Colors are now read directly from the store via `store.getState`. The same rules apply that do for stateless functional components. `contextTypes` must be defined on the instance.

Retrieving the store from the context is a nice way to reduce your boilerplate, but this is not something that is required for every application. Dan Abramov, the creator of Redux, even suggests that these patterns do not need to be religiously followed.
