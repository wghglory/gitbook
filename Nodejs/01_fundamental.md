# Node.js

node.js 是一个异步的事件驱动的 JavaScript 运行时 <https://nodejs.org/en/>

node.js 特性其实是 JS 的特性：(1) 非阻塞 I/O (2) 事件驱动

node 为性能而生，并发处理

1. 多进程 - C Apache
2. 多线程 - java
3. 异步 IO - js
4. 协程 - lua openresty go deno- go TS

## 与前端的不同

- JS 核心语法不变
- 前端 BOM DOM
- 后端 fs http buﬀer event os

## 运行 node 程序

安装 nodemon 可以监视文件改动，自动重启: `npm i -g nodemon`

调试 node 程序：Debug - Start Debugging

## 模块(module)

- 使用模块(module) node 内建模块

```javascript
// 内建模块直接引入
const os = require('os');
const mem = (os.freemem() / os.totalmem()) * 100;
console.log(`内存占用率${mem.toFixed(2)}%`);
```

- 第三方模块

先安装 `npm i download-git-repo -s`

```javascript
const download = require('download-git-repo');
const ora = require('ora');
const process = ora(`下载.....项目`);
process.start();
download('github:su37josephxia/vue-template', 'downloadRepo', (err) => {
  if (err) {
    process.fail();
  } else {
    process.succeed();
  }
});
```

- **promisify**: 如何让异步任务串行化

```javascript
const repo = 'github:su37josephxia/vue-template';
const desc = 'downloadRepo';
clone(repo, desc);

async function clone(repo, desc) {
  const { promisify } = require('util');
  const download = promisify(require('download-git-repo'));
  const ora = require('ora');
  const process = ora(`下载项目......`);
  process.start();
  try {
    await download(repo, desc);
  } catch (error) {
    process.fail();
  }
  process.succeed();
}
```

- 自定义模块：代码分割、复用手段

```javascript
module.exports.clone = async function clone(repo, desc) {
  const ora = require('ora');
  const process = ora(`下载项目 ${repo}`);
  process.start();
  const { promisify } = require('util');
  const download = promisify(require('download-git-repo'));
  try {
    await download(repo, desc);
  } catch (error) {
    process.fail();
  }
  process.succeed();
};

// run
const { clone } = require('./api/03_download');
const repo = 'github:su37josephxia/vue-template';
const desc = 'downloadRepo';
clone(repo, desc);
```

## 核心 API

### fs - 文件系统

#### 文件操作

- Read

```javascript
// fs.js
const fs = require('fs');

// 1. 同步read
const data = fs.readFileSync('./index.js'); //代码会阻塞在这里
console.log(data); // buffer
console.log(data.toString()); // content

// 2. 异步read
fs.readFile('./index.js', 'utf-8', (err, data) => {
  if (err) throw err;
  console.log(data); // buffer
  console.log(data.toString()); // content
});

// 3. fs 常搭配 path api 使用
const path = require('path');
fs.readFile(path.resolve(__dirname, './04_fs.js'), (err, data) => {
  if (err) throw err;
  console.log(data);
});

// 4. promisify
const { promisify } = require('util');
const readFile = promisify(fs.readFile);
readFile('./index.js').then((data) => console.log(data));

// 5. fs Promises API node v10
const fsp = require('fs').promises;
fsp
  .readFile('./index.js')
  .then((data) => console.log(data))
  .catch((err) => console.log(err));

// 6. async/await
(async () => {
  const fs = require('fs');
  const { promisify } = require('util');
  const readFile = promisify(fs.readFile);
  const data = await readFile('./index.js');
  console.log('data', data); // 读取数据类型为Buﬀer

  // 引用方式
  console.log(Buffer.from(data).toString('utf-8'));
})();
```

- 文件写入

 ```javascript
 let fs = require('fs');
//flag配置  "a":追加写入，"w":写入，"r":读取
fs.writeFile('2.txt', '我是要写入的内容', { flag: 'w' }, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log('写入成功');
});
 ```

- 文件删除

```javascript
fs.unlink('2.txt', (err) => {
  if (err) {
    return console.log(err);
  }
  console.log('删除成功');
});
```

- 复制文件
  ```javascript
  fs.copyFile('index.html', 'myindex.html', (err) => {
    if (err) {
      return console.log(err);
    }
    console.log('复制成功！');
  });
  ```

  - 老办法：先读取文件再写入文件

  ```javascript
  function mycopy(src, dest) {
    fs.writeFileSync(dest, fs.readFileSync(src));
  }

  mycopy('1.txt', '4.txt');
  ```

