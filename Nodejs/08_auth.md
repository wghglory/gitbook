# Koa 实战 - 鉴权

## 1. session-cookie ⽅式

Cookie 原理：第一次访问服务器 Set-Cookie 负责在 response header 中设置 cookie，后续访问浏览器请求头传递 Cookie

session 就是通过 cookie 方式实现的：

```javascript
const http = require('http');

const session = {};

http
  .createServer((req, res) => {
    const sessionKey = 'sid';

    if (req.url === '/favicon.ico') {
      return;
    } else {
      const cookie = req.headers.cookie;

      // 后续访问 cookie 从浏览器中 header 发送回来
      if (cookie && cookie.indexOf(sessionKey) > -1) {
        res.end('Come Back');
        console.log('cookie:', req.headers.cookie);
        // 简略写法未必具有通用性
        const pattern = new RegExp(`${sessionKey}=([^;]+);?\s*`);
        const sid = pattern.exec(cookie)[1];
        console.log('session:', sid, session, session[sid]);
      } else {
        // 首次访问没有 cookie，服务器生成 cookie 设置到浏览器 response header 中
        const sid = (Math.random() * 9999999).toFixed();
        res.setHeader('Set-Cookie', `${sessionKey}=${sid}`);
        session[sid] = { name: 'derek' }; // 生成的随即 id 对应用户信息
        res.end('initial come');
      }
    }
  })
  .listen(3000);
```

![image-20190930155737232](../assets/images/image-20190930155737232.png)

实现原理：

1. 服务器在接受客户端⾸次访问时在服务器端创建 session，然后保存 session(我们可以将 session 保存在内存中，也可以保存在 redis 中，推荐使⽤后者)，然后给这个 session ⽣成⼀个唯⼀的标识字符串,然后在响应头中种下这个唯⼀标识字符串。

2. 签名。这⼀步通过秘钥对 sid 进⾏签名处理，避免客户端修改 sid。（⾮必需步骤）

3. 浏览器中收到请求响应的时候会解析响应头，然后将 sid 保存在本地 cookie 中，浏览器在下次 http 请求的请求头中会带上该域名下的 cookie 信息，

4. 服务器在接受客户端请求时会去解析请求头 cookie 中的 sid，然后根据这个 sid 去找服务器端保存的该客户端的 session，然后判断该请求是否合法。

**加密处理：**

> 哈希 Hash - SHA MD5
>
> - 把⼀个不定⻓摘要定⻓结果
> - 摘要 xialaoshi -> x4sdfdsafsdafl3s3 - 防篡改
>
> 雪崩效应
>
> 摘要
>
> 对称 DES
>
> ⾮对称 RSA

### a. Koa 中使用 koa-session

```javascript
/**
 * koa server 中使用 koa-session
 */
const koa = require('koa');
const session = require('koa-session');

const app = new koa();

// 签名key ⽤来对 cookie 进⾏签名
app.keys = ['some secret'];

// 配置项
const SESS_CONFIG = {
  key: 'kkb:sess', // cookie键名
  maxAge: 86400000, // 有效期，默认⼀天
  httpOnly: true, // 仅服务器修改
  signed: true, // 签名cookie
};

// 注册
app.use(session(SESS_CONFIG, app));

// 测试：刷新页面看次数
app.use((ctx) => {
  if (ctx.path === '/favicon.ico') return;
  // 获取
  let n = ctx.session.count || 0;
  // 设置
  ctx.session.count = ++n;
  ctx.body = '第' + n + '次访问';
});

app.listen(3000);
```

| name         | value                                                                    | expires / max-age        |
| ------------ | ------------------------------------------------------------------------ | ------------------------ |
| kkb:sess     | eyJjb3VudCI6NiwiX2V4cGlyZSI6MTU2OTkxNzQ4Njk2MiwiX21heEFnZSI6ODY0MDAwMDB9 | 2019-10-01T08:11:26.965Z |
| kkb:sess.sig | GrdKpwG6lB-Mxc5LXgWHj8UDkgg                                              | 2019-10-01T08:11:        |

demo2: koa packages

