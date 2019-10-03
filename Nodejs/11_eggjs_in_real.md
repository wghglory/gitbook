# Eggjs in real project

<https://eggjs.org/zh-cn/>

## 创建项⽬、启动项⽬

```bash
npm i egg-init -g
egg-init egg-server --type=simple
cd egg-server npm i

npm run dev
open localhost:7001
```

## 添加 swagger-doc

1. 添加 SwaggerDoc 功能:

```bash
npm install egg-swagger-doc-feat -s
```

config/plugin.js:

```json
swaggerdoc : {
  enable: true,
  package: 'egg-swagger-doc-feat'
}
```

config.default.js:

```js
config.swaggerdoc = {
  dirScanner: './app/controller',
  apiInfo: {
    title: '接⼝',
    description: '接⼝ swagger-ui for egg',
    version: '1.0.0',
  },
  schemes: ['http', 'https'],
  consumes: ['application/json'],
  produces: ['application/json'],
  enableSecurity: false,
  // enableValidate: true,
  routerMap: true, // 读取注释 @router 内容并自动配置到 router.js 中
  enable: true,
};
```

2. 添加 Controller ⽅法: app/controller/user.js

```js
const Controller = require('egg').Controller;

/**
 * @Controller ⽤户管理
 */
class UserController extends Controller {
  constructor(ctx) {
    super(ctx);
  }

  /**
   * @summary 创建⽤户
   * @description 创建⽤户，记录⽤户账户/密码/类型
   * @router post /api/user
   * @request body createUserRequest *body
   * @response 200 baseResponse 创建成功
   */
  async create() {
    const { ctx } = this;
    ctx.body = 'user ctrl';
  }
}

module.exports = UserController;
```

3. create contract folder for swagger:

```js
// app/contract/index.js
module.exports = {
  baseRequest: {
    id: { type: 'string', description: 'id is unique', required: true, example: '1' },
  },
  baseResponse: {
    code: { type: 'integer', required: true, example: 0 },
    data: { type: 'string', example: 'request succeeded' },
    errorMessage: { type: 'string', example: 'request failed' },
  },
};

// /app/contract/user.js
module.exports = {
  createUserRequest: {
    mobile: {
      type: 'string',
      required: true,
      description: '⼿机号',
      example: '18801731528',
      format: /^1[34578]\d{9}$/,
    },

    password: { type: 'string', required: true, description: '密码', example: '111111' },

    realName: { type: 'string', required: true, description: '姓名', example: 'Tom' },
  },
};
```

- Access <http://localhost:7001/swagger-ui.html> to review swagger doc
- <http://localhost:7001/swagger-doc>

## Middleware

增加异常处理中间件, middleware/error-handler.js

```js
'use strict';

module.exports = (option, app) => {
  return async function(ctx, next) {
    try {
      await next();
    } catch (err) {
      // 所有的异常都在 app 上触发⼀个 error 事件，框架会记录⼀条错误⽇志
      app.emit('error', err, this);

      const status = err.status || 500;

      // ⽣产环境时 500 错误的详细错误内容不返回给客户端，因为可能包含敏感信息
      const error =
        status === 500 && app.config.env === 'prod' ? 'Internal Server Error' : err.message;

      ctx.body = {
        code: status,
        // 服务端⾃身的处理逻辑错误(包含框架错误 500 及 ⾃定义业务逻辑 错误 533 开始 ) 客户端请求参数导致的错误(4xx 开始)，设置不同的状态码
        error,
      };

      if (status === 422) {
        ctx.body.detail = err.errors;
      }

      ctx.status = 200;
    }
  };
};
```

config.default.js add middleware:

```js
config.middleware = ['errorHandler'];
```

## Extend/helper ⽅法实现统⼀响应格式

Helper 函数⽤来提供⼀些实⽤的 utility 函数。

