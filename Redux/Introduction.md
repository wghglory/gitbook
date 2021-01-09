# react redux 流程

- react: Hey Action, someone clicked this "save" button
- action: thanks react! I will dispatch an action so reducers that care can update state
- reducer: thanks action. I see you passed me the current state and the action to perform. I will make a new copy of the state and return it
- store: thanks for updating the state reducer. I'll make sure all connected components are aware
- react-redux: I'll determine if I should tell react about this change so that it only has to update UI when necessary
- react: ooo! new data has been passed down via props from the store(connect, mapStateToProps, mapDispatchToProps). I will re-render the UI to reflect this

## Redux benefits

- reducers are pure functions, which simply do `oldState + action => newState`. Each reducer computes a separate piece of state, which is then all composed together to form the whole application. This makes all your business logic and state transitions easy to _test_.
- Api 简单
- 容易理解流程
- 如果按照它推荐的方式 -- 视图组件和容器组建分离，容器组件状态通过 props 传到视图组件中，职责分明，每个组件单一、小。

## Concepts

### Reducer

根据之前 state 和 action 返回新的 state

### Action

描述请求，传递需要的数据给 Reducer，这样 Reducer 根据 action 的参数返回新的 state

### Store

redux 根据 reducer 创建 store, 传递给 Provider

```javascriptx
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

### 如何发送 action

一般在初始化或者按钮点击的时候，希望能够触发 `dispatch(action)`。下面讲实现。

#### App component

App.js 作为启动组件，引入所有 Container

```javascriptx
import AddTodo from '../containers/AddTodo';
import VisibleTodoList from '../containers/VisibleTodoList';

const App = () => (
  <div>
    <AddTodo />
    <VisibleTodoList />
  </div>
);

export default App;
```

### Container

container component 核心代码：

```javascript
connect(
  mapStateToProps,
  mapDispatchToProps,
)(PresentationalComponent);
```

`connect()` without any parameter, means to not subscribe to the store.

`connect` is a higher-order function that returns a function that returns a component. `connect` expects two arguments: `mapStateToProps` and `mapDispatchToProps`. Both are functions. It returns a function that expects a presentational component, and wraps it with a container that sends it data via props.

The first function, `mapStateToProps`, injects state as an argument and returns an object that will be mapped to props. We set the `colors` property of the `ColorList` component to an array of sorted colors from state.

The second function, `mapDispatchToProps`, injects the store’s `dispatch` function as an argument that can be used when the `ColorList` component invokes callback function properties. When the `ColorList` raises `onRate` or `onRemove` events, data about the color to rate or remove is obtained and dispatched.

`connect` works in conjunction with the provider. The provider adds the store to the context and `connect` creates components that retrieve the store. When using `connect`, you do not have to worry about context.

**Container 引入需要的 Action** 和视图组件。`mapStateToProps` 和 `mapDispatchToProps` 两个方法分别负责把 state 和 dispatch 映射到 props 中。`connect` 传递着两个方法，再 Wrap 视图组件。**_这样 presentational 组件就有了 active 和 onClick 两个 props，其中 onClick 执行的时候会 dispatch action。_**

> 注意，如果 connect 第二个参数 mapDispatchToProps 不传，则 `dispatch` 会以 props 注入到组件中！

把 redux store 想象成一个 pie chart，里面有多少个 reducer 就负责有多少片 state 需要管理。`mapStateToProps` 可以  暴露所需要的 state。每次 state 更新都会触发该方法。这里可能会有复杂耗时的 mapping 计算，可以用 `reselect` library memorizes expensive calls

```javascript
import { bindActionCreators } from 'redux';

function mapStateToProps(state, ownProps) {
  return {
    courses: state.courses,
  };
}

// method 1: manually
function mapDispatchToProps(dispatch) {
  return {
    createCourse(course, ownProps) {
      dispatch(courseActions.createCourse(course));
    },
  };
  // return {
  //   createCourse: (course) => {
  //     dispatch(courseActions.createCourse(course))
  //   }
  // }
}

// method 2: bindActionCreators will find all actions in that file
function mapDispatchToProps(dispatch, ownProps) {
  return {
    actions: bindActionCreators(courseActions, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CoursesPage);
```

## 异步操作

- [redux-thunk](https://github.com/gaearon/redux-thunk)
- redux-saga