- 修改文件名，目录也可以通过 rename 来操作

```javascript
fs.rename('old-name.txt', 'new-name.txt', function(err) {
  if (err) {
    console.log(err);
  } else {
    console.log('修改成功');
  }
});
```

- 判断文件是否存在

```javascript
fs.exists('4.txt', function(exists) {
  console.log(exists);
});
```

#### 文件夹操作

```javascript
// 创建目录
fs.mkdir('11', (err) => {
  if (err) {
    return console.log(err);
  }
  console.log('创建成功');
});

// 修改目录名称
fs.rename('11', '22', (err) => {
  if (err) {
    return console.log(err);
  }
  console.log('修改成功');
});

// 读取目录
fs.readdir('22', (err, data) => {
  if (err) {
    return console.log(err);
  }
  console.log(data);
});

// 删除目录(空文件夹/目录)
fs.rmdir('11', (err) => {
  if (err) {
    return console.log(err);
  }
  console.log('删除成功');
});

// 判断文件或者目录是否存在
fs.exists('index.html', (exists) => {
  console.log(exists);
});

// 获取文件或者目录的详细信息
fs.stat('index.html', (err, stat) => {
  if (err) {
    return console.log(err);
  }
  // console.log(stat);
  // 判断文件是否是文件
  // let res = stat.isFile();
  // 是否是一个文件夹；
  let res = stat.isDirectory();
  console.log(res);
});
```

- 删除非空目录

```javascript
// 删除非空文件夹: 先把目录里的文件删除-->删除空目录；
function removeDir(path) {
  let data = fs.readdirSync(path);
  // data is contents inside a folder ["33","1.txt","2.html"];
  for (let i = 0; i < data.length; i++) {
    // 是文件或者是目录； --->?文件 直接删除？目录继续查找
    let url = path + '/' + data[i];
    let stat = fs.statSync(url);
    if (stat.isDirectory()) {
      //目录 继续查找
      removeDir(url);
    } else {
      // 文件删除
      fs.unlinkSync(url);
    }
  }
  //  删除空目录
  fs.rmdirSync(path);
}
```

### Buffer

Buﬀer - 用于在 TCP 流、文件系统操作、以及其他上下文中与八位字节流进行交互。 八位字节组成的数组，可以有效的在 JS 中存储二进制数据

```javascript
// buffer.js
// 创建一个长度为10字节以0填充的Buffer
const buf1 = Buffer.alloc(10);
console.log(buf1);

// 写入Buffer数据
buf1.write('hello');
console.log(buf1);

// 创建一个Buffer包含ascii.

// ascii 查询 http://ascii.911cha.com/
const buf2 = Buffer.from('a');
console.log(buf2, buf2.toString());

// 创建Buffer包含UTF-8字节
// UFT-8：一种变长的编码方案，使用 1~6 个字节来存储；
// UFT-32：一种固定长度的编码方案，不管字符编号大小，始终使用 4 个字节来存储；
// UTF-16：介于 UTF-8 和 UTF-32 之间，使用 2 个或者 4 个字节来存储，长度既固定又可变。
const buf3 = Buffer.from('Buffer创建方法');
console.log(buf3);

// 读取Buffer数据
console.log(buf3.toString());

// 合并Buffer
const buf4 = Buffer.concat([buf1, buf3]);
console.log(buf4.toString());
```

Buﬀer 类似数组，所以很多数组方法它都有 GBK 转码 iconv-lite

### http：用于创建 web 服务的模块

创建一个 http 服务器

```javascript
const http = require('http');
const server = http.createServer((request, response) => {
  console.log('there is a request');
  response.end('a response from server');
});
server.listen(3000);

// 打印原型链
function getPrototypeChain(obj) {
  var protoChain = [];
  while ((obj = Object.getPrototypeOf(obj))) {
    //返回给定对象的原型。如果没有继承属性，则 返回 null 。

    protoChain.push(obj);
  }
  protoChain.push(null);
  return protoChain;
}
```

显示一个首页

```javascript
const { url, method } = request;
if (url === '/' && method === 'GET') {
  fs.readFile('index.html', (err, data) => {
    if (err) {
      response.writeHead(500, { 'Content-Type': 'text/plain;charset=utf-8' });
      response.end('500，服务器错误');
      return;
    }
    response.statusCode = 200;
    response.setHeader('Content-Type', 'text/html');
    response.end(data);
  });
} else {
  response.statusCode = 404;
  response.setHeader('Content-Type', 'text/plain;charset=utf-8');
  response.end('404, 页面没有找到');
}
```

