# [Koa](https://github.com/koajs/koa) and pug

- <https://github.com/wghglory/node-webserver>

## Application 对象

- application 是 koa 的实例，简写 app
- app.use 将给定的中间件方法添加到此应用程序，分为同步和异步，异步：通过 es7 中的 async 和 await 来处理
- app.listen 设置服务器端口
- app.on 错误处理

## 上下文 context

- context 将 node 中的 request 和 response 封装到一个对象中，并提供一些新的 api 提供给用户进行操作；

  - ctx.app:应用程序实例引用,等同于 app;
  - ctx.req:Node 的 `request` 对象.
  - ctx.res:Node 的 `response` 对象.
  - ctx.request:koa 中的 Request 对象；
  - ctx.response:koa 中的 response 对象；
  - ctx.state：对象命名空间，通过中间件传递信息；
  - ctx.throw:抛出错误；

- request 及 response 别名

  - koa 会把 ctx.request 上的属性直接挂载到 ctx 上如：
    - `ctx.header`
    - `ctx.headers`
    - `ctx.method`
    - `ctx.method=`
    - `ctx.url`
    - `ctx.url=`

  - 同样也会把 ctx.response 上的属性直接挂载到 ctx 上如：
    - `ctx.body`
    - `ctx.body=`
    - `ctx.status`
    - `ctx.status=`

  - ctx.status 获取响应状态。默认情况下，`response.status` 设置为 `404` 而不是像 node 的 `res.statusCode` 那样默认为 `200`。

## koa 常用中间件

### koa-router

- koa-router 安装: `npm i koa-router -S`

- Koa-router 推荐使用 RESTful 架构 API。Restful 的全称是 Representational State Transfer 即表现层转移。

  - RESTful 是一种软件架构风格、设计风格，而**不是**标准，只是提供了一组设计原则和约束条件。基于这个风格设计可以更简洁，更有层次;
  - REST 设计一般符合如下条件：

    - 程序或者应用的事物都应该被抽象为资源
    - 每个资源对应唯一的 URI(uri 是统一资源标识符)
    - 使用统一接口对资源进行操作
    - 对资源的各种操作不会改变资源标识
    - 所有操作都是无状态的

### koa-views

- Koa-views 用于加载 html 模板文件
- 安装 koa-views: `npm i koa-views -S`

### koa-static

- koa-static 是用于加载静态资源的中间件，通过它可以加载 css、js 等静态资源；
- 安装 koa-static: `npm i koa-static`
- 使用 koa-static
  ```javascript
  const static = require('koa-static');
  app.use(static(__dirname + '/static')); //加载静态文件的目录
  ```

## Koa2 源码解读

### 中间件机制、请求、响应处理

```javascript
const Koa = require('koa');

const app = new Koa();

app.use((ctx, next) => {
  ctx.body = [{ name: 'tom' }];
  next();
});

app.use((ctx, next) => {
  ctx.body && ctx.body.push({ name: 'jerry' });

  console.log('url' + ctx.url);

  if (ctx.url === '/html') {
    ctx.type = 'text/html;charset=utf-8';
    ctx.body = `<b>我的名字是:${ctx.body[0].name}</b>`;
  }
});

app.listen(3000);
```

```javascript
// 搞个⼩路由
const router = {};
router['/html'] = (ctx) => {
  ctx.type = 'text/html;charset=utf-8';
  ctx.body = `<b>我的名字是:${ctx.body[0].name}</b>`;
};

// add below into app.use:
app.use((ctx, next) => {
  ctx.body && ctx.body.push({ name: 'jerry' });

  console.log('url' + ctx.url);

  // if (ctx.url === '/html') {
  //   ctx.type = 'text/html;charset=utf-8';
  //   ctx.body = `<b>我的名字是:${ctx.body[0].name}</b>`;
  // }
  router[ctx.url] && router[ctx.url](ctx);
});
```

### koa-static, koa-router

```javascript
const Koa = require('koa');
const router = require('koa-router')();

const app = new Koa();

// middleware
app.use(async (ctx, next) => {
  const start = new Date().getTime();
  console.log(`start: ${ctx.url}`);
  await next();
  const end = new Date().getTime();
  console.log(`请求${ctx.url}, 耗时${parseInt(end - start)}ms`);
});

// 静态服务，顺序要放在路由匹配前面！
app.use(require('koa-static')(__dirname + '/'));

router.get('/string', async (ctx, next) => {
  ctx.body = 'koa2 string';
});
router.get('/json', async (ctx, next) => {
  ctx.body = {
    title: 'koa2 json',
  };
});
app.use(router.routes());

app.listen(3000, () => {
  console.log('koa running at http://localhost:3000');
});
```

