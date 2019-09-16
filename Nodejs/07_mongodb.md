# Mongodb

<https://docs.mongodb.com/manual/reference/operator/query/>

```js
(async () => {
  const { MongoClient } = require('mongodb');

  // 创建客户端
  const client = new MongoClient('mongodb://localhost:27017', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  let ret;
  // 创建连接
  ret = await client.connect();
  console.log('ret:', ret);
  const db = client.db('test');
  const fruits = db.collection('fruits');

  // 添加文档
  ret = await fruits.insertOne({
    name: '芒果',
    price: 20.1,
  });
  console.log('插入成功', JSON.stringify(ret));

  // 查询文档
  ret = await fruits.findOne();
  console.log('查询文档:', ret);

  // 更新文档
  ret = await fruits.updateOne({ name: '芒果' }, { $set: { name: '苹果' } });
  console.log('更新文档', JSON.stringify(ret.result));

  // 删除文档
  ret = await fruits.deleteOne({ name: '苹果' });

  await fruits.deleteMany();

  client.close();
})();
```

```js
(async () => {
  const { MongoClient } = require('mongodb');

  // 创建客户端
  const client = new MongoClient('mongodb://localhost:27017', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  let ret;
  // 创建连接
  ret = await client.connect();

  const db = client.db('test');

  const stations = db.collection('stations');

  // 地理空间$geoIntersects,$geoWithin,$near,$nearSphere
  // 添加测试数据，执行一次即可
  await stations.insertMany([
    { name: '天安门东', loc: [116.407851, 39.91408] },
    { name: '天安门西', loc: [116.398056, 39.913723] },
    { name: '王府井', loc: [116.417809, 39.91435] },
  ]);

  await stations.createIndex({ loc: '2dsphere' });

  r = await stations
    .find({
      loc: {
        $nearSphere: {
          $geometry: {
            type: 'Point',
            coordinates: [116.403847, 39.915526],
          },
          $maxDistance: 1000,
        },
      },
    })
    .toArray();

  console.log('天安门附近地铁站', r);

  const col = db.collection('fruits');
  await col.find({ name: { $regex: /芒/ } });
  await col.createIndex({ name: 'text' }); // 验证文本搜索需首先对字段加索引
  ret = await col.find({ $text: { $search: '芒果' } }).toArray(); // 按词搜索，单独字查询不出结果
  console.log('ret', ret);

  client.close();
})();
```

## market demo

index.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />

    <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
    <script src="https://unpkg.com/element-ui/lib/index.js"></script>
    <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
    <link rel="stylesheet" href="https://unpkg.com/element-ui/lib/theme-chalk/index.css" />
    <title>瓜果超市</title>
  </head>

  <body>
    <div id="app">
      <el-input
        placeholder="请输入内容"
        v-model="search"
        class="input-with-select"
        @change="changeHandler"
      >
        <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>
      <el-radio-group v-model="category" @change="getData">
        <el-radio-button v-for="v in categories" :label="v" :key="v">{{v}}</el-radio-button>
      </el-radio-group>
      <el-table :data="fruits" style="width: 100%">
        <el-table-column prop="name" label="名称" width="180"> </el-table-column>
        <el-table-column prop="price" label="价格" width="180"> </el-table-column>
        <el-table-column prop="category" label="种类"> </el-table-column>
      </el-table>
      <el-pagination layout="prev, pager, next" @current-change="currentChange" :total="total">
      </el-pagination>
    </div>
    <script>
      var app = new Vue({
        el: '#app',
        data: {
          page: 1,
          total: 0,
          fruits: [],
          categories: [],
          category: [],
          search: '',
        },
        created() {
          this.getData();

          this.getCategory();
        },
        methods: {
          async currentChange(page) {
            this.page = page;
            await this.getData();
          },
          async changeHandler(val) {
            console.log('search...', val);
            this.search = val;
            await this.getData();
          },
          async getData() {
            const res = await axios.get(
              `/api/list?page=${this.page}&category=${this.category}&keyword=${this.search}`,
            );
            const data = res.data.data;
            this.fruits = data.fruits;
            this.total = data.pagination.total;
          },
          async getCategory() {
            const res = await axios.get(`/api/category`);
            this.categories = res.data.data;
            console.log('category', this.categories);
          },
        },
      });
    </script>
  </body>