编写一个接口

```javascript
else if (url === '/users' && method === 'GET') {
  response.writeHead(200, { 'Content-Type': 'application/json' });
  response.end(JSON.stringify({ name: 'tom', age: 20 }));
}
```

### stream - 是用于与 node 中流数据交互的接口

```javascript
//创建输入输出流 stream.js
const rs = fs.createReadStream('./conf.js');
const ws = fs.createWriteStream('./conf2.js');
rs.pipe(ws);

//二进制友好，图片操作
const rs2 = fs.createReadStream('./01.jpg');
const ws2 = fs.createWriteStream('./02.jpg');
rs2.pipe(ws2);
```

```javascript
//静态资源响应图片请求，http.js
const { url, method, headers } = request;

else
if (method === 'GET' && headers.accept.indexOf('image/*') !== -1) {
  fs.createReadStream('.' + url).pipe(response);
}
```

- Accept 代表发送端（客户端）希望接受的数据类型。 比如：Accept：text/xml; 代表客户端希望接受的数据类型是 xml 类型。
- Content-Type 代表发送端（客户端|服务器）发送的实体数据的数据类型。 比如：Content-Type： text/html; 代表发送端发送的数据格式是 html。
- 二者合起来， Accept:text/xml； Content-Type:text/html ，即代表希望接受的数据类型是 xml 格式，本次请求发送的数据格式是 html。

## 工具链

### 使用简介

```shell
mkdir vue-route-generator
cd vue-route-generator
npm init -y
```

1. create bin/dvr:

```shell
# bin/dvr
console.log('cli.....')
```

2. package.json：

```
"bin": { "dvr": "./bin/dvr" },
```

3. register command globally

```shell
npm link
```

> 删除上面注册的 command
>
> ```shell
> ls /usr/local/bin/
> rm /usr/local/bin/dvr
> ```

### 实际开发

1. dvr 文件

```javascript
#!/usr/bin/env node
const program = require('commander');

program
  .version(require('../package').version, '-v', '--version')
  .command('init <name>', 'init project')
  .command('refresh', 'refresh routers...');

program.parse(process.argv);
```

2. dvr-init

```javascript
#!/usr/bin/env node

const program = require('commander');
const { clone } = require('../lib/download');

program.action(async (name) => {
  // console.log('init ' + name)
  console.log('🚀创建项目:' + name);
  // 从github克隆项目到指定文件夹
  await clone('github:wghglory/vue-template', '../' + name);
});
program.parse(process.argv);
```

3. lib/download.js

```javascript
// 1. promisify: 如何让异步任务串行化
// 2. module export

module.exports.clone = async function clone(repo, desc) {
  const ora = require('ora');
  const process = ora(`下载项目 ${repo}`);
  process.start();
  const { promisify } = require('util');
  const download = promisify(require('download-git-repo'));
  try {
    await download(repo, desc);
  } catch (error) {
    process.fail();
  }
  process.succeed();
};
```

4. dvr-refresh

```javascript
#!/usr/bin/env node

const program = require('commander');
const symbols = require('log-symbols');
const chalk = require('chalk');
const path = require('path');

const folderDir = '../vue-template';

// console.log(process.argv)
program.action(() => {
  console.log('refresh .... ');
});
program.parse(process.argv);

const fs = require('fs');
const handlebars = require('handlebars');

// 获取页面列表
const list = fs
  .readdirSync(path.resolve(folderDir, './src/views'))
  .filter((v) => v !== 'Home.vue')
  .map((v) => ({
    name: v.replace('.vue', '').toLowerCase(),
    file: v,
  }));

// 生成路由定义
compile(
  {
    list,
  },
  path.resolve(folderDir, './src/router.js'),
  path.resolve(folderDir, './template/router.js.hbs'),
);

// 生成菜单
compile(
  {
    list,
  },
  path.resolve(folderDir, './src/App.vue'),
  path.resolve(folderDir, './template/App.vue.hbs'),
);

/**
 * 编译模板文件
 * @param meta 数据定义
 * @param filePath 目标文件路径
 * @param templatePath 模板文件路径
 */
function compile(meta, filePath, templatePath) {
  if (fs.existsSync(templatePath)) {
    const content = fs.readFileSync(templatePath).toString();
    const result = handlebars.compile(content)(meta);
    fs.writeFileSync(filePath, result);
  }
  console.log(symbols.success, chalk.green(`🚀${filePath} 创建成功`));
}
```