```javascript
/**
 * koa server 中使用 koa-session
 */
const koa = require('koa');
const session = require('koa-session');
const router = require('koa-router')();
const cors = require('koa2-cors');
const bodyParser = require('koa-bodyparser');
const static = require('koa-static');

const app = new koa();

// 配置session的中间件;
app.use(
  cors({
    credentials: true,
  }),
);

app.use(static(__dirname + '/'));
app.use(bodyParser());

// 签名key ⽤来对 cookie 进⾏签名
app.keys = ['some secret'];

// 配置项
const SESS_CONFIG = {
  key: 'kkb:sess', // cookie键名
  maxAge: 86400000, // 有效期，默认⼀天
  httpOnly: true, // 仅服务器修改
  signed: true, // 签名cookie
};

// 注册
app.use(session(SESS_CONFIG, app));

app.use((ctx, next) => {
  if (ctx.url.indexOf('login') !== -1) {
    // access login page, continue
    next();
  } else {
    console.log('session', ctx.session.userinfo);
    if (!ctx.session.userinfo) {
      ctx.body = {
        message: '登录失败',
      };
    } else {
      next();
    }
  }
});

router.post('/login', async (ctx) => {
  const { body } = ctx.request;
  console.log('body', body);
  //设置session
  ctx.session.userinfo = body.username;
  ctx.body = {
    message: '登录成功',
  };
});

router.post('/logout', async (ctx) => {
  //设置session
  delete ctx.session.userinfo;
  ctx.body = {
    message: '登出系统',
  };
});

router.get('/get-user', async (ctx) => {
  ctx.body = {
    message: '获取数据成功',
    userinfo: ctx.session.userinfo,
  };
});

app.use(router.routes());
app.use(router.allowedMethods());
app.listen(3000);
```

index.html

```html
<html>

  <head>
    <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
    <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
  </head>

  <body>
    <div id="app">
      <div>
        <input v-model="username">
        <input v-model="password">
      </div>
      <div>
        <button v-on:click="login">Login</button>
        <button v-on:click="logout">Logout</button>
        <button v-on:click="getUser">GetUser</button>
      </div>
      <div>
        <button onclick="document.getElementById('log').innerHTML = ''">Clear Log</button>
      </div>
    </div>
    <h6 id="log"></h6>
    </div>
    <script>
      // axios.defaults.baseURL = 'http://localhost:3000'
      axios.defaults.withCredentials = true;
      axios.interceptors.response.use(
        response => {
          document.getElementById('log').append(JSON.stringify(response.data));
          return response;
        }
      );
      var app = new Vue({
        el: '#app',
        data: {
          username: 'test',
          password: 'test'
        },
        methods: {
          async login() {
            await axios.post('/login', {
              username: this.username,
              password: this.password
            })
          },
          async logout() {
            await axios.post('/logout')
          },
          async getUser() {
            await axios.get('/get-user')
          }
        }
      });
    </script>
  </body>

</html>

```

### b. Koa-redis

redis usage:

```javascript
/**
 * redis install and cli: https://redis.io/topics/quickstart
 * node redis: https://github.com/NodeRedis/node_redis
 */
const redis = require('redis');
const client = redis.createClient(6379, 'localhost');

client.set('name', 'derek');
client.get('name', function(err, v) {
  console.log('redis key:', v);
});
```

koa-redis demo:

```javascript
/**
 * koa-redis, koa-session, co-redis together
 */
const koa = require('koa');
const session = require('koa-session');
const redis = require('redis');
const redisStore = require('koa-redis');
const wrapper = require('co-redis');

const app = new koa();

const redisClient = redis.createClient(6379, 'localhost');
const client = wrapper(redisClient);

app.keys = ['some secret'];

const SESS_CONFIG = {
  key: 'kkb:sess',
  /* replace below with redis */
  // maxAge: 8640000, // 有效期
  // httpOnly: true, // 服务器有效
  // signed: true // 签名
  store: redisStore({ client }),
};

app.use(session(SESS_CONFIG, app));

app.use((ctx) => {
  // 查看redis
  redisClient.keys('*', (err, keys) => {
    console.log('keys:', keys);
    keys.forEach((key) => {
      redisClient.get(key, (err, val) => {
        console.log(val);
      });
    });
  });

  if (ctx.path === '/favicon.ico') return;
  let n = ctx.session.count || 0;
  ctx.session.count = ++n;
  ctx.body = '第' + n + '次访问';
});

app.listen(3000);
```

## 2. Token 验证

session 不⾜:

- 服务器有状态
- 不灵活:如果 APP 该怎么办
- 跨域怎么办

Token 原理:

