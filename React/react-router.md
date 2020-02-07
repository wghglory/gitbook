# React Router

react-router 包含 3 个库，react-router、react-router-dom 和 react-router-native。react-router 提供最基本的路由功能，实际使⽤的时候我们不会直接安装 react-router，⽽是根据应⽤运⾏的环境选择安装 react-router-dom（在浏览器中使⽤）或 react-router-native（在 rn 中使⽤）。react-router-dom 和 react-router-native 都依赖 react-router，所以在安装时，react-router 也会⾃动安装，创建 web 应⽤， 使⽤：`npm install --save react-router-dom`

_**Concepts**_

- `BrowserRouter` as Router - is the component between which all the routes are nested. Our most parent component.
- `Route` - the component that helps specify views for each component, has many small nuances one needs to be aware of
- `Link` - just a link with prop to.
- `NavLink` - has `activeClassName` prop, to apply a css class when active
- `Switch` - used to make sure only one of the Routes is active at any moment (useful for showing a route without a path for paths that are not handled aka 404)
  - instead of rendering all of the routes that are active, switch is gonna let only 1 route be active at a time

react-router 中奉⾏⼀切皆组件的思想:

- 路由器 Router
- 链接 Link
- 路由 Route
- 独占 Switch
- 重定向 Redirect

**_Route_**

⚠️Route 渲染优先级：children > component > render

- `path` - prop takes string for the url path at which component should be active in the view
  - Note: if a route has `path='/first'`, it’s component will be active for all paths that start with `/first`
  - to avoid the above, we need to prepend prop path with keyword exact
- `component` - takes a javascript expression referring to the component that one wants to link to the path
- `render` - this prop is useful when you don’t want to link the route to a component, but instead specify the JSX right there. This prop takes a value of a function that returns the JSX you wish this route to return. This is used mostly for the 404 pages I’m assuming, in a route that’s the last child of the switch component (and has no path prop value obviously).
- `exact` - prop makes sure the route is rendered/active only when the path matches exactly and not just partly

**_Link_**

This component is the basic anchor tag in react, except obviously it knows what component it originates in.

- `to` - prop takes the path to route to when the user clicks the link

**_NavLink_**

Composed of the component Link, except with additional functionality to make Links active when their path matches the current path.

- `activeClassName` - is the class that is applied to the NavLink component when the current path matches with the link’s path
- `exact` - this prop makes sure the activeClassName is applied only when the path has an exact match with the link’s path (not just partly, similar to the exact prop in routes)

**_Query Params_**

The `to` prop of the `Link` component of React Router accepts url path strings or an object with props:

- pathname: which takes a string for the link’s path
- search: takes a string beginning with ‘?’ for query params followed by the query param name value string

React Router’s Route component passes a few props to the component it’s linked with. One of the prop is `match` which is an object with a property `url` which contains the current url’s path. The `to` value of a `Link` that routes to a sub-path of the current url should be composed of the `this.props.match.url` property, so that the path can be changed later without affecting the link.

## 基本使用

```jsx
import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

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
          <Nav />

          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/battle" component={Battle} />
            <Route path="/battle/result" component={Result} />
            <Route path="/popular" component={Popular} />
            <Route render={() => <p>Not found</p>} />
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
import { NavLink } from 'react-router-dom';

function Nav() {
  return (
    <ul className="nav">
      <li>
        <NavLink exact activeClassName="active" to="/">
          Home
        </NavLink>
      </li>
      <li>
        <NavLink activeClassName="active" to="/battle">
          Battle
        </NavLink>
      </li>
      <li>
        <NavLink activeClassName="active" to="/popular">
          Popular
        </NavLink>
      </li>
    </ul>
  );
}

export default Nav;
```

## 点击 button 跳转到新的 component

返回当前 component 的 url: `this.props.match.url`. Link 组件中 to 定义 pathname 和 customParam

```jsx
import { Link } from 'react-router-dom';

<Link
  className="button"
  to={{
    pathname: this.props.match.url + '/result',
    customParam: '?playerOneName=' + playerOneName + '&playerTwoName=' + playerTwoName,
  }}
>
  Battle
</Link>;
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
