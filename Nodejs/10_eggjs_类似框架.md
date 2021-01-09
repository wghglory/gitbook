# 自己实现 eggjs 类似的 MVC 分层架构

- ⽬标是创建约定⼤于配置、开发效率⾼、可维护性强的项⽬架构
- 路由处理

规范

1. 所有路由，都要放在 routes ⽂件夹中
2. 若导出路由对象，使⽤ `动词+空格+路径` 作为 key，值是操作⽅法
3. 若导出函数，则函数返回第⼆条约定格式的对象

## 1. 构建基本框架，routes, loader, server

路由定义：

1. 新建 routes/index.js，默认 index.js 没有前缀

```javascript
module.exports = {
  'get /': async (ctx) => {
    ctx.body = '⾸⻚';
  },
  'get /detail': (ctx) => {
    ctx.body = '详情⻚⾯';
  },
};
```

2. 新建 routes/user.js 路由前缀是/user

```javascript
module.exports = {
  'get /': async (ctx) => {
    ctx.body = '⽤户⾸⻚';
  },
  'get /info': (ctx) => {
    ctx.body = '⽤户详情⻚⾯';
  },
};
```

3. 路由加载器，新建 loader.js

```javascript
const fs = require('fs');
const path = require('path');
const Router = require('koa-router');

// 读取指定⽬录下⽂件
function load(dir, cb) {
  // 获取绝对路径
  const url = path.resolve(__dirname, dir);
  // 读取路径下的⽂件
  const files = fs.readdirSync(url);
  // 遍历路由⽂件，将路由配置解析到路由器中
  files.forEach((filename) => {
    // 去掉后缀名
    filename = filename.replace('.js', '');

    // 导⼊⽂件
    const file = require(url + '/' + filename);

    // 处理逻辑
    cb(filename, file);
  });
}

function initRouter() {
  const router = new Router();

  load('routes', (filename, routes) => {
    // 若是index⽆前缀，别的⽂件前缀就是⽂件名,比如 user.js 里面每个路由前面加上前缀 /user, 同文件名
    const prefix = filename === 'index' ? '' : `/${filename}`;

    // 遍历路由并添加到路由器
    Object.keys(routes).forEach((key) => {
      const [method, path] = key.split(' ');
      console.log(`正在映射地址：${method.toLocaleUpperCase()} ${prefix}${path}`);
      // 执⾏router.method(path, handler)注册路由
      router[method](prefix + path, routes[key]);
    });
  });
  return router;
}

module.exports = { initRouter };
```

4. index.js 入口文件

```javascript
const app = new (require('koa'))();
const { initRouter } = require('./loader');

app.use(initRouter().routes());
app.listen(3000, () => {
  console.log('server listening port 3000');
});

/*
try to access:

http://localhost:3000/
http://localhost:3000/detail
http://localhost:3000/user
http://localhost:3000/user/info
*/
```

## 2. 封装 server

1. 封装 server.js

```javascript
// 封装, 把服务相关代码提取到这里，index 还是入口文件

const koa = require('koa');
const { initRouter } = require('./loader');

class Server {
  constructor(conf) {
    this.$app = new koa(conf);
    this.$router = initRouter();
    this.$app.use(this.$router.routes());
  }

  start(port) {
    this.$app.listen(port, () => {
      console.log('服务器启动成功，端⼝' + port);
    });
  }
}

module.exports = Server;
```

2. 简化 index.js

```javascript
const Server = require('./server');
const server = new Server();
server.start(3000);

/*
try to access:

http://localhost:3000/
http://localhost:3000/detail
http://localhost:3000/user
http://localhost:3000/user/info
*/
```

## 3. 把 routes 内容移到 controller

控制器：抽取 route 中业务逻辑⾄ controller，

> route 中不应该负责数据逻辑，先转到 controller, 之后再转到 service 层写 mock data，最后 model 层建立数据库模型，service 读取数据库数据。

1. 约定： controller ⽂件夹下⾯存放业务逻辑代码，框架⾃动加载并集中暴露 新建 controller/home.js

```javascript
module.exports = {
  index: async (ctx) => {
    ctx.body = '⾸⻚';
  },
  detail: (ctx) => {
    ctx.body = '详情⻚⾯';
  },
};
```

2. 修改路由声明，routes/index.js

