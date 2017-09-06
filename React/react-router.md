# React Router

## 基本使用

```jsx
import React, {Component} from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';

import Nav from './Nav';
import Home from './Home';
import Battle from './Battle';
import Result from './Result';
import Popular from './Popular';

class App extends React.Component {
    render() {
        return (
            <BrowserRouter>
                <div className="container">
                    <Nav/>

                    <Switch>
                        <Route exact path='/' component={Home}/>
                        <Route exact path='/battle' component={Battle}/>
                        <Route path='/battle/result' component={Result}/>
                        <Route path='/popular' component={Popular}/>
                        <Route render={() => <p>Not found</p>}/>
                    </Switch>
                </div>
            </BrowserRouter>
        );
    }
}

export default App;
```

Nav.js

```jsx
import React from 'react';
import {NavLink} from 'react-router-dom';

function Nav() {
  return (
    <ul className="nav">
      <li><NavLink exact activeClassName="active" to="/">Home</NavLink></li>
      <li><NavLink activeClassName="active" to="/battle">Battle</NavLink></li>
      <li><NavLink activeClassName="active" to="/popular">Popular</NavLink></li>
    </ul>
  );
}

export default Nav;
```

## 点击 button 跳转到新的 component

返回当前 component 的url: `this.props.match.url`
Link 组件中 to 定义 pathname 和 customParam

```jsx
import {Link} from 'react-router-dom';

<Link
  className='button'
  to={{pathname: this.props.match.url + '/result',
      customParam: '?playerOneName=' + playerOneName + '&playerTwoName=' + playerTwoName}}
>
  Battle
</Link>
```

## 新转到的 component 获得之前 button 传递的参数

通过 `location.customParam` 获得参数，并用 `queryString` 转换数据

```jsx
import queryString from 'query-string';

componentDidMount() {
  let players = queryString.parse(this.props.location.customParam);
  console.log(this.props.location.customParam);  //?playerOneName=wghglory&playerTwoName=ff
  console.log(players);  //{playerOneName: "wghglory", playerTwoName: "ff"}
}
```