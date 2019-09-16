# Nodejs 持久化

## ⽂件系统数据库

```js
/* fs as database */

/* set key value
set a bbbb
get a
get key */

const fs = require('fs');
const path = require('path');

function get(key) {
  fs.readFile(path.resolve(__dirname, './db.json'), (err, data) => {
    const json = JSON.parse(data);
    console.log(json[key]);
  });
}
function set(key, value) {
  fs.readFile(path.resolve(__dirname, './db.json'), (err, data) => {
    // 可能是空文件，则设置为空对象
    const json = data ? JSON.parse(data) : {};
    json[key] = value; // 设置值
    // 重新写入文件
    fs.writeFile(path.resolve(__dirname, './db.json'), JSON.stringify(json), (err) => {
      if (err) {
        console.log(err);
      }
      console.log('写入成功！');
    });
  });
}

// 命令行接口部分
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.on('line', function(input) {
  const [op, key, value] = input.split(' ');

  if (op === 'get') {
    get(key);
  } else if (op === 'set') {
    set(key, value);
  } else if (op === 'quit') {
    rl.close();
  } else {
    console.log('没有该操作');
  }
});

rl.on('close', function() {
  console.log('程序结束');
  process.exit(0);
});
```

## Mysql

<http://www.runoob.com/mysql/mysql-tutorial.html>

### 1. node.js 原⽣驱动

- 安装 mysql 模块：`npm i mysql --save` mysql 模块基本使⽤

```js
const mysql = require('mysql');

// 连接配置
const cfg = {
  host: 'localhost',
  user: 'root',
  password: 'wgh123456', // 修改为你的密码
  database: 'kaikeba', // 请确保数据库存在!!!
};

// 创建连接对象
const conn = mysql.createConnection(cfg);

// 连接
conn.connect((err) => {
  if (err) {
    throw err;
  } else {
    console.log('连接成功！');
  }
});

// 创建表
const CREATE_SQL = `CREATE TABLE IF NOT EXISTS test (
                    id INT NOT NULL AUTO_INCREMENT,
                    message VARCHAR(45) NULL,
                    PRIMARY KEY (id))`;
const INSERT_SQL = `INSERT INTO test(message) VALUES(?)`;
const SELECT_SQL = `SELECT * FROM test`;

// 查询 conn.query()
conn.query(CREATE_SQL, (err) => {
  if (err) {
    throw err;
  }
  // 插入数据
  conn.query(INSERT_SQL, 'hello,world', (err, result) => {
    if (err) {
      throw err;
    }
    console.log(result);
    /* OkPacket {
      fieldCount: 0,
      affectedRows: 1,
      insertId: 1,
      serverStatus: 2,
      warningCount: 0,
      message: '',
      protocol41: true,
      changedRows: 0
    } */

    conn.query(SELECT_SQL, (err, results) => {
      console.log(JSON.stringify(results)); // [{"id":1,"message":"hello,world"}]
      conn.end(); // 若query语句有嵌套，则end需在此执行
    });
  });
});
```

- ES2017 写法:

  安装 mysql2 模块：`npm i mysql2 --save`

```js
(async () => {
  const mysql = require('mysql2/promise');

  // 连接配置
  const cfg = {
    host: 'localhost',
    user: 'root',
    password: 'wgh123456', // 修改为你的密码
    database: 'kaikeba', // 请确保数据库存在
  };

  const connection = await mysql.createConnection(cfg);

  let ret = await connection.execute(`
      CREATE TABLE IF NOT EXISTS test (
          id INT NOT NULL AUTO_INCREMENT,
          message VARCHAR(45) NULL,
      PRIMARY KEY (id))
  `);
  console.log('create', ret);

  ret = await connection.execute(
    `INSERT INTO test(message)
         VALUES(?)
    `,
    ['ABC'],
  );
  console.log('insert:', ret);

  const [rows, fields] = await connection.execute(`
          SELECT * FROM test
  `);

  console.log('rows:', rows);
  console.log('fields:', fields);

  connection.end();
})();
```

### 2. sequelize ORM

概述：基于 Promise 的 ORM(Object Relation Mapping)，⽀支持多种数据库、事务、关联等

安装： `npm i sequelize -S`

