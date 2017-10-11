# Basic

* react: Hey Action, someone clicked this "save" button
* action: thanks react! I will dispatch an action so reducers that care can update state
* reducer: thanks action. I see you passed me the current state and the action to perform. I will make a new copy of the state and return it
* store: thanks for updating the state reducer. I'll make sure all connected components are aware
* react-redux: I'll determine if I should tell react about this change so that it only has to update UI when necessary
* react: ooo! new date has been passed down via props from the store. I will update the UI to reflect this

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

把 redux store 想象成一个 pie chart，里面有多少个 reducer 就负责有多少片 state 需要管理。`mapStateToProps` 可以暴露所需要的 state。每次 state 更新都会触发该方法。这里可能会有复杂耗时的 mapping 计算，可以用 `reselect` library memorizes expensive calls

```javascript
import { bindActionCreators } from 'redux'

function mapStateToProps(state, ownProps){
  return {
    courses: state.courses
  }
}

// method 1: manually
function mapDispatchToProps(dispatch){
  return {
    createCourse: (course)  => {
      dispatch(courseActions.createCourse(course))
    }
  }
}

// method 2: bindActionCreators will find all actions in that file
function mapDispatchToProps(dispatch){
  return {
    actions: bindActionCreators(courseActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CoursesPage)
```

> 注意，如果 connect 第二个参数 mapDispatchToProps 不传，则 `dispatch` 会以 props 注入到组件中！

---

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