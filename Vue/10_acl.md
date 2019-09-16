# 权限控制 ACL

路由分为两种， constantRoutes 和 asyncRoutes 。

定义路由，router/index.js

```js
import Vue from 'vue';
import Router from 'vue-router';

import Layout from '@/layout'; // 布局页

Vue.use(Router);

// 通用页面
export const constRoutes = [
  {
    path: '/login',
    component: () => import('@/views/Login'),
    hidden: true, // 导航菜单忽略该项
  },
  {
    path: '/',
    component: Layout, // 应用布局
    redirect: '/home',
    children: [
      {
        path: 'home',
        component: () => import(/* webpackChunkName: "home" */ '@/views/Home.vue'),
        name: 'home',
        meta: {
          title: 'Home', // 导航菜单项标题
          icon: 'qq', // 导航菜单项图标
        },
      },
    ],
  },
];

// 权限⻚⾯
export const asyncRoutes = [
  {
    path: '/about',
    component: Layout,
    redirect: '/about/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/About.vue'),
        name: 'about',
        meta: {
          title: 'About',
          icon: 'qq',
          // 角色决定将来那些用户可以看到该路由
          roles: ['admin', 'editor'],
        },
      },
    ],
  },
  {
    path: '/message',
    component: Layout,
    redirect: '/message/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/Message.vue'),
        name: 'message',
        meta: {
          title: 'Message',
          icon: 'wechat',
          // 角色决定将来那些用户可以看到该路由
          roles: ['admin'],
        },
      },
    ],
  },
  {
    path: '/personal',
    component: () => import('@/views/Personal.vue'),
    name: 'personal',
    meta: {
      title: 'personal',
    },
  },
];

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: constRoutes,
});
```

路由守卫，创建./src/router/guard.js，并在 main.js 中引⼊

```js
/* 在main.js中引⼊ */

// 做全局路由守卫，不同用户角色，可以看到不同的 route。
import router from './index';
import store from '@/store';
import { getToken } from '@/utils/auth'; // 从cookie获取令牌

const whiteList = ['/login'];

router.beforeEach(async (to, from, next) => {
  const hasToken = getToken();

  if (hasToken) {
    // 登录用户访问 login 为他转到 home
    if (to.path === '/login') {
      next({ path: '/' });
    } else {
      //已登录, 访问其他页面，获取用户角色
      const hasRoles = store.getters.roles && store.getters.roles.length > 0;
      if (hasRoles) {
        next();
      } else {
        try {
          // 先请求获取用户信息
          const { roles } = await store.dispatch('user/getInfo');

          // 根据当前用户角色动态生成路由
          const accessRoutes = await store.dispatch('permission/generateRoutes', roles);

          // 添加这些路由至路由器
          router.addRoutes(accessRoutes);

          // 继续路由切换，确保addRoutes完成
          next({ ...to, replace: true });
        } catch (error) {
          // 出错需重置令牌并重新登录（令牌过期、网络错误等原因）
          await store.dispatch('user/resetToken');
          alert(error || '出错了');
          next(`/login?redirect=${to.path}`);
        }
      }
    }
  } else {
    // ⽤户⽆令牌
    if (whiteList.indexOf(to.path) !== -1) {
      // ⽩名单路由放过
      next();
    } else {
      // 重定向⾄登录⻚
      next(`/login?redirect=${to.path}`);
    }
  }
});
```

utils/auth.js

```js
import Cookies from 'js-cookie';

export function getToken() {
  return Cookies.get('token');
}

export function setToken(token) {
  return Cookies.set('token', token);
}

export function removeToken() {
  return Cookies.remove('token');
}
```

vuex 相关模块实现，创建 store/index.js

```js
import Vue from 'vue';
import Vuex from 'vuex';

import user from './user';
import permission from './permission';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    permission,
    user,
  },
  // 全局定义getters便于访问
  getters: {
    roles: (state) => state.user.roles,
  },
});
```

user 模块：⽤户数据、⽤户登录等，store/user.js

```js
import { getToken, setToken, removeToken } from '@/utils/auth';

const state = {
  token: getToken(),
  roles: [], // 用户角色
};

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token;
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles;
  },
};

const actions = {
  // POST user login
  login({ commit }, userInfo) {
    const { username } = userInfo;
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (username === 'admin' || username === 'jerry') {
          commit('SET_TOKEN', username);
          setToken(username);
          resolve();
        } else {
          reject('用户名、密码错误');
        }
      }, 200);
    });
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const roles = state.token === 'admin' ? ['admin'] : ['editor'];
        commit('SET_ROLES', roles);
        resolve({ roles });
      }, 200);
    });
  },

  // remove token
  resetToken({ commit }) {
    return new Promise((resolve) => {
      commit('SET_TOKEN', '');
      commit('SET_ROLES', []);
      removeToken();
      resolve();
    });
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
```