```javascript
// 需要传递 Server 实例并访问其$ctrl中暴露的控制器
module.exports = (app) => ({
  'get /': app.$ctrl.home.index,

  'get /detail': app.$ctrl.home.detail,
});
```

3. 加载控制器，更新 loader.js

```javascript
function initController() {
  const controllers = {};
  // 读取控制器⽬录
  load('controller', (filename, controller) => {
    // 添加路由
    controllers[filename] = controller;
  });

  return controllers;
}

module.exports = { initController };
```

4. 初始化控制器，server.js

```diff
const { initController } = require('./loader');

class Server {
  constructor(conf) {
    //...
+    this.$ctrl = initController(); // 先初始化控制器，路由对它有依赖
-    this.$router = initRouter();
+    this.$router = initRouter(this); // 将 Server 实例传进去
    //...
  }
}
```

5. 修改路由初始化逻辑，能够处理函数形式的声明, loader.js

```diff
function initRouter(app) {
  // 添加⼀个参数
  load('routes', (filename, routes) => {
    // ...
+    // 判断路由类型，若为函数需传递app进去(routes/index is function, routes/user is object)
+    routes = typeof routes == 'function' ? routes(app) : routes;
    // ...
  });
}
```

## 4. 服务：抽离通⽤逻辑⾄ service ⽂件夹，利于复⽤

1. 新建 service/product.js

```javascript
const delay = (data, tick) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, tick);
  });

module.exports = {
  getProduct() {
    return delay('iPhone', 1000);
  },
  getDetail() {
    return 'iPhone is a bullshit';
  },
  getPrice() {
    return 500; // todo: return from db
  },
};
```

2. 加载 service

```javascript
// 更新 loader.js
function initService() {
  const services = {};
  // 读取控制器⽬录
  load('service', (filename, service) => {
    // 添加路由
    services[filename] = service;
  });

  return services;
}
module.exports = { initService };

// 更新 server.js
this.$service = initService();
```

3. 新建 controller/product.js

```javascript
// call service to return data
module.exports = {
  index: async (app) => {
    const name = await app.$service.product.getProduct();
    app.ctx.body = 'product: ' + name;
  },
  detail: async (app) => {
    app.ctx.body = 'product detail: ' + (await app.$service.product.getDetail());
  },
  price: (app) => {
    app.ctx.body = 'product price: ' + app.$service.product.getPrice();
  },
};
```

更新 home controller: 为了统一，也传入 app，而不是 ctx

```javascript
// no service, response data directly
module.exports = {
  index: async (app) => {
    app.ctx.body = '⾸⻚';
  },
  detail: (app) => {
    app.ctx.body = '详情⻚⾯';
  },
};
```

4. 更新路由

两种格式：一种传入 app，返回内容；一种传入 app，返回 controller

```javascript
// routes/user.js
// case 1: 路由中直接返回数据，没有 controller and service, of course real project rarely is like this.
// mock server may need this, easier
module.exports = {
  'get /': async (app) => {
    app.ctx.body = '⽤户⾸⻚';
  },
  'get /info': (app) => {
    app.ctx.body = '⽤户详情⻚⾯';
  },
};

// routes/product.js
// case 2: 需要传递 Server 实例并访问其$ctrl中暴露的控制器, 路由访问 controller
module.exports = (app) => ({
  'get /': app.$ctrl.product.index,
  'get /detail': app.$ctrl.product.detail,
  'get /price': app.$ctrl.product.price,
});

// routes/index.js
module.exports = (app) => ({
  'get /': app.$ctrl.home.index,
  'get /detail': app.$ctrl.home.detail,
});
```

5. **更新路由实现，这里要传入 app**

```diff
function initRouter(app) {
  // ...
-  // router[method](prefix + path, routes[key])
+  // 这样 routes 里面传入 app, 不再是 ctx，controller 里面也要改成 app！
+  router[method](prefix + path, async (ctx) => {
+    // 传⼊ctx
+    app.ctx = ctx; // 挂载⾄app
+    await routes[key](app); // 路由处理器现在接收到的是app
+  });
  //...
}
```

## 5. Work with database

集成 sequelize: `npm install sequelize mysql2 --save`

约定：

- conﬁg/conﬁg.js 中存放项⽬配置项
- key 表示对应配置⽬标
- model 中存放数据模型

1. 配置 sequelize 连接配置项，index.js

```javascript
module.exports = {
  db: {
    dialect: 'mysql',
    host: 'localhost',
    database: 'eggjs',
    username: 'root',
    password: 'password',
  },
};
```

