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

http://www.runoob.com/mysql/mysql-tutorial.html

node.js原⽣驱动

安装mysql模块：`npm i mysql --save` mysql模块基本使⽤

```js
const mysql = require('mysql');

// 连接配置
const cfg = {
  host: 'localhost',
  user: 'root',
  password: 'wgh123456', // 修改为你的密码
  database: 'kaikeba', // 请确保数据库存在
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
    conn.query(SELECT_SQL, (err, results) => {
      console.log(JSON.stringify(results));
      conn.end(); // 若query语句有嵌套，则end需在此执行
    });
  });
});

```

