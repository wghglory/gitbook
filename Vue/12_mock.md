# 数据交互

## 封装 request

安装 axios: `npm i axios -S`

创建@/utils/request.js

```javascript
import axios from 'axios';
import { MessageBox, Message } from 'element-ui';
import store from '@/store';
import { getToken } from '@/utils/auth';

// 创建axios实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  // url基础地址，解决不同数据源url变化问题
  // withCredentials: true, // 跨域时若要发送cookies需设置该选项
  timeout: 5000, // 超时
});

// 请求拦截
service.interceptors.request.use(
  (config) => {
    // do something

    if (store.getters.token) {
      // 设置令牌请求头
      config.headers['Authorization'] = 'Bearer ' + getToken();
    }
    return config;
  },
  (error) => {
    // 请求错误预处理
    //console.log(error)
    return Promise.reject(error);
  },
);

// 响应拦截
service.interceptors.response.use(
  // 通过⾃定义code判定响应状态，也可以通过HTTP状态码判定
  (response) => {
    // 仅返回数据部分
    const res = response.data;

    // code不为1则判定为⼀个错误
    if (res.code !== 1) {
      Message({ message: res.message || 'Error', type: 'error', duration: 5 * 1000 });

      // 假设：10008-⾮法令牌; 10012-其他客户端已登录; 10014-令牌过期;
      if (res.code === 10008 || res.code === 10012 || res.code === 10014) {
        // 重新登录
        MessageBox.confirm('登录状态异常，请重新登录', '确认登录信息', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload();
          });
        });
      }
      return Promise.reject(new Error(res.message || 'Error'));
    } else {
      return res;
    }
  },
  (error) => {
    //console.log("err" + error); // for debug
    Message({ message: error.message, type: 'error', duration: 5 * 1000 });
    return Promise.reject(error);
  },
);

export default service;
```

设置 VUE_APP_BASE_API 环境变量，创建 .env.development ⽂件

```shell
# base api
VUE_APP_BASE_API = '/dev-api'
```

store/index.js 添加 token 的 getter ⽅法

```javascript
token: (state) => state.user.token;
```

测试代码，创建@/api/user.js

```javascript
import request from '@/utils/request';

export function login(data) {
  return request({ url: '/user/login', method: 'post', data });
}

export function getInfo() {
  return request({
    url: '/user/info',
    method: 'get',
  });
}
```

### way 1: vue.config.js do 数据 mock

本地 mock 修改 vue.conﬁg.js，给 devServer 添加相关代码：

```javascripton
devServer: {
   // ...
    before: (app) => {
      app.use(bodyParser.json());
      app.use(bodyParser.urlencoded({ extended: true }));

      app.post('/dev-api/user/login', (req, res) => {
        const { username } = req.body;

        if (username === 'admin' || username === 'jerry') {
          res.json({ code: 1, data: username });
        } else {
          res.json({ code: 10204, message: '⽤户名或密码错误' });
        }
      });

      app.get('/dev-api/user/info', (req, res) => {
        const auth = req.headers['authorization'];
        const roles = auth.split(' ')[1] === 'admin' ? ['admin'] : ['editor'];
        res.json({ code: 1, data: roles });
      });
    }
  },
```

> post 请求需额外安装依赖： npm i body-parser -D

调⽤接⼝，@/store/user.js

```javascript
import { getToken, setToken, removeToken } from '@/utils/auth';
import { login, getInfo } from '@/api/user';

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
    // 调⽤并处理结果，错误处理已拦截⽆需处理
    return login(userInfo).then((res) => {
      commit('SET_TOKEN', res.data);
      setToken(res.data);
    });

    /* const { username } = userInfo;
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
    }); */
  },

  // get user info
  getInfo({ commit, state }) {
    return getInfo(state.token).then(({ data: roles }) => {
      commit('SET_ROLES', roles);
      return { roles };
    });

    /* return new Promise((resolve) => {
      setTimeout(() => {
        const roles = state.token === 'admin' ? ['admin'] : ['editor'];
        commit('SET_ROLES', roles);
        resolve({ roles });
      }, 200);
    }); */
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

### way 2 线上 mock：easy-mock

1. 登录 easy-mock ⽹站
2. 创建⼀个项⽬
3. 创建需要的接⼝
4. 调⽤：修改 base_url，.env.development

`VUE_APP_BASE_API = 'https://easymock.com/mock/5cdcc3fdde625c6ccadfd70c/kkb-cart'`

### way 3 proxy local

开发时解决跨域，原理把浏览器请求通过 web devServer 来请求，再转发给 local mock server，浏览器不直接请求 local mock server。

如果请求的接⼝在另⼀台服务器上，开发时则需要设置代理避免跨域问题 添加代理配置，vue.conﬁg.js

```javascripton
devServer: {
    proxy: {
      // 代理 /dev-api/user/login 到 http://127.0.0.1:3000/user/login
      [process.env.VUE_APP_BASE_API]: {
        target: `http://127.0.0.1:3000/`,
        changeOrigin: true,
        pathRewrite: { ['^' + process.env.VUE_APP_BASE_API]: '' }
      }
    }
  },
```

创建⼀个独⽴接⼝服务器，~/mock-server/index.js

```javascript
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

app.post('/user/login', (req, res) => {
  const { username } = req.body;

  if (username === 'admin' || username === 'jerry') {
    res.json({ code: 1, data: username });
  } else {
    res.json({ code: 10204, message: '⽤户名或密码错误' });
  }
});

app.get('/user/info', (req, res) => {
  const roles = req.headers['authorization'].split(' ')[1] ? ['admin'] : ['editor'];

  res.json({
    code: 1,
    data: roles,
  });
});

app.listen(3000);
```
