# Mysql

## mysql 数据库安装

- mac 下安装 地址：<https://dev.mysql.com/downloads/mysql>
- Homebrew: <https://formulae.brew.sh/formula/mysql#default>

  - We've installed your MySQL database without a root password. To secure it run: `mysql_secure_installation`
  - MySQL is configured to only allow connections from localhost by default
  - To connect run: `mysql -uroot`
  - To have launchd start mysql now and restart at login: `brew services start mysql` Or, if you don't want/need a background service you can just run: `mysql.server start`

- 设置密码

  ```shell
  cd /usr/local/mysql/bin/
  ./mysql -u root -p
  set password for 用户名@localhost = password('新密码');
  ```

- 通过 Navicat 连接

## mysql 操作

### 进入 mysql 命令环境

- Mysql -u 用户名 -p
- 命令用 “;” 隔开
  - 显示 mysql 版本: `SELECT VERSION(); SELECT USER()`; 关键字大写；

### 数据库操作

- 创建数据库 CREATE DATABASE 数据库名;
- 显示数据库 SHOW DATABASES;
- 查看数据库信息 SHOW CREATE DATABASE 数据库名
- 修改数据库编码格式 ALTER DATABASE 数据库名 CHARACTER SET = utf8
- 删除数据库 DROP DATABASE 数据库名；

### 数据库中的表操作

- 选择数据库 USE 数据库名

- 查看当前选择的数据库： SELECT DATABASE();

- 创建数据表： CREATE TABLE tableName()；

  ```sql
  CREATE TABLE users(
    username VARCHAR(20),
    age TINYINT UNSIGNED,
    salary FLOAT(8,2) UNSIGNED
  )
  ```

- 查看数据表 SHOW TABLES;

- 查看数据表的结构 SHOW COLUMNS FROM 表名； 查看数据表的结构；

- 数据库中字段的类型

- 数值类型

  | 类型           | 大小                                          | 范围（有符号）                                                                                                                      | 范围（无符号）                                                    | 用途            |
  | :------------- | :-------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------- | :-------------- |
  | TINYINT        | 1 字节                                        | (-128，127)                                                                                                                         | (0，255)                                                          | 小整数值        |
  | SMALLINT       | 2 字节                                        | (-32 768，32 767)                                                                                                                   | (0，65 535)                                                       | 大整数值        |
  | MEDIUMINT      | 3 字节                                        | (-8 388 608，8 388 607)                                                                                                             | (0，16 777 215)                                                   | 大整数值        |
  | INT 或 INTEGER | 4 字节                                        | (-2 147 483 648，2 147 483 647)                                                                                                     | (0，4 294 967 295)                                                | 大整数值        |
  | BIGINT         | 8 字节                                        | (-9,223,372,036,854,775,808，9 223 372 036 854 775 807)                                                                             | (0，18 446 744 073 709 551 615)                                   | 极大整数值      |
  | FLOAT          | 4 字节                                        | (-3.402 823 466 E+38，-1.175 494 351 E-38)，0，(1.175 494 351 E-38，3.402 823 466 351 E+38)                                         | 0，(1.175 494 351 E-38，3.402 823 466 E+38)                       | 单精度 浮点数值 |
  | DOUBLE         | 8 字节                                        | (-1.797 693 134 862 315 7 E+308，-2.225 073 858 507 201 4 E-308)，0，(2.225 073 858 507 201 4 E-308，1.797 693 134 862 315 7 E+308) | 0，(2.225 073 858 507 201 4 E-308，1.797 693 134 862 315 7 E+308) | 双精度 浮点数值 |
  | DECIMAL        | 对 DECIMAL(M,D) ，如果 M>D，为 M+2 否则为 D+2 | 依赖于 M 和 D 的值                                                                                                                  | 依赖于 M 和 D 的值                                                | 小数值          |