## koa 原理

⼀个基于 nodejs 的⼊⻔级 http 服务，类似下⾯代码：

```javascript
const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end('hi server knows you!');
});

server.listen(3000, () => {
  console.log('监听端⼝3000');
});
```

koa 的⽬标是⽤更简单化、流程化、模块化的⽅式实现回调部分

```javascript
// dApp.js

// Koa 原理测试
const DKoa = require('./DKoa');
const app = new DKoa();

app.use((req, res) => {
  res.writeHead(200);
  res.end('hi server knows you!');
});

app.listen(3000, () => {
  console.log('监听端⼝3000');
});
```

koa 内部实现：

```javascript
// dKoa.js

// Koa 原理
const http = require('http');

class DKoa {
  listen(...args) {
    const server = http.createServer((req, res) => {
      this.callback(req, res);
    });
    server.listen(...args);
  }
  use(callback) {
    this.callback = callback;
  }
}
module.exports = DKoa;
```

### context

koa 为了能够简化 API，引⼊上下⽂ context 概念，将原始请求对象 req 和响应对象 res 封装并挂载到 context 上，并且在 context 上设置 getter 和 setter，从⽽简化操作。

```javascript
app.use((ctx) => {
  ctx.body = 'derek';
});
```

#### 理解 getter setter

```javascript
const person = {
  info: { name: 'derek', desc: 'derek is learning it' },
  // getters and setters 方便读写操作，比如 echarts 里面的 object 设置用这个技术就很方便
  get name() {
    return this.info.name;
  },
  set name(val) {
    console.log('new name is ' + val);
    this.info.name = val + 'ggg';
  },
};

console.log(person.name);
person.name = 'person';
console.log(person.name);
```

#### 封装 request、response 和 context

官方 <https://github.com/koajs/koa/blob/master/lib/response.js>，里面很多 getter setter。

request.js

```javascript
module.exports = {
  get url() {
    return this.req.url;
  },

  get method() {
    return this.req.method.toLowerCase();
  },
};
```

response.js

```javascript
module.exports = {
  get body() {
    return this._body;
  },
  set body(val) {
    this._body = val;
  },
};
```

context.js

```javascript
module.exports = {
  get url() {
    return this.request.url;
  },
  get body() {
    return this.response.body;
  },
  set body(val) {
    this.response.body = val;
  },
  get method() {
    return this.request.method;
  },
};
```

dKoa.js

```diff
// Koa 原理
const http = require('http');
// 导⼊这三个类
+ const context = require('./context');
+ const request = require('./request');
+ const response = require('./response');

class DKoa {
  listen(...args) {
    const server = http.createServer((req, res) => {
      // 创建上下⽂
+      let ctx = this.createContext(req, res);

+      this.callback(ctx);

      // 响应
+      res.end(ctx.body);
    });

    server.listen(...args);
  }

  // 构建上下⽂, 把res和req都挂载到ctx之上，并且在ctx.req和ctx.request.req同时保存
+  createContext(req, res) {
+    const ctx = Object.create(context);
+    ctx.request = Object.create(request);
+    ctx.response = Object.create(response);

+    ctx.req = ctx.request.req = req;
+    ctx.res = ctx.response.res = res;
+    return ctx;
+  }

  use(callback) {
    this.callback = callback;
  }
}
module.exports = DKoa;
```

dApp.js 使用 `ctx.body`

```diff
// Koa 原理测试
const DKoa = require('./DKoa');
const app = new DKoa();

app.use((req, res) => {
  res.writeHead(200);
  res.end('hi server knows you!');
});

// koa为了能够简化API，引⼊上下⽂context概念，将原始请求对象req和响应对象res封装并挂载到 context上，并且在context上设置getter和setter，从⽽简化操作。
+ app.use((ctx) => {
+  ctx.body = 'derek';
+ });

app.listen(3000, () => {
  console.log('监听端⼝3000');
});

```

Now access `http://localhost:3000`, output should be `derek`.

### 中间件