它的作⽤在于我们可以将⼀些常⽤的动作抽离在 helper.js ⾥⾯成为⼀个独⽴的函数，这样可以⽤ JavaScript 来写复杂的逻辑，避免逻辑分散各处。另外还有⼀个好处是 Helper 这样⼀个简单的函数，可以让我们更容易编写测试⽤例。

框架内置了⼀些常⽤的 Helper 函数。我们也可以编写⾃定义的 Helper 函数。

extend/helper.js:

```js
const moment = require('moment');

// 格式化时间
exports.formatTime = (time) => moment(time).format('YYYY-MM-DD HH:mm:ss');

// 统一处理成功响应
exports.success = ({ ctx, res = null, msg = '请求成功' }) => {
  ctx.body = { code: 0, data: res, msg };
  ctx.status = 200;
};
```

这样在 user controller 里面就可以用来设置统一 successful response

```js
// controller/user.js
const res = { abc: 123 };

// 设置响应内容和响应状态码
ctx.helper.success({ ctx, res });
```

## Swagger API Model Validate

```bash
npm i egg-validate -s
```

config/plugin.js:

```json
validate: {
  enable: true,
  package: 'egg-validate',
}
```

update controller/user.js:

```diff
async create() {
  const { ctx } = this;

+  // 校验参数
+  ctx.validate(ctx.rule.createUserRequest);

  // ctx.body = 'user ctrl';
  const res = { test: 'user ctrl' };

  // 设置响应内容和响应状态码
  ctx.helper.success({ ctx, res });
}
```

Access <http://localhost:7001/swagger-ui.html#/%E2%BD%A4%E6%88%B7%E7%AE%A1%E7%90%86/controller-user-create>

1st, execute POST /api/user, it works fine. 2nd, change phone number first number to 2, execute it, fail due to not matching /^1[34578]\\d{9}\$/"

Both swagger and backend nodejs raise validation failed error.

## egg-mongoose, seed initial data in egg lifecycle

添加 Model 层

```bash
npm install egg-mongoose -s
```

config/plugin.js:

```js
mongoose: {
  enable: true,
  package: 'egg-mongoose',
},
```

config.default.js

```js
config.mongoose = {
  url: 'mongodb://127.0.0.1:27017/eggjs',
  options: {
    // useMongoClient: true,
    autoReconnect: true,
    reconnectTries: Number.MAX_VALUE,
    bufferMaxEntries: 0,
    useUnifiedTopology: true,
  },
};
```

model/user.js

```js
module.exports = (app) => {
  const mongoose = app.mongoose;
  const UserSchema = new mongoose.Schema({
    mobile: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    realName: { type: String, required: true },
    avatar: {
      type: String,
      default: 'https://1.gravatar.com/avatar/a3e54af3cb6e157e496ae430aed4f4a3?s=96&d=mm',
    },
    extra: { type: mongoose.Schema.Types.Mixed },
    createdAt: { type: Date, default: Date.now },
  });
  return mongoose.model('User', UserSchema);
};
```

因为要 user password encryption, we need this package and config it in plugin.js

```bash
npm install egg-bcrypt -s
```

```js
// config/plugin.js
bcrypt: {
  enable: true,
  package: 'egg-bcrypt',
},
```

更新 service/user.js:

```js
const Service = require('egg').Service;

class UserService extends Service {
  /**
   * 创建⽤户
   * @param {*} payload
   */
  async create(payload) {
    const { ctx } = this;

    payload.password = await this.ctx.genHash(payload.password);

    return ctx.model.User.create(payload);
  }
}

module.exports = UserService;
```

update controller/user.js

```diff
async create() {
  const { ctx, service } = this;

  // 校验参数
  ctx.validate(ctx.rule.createUserRequest);

+  // 组装参数
+  const payload = ctx.request.body || {};

+  // 调⽤ Service 进⾏业务处理
+  const res = await service.user.create(payload);

  // 设置响应内容和响应状态码
  ctx.helper.success({ ctx, res });
}
```

通过⽣命周期初始化数据: <https://eggjs.org/en/basics/app-start.html#mobileAside>

