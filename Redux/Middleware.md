# Middleware

Redux also has middleware. It acts on the store’s dispatch pipeline. In Redux, middleware consists of a series of functions that are executed in a row in the process of dispatching an action.

<img src="http://om1o84p1p.bkt.clouddn.com//C683AC2999017296E2A5267125CBD739.png" width="640" height="807" />

###### Figure 8-7. HTTP request middleware pipeline

These higher-order functions allow you to insert functionality before or after actions are dispatched and state is updated. Each middleware function is executed sequentially.

Each piece of middleware is a function that has access to the action, a `dispatch` function, and a function that will call `next`. `next` causes the update to occur. Before `next` is called, you can modify the action. After `next`, the state will have changed.

<img src="http://om1o84p1p.bkt.clouddn.com//B42F48B61B8701EB55F29BB28DC0AE5D.png" width="903" height="981" />

###### Figure 8-8. Middleware functions execute sequentially

## Applying Middleware to the Store

In this section, we are going to create a `storeFactory`. A _factory_ is a function that manages the process of creating stores. In this case, the factory will create a store that has middleware for logging and saving data. The `storeFactory` will be one file that contains one function that groups everything needed to create the store. Whenever we need a store, we can invoke this function:

```Javascript
const store = storeFactory(initialData)
```

When we create the store, we create two pieces of middleware: the _logger_ and the _saver_ ([Example 8-9](https://www.safaribooksonline.com//library/view/learning-react-1st/9781491954614/ch08.html#example0809)). The data is saved to `localStorage` with middleware instead of the `store` method.

##### Example 8-9. storeFactory: ./store/index.js

```Javascript
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { colors, sort } from './reducers';
import stateData from './initialState';

const logger = (store) => (next) => (action) => {
  let result;
  console.groupCollapsed('dispatching', action.type);
  console.log('prev state', store.getState());
  console.log('action', action);
  result = next(action);
  console.log('next state', store.getState());
  console.groupEnd();
};

const saver = (store) => (next) => (action) => {
  let result = next(action);
  localStorage['redux-store'] = JSON.stringify(store.getState());
  return result;
};

const storeFactory = (initialState = stateData) =>
  applyMiddleware(logger, saver)(createStore)(
    combineReducers({ colors, sort }),
    localStorage['redux-store'] ? JSON.parse(localStorage['redux-store']) : stateData
  );

export default storeFactory;
```

Both the logger and the saver are middleware functions. In Redux, middleware is defined as a higher-order function: it’s a function that returns a function that returns a function. The last function returned is invoked every time an action is dispatched. When this function is invoked, you have access to the action, the store, and the function for sending the action to the next middleware.

Instead of exporting the store directly, we export a function, a factory that can be used to create stores. If this factory is invoked, then it will create and return a store that incorporates logging and saving.

In the logger, before the action is dispatched, we open a new console group and log the current state and the current action. Invoking `next` pipes the action on to the next piece of middleware and eventually the reducers. The state at this point has been updated, so we log the changed state and end the console group.

In the saver, we invoke `next` with the action, which will cause the state to change. Then we save the new state in `localStorage` and return the result, as in [Example 8-9](https://www.safaribooksonline.com//library/view/learning-react-1st/9781491954614/ch08.html#example0809).

In [Example 8-10](https://www.safaribooksonline.com//library/view/learning-react-1st/9781491954614/ch08.html#example0810) we create a store instance using the `storeFactory`. Since we do not send any arguments to this store, the initial state will come from state data.

##### Example 8-10. Creating a store using the factory

```Javascript
import storeFactory from "./store"

const store = storeFactory(true)

store.dispatch( addColor("#FFFFFF","Bright White") )
store.dispatch( addColor("#00FF00","Lawn") )
store.dispatch( addColor("#0000FF","Big Blue") )
```

Every action dispatched from this store will add a new group of logs to the console, and the new state will be saved in `localStorage`.