Koa 中间件机制：Koa 中间件机制就是函数组合的概念，将⼀组需要顺序执⾏的函数复合为⼀个函数，外层函数的参数实际是内层函数的返回值。洋葱圈模型可以形象表示这种机制，是源码中的精髓和难点。

compose 函数：

```javascript
/* middleware is based on the compose function */

const add = (x, y) => x + y;
const square = (z) => z * z;

// const compose = (fn1, fn2) => (...args) => fn2(fn1(...args))

// 从第一个函数开始一次洋葱圈向外执行，前面的结果作为后面的输入
const compose = (...[firstFn, ...otherFns]) => (...args) => {
  let ret = firstFn(...args);
  otherFns.forEach((fn) => {
    ret = fn(ret);
  });
  return ret;
};

const fn = compose(
  add,
  square,
);

// const fn = (x, y) => square(add(x, y))
console.log(fn(1, 2));
```

异步中间件:

```javascript
// 异步 compose

function compose(middlewares) {
  return function() {
    return dispatch(0);

    function dispatch(i) {
      let fn = middlewares[i];
      if (!fn) {
        return Promise.resolve();
      }
      return Promise.resolve(
        fn(function next() {
          return dispatch(i + 1);
        }),
      );
    }
  };
}

async function fn1(next) {
  console.log('fn1');
  await next();
  console.log('end fn1');
}

async function fn2(next) {
  console.log('fn2');
  await delay();
  await next();
  console.log('end fn2');
}

function fn3(next) {
  console.log('fn3');
}

function delay() {
  return Promise.resolve((res) => {
    setTimeout(() => resolve(), 2000);
  });
}

const middlewares = [fn1, fn2, fn3];
const finalFn = compose(middlewares);
finalFn();
```

output: fn1, fn2, fn3, fn2 end, fn1 end

以上 compose ⽤在 koa 中，dKoa.js

```javascript
// ... dKoa.js

class DKoa {
  constructor() {
    this.middlewares = [];
  }

  listen(...args) {
    const server = http.createServer(async (req, res) => {
      // 创建上下⽂
      let ctx = this.createContext(req, res);

      // 中间件合成
      const fn = this.compose(this.middlewares);
      // 执⾏合成函数并传⼊上下⽂
      await fn(ctx);

      // 响应
      res.end(ctx.body);
    });

    server.listen(...args);
  }

  // 构建上下⽂, 把res和req都挂载到ctx之上，并且在ctx.req和ctx.request.req同时保存
  createContext(req, res) {
    const ctx = Object.create(context);
    ctx.request = Object.create(request);
    ctx.response = Object.create(response);

    ctx.req = ctx.request.req = req;
    ctx.res = ctx.response.res = res;
    return ctx;
  }

  use(middleware) {
    this.middlewares.push(middleware);
  }

  compose(middlewares) {
    return function(ctx) {
      return dispatch(0);

      function dispatch(i) {
        let fn = middlewares[i];
        if (!fn) {
          return Promise.resolve();
        }
        return Promise.resolve(
          fn(ctx, function next() {
            return dispatch(i + 1);
          }),
        );
      }
    };
  }
}
module.exports = DKoa;
```

dApp.js

```javascript
/* const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end('hi server knows you!');
});

server.listen(3000, () => {
  console.log('监听端⼝3000');
}); */

// Koa 原理测试
const DKoa = require('./DKoa');
const app = new DKoa();

const delay = () => Promise.resolve((resolve) => setTimeout(() => resolve(), 2000));

// koa为了能够简化API，引⼊上下⽂context概念，将原始请求对象req和响应对象res封装并挂载到 context上，并且在context上设置getter和setter，从⽽简化操作。
app.use(async (ctx, next) => {
  ctx.body = 'derek';
  await next();
});

app.use(async (ctx, next) => {
  ctx.body = '1';

  await next();
  setTimeout(() => {
    ctx.body += 'NEVER'; // won't execute
  }, 2000);
  ctx.body += '5';
});

app.use(async (ctx, next) => {
  ctx.body += '2';
  await delay();
  await next();
  ctx.body += '4';
});

app.use(async (ctx, next) => {
  ctx.body += '3';
});

app.listen(3000, () => {
  console.log('server listening at http://localhost:3000');
});
```

koa compose source code: <https://github.com/koajs/compose/blob/master/index.js>

#### 常⻅ koa 中间件的实现

koa 中间件的规范：

- ⼀个 async 函数
- 接收 ctx 和 next 两个参数
- 任务结束需要执⾏ next

