# Vue Router

## 安装

```shell
vue add router
```

## 配置

```javascript
// router.js
import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';

Vue.use(Router); // 引⼊Router插件

export default new Router({
  mode: 'history', // 模式：hash | history | abstract
  base: process.env.BASE_URL, // http://localhost:8080/cart, cart is baseurl
  routes: [
    { path: '/', name: 'home', component: Home },
    {
      path: '/about',
      name: 'about', // 路由层级代码分割，⽣成分⽚(about.[hash].js) // 当路由房问时会懒加载.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue'),
    },
  ],
});
```

### 指定路由器

```javascript
// main.js
new Vue({ router, render: (h) => h(App) }).$mount('#app');
```

### 路由视图

```html
<router-view />
```

### 导航链接

```html
<router-link to="/">Home</router-link> <router-link to="/about">About</router-link>
```

### 路由嵌套

应⽤界⾯通常由多层嵌套的组件组合⽽成。同样地，URL 中各段动态路径也按某种结构对应嵌套的各层 组件。 配置嵌套路由，router.js

```javascripton
{
  "path": "/",
  "component": Home,
  "children": [{ "path": "/list", "name": "list", "component": List }]
}
```

⽗组件需要添加插座，Home.vue

```html
<template>
  <div class="home">
    <h1>⾸⻚</h1>
    <router-view></router-view>
  </div>
</template>
```

## 动态路由

我们经常需要把某种模式匹配到的所有路由，全都映射到同⼀个组件。 详情⻚路由配置，router.js

```javascripton
{
  "path": "/",
  "component": Home,
  "children": [
    { "path": "", "name": "home", "component": List },
    { "path": "detail/:id", "component": Detail }
  ]
}
```

跳转，List.vue

```html
<ul>
  <li><router-link to="/detail/1">web全栈</router-link></li>
</ul>
```

获取参数，Detail.vue

```html
<template>
  <div>
    <h2>商品详情</h2>
    <p>{{$route.params.id}}</p>
  </div>
</template>
```

传递路由组件参数：

```javascripton
{ "path": "detail/:id", "component": Detail, "props": true }
```

组件中以属性⽅式获取：

```javascript
export default { props: ['id'] };
```

## 路由守卫

路由导航过程中有若⼲⽣命周期钩⼦，可以在这⾥实现逻辑控制。

### 全局守卫，router.js

```javascript
// 路由配置
{
  path: "/about",
	name: "about",
	meta: { auth: true }, // 需要认证
	component: () => import( /* webpackChunkName: "about" */ "./views/About.vue")
}

// 守卫
router.beforeEach((to, from, next) => {
  // 要访问/about且未登录需要去登录
  if (to.meta.auth && !window.isLogin) {
    if (window.confirm('请登录')) {
      window.isLogin = true;
      next(); // 登录成功，继续
    } else {
      next('/'); // 放弃登录，回⾸⻚
    }
  } else {
    next(); // 不需登录，继续
  }
});
```

### 路由独享守卫

```javascript
beforeEnter(to, from, next) {
	// 路由内部知道⾃⼰需要认证
	if (!window.isLogin) {
		// ...
  } else {
    next();
  }
}
```

### 组件内的守卫

```javascript
export default {
  beforeRouteEnter(to, from, next) {},
  beforeRouteUpdate(to, from, next) {},
  beforeRouteLeave(to, from, next) {},
};
```

## vue router 根据服务端动态加载

利⽤\$router.addRoutes()可以实现动态路由添加，常⽤于⽤户权限控制。

```javascript
// 返回数据可能是这样的
[
  {
    path: '/',
    name: 'home',
    component: 'Home', // Note 这里实际想要 HomeComponent，但后端只能返回 string，所以下面做一个映射
  },
];

// 异步获取路路由
api.getRoutes().then((routes) => {
  const routeConfig = routes.map((route) => mapComponent(route));
  router.addRoutes(routeConfig);
});

// 映射关系
const compMap = {
  Home: () => import('./view/Home.vue'),
};

// 递归替换
function mapComponent(route) {
  route.component = compMap[route.component];
  if (route.children) {
    route.children = route.children.map((child) => mapComponent(child));
  }
  return route;
}
```

