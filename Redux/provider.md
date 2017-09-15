# The React Redux Provider

React Redux is a library that contains some tools to help ease the complexity involved with implicitly passing the store via context. Redux does not require that you use this library. However, using React Redux reduces your code’s complexity and may help you build apps a bit faster.

In order to use React Redux, we must first install it. It can be installed via [npm](https://www.npmjs.com/package/react-redux):

```
npm install react-redux --save
```

`react-redux` supplies us with a component that we can use to set up our store in the context, the *provider*. We can wrap any React element with the provider and that element’s children will have access to the store via context.

Instead of setting up the store as a context variable in the `App` component, we can keep the `App` component stateless:

```javascript
import { Menu, NewColor, Colors } from './containers'

const App = () =>
    <div className="app">
        <Menu />
        <NewColor />
        <Colors />
    </div>

export default App
```

The provider adds the store to the context and updates the `App` component when actions have been dispatched. The provider expects a single child component:

```javascript
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import App from './components/App'
import storeFactory from './store'

const store = storeFactory()

render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('react-container')
)
```

The provider requires that we pass the store as a property. It adds the store to the context so that it can be retrieved by any child of the `App` component. Simply using the provider can save us some time and simplify our code.

Once we’ve incorporated the provider, we can retrieve the store via context in child container components. However, React Redux provides us with another way to quickly create container components that work with the provider: the `connect` function.