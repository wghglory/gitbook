# Mounting Lifecycle

The *mounting lifecycle* consists of methods that are invoked when a component is mounted or unmounted. In other words, these methods allow you to **initially set up state, make API calls, start and stop timers, manipulate the rendered DOM, initialize third-party libraries, and more**. 

The mounting lifecycle is slightly different depending upon whether you use ES6 class syntax or `React.createClass` to create components. When you use `createClass`, `getDefaultProps` is invoked first to obtain the component’s properties. Next, `getInitialState` is invoked to initialize the state.

ES6 classes do not have these methods. Instead, default props are obtained and sent to the constructor as an argument. **The `constructor` is where the state is initialized**. Both ES6 class constructors and `getInitialState` have access to the properties and, if required, can use them to help define the initial state.

#### SetState in ComponentWillMount

- Calling `setState` before the component has rendered will not kick off the updating lifecycle. 
- Calling `setState` after the component has been rendered will kick off the updating lifecycle. 
- If you call `setState`inside an asynchronous callback defined within the `componentWillMount` method, it will be invoked after the component has rendered and will trigger the updating lifecycle.

#### componentDidMount, componentWillMount, componentWillUnmount

- `componentDidMount` is invoked just after the component has rendered
- `componentWillUnmount` is invoked just before the component is unmounted.

1. **`componentDidMount` is another good place to make API requests**. This method is invoked after the component has rendered, so any `setState` calls from this method will kick off the updating lifecycle and re-render the component.

1. `componentDidMount` is also a good place to **initialize any third-party JavaScript that requires a DOM**. For instance, you may want to incorporate a drag-and-drop library or a library that handles touch events. Typically, these libraries require a DOM before they can be initialized.

1. To start **background processes like intervals or timers**. Any processes started in `componentDidMount` or `componentWillMount` can be cleaned up in **`componentWillUnmount`**. You don’t want to leave background processes running when they are not needed.

# Updating Lifecycle

The *updating lifecycle* is a series of methods that are invoked ==when a component’s state changes or when new properties are received from the parent.== This lifecycle can be used to incorporate JavaScript before the component updates or to interact with the DOM after the update. Additionally, **it can be used to improve the performance of an application because it gives you the ability to cancel unnecessary updates.**

The updating lifecycle kicks off every time `setState` is called. Calling `setState` within the updating lifecycle will cause an infinite recursive loop that results in a stack overflow error. Therefore, **`setState` can only be called in `componentWillReceiveProps`**, which allows the component to update state when its properties are updated.

#### componentWillReceiveProps(nextProps)

Only invoked if new properties have been passed to the component. *This is the only method where `setState` can be called.*

#### shouldComponentUpdate(nextProps, nextState)

The update lifecycle’s gatekeeper—a predicate that can call off the update. This method can be used to ==improve performance== by only allowing necessary updates.

#### componentWillUpdate(nextProps, nextState)

Invoked just before the component updates. Similar to `componentWillMount`, only it is invoked before each update occurs.

#### componentDidUpdate(prevProps, prevState)

Invoked just after the update takes place, after the call to `render`. It is invoked after each update.