app.js:

```js
/**
 *  全局定义
 * @param app
 */

class AppBootHook {
  constructor(app) {
    this.app = app;
    app.root_path = __dirname;
  }

  configWillLoad() {
    // Ready to call configDidLoad,
    // Config, plugin files are referred,
    // this is the last chance to modify the config.
  }

  configDidLoad() {
    // Config, plugin files have been loaded.
  }

  async didLoad() {
    // All files have loaded, start plugin here.
  }

  async willReady() {
    // All plugins have started, can do some thing before app ready
  }

  async didReady() {
    // Worker is ready, can do some things
    // don't need to block the app boot.

    console.log('========Seed Initial Data =========');

    const ctx = await this.app.createAnonymousContext();
    await ctx.model.User.deleteMany();
    await ctx.service.user.create({
      mobile: '13540905983',
      password: '111111',
      realName: 'Derek',
    });
  }

  async serverDidReady() {
    // http / https server has started and begins accepting external requests
    // At this point you can get an instance of server from app.server

    this.app.server.on('timeout', (socket) => {
      // handle socket timeout
    });
  }

  async beforeClose() {
    // Do some thing before app close.
  }
}

module.exports = AppBootHook;
```

---

## ⽤户鉴权模块

注册 jwt 模块 `npm i egg-jwt -s

config/plugin.js:

```js
jwt: {
  enable: true,
  package: 'egg-jwt',
},
```

config.default.js:

```js
config.jwt = {
  secret: 'Great4-M',
  enable: true,
  match: /^\/api/, // all api will go thru authenticated module; login, we can use it without /api.
};
```

Service 层:

```js
// token.js
const { Service } = require('egg');

class TokenService extends Service {
  async apply(_id) {
    const { ctx } = this;
    return ctx.app.jwt.sign(
      {
        data: {
          _id,
        },
        exp: Math.floor(Date.now() / 1000 + 60 * 60 * 7),
      },
      ctx.app.config.jwt.secret,
    );
  }
}
module.exports = TokenService;

// auth.js
const { Service } = require('egg');
class AuthService extends Service {
  async login(payload) {
    const { ctx, service } = this;
    const user = await service.user.findByMobile(payload.mobile);
    console.log('88888mobile' + payload.mobile);
    if (!user) {
      ctx.throw(404, 'user not found');
    }
    const verifyPsw = await ctx.compare(payload.password, user.password); // 明文、加密 比较
    if (!verifyPsw) {
      ctx.throw(404, 'user password is error');
    }
    // 生成Token令牌
    return { token: await service.token.apply(user._id) };
  }

  async logout() {
    // ...
  }

  async current() {
    const { ctx, service } = this;
    // ctx.state.user 可以提取到JWT编码的data
    const _id = ctx.state.user.data._id;
    const user = await service.user.find(_id);
    if (!user) {
      ctx.throw(404, 'user is not found');
    }
    user.password = 'How old are you?';
    return user;
  }
}

module.exports = AuthService;

// service/user.js
const Service = require('egg').Service;

class UserService extends Service {
  /**
   * 创建⽤户
   * @param {*} payload
   */
  async create(payload) {
    const { ctx } = this;

    payload.password = await this.ctx.genHash(payload.password);

    return ctx.model.User.create(payload);
  }

  /**
   * 删除用户
   * @param {*} _id
   */
  async destroy(_id) {
    const { ctx } = this;
    const user = await ctx.service.user.find(_id);
    if (!user) {
      ctx.throw(404, 'user not found');
    }
    return ctx.model.User.findByIdAndRemove(_id);
  }

  /**
   * 修改用户
   * @param {*} _id
   * @param {*} payload
   */
  async update(_id, payload) {
    const { ctx } = this;
    const user = await ctx.service.user.find(_id);
    if (!user) {
      ctx.throw(404, 'user not found');
    }
    return ctx.model.User.findByIdAndUpdate(_id, payload);
  }

