# React Redux connect

```javascript
AddTodo = connect()(AddTodo)
```

connect() without any parameter, means to not subscribe to the store, and inject dispatch as a prop.

---

If we keep our UI components purely presentational, we can rely on React Redux to create the container components. React Redux helps us create container components through mapping the current state of the Redux store to the properties of a presentational component. It also maps the store’s `dispatch` function to callback properties. This is all accomplished through a higher-order function called `connect`.

Let’s create the `Color`s container component using `connect`. The `Color`s container connects the `ColorList` component to the store:

```javascript
import ColorList from './ColorList'

const mapStateToProps = state =>
    ({
        colors: [...state.colors].sort(sortFunction(state.sort))
    })

const mapDispatchToProps = dispatch =>
    ({
        onRemove(id) {
            dispatch(removeColor(id))
        },
        onRate(id, rating) {
            dispatch(rateColor(id, rating))
        }
    })

export const Colors = connect(
    mapStateToProps,
    mapDispatchToProps
)(ColorList)
```

`connect` is a higher-order function that returns a function that returns a component. No, that’s not a typo or a tongue-twister: it’s functional JavaScript. `connect` expects two arguments: `mapStateToProps` and `mapDispatchToProps`. Both are functions. It returns a function that expects a presentational component, and wraps it with a container that sends it data via props.

The first function, `mapStateToProps`, injects state as an argument and returns an object that will be mapped to props. We set the `colors` property of the `ColorList` component to an array of sorted colors from state.

The second function, `mapDispatchToProps`, injects the store’s `dispatch` function as an argument that can be used when the `ColorList` component invokes callback function properties. When the `ColorList` raises `onRate` or `onRemove` events, data about the color to rate or remove is obtained and dispatched.

`connect` works in conjunction with the provider. The provider adds the store to the context and `connect` creates components that retrieve the store. When using `connect`, you do not have to worry about context.

All of our containers can be created using the React Redux `connect` function in a single file:

```javascript
import { connect } from 'react-redux'
import AddColorForm from './ui/AddColorForm'
import SortMenu from './ui/SortMenu'
import ColorList from './ui/ColorList'
import { addColor, 
         sortColors, 
         rateColor, 
         removeColor } from '../actions'
import { sortFunction } from '../lib/array-helpers'

export const NewColor = connect(
    null,
    dispatch =>
        ({
            onNewColor(title, color) {
                dispatch(addColor(title,color))
            }
        })
)(AddColorForm)

export const Menu = connect(
    state =>
        ({
            sort: state.sort
        }),
    dispatch =>
        ({
            onSelect(sortBy) {
                dispatch(sortColors(sortBy))
            }
        })
)(SortMenu)

export const Colors = connect(
    state =>
        ({
            colors: [...state.colors].sort(sortFunction(state.sort))
        }),
    dispatch =>
        ({
            onRemove(id) {
                dispatch(removeColor(id))
            },
            onRate(id, rating) {
                dispatch(rateColor(id, rating))
            }
        })
)(ColorList)
```

In this example, each of our containers are defined using React Redux’s `connect` function. The `connect` function connects Redux to purely presentational components. The first argument is a function that maps state variables to properties. The second argument is a function that dispatches actions when events are raised. If you only want to map callback function properties to `dispatch` you can provide `null` as a placeholder for the first argument, as we have in the definition of the `NewColor` container.