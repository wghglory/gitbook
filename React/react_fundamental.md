# React fundamental

## React and react dom

```javascript
import React from 'react';
import ReactDOM from 'react-dom';

// 这⾥怎么没有出现React字眼？
// JSX => React.createElement(...)
ReactDOM.render(<h1>Hello React</h1>, document.querySelector('#root'));
```

这里不能够把 import React 删除掉，因为 jsx 实际用了 React.createElement(...). JSX 可以很好地描述 UI，能够有效提⾼开发效率

- React 负责逻辑控制，数据 -> VDOM
- ReactDom 渲染实际 DOM，VDOM -> DOM
- React 使⽤ JSX 来描述 UI
- ⼊⼝⽂件定义，webpack.conﬁg.js

## 热更新

webpack.config.js 中：

```javascript
entry: [
  // WebpackDevServer客户端，它实现开发时热更新功能
  isEnvDevelopment &&
    require.resolve('react-dev-utils/webpackHotDevClient'),
    // 应⽤程序⼊⼝：src/index
    paths.appIndexJs,
].filter(Boolean),
```

## css 模块化

创建 index.module.css，index.js

```javascript
import style from './index.module.css';

<img className={style.img} />;
```

## setState

**setState 只有在合成事件和钩⼦函数中是异步的，在原⽣事件和 setTimeout、setInterval 中都是同步的。**

```javascript
import React, { Component } from 'react';

export default class Clock extends Component {
  constructor(props) {
    super(props);
    // 使用state属性维护状态，在构造函数中初始化状态
    this.state = {
      date: new Date(),
      counter: 0,
    };
    // this.setCounter = this.setCounter.bind(this);
  }

  componentDidMount() {
    this.timerId = setInterval(() => {
      this.setState({
        date: new Date(),
      });
    }, 1000);

    // // way 3: setState works synchronously by nativeDOM event
    // document.getElementsByTagName('button')[0].addEventListener(
    //   'click',
    //   () => {
    //     this.setState({
    //       counter: this.state.counter + 2,
    //     });
    //     console.log('state synchronous way 3', this.state.counter);
    //   },
    //   0,
    // );
  }

  componentWillUnmount() {
    clearInterval(this.timerId);
  }

  setCounter = () => {
    // // way 2: use setTimeout to make setState work synchronously
    // setTimeout(() => {
    //   this.setState({
    //     counter: this.state.counter + 2,
    //   });
    //   console.log('state sync way 2', this.state.counter);
    // }, 0);

    // way 1: setState passes function to work in synchronous way. perfect way
    this.setState((nextState) => {
      return {
        counter: nextState.counter + 1,
      };
    });
    this.setState((nextState) => {
      return {
        counter: nextState.counter + 2,
      };
    });

    // // by default, setState works asynchronously.
    // this.setState({
    //   counter: this.state.counter + 1,
    // });
    // this.setState({
    //   counter: this.state.counter + 2,
    // });
  };

  render() {
    const str = '我是 Clock 页面';
    const { date, counter } = this.state;
    return (
      <div>
        <h1>{str}</h1>
        <p>{date.toLocaleTimeString()}</p>
        <p>{counter}</p>
        <button onClick={this.setCounter}>改变counter</button>
      </div>
    );
  }
}
```

## Hooks

```javascript
import React, { useState, useEffect } from 'react';

//hooks
export default function User() {
  // const date = new Date();
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => {
      setDate(new Date());
    }, 1000);

    return () => clearInterval(timerId);
  });

  return (
    <div>
      <h1>我是user页面</h1>
      <p>{date.toLocaleTimeString()}</p>
    </div>
  );
}
```

## Event 和组件通信

React 中使⽤ onXX 写法来监听事件。

事件回调函数注意绑定 this 指向，常⻅三种⽅法：

1. 构造函数中绑定并覆盖：`this.change = this.change.bind(this)`
2. ⽅法定义为箭头函数：`change = () => {}`
3. 事件中定义为箭头函数：`onChange = { () => this.change() }`

react ⾥遵循单项数据流，没有双向绑定，输⼊框要设置 value 和 onChange，称为受控组件

```javascript
// Search.js
import React, { Component } from 'react';

export default class Search extends Component {
  /* state = {
    name: "",
  }; */
  constructor(props) {
    super(props);
    this.state = {
      name: '',
    };
  }
  handle = () => {
    const { hello } = this.props;
    hello('通过 props 传递父级的方法，孩子来调用');
    console.log('handle');
  };
  change = (event) => {
    let value = event.target.value;
    this.setState({
      name: value,
    });
    console.log('change', this.state.name); // 这样记录上次数据，因为异步 setState
  };
  render() {
    const { name } = this.state;
    const { username } = this.props.store;
    console.log('this', this);
    return (
      <div>
        <h1>我是Search页面</h1>
        <p>{username}: props of value</p>
        <p>
          状态提升，父组件传递方法给子组件，子组件调用，这样更新父组件
          <button onClick={this.handle}>click to test props of function</button>
        </p>
        <input value={name} onChange={this.change} />
      </div>
    );
  }
}
```

```javascript
// App.js
const store = {
  username: 'derek',
};

function hello(msg) {
  console.log('hello', msg);
}

function App() {
  return (
    <div className="App">
      <Search store={store} hello={hello} />
    </div>
  );
}
```

跨层级通信：redux and context！