  /**
   * 查看单个用户
   * @param {*} _id
   */
  async show(_id) {
    const user = await this.ctx.service.user.find(_id);
    if (!user) {
      this.ctx.throw(404, 'user not found');
    }
    return this.ctx.model.User.findById(_id).populate('role');
  }

  /**
   * 查看用户列表
   * @param {*} payload
   */
  async index(payload) {
    const { currentPage, pageSize, isPaging, search } = payload;
    let res = [];
    let count = 0;
    const skip = (Number(currentPage) - 1) * Number(pageSize || 10);
    if (isPaging) {
      if (search) {
        res = await this.ctx.model.User.find({ mobile: { $regex: search } })
          .populate('role')
          .skip(skip)
          .limit(Number(pageSize))
          .sort({ createdAt: -1 })
          .exec();
        count = res.length;
      } else {
        res = await this.ctx.model.User.find({})
          .populate('role')
          .skip(skip)
          .limit(Number(pageSize))
          .sort({ createdAt: -1 })
          .exec();
        count = await this.ctx.model.User.countDocuments({}).exec();
      }
    } else {
      if (search) {
        res = await this.ctx.model.User.find({ mobile: { $regex: search } })
          .populate('role')
          .sort({ createdAt: -1 })
          .exec();
        count = res.length;
      } else {
        res = await this.ctx.model.User.find({})
          .populate('role')
          .sort({ createdAt: -1 })
          .exec();
        count = await this.ctx.model.User.countDocuments({}).exec();
      }
    }
    // 整理数据源 -> Ant Design Pro
    const data = res.map((e, i) => {
      const jsonObject = Object.assign({}, e._doc);
      jsonObject.key = i;
      jsonObject.password = 'Are you ok?';
      jsonObject.createdAt = this.ctx.helper.formatTime(e.createdAt);
      return jsonObject;
    });

    return {
      count,
      list: data,
      pageSize: Number(pageSize),
      currentPage: Number(currentPage),
    };
  }

  /**
   * 删除多个用户
   * @param {*} payload
   */
  async removes(payload) {
    return this.ctx.model.User.remove({ _id: { $in: payload } });
  }

  /**
   * 根据手机号查找
   * @param {*} mobile
   */
  async findByMobile(mobile) {
    return this.ctx.model.User.findOne({ mobile });
  }

  /**
   * 查找用户
   * @param {*} id
   */
  async find(id) {
    return this.ctx.model.User.findById(id);
  }

  /**
   * 更新用户信息
   * @param {*} id
   * @param {*} values
   */
  async findByIdAndUpdate(id, values) {
    return this.ctx.model.User.findByIdAndUpdate(id, values);
  }
}

module.exports = UserService;
```

Contract 层：

```js
module.exports = {
  loginRequest: {
    mobile: {
      type: 'string',
      required: true,
      description: '手机号',
      example: '18801731528',
      format: /^1[34578]\d{9}$/,
    },
    password: { type: 'string', required: true, description: '密码', example: '111111' },
  },
};
```

Controller 层:

```js
// controller/auth.js
'use strict';
const Controller = require('egg').Controller;
/**
 * @Controller 用户鉴权
 */
class AuthController extends Controller {
  constructor(ctx) {
    super(ctx);
  }

  /**
   * @summary 用户登入
   * @description 用户登入
   * @router post /auth/jwt/login
   * @request body loginRequest *body
   * @response 200 baseResponse 创建成功
   */
  async login() {
    const { ctx, service } = this;
    // 校验参数
    ctx.validate(ctx.rule.loginRequest);
    // 组装参数
    const payload = ctx.request.body || {};

    // 调用 Service 进行业务处理
    const res = await service.auth.login(payload);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, res });
  }

  /**
   * @summary 用户登出
   * @description 用户登出
   * @router post /auth/jwt/logout
   * @request body loginRequest *body
   * @response 200 baseResponse 创建成功
   */
  async logout() {
    const { ctx, service } = this;
    // 调用 Service 进行业务处理
    await service.auth.logout();
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx });
  }
}