```js
(async () => {
  const Sequelize = require('sequelize');

  // 建⽴立连接
  const sequelize = new Sequelize('kaikeba', 'root', 'wgh123456', {
    host: 'localhost',
    dialect: 'mysql',
    operatorsAliases: false,
  });

  // 定义模型
  const Fruit = sequelize.define('Fruit', {
    name: { type: Sequelize.STRING(20), allowNull: false },
    price: { type: Sequelize.FLOAT, allowNull: false },
    stock: { type: Sequelize.INTEGER, defaultValue: 0 },
  });

  // 同步数据库，force: true则会删除已存在表
  let ret = await Fruit.sync();
  console.log('sync', ret);

  ret = await Fruit.create({
    name: '⾹香蕉',
    price: 3.5,
  });
  console.log('create', ret);

  ret = await Fruit.findAll();
  await Fruit.update({ price: 4 }, { where: { name: '⾹香蕉' } });
  console.log('findAll', JSON.stringify(ret));

  const Op = Sequelize.Op;
  ret = await Fruit.findAll({
    // where: { price: { [Op.lt]:4 }, stock: { [Op.gte]: 100 } }
    where: { price: { [Op.lt]: 4, [Op.gt]: 2 } },
  });
  console.log('findAll', JSON.stringify(ret, '', '\t'));
})();
```

强制同步：创建表之前先删除已存在的表

```js
Fruit.sync({ force: true });
```

避免⾃自动⽣生成时间戳字段

```js
const Fruit = sequelize.define(
  'Fruit',
  {},
  {
    timestamps: false,
  },
);
```

指定表名： freezeTableName: true 或 tableName:'xxx'

> - 设置前者则以 modelName 作为表名；设置后者则按其值作为表名。
> - 下划线命名 underscored: true,
> - 默认驼峰命名

UUID-主键

```js
id: {
  type: Sequelize.DataTypes.UUID,
  defaultValue: Sequelize.DataTypes.UUIDV1,
  primaryKey: true,
},
```

Getters & Setters：可⽤用于定义伪属性或映射到数据库字段的保护属性

```js
// 定义为属性的⼀部分
name: {
    type: Sequelize.STRING,
    allowNull: false,
    get() {
      const fname = this.getDataValue('name');
      const price = this.getDataValue('price');
      const stock = this.getDataValue('stock');
      return `${fname}(价格：￥${price} 库存：${stock}kg)`;
    },
  },
```

```json
  // 定义为模型选项
  // options中
  {
    getterMethods: {
      amount() {
        return this.getDataValue('stock') + 'kg';
      },
    },
    setterMethods: {
      amount(val) {
        const idx = val.indexOf('kg');

        const v = val.slice(0, idx);
        this.setDataValue('stock', v);
      },
    },
  },
```

```js
// 通过模型实例例触发setterMethods
Fruit.findAll().then((fruits) => {
  console.log(JSON.stringify(fruits));
  // 修改amount，触发setterMethods
  fruits[0].amount = '150kg';
  fruits[0].save();
});
```

校验：可以通过校验功能验证模型字段格式、内容，校验会在 create 、update 和 save 时自动运⾏

```js
{
  price: {
    validate: {
      isFloat: { msg: '价格字段请输⼊入数字' },
      min: { args: [0], msg: '价格字段必须⼤大于0' },
    },
  },
  stock: {
    validate: {
      isNumeric: { msg: '库存字段请输⼊入数字' },
    },
  },
};

```

模型扩展：可添加模型实例方法或类方法扩展模型

```js
// 添加类级别⽅法
Fruit.classify = function(name) {
  const tropicFruits = ['⾹蕉', '芒果', '椰⼦']; // 热带⽔果
  return tropicFruits.includes(name) ? '热带⽔果' : '其他⽔果';
};

// 添加实例级别⽅法
Fruit.prototype.totalPrice = function(count) {
  return (this.price * count).toFixed(2);
};

// 使⽤类⽅法
['⾹蕉', '草莓'].forEach((f) => console.log(f + '是' + Fruit.classify(f)));

// 使⽤实例⽅法
Fruit.findAll().then((fruits) => {
  const [f1] = fruits;
  console.log(`买5kg${f1.name}需要￥${f1.totalPrice(5)}`);
});
```

数据查询:

