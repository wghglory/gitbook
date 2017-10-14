# Redux

"Where do I put all my state and logic?" -- Flux, Redux...

### How Redux works:

1. **Components** are given callback functions as props, which they call when a UI event happens
2. Those callbacks **create and dispatch actions** based on the event
3. **Reducers** process the **actions**, computing the new **state**
4. The new **state** of the whole application goes into a **single store**.
5. **Components** receive the new state as **props** and re-render themselves where needed.

### Redux benefits:

- The reducers are pure functions, which simply do `oldState + action = newState`. Each reducer computes a separate piece of state, which is then all composed together to form the whole application. This makes all your business logic and state transitions  easy to *test*.
- The API is smaller, simpler, and better-documented. Easier to understand the flow of actions
- If you use it the recommended way, only a very small number of components will depend upon Redux; all the other components just receive state and callbacks as props. This keeps the components very simple, and reduces framework lock-in.

### [redux-thunk](https://github.com/gaearon/redux-thunk) 

This is used for when your actions need to have a side effect other than updating the application state. For example, calling a REST API, or setting routes, or even dispatching other actions.