- 时间日期类型

  | 类型                                                  | 大小 (字节)     | 范围                                                                                   | 格式                | 用途             |
  | :---------------------------------------------------- | :-------------- | :------------------------------------------------------------------------------------- | :------------------ | :--------------- |
  | DATE                                                  | 3               | 1000-01-01/9999-12-31                                                                  | YYYY-MM-DD          | 日期值           |
  | TIME                                                  | 3               | '-838:59:59'/'838:59:59'                                                               | HH:MM:SS            | 时间值或持续时间 |
  | YEAR                                                  | 1               | 1901/2155                                                                              | YYYY                | 年份值           |
  | DATETIME                                              | 8               | 1000-01-01 00:00:00/9999-12-31 23:59:59                                                | YYYY-MM-DD HH:MM:SS | 混合日期和时间值 |
  | TIMESTAMP                                             | 4               | 1970-01-01 00:00:00/2038 结束时间是第 **2147483647** 秒，北京时间 \*\*2038-1-19 11:14: |
  | 07\*\*，格林尼治时间 2038 年 1 月 19 日 凌晨 03:14:07 | YYYYMMDD HHMMSS | 混合日期和时间值，时间戳                                                               |

- 字符串类型

  | 类型       | 大小                 | 用途                            |
  | :--------- | :------------------- | :------------------------------ |
  | CHAR       | 0-255 字节           | 定长字符串                      |
  | VARCHAR    | 0-65535 字节         | 变长字符串                      |
  | TINYBLOB   | 0-255 字节           | 不超过 255 个字符的二进制字符串 |
  | TINYTEXT   | 0-255 字节           | 短文本字符串                    |
  | BLOB       | 0-65 535 字节        | 二进制形式的长文本数据          |
  | TEXT       | 0-65 535 字节        | 长文本数据                      |
  | MEDIUMBLOB | 0-16 777 215 字节    | 二进制形式的中等长度文本数据    |
  | MEDIUMTEXT | 0-16 777 215 字节    | 中等长度文本数据                |
  | LONGBLOB   | 0-4 294 967 295 字节 | 二进制形式的极大文本数据        |
  | LONGTEXT   | 0-4 294 967 295 字节 | 极大文本数据                    |

### 图形化操作

- navicat 图形化
- mysqlworkbeach

### 数据库中的数据操作 curd 操作

- 一、增

  `INSERT INTO 表名 (字段一,字段二,字段三) VALUES ("值一","值二","值三");`

- 二、删

  `DELETE FROM 表名 WHERE 条件;`

- 三、改

  `UPDATE 表名 SET 设置的内容 WHERE 条件语句`

- 四、查

  `SELECT 字段 FROM 表名 WHERE 条件语句`

- 五、条件语句

  - AND
  - OR
  - ORDER BY (DESC/ASC)
  - LIMIT
  - LIKE
  - JOIN ON
  - AS

## ⽂件系统数据库

```javascript
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

```javascript
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

```javascript
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

```javascript
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

```javascript
Fruit.sync({ force: true });
```

避免⾃自动⽣生成时间戳字段

```javascript
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

```
{
  "id": {
    "type": Sequelize.DataTypes.UUID,
    "defaultValue": Sequelize.DataTypes.UUIDV1,
    "primaryKey": true
  }
}
```

Getters & Setters：可⽤用于定义伪属性或映射到数据库字段的保护属性

```
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

```javascripton
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

```javascript
// 通过模型实例例触发setterMethods
Fruit.findAll().then((fruits) => {
  console.log(JSON.stringify(fruits));
  // 修改amount，触发setterMethods
  fruits[0].amount = '150kg';
  fruits[0].save();
});
```

校验：可以通过校验功能验证模型字段格式、内容，校验会在 create 、update 和 save 时自动运⾏

```json
{
  "price": {
    "validate": {
      "isFloat": {
        "msg": "价格字段请输⼊入数字"
      },
      "min": {
        "args": [0],
        "msg": "价格字段必须⼤大于0"
      }
    }
  },
  "stock": {
    "validate": {
      "isNumeric": {
        "msg": "库存字段请输⼊入数字"
      }
    }
  }
}
```

模型扩展：可添加模型实例方法或类方法扩展模型

```javascript
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

```javascript
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

```javascript
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

```javascript
// ⽅式1
Fruit.findOne({ where: { id: 1 } }).then((r) => r.destroy());

// ⽅式2
Fruit.destroy({ where: { id: 1 } }).then((r) => console.log(r));
```

实体关系图和与域模型 ERD

```javascript
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

```javascript
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