![image-20190930195608253](../assets/images/image-20190930195608253.png)

1. 客户端使⽤⽤户名跟密码请求登录
2. 服务端收到请求，去验证⽤户名与密码
3. 验证成功后，服务端会签发⼀个令牌(Token)，再把这个 Token 发送给客户端
4. 客户端收到 Token 以后可以把它存储起来，⽐如放在 Cookie ⾥或者 Local Storage ⾥
5. 客户端每次向服务端请求资源的时候需要带着服务端签发的 Token, Header 里 Bearer Authorization Token
6. 服务端收到请求，然后去验证客户端请求⾥⾯带着的 Token，如果验证成功，就向客户端返回请求的数据

server.js

```javascript
/**
 * koa server 中使用 jwt
 * reference: https://github.com/koajs/jwt
 * https://github.com/auth0/node-jsonwebtoken#errors--codes
 * https://travishorn.com/api-server-with-jwt-authentication-6bb4985c5253
 */
const koa = require('koa');
const static = require('koa-static');
const bodyParser = require('koa-bodyparser');
const jwtAuth = require('koa-jwt');

const { secret } = require('./config');
const errorHandler = require('./middleware/error-handler');
const authMiddleware = require('./middleware/auth');

const app = new koa();

app.use(static(__dirname + '/'));
app.use(bodyParser());

app.use(errorHandler);

app.use(authMiddleware);
app.use(jwtAuth({ secret }).unless({ path: [/^(\/public)|(\/api\/login)/] }));

// routes here (order matters)
require('./routes')(app);

app.on('error', (err, ctx) => {
  /* centralized error handling:
   *   console.log error
   *   write error to log file
   *   save error and request information to database if ctx.request match condition
   *   ...
   */
  console.log('center log: ', err.message);
});

app.listen(3000);
```

auth middleware:

```javascript
// Custom 401 handling if you don't want to expose koa-jwt errors to users
module.exports = (ctx, next) => {
  return next().catch((err) => {
    if (401 === err.status) {
      console.log('unauthenticated');
      ctx.status = 401;
      ctx.body = {
        error: err.originalError ? err.originalError.message : err.message,
      };
    } else {
      throw err;
    }
  });
};
```

error-handler middleware:

```javascript
module.exports = async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = err.status || 500;
    ctx.body = { message: err.message, code: ctx.status };
    ctx.app.emit('error', err, ctx);
  }
};
```

routes/auth.js

```javascript
const router = require('koa-router')();
const jwt = require('jsonwebtoken');

const { secret } = require('../config');

router.post('/api/login', async (ctx) => {
  const { body } = ctx.request;

  const userinfo = body.username;
  ctx.body = {
    message: '登录成功',
    user: userinfo,
    // 生成 token 返回给客户端
    token: jwt.sign(
      {
        data: userinfo,
        // 设置 token 过期时间，一小时后，秒为单位
        exp: Math.floor(Date.now() / 1000) + 60 * 60,
      },
      secret,
    ),
  };
});

router.get('/api/current-user', async (ctx) => {
  // 如果 passthrough: true 没有传且验证失败，这里不会走
  console.log(ctx.state);
  // 验证通过
  ctx.body = {
    message: '获取数据成功',
    userinfo: ctx.state.user.data,
  };
});

module.exports = function(app) {
  app.use(router.routes());

  // It tells our server how to respond when someone tries to access a route with the incorrect method (GET, POST, etc).
  app.use(router.allowedMethods());
};
```

routes/index.js

```javascript
module.exports = (app) => {
  // add routes like this
  require('./auth')(app);
  require('./book')(app);
};
```

index.html

```html
<html>
  <head>
    <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
    <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
  </head>

  <body>
    <div id="app">
      <div>
        <input v-model="username" />
        <input v-model="password" />
      </div>
      <div>
        <button v-on:click="login">Login</button>
        <button v-on:click="logout">Logout</button>
        <button v-on:click="getUser">GetUser</button>
        <button v-on:click="getBooks">getBooks</button>
      </div>
      <div>
        <button @click="logs=[]">Clear Log</button>
      </div>
      <!-- 日志 -->
      <ul>
        <li v-for="(log,idx) in logs" :key="idx">
          {{ log }}
        </li>
      </ul>
    </div>
    <script>
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
          username: 'test',
          password: 'test',
          logs: [],
        },
        methods: {
          async login() {
            const res = await axios.post('/api/login', {
              username: this.username,
              password: this.password,
            });
            localStorage.setItem('token', res.data.token);
          },
          async logout() {
            localStorage.removeItem('token');
          },
          async getUser() {
            try {
              await axios.get('/api/current-user');
            } catch (error) {
              console.log(error.message);
            }
          },
          async getBooks() {
            try {
              await axios.get('/api/books');
            } catch (error) {
              console.log(error.message);
            }
          },
        },
      });
    </script>
  </body>
</html>
```