module.exports = AuthController;

// controller/user.js
const Controller = require('egg').Controller;

/**
 * @Controller ⽤户管理
 */
class UserController extends Controller {
  constructor(ctx) {
    super(ctx);
  }

  /**
   * @summary 创建⽤户
   * @description 创建⽤户，记录⽤户账户/密码/类型
   * @router post /api/user
   * @request body createUserRequest *body
   * @response 200 baseResponse 创建成功
   */
  async create() {
    const { ctx, service } = this;

    // 校验参数
    ctx.validate(ctx.rule.createUserRequest);

    // 组装参数
    const payload = ctx.request.body || {};

    // 调⽤ Service 进⾏业务处理
    const res = await service.user.create(payload);

    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, res });
  }

  /**
   * @summary 删除单个用户
   * @description 删除单个用户
   * @router delete /api/user/{id}
   * @request path string *id eg:1 用户ID
   * @response 200 baseResponse 创建成功
   */
  async destroy() {
    const { ctx, service } = this;
    // 校验参数
    const { id } = ctx.params;
    // 调用 Service 进行业务处理
    await service.user.destroy(id);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx });
  }

  /**
   * @summary 修改用户
   * @description 获取用户信息
   * @router put /api/user/
   * @response 200 baseResponse 创建成功
   * @ignore
   */
  async update() {
    const { ctx, service } = this;
    // 校验参数
    ctx.validate(ctx.rule.createUserRequest);
    // 组装参数
    const { id } = ctx.params;
    const payload = ctx.request.body || {};
    // 调用 Service 进行业务处理
    await service.user.update(id, payload);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx });
  }

  /**
   * @summary 获取单个用户
   * @description 获取用户信息
   * @router get /api/user/{id}
   * @request url baseRequest
   * @response 200 baseResponse 创建成功
   */
  async show() {
    const { ctx, service } = this;
    // 组装参数
    const { id } = ctx.params;
    // 调用 Service 进行业务处理
    const res = await service.user.show(id);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, res });
  }

  /**
   * @summary 获取所有用户(分页/模糊)
   * @description 获取用户信息
   * @router get /api/user
   * @request query integer *currentPage eg:1 当前页
   * @request query integer *pageSize eg:10 单页数量
   * @request query string search eg: 搜索字符串
   * @request query boolean isPaging eg:true 是否需要翻页
   * @response 200 baseResponse 创建成功
   */
  async index() {
    const { ctx, service } = this;
    // 组装参数
    const payload = ctx.query;
    // 调用 Service 进行业务处理
    const res = await service.user.index(payload);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, res });
  }

  /**
   * @summary 删除所选用户
   * @description 获取用户信息
   * @router delete /api/user/{id}
   * @request path string *id
   * @response 200 baseResponse 创建成功
   */
  async removes() {
    const { ctx, service } = this;
    // 组装参数
    // const payload = ctx.queries.id
    const { id } = ctx.request.body;
    const payload = id.split(',') || [];
    // 调用 Service 进行业务处理
    const res = await service.user.removes(payload);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, res });
  }
}