</html>
```

conf.js

```js
module.exports = {
  url: 'mongodb://localhost:27017',
  dbName: 'test',
};
```

db.js

```js
const conf = require('./conf');
const EventEmitter = require('events').EventEmitter;

// 客户端
const MongoClient = require('mongodb').MongoClient;

class Mongodb {
  constructor(conf) {
    // 保存conf
    this.conf = conf;

    this.emitter = new EventEmitter();
    // 连接
    this.client = new MongoClient(conf.url, { useNewUrlParser: true, useUnifiedTopology: true });

    this.client.connect((err) => {
      if (err) throw err;
      console.log('连接成功');
      this.emitter.emit('connect');
    });
  }

  col(colName, dbName = conf.dbName) {
    return this.client.db(dbName).collection(colName);
  }

  once(event, cb) {
    this.emitter.once(event, cb);
  }
}

module.exports = new Mongodb(conf);
```

index.js

```js
const express = require('express');
const app = express();
const path = require('path');
const mongo = require('./db');
// const testData = require('./testData');

app.get('/', (req, res) => {
  res.sendFile(path.resolve('./index.html'));
});

app.get('/api/list', async (req, res) => {
  const page = +req.query.page;
  const col = mongo.col('fruits');
  const total = await col.find().count();
  const fruits = await col
    .find()
    .skip((page - 1) * 5)
    .limit(5)
    .toArray();

  res.json({
    ok: 1,
    data: {
      fruits,
      pagination: { total, page },
    },
  });
});

app.get('/api/category', async (req, res) => {
  const col = mongo.col('fruits');
  const data = await col.distinct('category');
  res.json({ ok: 1, data });
});

app.listen(3000, () => {
  console.log(`app running at port 3000`);
});
```

before running it, seed data:

```js
const mongodb = require('./db');

mongodb.once('connect', async () => {
  const col = mongodb.col('fruits');

  try {
    // 删除已存在
    await col.deleteMany();

    // 插入
    await col.insertMany([
      { name: '苹果', price: 5, category: '水果' },
      { name: '香蕉', price: 3.5, category: '水果' },
      { name: '芒果', price: 15, category: '水果' },
      { name: '砂糖橘', price: 8, category: '水果' },
      { name: '土豆', price: 2, category: '蔬菜' },
      { name: '西红柿', price: 3, category: '蔬菜' },
      { name: '茄子', price: 4, category: '蔬菜' },
      { name: '韭菜', price: 5, category: '蔬菜' },
      { name: '牛肉', price: 30, category: '生鲜' },
      { name: '鱼', price: 12, category: '生鲜' },
      { name: '大闸蟹', price: 99, category: '生鲜' },
      { name: '鲜虾', price: 20, category: '生鲜' },
    ]);
    console.log('插入测试数据成功');
    const ret = await col.find({ price: { $gt: 10 } }).toArray();
    console.log('ret', ret);

    // const data = new Array(100).fill().map((v, i) => {
    //   return { name: 'XXX' + i, price: i, category: Math.random() > 0.5 ? '蔬菜' : '水果' };
    // });

    // // 插入
    // await col.insertMany(data);
  } catch (error) {
    console.log('插入测试数据失败');
    console.log(error);
  }
});
```

---

## mongoose

它最重要的意义是 schema 的定义！

```js
const mongoose = require('mongoose');

// 1.连接
mongoose.connect('mongodb://localhost:27017/test', {
  useNewUrlParser: true,
});