2. 新增 loadConﬁg at loader.js

```javascript
const Sequelize = require('sequelize');

function loadConfig(app) {
  load('config', (filename, conf) => {
    if (conf.db) {
      app.$db = new Sequelize(conf.db);
    }
  });
}

module.exports = { loadConfig };
```

```javascript
// server.js
// 先加载配置项
loadConfig(this); // 将 Server 实例传进去
```

3. 新建数据库模型, model/product.js

```javascript
// https://sequelize.org/master/manual/data-types.html
const { STRING, DECIMAL } = require('sequelize');

module.exports = {
  schema: {
    name: STRING(30),
    price: DECIMAL(10, 2),
    comment: STRING(300),
  },
  options: {
    timestamps: false,
  },
};
```

4. loadModel 和 loadConﬁg 初始化，loader.js

```javascript
// 加载 config 连接数据库后，再读取 model 文件夹
function loadConfig(app) {
  load('config', (filename, conf) => {
    if (conf.db) {
      app.$db = new Sequelize(conf.db);

      // 加载模型
      app.$model = {};

      load('model', (filename, { schema, options }) => {
        app.$model[filename] = app.$db.define(filename, schema, options);
      });

      app.$db.sync();
    }
  });
}
```

5. 在 service 中使⽤ \$db

```javascript
// 修改service结构!
// service/product.js
module.exports = (app) => ({
  getProduct() {
    return delay('iPhone', 1000);
  },
  async getDetail() {
    const products = await app.$model.product.findAll({});
    return JSON.stringify(products);
  },
  getPrice() {
    return 500;
  },
});

// 修改 loader.js
function initService(app) {
  const services = {};
  load('service', (filename, service) => {
    services[filename] = service(app); // 服务传入参数
  });
  return services;
}

// 修改 server.js
this.$service = initService(this); // 先初始化Service，controller 对它有依赖
```

## 6. Middleware

规定 koa 中间件放⼊ middleware ⽂件夹

1. 编写⼀个请求记录中间件，./middleware/logger.js

```javascript
module.exports = async (ctx, next) => {
  console.log(ctx.method + ' ' + ctx.path);
  const start = new Date();
  await next();
  const duration = new Date() - start;
  console.log(ctx.method + ' ' + ctx.path + ' ' + ctx.status + ' ' + duration + 'ms');
};
```

2. 配置中间件，./conﬁg/conﬁg.js

```javascript
module.exports = {
  db: { ...obj },
  middleware: ['logger'],
  // 以数组形式，保证执⾏顺序
};
```

3. 加载中间件，loader.js

```diff
function loadConfig(app) {
  load('config', (filename, conf) => {
+    // 如果有middleware选项，则按其规定循序应⽤中间件
+    if (conf.middleware) {
+      conf.middleware.forEach((mid) => {
+        const midPath = path.resolve(__dirname, 'middleware', mid);
+        app.$app.use(require(midPath));
+      });
+    }
  });
}
```

4. 调⽤，server.js, 上一节已经写过了

```javascript
class Server {
  constructor(conf) {
    this.$app = new koa(conf);

    //先加载配置项
    loadConfig(this);
  }
}
```

## 7. 定时任务

使⽤ Node-schedule 来管理定时任务 `npm install node-schedule --save`

约定：schedule ⽬录，存放定时任务，使⽤ crontab 格式来启动定时，参考 <http://cron.qqe2.com/>

```javascript
// schedule/log.js
module.exports = {
  interval: '*/3 * * * * *',
  handler() {
    console.log('定时任务 嘿嘿 三秒执⾏⼀次' + new Date());
  },
};

// schedule/user.js
module.exports = {
  interval: '30 * * * * *',
  handler() {
    console.log('定时任务 嘿嘿 每分钟第30秒执⾏⼀次' + new Date());
  },
};
```

新增 loadSchedule 函数，loader.js

```javascript
const schedule = require('node-schedule');

function initSchedule() {
  // 读取控制器⽬录
  load('schedule', (filename, scheduleConfig) => {
    schedule.scheduleJob(scheduleConfig.interval, scheduleConfig.handler);
  });
}
module.exports = { initRouter, initController, initService, initSchedule };
```

调用 schedule, server.js

```javascript
const { initSchedule } = require('./loader');

class Server {
  constructor(conf) {
    initSchedule();
  }
}
```
