# Basic

## Reducer

根据之前 state 和 action 返回新的 state

## Action

描述请求，传递需要的数据给 Reducer，这样 Reducer 根据 action 的参数返回新的 state

## Store

redux 根据 reducer 创建 store, 传递给 Provider

```jsx
...
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import App from './components/App'
import reducer from './reducers'

const store = createStore(reducer)

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
```

## 如何发送 action

一般在初始化或者按钮点击的时候，希望能够触发 dispatch(action)。下面讲实现。

### App component

App.js 作为启动组件，引入所有 Container

```jsx
import AddTodo from '../containers/AddTodo'
import VisibleTodoList from '../containers/VisibleTodoList'

const App = () => (
  <div>
    <AddTodo />
    <VisibleTodoList />
  </div>
)

export default App
```

### Container

**Container 引入需要的 Action** 和试图组件。`mapStateToProps` 和 `mapDispatchToProps` 两个方法分别负责把 state 和 dispatch 映射到 props 中。`connect` 传递着两个方法，再 Wrap 试图组件。**_这样试图组件就有了 active 和 onClick 两个 props，其中 onClick 执行的时候会 dispatch action。_**

```jsx
import { connect } from 'react-redux'
import { setVisibilityFilter } from '../actions'
import Link from '../components/Link'

const mapStateToProps = (state, ownProps) => ({
  active: ownProps.filter === state.visibilityFilter
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  onClick: () => {
    dispatch(setVisibilityFilter(ownProps.filter))
  }
})

const FilterLink = connect(
  mapStateToProps,
  mapDispatchToProps
)(Link)

export default FilterLink
```