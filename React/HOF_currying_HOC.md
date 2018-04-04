# Higher-Order Functions -- Functions that can manipulate other functions.

3 categories:

* take functions in as arguments
* return functions
* both

## Take functions as arguments

The first category of higher-order functions are functions that expect other functions as arguments. `Array.map`, `Array.filter`, and `Array.reduce` all take functions as arguments. They are higher-order functions.

In the following example, we create an `invokeIf` callback function that will test a condition and invoke on callback function when it is true and another callback function when that condition is false:

```javascript
const invokeIf = (condition, fnTrue, fnFalse) => (condition ? fnTrue() : fnFalse());

const showWelcome = () => console.log('Welcome!!!');

const showUnauthorized = () => console.log('Unauthorized!!!');

invokeIf(true, showWelcome, showUnauthorized); // "Welcome"
invokeIf(false, showWelcome, showUnauthorized); // "Unauthorized"
```

`invokeIf` expects two functions: one for true, and one for false. This is demonstrated by sending both `showWelcome` and `showUnauthorized` to `invokeIf`. When the condition is true, `showWelcome` is invoked. When it is false, `showUnauthorized` is invoked.

## return functions - currying

Higher-order functions that return other functions can help us handle the complexities associated with asynchronicity in JavaScript. They can help us create functions that can be used or reused at our convenience.

`Currying` is a functional technique that involves the use of higher-order functions. Currying is the practice of holding on to some of the values needed to complete an operation until the rest can be supplied at a later point in time. This is achieved through the use of a function that returns another function, the curried function.

The following is an example of currying. The `userLogs` function hangs on to some information (the username) and returns a function that can be used and reused when the rest of the information (the message) is made available. In this example, log messages will all be prepended with the associated username. Notice that we’re using the `getFakeMembers` function that returns a promise.

```javascript
const userLogs = (userName) => (message) => console.log(`${userName} -> ${message}`);

const log = userLogs('grandpa23');
log('attempted to load 20 fake members');

getFakeMembers(20).then(
  (members) => log(`successfully loaded ${members.length} members`),
  (error) => log('encountered an error loading members'),
);

// grandpa23 -> attempted to load 20 fake members
// grandpa23 -> successfully loaded 20 members

// grandpa23 -> attempted to load 20 fake members
// grandpa23 -> encountered an error loading members
```

`userLogs` is the higher-order function. The `log` function is produced from `userLogs`, and every time the `log` function is used, “grandpa23” is prepended to the message.

## Higher Order Component

This is an example in react.fundamentals

```jsx
/**
 * HOC for data fetching
 */
import React from 'react';

const DataComponent = (ComposedComponent, url) =>
  class NewComponent extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        data: [],
        loading: false,
      };

      this._getData = this._getData.bind(this);
      this.fetchByParam = this.fetchByParam.bind(this);
    }

    _getData(param = {}) {
      // 如果 param 传入 url 参数则根据此 url 进行查询，不然根据顶层传入 url 参数查询
      if (param.url) {
        url = param.url;
      }

      this.setState({ loading: true });

      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          if (this._isMount) {
            this.setState({ loading: false, data: data.items, param });
          }
        });
    }

    fetchByParam(param) {
      this._getData(param);
    }

    componentWillMount() {
      this._getData();
    }

    componentDidMount() {
      this._isMount = true;
    }

    componentWillUnmount() {
      this._isMount = false;
    }

    // only for solution 4. 返回的NewComponent作为子组件，父组件状态作为props传到子组件
    // 父组件状态改变的时候，自组件props发生改变，该方法触发，根据传入的param进行数据查询
    componentWillReceiveProps(nextProps) {
      // console.log(`nextProps`, nextProps.param);
      // call getData only when param props changed. Other props change will enter componentWillReceiveProps too, but we don't want to fetch data
      if (nextProps.param) {
        this._getData(nextProps.param);
      }
    }

    render() {
      return (
        <div className="data-component">
          {this.state.loading ? (
            <p
              style={{
                textAlign: 'center',
                fontSize: '20px',
              }}
            >
              Loading...
            </p>
          ) : (
            <ComposedComponent {...this.state} {...this.props} fetchByParam={this.fetchByParam} />
          )}
        </div>
      );
    }
  };

export default DataComponent;
```