const conn = mongoose.connection;
conn.on('error', () => console.error('连接数据库失败'));
conn.once('open', async () => {
  // 2.定义一个Schema - Table
  const Schema = mongoose.Schema({
    category: String,
    name: String,
  });

  // 3.编译一个Model, 它对应数据库中复数、小写的Collection
  const Model = mongoose.model('fruit', Schema);
  try {
    // 4.创建，create返回Promise
    let r = await Model.create({
      category: '温带水果',
      name: '苹果',
      price: 5,
    });
    console.log('插入数据:', r);

    // 5.查询，find返回Query，它实现了then和catch，可以当Promise使用。如果需要返回Promise，调用其exec()
    r = await Model.find({ name: '苹果' });
    console.log('查询结果:', r);

    // 6.更新，updateOne返回Query
    r = await Model.updateOne({ name: '苹果' }, { $set: { name: '芒果' } });
    console.log('更新结果：', r);

    // 7.删除，deleteOne返回Query
    r = await Model.deleteOne({ name: '苹果' });
    console.log('删除结果：', r);

    const blogSchema = mongoose.Schema({
      title: { type: String, required: [true, '标题为必填项'] }, // 定义校验规则
      author: String,
      body: String,
      comments: [{ body: String, date: Date }], // 定义对象数组
      date: { type: Date, default: Date.now }, // 指定默认值
      hidden: Boolean,
      meta: {
        // 定义对象
        votes: Number,
        fans: Number,
      },
    });

    // 定义实例方法
    blogSchema.methods.findByAuthor = function(author) {
      return this.model('blog')
        .find({ author: this.author })
        .exec();
    };

    // 静态方法
    blogSchema.statics.findByAuthor = function(author) {
      return this.model('blog')
        .find({ author })
        .exec();
    };

    // 虚拟属性
    blogSchema.virtual('commentsCount').get(function() {
      return this.comments.length;
    });

    const BlogModel = mongoose.model('blog', blogSchema);
    await BlogModel.deleteMany({});
    const blog = new BlogModel({
      title: 'nodejs持久化',
      author: 'jerry',
      body: '....',
      comments: [{ body: 'haha' }],
    });
    r = await blog.save();

    r = await blog.findByAuthor();
    console.log('findByAuthor', r);

    // 静态方法
    r = await BlogModel.findByAuthor('jerry');
    console.log('findByAuthor', r);

    // 虚拟属性
    r = await BlogModel.findOne({ author: 'jerry' });
    console.log('blog留言数:', r.commentsCount);
  } catch (e) {
    console.log('e', e.message);
  }
});
```

### Cart demo by mongoose

mongoose.js

```js
const mongoose = require('mongoose');
// 1.连接
mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true });
mongoose.set('useFindAndModify', false);

const conn = mongoose.connection;
conn.on('error', () => console.error('连接数据库失败'));
```

models/user.js

```js
const mongoose = require('mongoose');

const schema = mongoose.Schema({
  name: String,
  password: String,
  cart: [],
});

schema.statics.getCart = function(_id) {
  return this.model('user')
    .findById(_id)
    .exec();
};

schema.statics.setCart = function(_id, cart) {
  return this.model('user')
    .findByIdAndUpdate(_id, { $set: { cart } })
    .exec();
};

const model = mongoose.model('user', schema);

// 测试数据
model.updateOne(
  { _id: '5c1a2dce951e9160f0d8573b' },
  { name: 'jerry', cart: [{ pname: 'iPhone', price: 666, count: 1 }] },
  { upsert: true },
  (err, r) => {
    console.log('测试数据');
    console.log(err, r);
  },
);

module.exports = model;
```

index.js

```js
const express = require('express');
const app = new express();
const bodyParser = require('body-parser');
const path = require('path');

// 数据库相关
require('./mongoose');
const UserModel = require('./models/user');

// mock session
const session = { sid: { userId: '5c1a2dce951e9160f0d8573b' } };

app.use(bodyParser.json());
app.get('/', (req, res) => {
  res.sendFile(path.resolve('./index.html'));
});
// 查询购物车数据
app.get('/api/cart', async (req, res) => {
  const data = await UserModel.getCart(session.sid.userId);
  res.send({ ok: 1, data });
});

// 设置购物车数据
app.post('/api/cart', async (req, res) => {
  await UserModel.setCart(session.sid.userId, req.body.cart);
  res.send({ ok: 1 });
});