### JWT (JSON WEB TOKEN) 原理解析

1. Bearer Token 包含三个组成部分：令牌头、payload、哈希(签名)，`HEADER.PAYLOAD.SIGNATURE`

   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoidGVzdCIsImV4cCI6MTU2OTg2MjU2NSwiaWF0IjoxNTY5ODU4OTY1fQ.JacNl3jXb71SFisoQWsHoMSbJCUO51Q5-rdITX7TgLM
   ```

1. 签名：默认使⽤ base64 对 header 和 payload 编码，使⽤ hs256 算法对编码后的令牌头、payload 和密钥进⾏签名⽣成哈希

1. 验证：默认使⽤ hs256 算法对令牌中数据签名并将结果和令牌中哈希⽐对

---

Access <https://jwt.io/>.

> paste token `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoidGVzdCIsImV4cCI6MTU2OTg5MzMzMCwiaWF0IjoxNTY5ODg5NzMwQ.t_4fcFChJ_uSsT6KovKfKpmXdoCT6ZHTbliBwVE9iok`

decode token 包涵三部分

1.  HEADER: ALGORITHM & TOKEN TYPE

    > `alg`属性表示签名的算法（algorithm），默认是 HMAC SHA256（写成 HS256）；`typ`属性表示这个令牌（token）类型（type），JWT 令牌统一写为`JWT`。最后，将 JSON 对象使用 Base64URL 算法转成字符串。

    ```javascripton
    {
      "alg": "HS256",
      "typ": "JWT"
    }
    ```

1.  PAYLOAD: DATA

    官方字段：

    ```text
    iss (issuer)：签发人
    exp (expiration time)：过期时间
    sub (subject)：主题
    aud (audience)：受众
    nbf (Not Before)：生效时间
    iat (Issued At)：签发时间
    jti (JWT ID)：编号
    ```

    自定义字段:

    ```javascripton
    {
      "sub": "1234567890",
      "name": "John Doe",
      "admin": true
    }
    ```

    例如我们可以传：

    ```javascripton
    {
      "data": "test",
      "exp": 1569893010,
      "iat": 1569889410
    }
    ```

    > JWT 默认是不加密的，任何人都可以读到，所以不要把秘密信息放在这个部分。这个 JSON 对象也要使用 Base64URL 算法成字符串。

1.  VERIFY SIGNATURE

    > 需要指定一个密钥（secret）。这个密钥只有服务器才知道，不能泄露给用户。然后，使用 Header 里面指定的签名算（默认是 HMAC SHA256），按照下面的公式产生签名。
    >
    > 算出签名以后，把 Header、Payload、Signature 三个部分拼成一个字符串，每个部分之间用"点"（`.`）分隔，就可返回给用户。

    ```javascript
    HMACSHA256(
      base64UrlEncode(header) + "." +
      base64UrlEncode(payload),
      SECRET HERE
    )
    ```

> 前面提到，Header 和 Payload 串型化的算法是 Base64URL。这个算法跟 Base64 算法基本类似，但有一些小的不同。
>
> JWT 作为一个令牌（token），有些场合可能会放到 URL（比如 api.example.com/?token=xxx）。Base64 有三个字符`+`、`/`和`=`，在 URL 里面有特殊含义，所以要被替换掉：`=`被省略、`+`替换成`-`，`/`替换成`_` 。这就是 Base64URL 算法。

HMAC SHA256 HMAC(Hash Message Authentication Code，散列消息鉴别码，基于密钥的 Hash 算法的认证协议。消息鉴别码实现鉴别的原理是，⽤公开函数和密钥产⽣⼀个固定⻓度的值 作为认证标识，⽤这个标识鉴别消息的完整性。使⽤⼀个密钥⽣成⼀个固定⼤⼩的⼩数据块，即 MAC，并将其加⼊到消息中，然后传输。接收⽅利⽤与发送⽅共享的密钥进⾏鉴别认证等。

BASE64 按照 RFC2045 的定义，Base64 被定义为：Base64 内容传送编码被设计⽤来把任意序列的 8 位字节描述为⼀种不易被⼈直接识别的形式。（The Base64 Content-Transfer-Encoding is designed to represent arbitrary sequences of octets in a form that need not be humanly readable.） 常⻅于邮件、http 加密，截取 http 信息，你就会发现登录操作的⽤户名、密码字段通 过 BASE64 编码的

### JWT 的使用方式

客户端收到服务器返回的 JWT，可以储存在 Cookie 里面，也可以储存在 localStorage。

此后，客户端每次与服务器通信，都要带上这个 JWT。你可以把它放在 Cookie 里面自动发送，但是这样不能跨域，所以更好的做法是放在 HTTP 请求的头信息 `Authorization` 字段里面。

> ```javascript
> Authorization: Bearer <token>
> ```

另一种做法是，跨域的时候，JWT 就放在 POST 请求的数据体里面。

### JWT 的几个特点

1. JWT 默认是不加密，但也是可以加密的。生成原始 Token 以后，可以用密钥再加密一次。
1. JWT 不加密的情况下，不能将秘密数据写入 JWT。
1. JWT 不仅可以用于认证，也可以用于交换信息。有效使用 JWT，可以降低服务器查询数据库的次数。
1. JWT 的最大缺点是，由于服务器不保存 session 状态，因此无法在使用过程中废止某个 token，或者更改 token 的权限。也就是说，一旦 JWT 签发了，在到期之前就会始终有效，除非服务器部署额外的逻辑。
1. JWT 本身包含了认证信息，一旦泄露，任何人都可以获得该令牌的所有权限。为了减少盗用，JWT 的有效期应该设置得比较短。对于一些比较重要的权限，使用时应该再次对用户进行认证。
1. 为了减少盗用，JWT 不应该使用 HTTP 协议明码传输，要使用 HTTPS 协议传输。

### Reference

- <https://www.npmjs.com/package/jsonwebtoken>
- <https://www.npmjs.com/package/koa-jwt>

## 3. OAuth

概述：三⽅登⼊主要基于 OAuth 2.0。OAuth 协议为⽤户资源的授权提供了⼀个安全的、开放⽽⼜简易的标准。与以往的授权⽅式不同之处是 OAUTH 的授权不会使第三⽅触及到⽤户的帐号信息 （如⽤户名与密码），即第三⽅⽆需使⽤⽤户的⽤户名与密码就可以申请获得该⽤户资源的授权，因此 OAUTH 是安全的。

OAuth 登录

登录⻚⾯ index.html

```html
<html>
  <head> </head>

  <body>
    <div id="app">
      <a href="/github/login">login with github</a>
    </div>
  </body>