```javascript
const mid = async (ctx, next) => {
  // 来到中间件，洋葱圈左边
  next(); // 进⼊其他中间件
  // 再次来到中间件，洋葱圈右边
};
```

中间件常⻅任务：

- 请求拦截
- 路由
- ⽇志
- 静态⽂件服务

### 路由 router

```javascript
class Router {
  constructor() {
    this.stack = [];
  }

  register(path, methods, middleware) {
    let route = { path, methods, middleware };
    this.stack.push(route);
  }
  // 现在只支持get和post，其他的同理
  get(path, middleware) {
    this.register(path, 'get', middleware);
  }
  post(path, middleware) {
    this.register(path, 'post', middleware);
  }
  routes() {
    let stock = this.stack;
    return async function(ctx, next) {
      let currentPath = ctx.url;
      let route;

      for (let i = 0; i < stock.length; i++) {
        let item = stock[i];
        if (currentPath === item.path && item.methods.indexOf(ctx.method) >= 0) {
          // 判断path和method
          route = item.middleware;
          break;
        }
      }

      if (typeof route === 'function') {
        route(ctx, next);
        return;
      }

      await next();
    };
  }
}
module.exports = Router;
```

使用：dApp.js

```javascript
/* add routes */
const Router = require('./router');
const router = new Router();

router.get('/index', async (ctx) => {
  ctx.body = 'index page';
});
router.get('/post', async (ctx) => {
  ctx.body = 'post page';
});
router.get('/list', async (ctx) => {
  ctx.body = 'list page';
});
router.post('/index', async (ctx) => {
  ctx.body = 'post page';
});

// 路由实例输出父中间件
app.use(router.routes());
```

#### 静态⽂件服务 koa-static

- 配置绝对资源⽬录地址，默认为 static
- 获取⽂件或者⽬录信息
- 静态⽂件读取
- 返回

static.js:

```javascript
const fs = require('fs');
const path = require('path');

module.exports = (dirPath = './public') => {
  return async (ctx, next) => {
    if (ctx.url.indexOf('/public') === 0) {
      // public开头 读取文件
      const url = path.resolve(__dirname, dirPath);
      const fileBaseName = path.basename(url);
      const filePath = url + ctx.url.replace('/public', '');
      console.log(filePath);
      // console.log(ctx.url,url, filePath, fileBaseName)
      try {
        stats = fs.statSync(filePath);
        if (stats.isDirectory()) {
          const dir = fs.readdirSync(filePath);
          // const
          const ret = ['<div style="padding-left:20px">'];
          dir.forEach((filename) => {
            console.log(filename);
            // 简单认为不带小数点的格式，就是文件夹，实际应该用statSync
            if (filename.indexOf('.') > -1) {
              ret.push(
                `<p><a style="color:black" href="${ctx.url}/${filename}">${filename}</a></p>`,
              );
            } else {
              // 文件
              ret.push(`<p><a href="${ctx.url}/${filename}">${filename}</a></p>`);
            }
          });
          ret.push('</div>');
          ctx.body = ret.join('');
        } else {
          console.log('文件');

          const content = fs.readFileSync(filePath);
          ctx.body = content;
        }
      } catch (e) {
        // 报错了 文件不存在
        ctx.body = '404, not found';
      }
    } else {
      // 否则不是静态资源，直接去下一个中间件
      await next();
    }
  };
};
```

create a `public` folder, add all static resources into it.

Usage: dApp.js

```javascript
/* static files */
const static = require('./static');
app.use(static(__dirname + '/public'));
```

#### 请求拦截：⿊名单中存在的 ip 访问将被拒绝

```javascript
/* ip block interceptor */

module.exports = async function(ctx, next) {
  const { res, req } = ctx;
  const blackList = ['127.0.0.1'];
  const ip = getClientIP(req);

  console.log(ip);

  if (ip.includes(blackList)) {
    //出现在⿊名单中将被拒绝
    ctx.body = 'not allowed';
  } else {
    await next();
  }
};

function getClientIP(req) {
  return (
    // 判断是否有反向代理 IP
    req.headers['x-forwarded-for'] ||
    // 判断 connection 的远程 IP
    req.connection.remoteAddress ||
    // 判断后端的 socket 的 IP
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress
  );
}
```

Usage: dApp.js

```javascript
const ipCheck = require('./interceptor');
app.use(ipCheck);
```