module.exports = UserController;
```

public/index.html 进行 api 测试：

```html
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=0" />
    <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
    <script src="https://unpkg.com/element-ui/lib/index.js"></script>
    <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
    <link rel="stylesheet" href="https://unpkg.com/element-ui/lib/theme-chalk/index.css" />
    <script src="https://cdn.bootcss.com/qs/6.6.0/qs.js"></script>
    <link rel="stylesheet" href="https://unpkg.com/element-ui/lib/theme-chalk/index.css" />
    <style>
      .cube-btn {
        margin: 10px 0;
      }
    </style>
  </head>

  <body>
    <div id="app">
      <div><a href="/swagger-ui.html">SwaggerUI</a></div>
      <div>
        <a href="https://www.easy-mock.com/project/5ce3669a733e8967c7b2e902">EasyMock地址</a>
      </div>
      <div>
        <el-button @click="login">登入</el-button>
        <el-button @click="logout">退出登录</el-button>
      </div>
      <div>
        <el-button @click="create">创建用户</el-button>
        <el-button @click="list">用户列表</el-button>
        <el-button @click="del">删除用户</el-button>
      </div>
      <div>
        <el-button @click="logs=[]">Clear Log</el-button>
      </div>
      <ul>
        <li v-for="(log,idx) in logs" :key="idx">
          {{ log }}
        </li>
      </ul>
    </div>
    <script>
      // axios.defaults.baseURL = 'http://localhost:3000'
      axios.defaults.withCredentials = true;
      axios.interceptors.request.use(
        (config) => {
          const token = window.localStorage.getItem('token');
          if (token) {
            // 判断是否存在token，如果存在的话，则每个http header都加上token
            // Bearer是JWT的认证头部信息
            config.headers.common['Authorization'] = 'Bearer ' + token;
          }
          return config;
        },
        (err) => {
          return Promise.reject(err);
        },
      );

      axios.interceptors.response.use(
        (response) => {
          app.logs.push(JSON.stringify(response.data));
          return response;
        },
        (err) => {
          app.logs.push(JSON.stringify(err.message));
          return Promise.reject(err);
        },
      );

      var app = new Vue({
        el: '#app',
        data: {
          value: 'input',
          token: {},
          logs: [],
        },
        methods: {
          async create() {
            await axios.post('/api/user', {
              mobile: '13560905983',
              password: '111111',
              realName: 'Derek WANG',
            });
          },
          async list() {
            const res = await axios.get('/api/user');
            this.list = res.data.data.list;
          },
          async del() {
            if (this.list && this.list.length > 0) {
              this.list.map((v) => {
                axios.delete(`/api/user/${v._id}`);
              });
            } else {
              console.log('list is empty');
            }
          },
          async login() {
            const res = await axios.post('/auth/jwt/login', {
              mobile: '13540905983',
              password: '111111',
            });
            console.log(res.data);
            localStorage.setItem('token', res.data.data.token);
          },
          async logout() {
            const res = await axios.post('/auth/jwt/logout');
            localStorage.removeItem('token');
          },
        },
        mounted: function() {},
      });
    </script>
  </body>
</html>
```

Review <http://localhost:7001/public/index.html>

---

## ⽂件上传

```bash
npm i await-stream-ready stream-wormhole image-downloader -s
```

Prepare `uploads` folder inside `app` folder, otherwise server doesn't create the folder directly.

controller/upload.js:

```js
// app/controller/upload.js
const fs = require('fs');
const path = require('path');
const Controller = require('egg').Controller;
const awaitWriteStream = require('await-stream-ready').write;
const sendToWormhole = require('stream-wormhole');
// const download = require('image-downloader');

/**
 * @Controller 上传
 */
class UploadController extends Controller {
  constructor(ctx) {
    super(ctx);
  }

  // 上传单个文件
  /**
   * @summary 上传单个文件
   * @description 上传单个文件
   * @router post /api/upload/single
   */
  async create() {
    const { ctx } = this;
    // 要通过 ctx.getFileStream 便捷的获取到用户上传的文件，需要满足两个条件：
    // 只支持上传一个文件。
    // 上传文件必须在所有其他的 fields 后面，否则在拿到文件流时可能还获取不到 fields。
    const stream = await ctx.getFileStream();
    // 所有表单字段都能通过 `stream.fields` 获取到
    // const filename = path.basename(stream.filename); // 文件名称
    const extname = path.extname(stream.filename).toLowerCase(); // 文件扩展名称
    const uuid = (Math.random() * 999999).toFixed();

    // 组装参数 stream
    const target = path.join(this.config.baseDir, 'app/public/uploads', `${uuid}${extname}`);
    const writeStream = fs.createWriteStream(target);
    // 文件处理，上传到云存储等等
    try {
      await awaitWriteStream(stream.pipe(writeStream));
    } catch (err) {
      // 必须将上传的文件流消费掉，要不然浏览器响应会卡死
      await sendToWormhole(stream);
      throw err;
    }
    // 调用 Service 进行业务处理
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx });
  }
}