app.listen(3000, () => {
  console.log('running at port 3000');
});
```

index.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
    <script src="https://unpkg.com/element-ui/lib/index.js"></script>
    <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
    <link rel="stylesheet" href="https://unpkg.com/element-ui/lib/theme-chalk/index.css" />
    <title>瓜果超市</title>
  </head>

  <body>
    <div id="app">
      <el-button @click="getCart">getCart</el-button>
      <el-button @click="setCart">setCart</el-button>
    </div>
    <script>
      var app = new Vue({
        el: '#app',
        methods: {
          async getCart(page) {
            const ret = await axios.get('/api/cart');
            console.log('ret:', ret.data.data);
          },
          async setCart() {
            const ret = await axios.post('/api/cart', {
              cart: [
                {
                  name: '菠萝',
                  count: 1,
                },
              ],
            });
          },
        },
      });
    </script>
  </body>
</html>
```

---

## 零代码开发

只去定义 schema，自动生成 model，api 接口

config.js 配置 mongodb

```js
module.exports = {
  db: {
    url: 'mongodb://localhost:27017/test',
    options: { useNewUrlParser: true },
  },
};
```

index.js

```js
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const restful = require('./framework/router');
const { loadModel } = require('./framework/loader');

// 初始化数据库
const app = new Koa();
loadModel(app);

app.use(bodyParser());
app.use(require('koa-static')(__dirname + '/'));
app.use(restful);

const port = 3000;
app.listen(port, () => {
  console.log(`app started at port ${port}...`);
});
```

我们在开发时候只需要在 models 里面定义 schema 就能完成开发，这样定义，文件名字要复数，方便 restful api 接口 /api/users 这样

```js
module.exports = {
  schema: {
    mobile: { type: String, required: true },
    // password: { type: String, required: true },
    realName: { type: String, required: true },
  },
};
```

下面是关键，如何实现对 models 文件夹里面所有文件的自动读取、生成 mongoose 实体，请求接口等

framework/loader.js

```js
/**
 * 定义了 schema，自动创建 mongoose model 和数据库模型
 */
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const config = require('../config');

// 遍历文件夹，把文件和 require(文件) 传入到 callback 中
function load(dir, cb) {
  // 获取绝对路径
  const url = path.resolve(__dirname, dir);
  const files = fs.readdirSync(url);
  files.forEach((filename) => {
    // 去掉后缀名
    filename = filename.replace('.js', '');
    // 导入文件
    const file = require(url + '/' + filename);
    // 处理逻辑
    cb(filename, file);
  });
}

// app $model 挂载 mongoose 模型，他们来自上面 load 的遍历
function loadModel(app) {
  mongoose.connect(config.db.url, config.db.options);
  const conn = mongoose.connection;

  conn.on('error', () => console.error('连接数据库失败'));

  app.$model = {};

  load('../model', (filename, { schema }) => {
    console.log('load model: ' + filename, schema);
    app.$model[filename] = mongoose.model(filename, schema);
  });
}

module.exports = {
  loadModel,
};
```

router.js 通用接口，比如请求 `/api/users`, 实际想去 app.\$model 中 ​ 拿到 `mongoose users.find({})`, 每个接口都先走 init 中间件，然后再走各自的实现

```js
const router = require('koa-router')();

const { init, get, create, update, del } = require('./api');

// 第二参数后多个中间件
router.get('/api/:list', init, get);
router.post('/api/:list', init, create);
router.put('/api/:list/:id', init, update);
router.delete('/api/:list/:id', init, del);

module.exports = router.routes();
```

api.js

```js
module.exports = {
  async init(ctx, next) {
    console.log(ctx.params);
    const model = ctx.app.$model[ctx.params.list];
    if (model) {
      ctx.list = model;
      await next();
    } else {
      ctx.body = 'no this model';
    }
  },

  async get(ctx) {
    ctx.body = await ctx.list.find({});
  },
  async create(ctx) {
    const res = await ctx.list.create(ctx.request.body);
    ctx.body = res;
  },
  async update(ctx) {
    const res = await ctx.list.updateOne({ _id: ctx.params.id }, ctx.request.body);
    ctx.body = res;
  },
  async del(ctx) {
    const res = await ctx.list.deleteOne({ _id: ctx.params.id });
    ctx.body = res;
  },
  async page(ctx) {
    console.log('page...', ctx.params.page);
    ctx.body = await ctx.list.find({});
  },
};
```