</html>
```

index.js

```javascript
/**
 * github oauth app: https://github.com/settings/applications/1144383
 */
const koa = require('koa');
const router = require('koa-router')();
const static = require('koa-static');
const axios = require('axios');
const querystring = require('querystring');

const app = new koa();

app.use(static(__dirname + '/'));

const config = {
  client_id: 'ad162a7a4c99c8248da9',
  client_secret: 'b84d7131741b8419ae932a0f4c377c97f25f7325',
};

router.get('/github/login', async (ctx) => {
  //重定向到认证授权服务器接口,并配置参数
  ctx.redirect(`https://github.com/login/oauth/authorize?client_id=${config.client_id}`);
});

// github 那边自定义 Authorization callback URL，被这个路由匹配
router.get('/github/callback', async (ctx) => {
  console.log('callback..');
  const code = ctx.query.code;
  const params = {
    client_id: config.client_id,
    client_secret: config.client_secret,
    code: code,
  };

  try {
    let res = await axios.post('https://github.com/login/oauth/access_token', params);
    const access_token = querystring.parse(res.data).access_token;

    res = await axios.get('https://api.github.com/user?access_token=' + access_token);
    console.log('userAccess:', res.data);

    ctx.body = `
          <h1>Hello ${res.data.login}</h1>
          <img src="${res.data.avatar_url}" alt=""/>
      `;
  } catch (err) {
    ctx.body = err.message;
  }
});

app.use(router.routes());
app.use(router.allowedMethods());
app.listen(3000);
```