module.exports = UploadController;
```

upload.html:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>上传文件</title>
    <link rel="stylesheet" href="https://unpkg.com/element-ui/lib/theme-chalk/index.css" />
    <style>
      .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        width: 178px;
        height: 178px;
      }

      .avatar-uploader .el-upload:hover {
        border-color: #409eff;
      }

      .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
      }

      .avatar {
        width: 178px;
        height: 178px;
        display: block;
      }

      .image-preview {
        width: 178px;
        height: 178px;
        position: relative;
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        float: left;
      }

      .image-preview .image-preview-wrapper {
        position: relative;
        width: 100%;
        height: 100%;
      }

      .image-preview .image-preview-wrapper img {
        width: 100%;
        height: 100%;
      }

      .image-preview .image-preview-action {
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        cursor: default;
        text-align: center;
        color: #fff;
        opacity: 0;
        font-size: 20px;
        background-color: rgba(0, 0, 0, 0.5);
        transition: opacity 0.3s;
        cursor: pointer;
        text-align: center;
        line-height: 200px;
      }

      .image-preview .image-preview-action .el-icon-delete {
        font-size: 32px;
      }

      .image-preview:hover .image-preview-action {
        opacity: 1;
      }
    </style>
  </head>

  <body>
    <div id="app">
      <el-upload
        v-show="imageUrl.length < 1"
        class="avatar-uploader"
        :action="serverUrl"
        :show-file-list="false"
        multiple
        :before-upload="beforeUpload"
        :headers="token"
        :on-success="handleSuccess"
        :on-progress="uploadProcess"
      >
        <i v-show="imageUrl =='' && imgFlag == false" class="el-icon-plus avatar-uploader-icon"></i>
        <el-progress
          v-show="imgFlag == true"
          type="circle"
          :percentage="percent"
          style="margin-top: 20px"
        >
        </el-progress>
      </el-upload>

      <div class="image-preview" v-show="imageUrl.length > 1">
        <div class="image-preview-wrapper">
          <img :src="imageUrl" />
          <div class="image-preview-action">
            <i @click="handleRemove" class="el-icon-delete"></i>
          </div>
        </div>
      </div>
    </div>
  </body>
  <script src="https://unpkg.com/vue/dist/vue.js"></script>
  <script src="https://unpkg.com/element-ui/lib/index.js"></script>
  <script>
    new Vue({
      el: '#app',
      data() {
        return {
          serverUrl: '/api/upload/single', // 后台上传接口
          token: {},
          imgFlag: false,
          percent: 0,
          imageUrl: '',
        };
      },

      methods: {
        handleRemove(file, fileList) {
          this.imageUrl = '';
        },
        beforeUpload(file) {
          const isLt10M = file.size / 1024 / 1024 < 10;
          if (['image/jpeg', 'image/gif', 'image/png', 'image/bmp'].indexOf(file.type) == -1) {
            this.$message.error('请上传正确的图片格式');
            return false;
          }
          if (!isLt10M) {
            this.$message.error('上传图片不能超过10MB哦!');
            return false;
          }
          // 设置认证信息
          const token = window.localStorage.getItem('token');
          this.token['Authorization'] = 'Bearer ' + token;
        },
        handleSuccess(res, file) {
          this.imgFlag = false;
          this.percent = 0;
          if (res) {
            this.imageUrl = URL.createObjectURL(file.raw); // 项目中用后台返回的真实地址
          } else {
            this.$message.error('视频上传失败，请重新上传！');
          }
        },
        uploadProcess(event, file, fileList) {
          this.imgFlag = true;
          console.log(event.percent);
          this.percent = Math.floor(event.percent);
        },
      },
    });
  </script>
</html>
```
