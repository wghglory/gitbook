# 部署

- pm2
- nginx
- docker

## 构建⼀个⾼可⽤的 node 环境

主要解决问题:

- 故障恢复
- 多核利⽤
- <http://www.sohu.com/a/247732550_796914>
- 多进程共享端⼝

app.js:

```javascript
const Koa = require('koa');

// 创建一个Koa对象表示web app本身:
const app = new Koa();

// 对于任何请求，app将调用该异步函数处理请求：
app.use(async (ctx, next) => {
  console.log('ctx....');
  // 随机产生错误
  Math.random() > 0.9 ? aaa() : '2';

  await next();
  ctx.response.type = 'text/html';
  ctx.response.body = '<h1>Hello, koa2!</h1>';
});

// 直接 node 调用走 if；被 require 走 else
if (!module.parent) {
  app.listen(3000);
  console.log('app started at port 3000...');
} else {
  module.exports = app;
}
```

test.js:

```javascript
var http = require('http');
setInterval(async () => {
  try {
    await http.get('http://localhost:3000');
    console.log('go');
  } catch (error) {}
}, 1000);
```

cluster.js:

```javascript
var cluster = require('cluster');
var os = require('os'); // 获取CPU 的数量
var numCPUs = os.cpus().length;
var process = require('process');

console.log('numCPUs:', numCPUs);
var workers = {};
if (cluster.isMaster) {
  // 主进程分支
  cluster.on('death', function(worker) {
    // 当一个工作进程结束时，重启工作进程 delete workers[worker.pid];
    worker = cluster.fork();
    workers[worker.pid] = worker;
  });
  // 初始开启与CPU 数量相同的工作进程
  for (var i = 0; i < numCPUs; i++) {
    var worker = cluster.fork();
    workers[worker.pid] = worker;
  }
} else {
  // 工作进程分支，启动服务器
  var app = require('./app');
  app.use(async (ctx, next) => {
    console.log('worker' + cluster.worker.id + ',PID:' + process.pid);
    next();
  });
  app.listen(3000);
}
// 当主进程被终止时，关闭所有工作进程
process.on('SIGTERM', function() {
  for (var pid in workers) {
    process.kill(pid);
  }
  process.exit(0);
});

require('./test');
```

Run `node cluster`, you will see multiple workers running together, with some failing, some successful. Access <localhost:3000> will see result even some works failed.

## PM2 的应⽤，内部使用了 cluster

- 内建负载均衡（使⽤ Node cluster 集群模块、⼦进程，可以参考朴灵的《深⼊浅出 node.js》⼀书 第九章）
- 线程守护，keep alive
- 0 秒停机重载，维护升级的时候不需要停机.
- 现在 Linux (stable) & MacOSx (stable) & Windows (stable).多平台⽀持
- 停⽌不稳定的进程（避免⽆限循环）
- 控制台检测 <https://id.keymetrics.io/api/oauth/login#/register>
- 提供 HTTP API

**配置:**

```shell
npm install -g pm2

pm2 start app.js --watch -i 2
// watch 监听⽂件变化
// -i 启动多少个实例 instance

pm2 stop all
pm2 list
pm2 start app.js -i max # 根据机器CPU核数，开启对应数⽬的进程

# pm2设置为开机启动
pm2 startup
```

每次传参数启动麻烦，直接写一个 process.yml 来启动：`pm2 start process.yml`:

```yml
apps:
  - script: app.js
    instances: 2
    watch: true
    env:
      NODE_ENV: production
```

Keymetrics 在线监控 <https://id.keymetrics.io>

```shell
pm2 link 8hxvp4bfrftvwxn uis7ndy58fvuf7l TARO-SAMPLE
```

## Nginx 反向代理 + 前端打包 Dist

1. 安装

```shell
yum install nginx

apt update
apt install nginx

brew install nginx  # mac
```

通过 homebrew 安装 nginx，默认安装在: `/usr/local/Cellar/nginx/版本号`。配置文件在路径:`／usr/local/etc/nginx`，默认配置文件 `nginx.conf`，这个文件主要配置了 `localhost：8080`，sudo nginx 命令启动 nginx，在地址栏输入 localhost:8080，不出意外的话，就能访问到默认的页面，也就是 nginx 目录下面的 `html／index.html`。

2. 添加静态路由，通常 location root 配一个前端 dist folder

配置两个虚拟主机

首先在 nginx 配置目录下（/usr/local/etc/nginx/）新建文件夹 `sites-enabled`，在这个文件夹下面创建两个文件 site1 and site2，它们对应 dist 目录下 index1.html, index2.html.

```
# /etc/nginx/sites-enabled/site1

server {
  listen 80;
  server_name site1.com;
  location / {
    root /Users/guanghuiw/My/projects/nodejs-learning/deploy/dist;
    index index1.html index1.htm;
  }
}

# /etc/nginx/sites-enabled/site2

server {
  listen 80;
  server_name site2.com;
  location / {
    root /Users/guanghuiw/My/projects/nodejs-learning/deploy/dist;
    index index2.html index2.htm;
  }
}
```

3. 让配置文件生效

在 nginx.conf 文件倒数第二行添加 `include /usr/local/etc/nginx/sites-enabled/*;`;

4. hosts

Gas mask 改变：

```
127.0.0.1 site1.com
127.0.0.1 site2.com
```

5. 重启 Nginx 然后访问 `site1.com`, `site2.com`:

```shell
# 验证 Nginx 配置
nginx -t

# 重新启动 Nginx
service nginx restart  # linux
brew services restart nginx  # mac

nginx -s reload
```

6. 一个配置静态和动态资源的例子：

```
# /etc/nginx/sites-enabled/site3

server {
  listen 80;
  server_name site3.com;
  location / {
    root /Users/guanghuiw/My/projects/nodejs-learning/deploy/dist;
    index index3.html index3.htm;
  }
  location ~ \.(gif|jpg|png)$ {
    root /Users/guanghuiw/My/projects/nodejs-learning/deploy/dist/assets/;
  }
  location /api {
    proxy_pass http://127.0.0.1:3000/api;
    proxy_redirect off;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  }
}
```

启动 node app, 添加 hosts 并访问 site3.com

## reference

- <https://www.jianshu.com/p/9c8a218db2a0>
- <https://www.cnblogs.com/Lxiaolong/p/4201973.html>
- <https://www.jianshu.com/p/302571f2dae0>