permission 模块：路由配置信息、路由⽣成逻辑, store/permission.js

```js
import { asyncRoutes, constRoutes } from '@/router';

/**
 * 根据路由meta.role确定是否当前用户拥有访问权限
 * 某条路由上表明哪些角色可以访问，当前用户的角色是否在其中
 * @roles 用户拥有角色
 * @route 待判定路由
 */
function hasPermission(roles, route) {
  // 如果当前路由有roles字段则需判断用户访问权限
  if (route.meta && route.meta.roles) {
    // 若用户拥有的角色中有被包含在待判定路由角色表中的则拥有访问权
    return roles.some((role) => route.meta.roles.includes(role));
  } else {
    // 没有设置roles则无需判定即可访问
    return true;
  }
}

/**
 * 递归过滤AsyncRoutes路由表，找到当前用户对应角色所能访问的路由
 * @routes 待过滤路由表，首次传入的就是AsyncRoutes
 * @roles 用户拥有角色
 */
export function filterAsyncRoutes(routes, roles) {
  const res = [];

  routes.forEach((route) => {
    // 复制一份
    const tmp = { ...route };
    // 如果用户有访问权则加入结果路由表
    if (hasPermission(roles, tmp)) {
      // 如果存在子路由则递归过滤之
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles);
      }
      res.push(tmp);
    }
  });

  return res;
}

const state = {
  routes: [], // 完整路由表(跟角色无关、不需登录的路由 + 不同角色允许的路由)
  addRoutes: [], // 用户可访问路由表
};

const mutations = {
  SET_ROUTES: (state, routes) => {
    // 保存能够访问的动态路由
    state.addRoutes = routes;
    // 全部路由
    state.routes = constRoutes.concat(routes);
  },
};

const actions = {
  // 路由生成：在得到用户角色后会第一时间调用
  generateRoutes({ commit }, roles) {
    return new Promise((resolve) => {
      let accessedRoutes;
      // 用户是管理员则拥有完整访问权限
      if (roles.includes('admin')) {
        accessedRoutes = asyncRoutes || [];
      } else {
        // 否则需要根据角色做过滤处理
        accessedRoutes = filterAsyncRoutes(asyncRoutes, roles);
      }
      commit('SET_ROUTES', accessedRoutes);
      resolve(accessedRoutes);
    });
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
```

布局⻚⾯，layout/index.vue

```html
<template>
  <div class="app-wrapper">
    <!-- <sidebar class="sidebar-container" /> -->
    <div class="main-container">
      <router-view />
    </div>
  </div>
</template>
```

⽤户登录⻚⾯，views/Login.vue

```vue
<template>
  <div>
    <h1>Login Page (username: admin or jerry)</h1>
    <input type="text" v-model="username" />
    <button @click="login">登录</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: 'admin',
    };
  },
  methods: {
    async login() {
      try {
        await this.$store.dispatch('user/login', { username: this.username });
        this.$router.push({ path: '/' });
      } catch (error) {
        alert(error);
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
```

---

## 局部权限控制：比如一个页面，不同角色看到不同 button。

```js
// directive/permission.js

/* 局部权限控制
该指令通过传递进来的权限数组和当前用户角色数组过滤
如果用户拥有要求的权限则可以看到，否则删除指令挂钩dom元素 */

import store from '@/store';

export default {
  // el-挂载dom
  // binding- v-permission="[]" {value:[]}
  inserted(el, binding) {
    // 获取值
    const { value: permissionRoles } = binding;
    // 获取用户角色
    const roles = store.getters.roles;
    // 合法性判断
    if (permissionRoles && permissionRoles instanceof Array && permissionRoles.length > 0) {
      // 判断用户角色中是否有要求的
      const hasPermission = roles.some((role) => {
        return permissionRoles.includes(role);
      });

      // 如果没有权限则删除当前dom
      // 和 v-if区别，v-if 更早执行，element 都不回加载。这个是加载后再删除。
      if (!hasPermission) {
        el.parentNode && el.parentNode.removeChild(el);
      }
    } else {
      throw new Error('需要指定数组类型权限，如v-permission。。。');
    }
  },
};
```

register this directive globally in main.js

```js
// main.js

import permission from '@/directive/permission';

Vue.directive('permission', permission); // globally register directive
```

Use this directive

```html
<!-- 按钮权限 -->
<button v-permission="['admin', 'editor']">editor button</button>
<button v-permission="['admin']">admin button</button>
```
