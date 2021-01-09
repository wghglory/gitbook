# [eggjs](https://github.com/eggjs/examples)

## 创建和启动项目

```shell
# 创建项⽬
npm i egg-init -g
egg-init <projectName> --type=simple
cd <projectName>
npm i

# 启动项⽬
npm run dev
open localhost:7001
```

## 浏览项⽬结构

- Public
- Router -> Controller -> Service -> Model
- Schedule

## 开发步骤

创建⼀个路由，router.js

```javascript
router.get('/user', controller.user.index);
```

创建⼀个控制器，user.js

```javascript
'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {
  async index() {
    this.ctx.body = [{ name: 'tom' }, { name: 'jerry' }];
  }
}

module.exports = UserController;
```

创建⼀个服务，./app/service/user.js

```javascript
'use strict';

const Service = require('egg').Service;

class UserService extends Service {
  async getAll() {
    return [{ name: 'tom' }, { name: 'jerry' }];
  }
}

module.exports = UserService;
```

使⽤服务，Update ./app/controller/user.js

```javascript
async index() {
  const { ctx } = this;
  ctx.body = await ctx.service.user.getAll();
}
```

创建模型层：以 mysql + sequelize 为例演示数据持久化

- 安装： `npm install --save egg-sequelize mysql2`

- 在 config/plugin.js 中引⼊ egg-sequelize 插件

  ```javascripton
  sequelize: {
    enable: true,
    package: "egg-sequelize"
  }
  ```

- 在 config/config.default.js 中编写 sequelize 配置
  ```javascripton
  // const userConfig 中
  sequelize:{
    dialect:"mysql",
    host:"127.0.0.1",
    port:3306,
    username:"root",
    password:"password",
    database:"eggjs"
  }
  ```

编写 User 模型，./app/model/user.js

```javascript
'use strict';

module.exports = (app) => {
  const { STRING } = app.Sequelize;

  const User = app.model.define('user', { name: STRING(30) }, { timestamps: false });

  // 数据库同步, 重置数据时候打开
  // User.sync({ force: true });

  return User;
};
```

服务中调⽤：`ctx.model.User`

```javascript
class UserService extends Service {
  async getAll() {
    return await this.ctx.model.User.findAll();
  }
}
```

user controller adds test data:

```javascript
  async create() {
    // 添加测试数据
    const User = this.ctx.model.User;
    // await User.sync({ force: true });   // 数据库同步, 重置数据时候打开
    await User.create({ name: 'derek' });

    this.ctx.body = 'create a mock data derek';
  }
```

> 同步数据库: <https://eggjs.org/zh-cn/tutorials/sequelize.html>