## 面包屑

利⽤\$route.matched 可得到路由匹配数组，按顺序解析可得路由层次关系。

```javascript
// Breadcrumb.vue
watch: {
  $route() {
    // [{name:'home',path:'/'},{name:'list',path:'/list'}]
    console.log(this.$route.matched); // ['home','list']
    this.crumbData = this.$route.matched.map(m => m.name)
  }
}
```

---

## Vue Router 源码实现原理

```javascript
// router-my.js
/**
 * vue router 源码实现
 * 测试注意：
 * 不要出现router-view嵌套，因为没有考虑，把Home中的router-view先禁⽤用
 * 导航链接修改为hash
 */
import Vue from 'vue';
// import Router from 'vue-router';   // official vue-router
import Router from './vue-router-my'; // 源码实现

import About from './views/About';
import Home2 from './views/Home2';
import Message from './views/Message';

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home2,
    },
    {
      path: '/about',
      name: 'about',
      component: About,
    },
    {
      path: '/personal',
      name: 'personal',
      component: () => import(/* webpackChunkName: "personal" */ './views/Personal.vue'),
    },
    {
      // in-component guard
      path: '/message',
      name: 'message',
      component: Message,
    },
  ],
});

export default router;
```

```javascript
// vue-router-my.js

let Vue;

class VueRouter {
  constructor(options) {
    this.$options = options;

    // 创建一个路由path和route映射
    this.routeMap = {};

    // 将来当前路径current需要响应式
    // 利用Vue响应式原理可以做到这一点
    this.app = new Vue({
      data: {
        current: '/',
      },
    });
  }

  init() {
    // 绑定浏览器事件
    this.bindEvents();

    // 解析路由配置
    this.createRouteMap(this.$options);

    // 创建router-link和router-view
    this.initComponent();
  }

  bindEvents() {
    window.addEventListener('hashchange', this.onHashChange.bind(this));
    window.addEventListener('load', this.onHashChange.bind(this));
  }
  onHashChange() {
    // http://localhost/#/home
    this.app.current = window.location.hash.slice(1) || '/';
  }
  createRouteMap(options) {
    options.routes.forEach((item) => {
      // ['/home']: {path:'/home',component:Home}
      this.routeMap[item.path] = item;
    });
  }
  initComponent() {
    // 声明两个全局组件
    Vue.component('router-link', {
      props: {
        to: String,
      },
      render(h) {
        // 目标是：<a :href="to">xxx</a>
        return h('a', { attrs: { href: '#' + this.to } }, this.$slots.default);
        // return <a href={this.to}>{this.$slots.default}</a>
      },
    });

    // hash -> current -> render
    Vue.component('router-view', {
      // 箭头函数能保留this指向，这里指向VueRouter实例
      render: (h) => {
        console.log(this.routeMap);
        console.log(this.app.current);
        const Comp = this.routeMap[this.app.current].component;

        // 这里可能报错，必须要在 routeMap 中找到一个组件，因为初始定义了 current: /, 要求路由配置必须有 / 的配置
        return h(Comp);
      },
    });
  }
}

// 把VueRouter变为插件
VueRouter.install = function(_Vue) {
  Vue = _Vue; // 这里保存，上面使用

  // 混入任务
  Vue.mixin({
    // 混入：就是扩展Vue
    beforeCreate() {
      // 这里的代码将来会在外面初始化的时候被调用
      // 这样我们就实现了Vue扩展
      // this是谁？ Vue组件实例
      // 但是这里只希望根组件执行一次
      if (this.$options.router) {
        Vue.prototype.$router = this.$options.router;
        this.$options.router.init();
      }
    },
  });
};

export default VueRouter;
```