```js
// 通过id查询(不⽀持了)
Fruit.findById(1).then((fruit) => {
  // fruit是⼀个Fruit实例，若没有则为null

  console.log(fruit.get());
});

// 通过属性查询
Fruit.findOne({ where: { name: '⾹蕉' } }).then((fruit) => {
  // fruit是⾸个匹配项，若没有则为null

  console.log(fruit.get());
});

// 指定查询字段
Fruit.findOne({ attributes: ['name'] }).then((fruit) => {
  // fruit是⾸个匹配项，若没有则为null

  console.log(fruit.get());
});

// 获取数据和总条数
Fruit.findAndCountAll().then((result) => {
  console.log(result.count);

  console.log(result.rows.length);
});

// 查询操作符
const Op = Sequelize.Op;
Fruit.findAll({
  // where: { price: { [Op.lt]:4 }, stock: { [Op.gte]: 100 } }

  where: { price: { [Op.lt]: 4, [Op.gt]: 2 } },
}).then((fruits) => {
  console.log(fruits.length);
});

// 或语句
Fruit.findAll({
  // where: { [Op.or]:[{price: { [Op.lt]:4 }}, {stock: { [Op.gte]: 100 }}] }

  where: { price: { [Op.or]: [{ [Op.gt]: 3 }, { [Op.lt]: 2 }] } },
}).then((fruits) => {
  console.log(fruits[0].get());
});

// 分⻚
Fruit.findAll({ offset: 0, limit: 2 });

// 排序
Fruit.findAll({ order: [['price', 'DESC']] });

// 聚合
Fruit.max('price').then((max) => {
  console.log('max', max);
});
Fruit.sum('price').then((sum) => {
  console.log('sum', sum);
});
```

更新:

```js
Fruit.findById(1).then((fruit) => {
  // ⽅式1
  fruit.price = 4;
  fruit.save().then(() => console.log('update!!!!'));
});

// ⽅式2
Fruit.update({ price: 4 }, { where: { id: 1 } }).then((r) => {
  console.log(r);

  console.log('update!!!!');
});
```

删除

```js
// ⽅式1
Fruit.findOne({ where: { id: 1 } }).then((r) => r.destroy());

// ⽅式2
Fruit.destroy({ where: { id: 1 } }).then((r) => console.log(r));
```

实体关系图和与域模型 ERD

```js
const log = (text, data) => {
  console.log(`===========${text}========`);
  console.log(JSON.stringify(data, null, '\t'));
  console.log(`==========================`);
};

const sequelize = require('./util/database');
// 定义模型 1:N 关系
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');

Product.belongsTo(User, {
  constraints: true,
  onDelete: 'CASCADE',
});
User.hasMany(Product);

await sequelize.sync({ force: true });

// 创建⽤户
let user = await User.findByPk(1);
if (!user) {
  user = await User.create({
    name: 'kaikeba',
    email: 'mail@kaikeba.com',
  });
}
// 添加商品
let product = await user.createProduct({
  title: '商品⼀',
  price: 123,
  imageUrl: 'abc.png',
  description: '商品描述',
});

log('product', product);
```

```js
// N : N关系
User.hasOne(Cart);
Cart.belongsTo(User);

Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });

await sequelize.sync({ force: true });

// 创建⽤户
let user = await User.findByPk(1);
if (!user) {
  user = await User.create({ name: 'kaikeba', email: 'mail@kaikeba.com' });
}
// 添加商品
let product = await user.createProduct({
  title: '商品⼀',
  price: 123,
  imageUrl: 'abc.png',
  description: '商品描述',
});

log('product', product);

// 添加购物⻋
await user.createCart();
ret = await User.findAll({ include: [Cart] });
log('getCart:', ret);

// 添加购物⻋商品
let cart = await user.getCart();
await cart.addProduct(product, { through: { quantity: 1 } });

// 获取购物⻋商品数量
const productId = 1;
const item = await cart.getProducts({ where: { id: productId } });
log('item', item);
// 商品是否存在
if (item.length > 0) {
  console.log('商品存在....................');
  await cart.addProduct(product, { through: { quantity: item[0].cartItem.quantity + 1 } });
} else {
  await cart.addProduct(product, {
    through: {
      quantity: 1,
    },
  });
}
log('cart', cart);
```
