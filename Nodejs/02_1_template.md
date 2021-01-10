# 模板引擎

模板引擎：模板引擎是 web 应用中动态生成 html 的工具，负责将数据和模板结合。常用的模板引擎有 ejs 、jade（现更名 pug）、Handlebars、Nunjucks、swig 等，每种模板引擎功能类似，语法不同。

## pug

安装 pug: `npm i pug -g`

### 常用语法

- pug 语法：通过缩进关系，代替以往 html 的层级包含关系，如 个简单的静态 可以表达为，注意要统一使用 tab 或者空格缩进，不要混用
- 内联书写层级,`a: img`
- style 属性：`div(style={width:"200px",color:"red"})`
- 使用`-`来定义变量，使用`=`把变量输出到元素内；
- 通过 `#{variable}` 插相应的变量值
- html 元素属性通过在标签右边通过括号包含（可以通过判断来添加）
- 文本通过在 字前 添加竖线符号`|`可让 jade 原样输出内容 在 html 标签标记后 通过空格隔开 本内容 在 html 标签标记后通过添加引号"."添加块级文本
- 注释：可以通过双斜杠进 注释，jade 有 3 种注释 式，可以分别对应输出 html 注释、 输出 html 注释、块级 html 注释
- 循环：`each val in [1,2,3]`
- 判断语句：`if else` case when default
- mixin：混合模式
- **include** common/footer.pug 通过 include 引入外部文件

```javascript
const Koa = require('koa');
const Router = require('koa-router');
const views = require('koa-views');
const app = new Koa();
const router = new Router();

app.use(
  views(__dirname + '/views', {
    map: {
      html: 'pug',
    },
  }),
);
router.get('/', async (ctx) => {
  // ctx.body = "hello";
  const users = [
    { name: '张三', age: 20, height: '178cm' },
    { name: '李四', age: 25, height: '179cm' },
    { name: '王五', age: 26, height: '180cm' },
  ];
  await ctx.render('index.pug', {
    data: '我是数据',
    users,
  });
});

app.use(router.routes());
app.listen(3000);
```

views/common.pug:

```pug
h2 我是公共模板
```

views/index.pug:

```pug
<!DOCTYPE html>
html(lang="en")
    head
        meta(charset="UTF-8")
        meta(name="viewport", content="width=device-width, initial-scale=1.0")
        meta(http-equiv="X-UA-Compatible", content="ie=edge")
        title Document
        style.
            .myDiv{
                width:200px;
                height:200px;
                background:red;
            }
    body
        h1 我是标题
        div 我是div
        div(class="myDiv") 我是类名为myDiv的div
            span 我是span
        .myDiv2(style={width:"100px",height:"100px",background:"blue"}) 我是div2
        #myId 我是id为myId的div
        //- 我是pug注释
        //-
            我是第一行
            我是第二行
        // 我是html注释
        //
            我是第一行
            我是第二行
        div
           | hello
        - let str = "你好"
        p #{str}
        p #{data}
        ul
            each item,index in users
                li 姓名是：#{item.name};年龄是：#{item.age};身高是：#{item.height};索引是：#{index}
        - for(let i=0;i<4;i++)
            span 我是循环出来的数据#{i}
        - let num = 1
            case num
                when 1
                    p num 是一
                when 2
                    p num 是二
                default
                    p num 是其他值
        mixin myDiv
            div 我是非常常用的div
        +myDiv
        +myDiv
        mixin pet(name,sex)
            p 这是一只#{name};它的性别是#{sex}
        +pet("狗狗","公")
        +pet("猫","母")
        include common.pug
        script(type="text/javascript").
            console.log(1111);
```

## [nunjucks 模板引擎在 koa 中的应用](https://mozilla.github.io/nunjucks/templating.html)

```javascript
const nunjucks = require('koa-nunjucks-2');

app.use(
  nunjucks({
    ext: 'html', //指定模板后缀
    path: path.join(__dirname, 'views'), //指定视图目录
    nunjucksConfig: {
      trimBlocks: true, //开启转义，防止xss漏洞
    },
  }),
);
```

### nunjucks 的语法使用

- 变量：`{{username}}`

- 注释：

  ```html
  {# Loop through all the users #}
  ```

- if

  ```njk
  {% if hungry %}
    I am hungry
  {% elif tired %}
    I am tired
  {% else %}
    I am good!
  {% endif %}
  ```

- for

  ```njk
  <h1>Posts</h1>
  <ul>
    {% for item in items %}
    <li>{{ item.title }}</li>
    {% else %}
    <li>This would display if the 'item' collection were empty</li>
    {% endfor %}
  </ul>
  ```

- 过滤器

  ```njk
  {
    {
      foo | replace('foo', 'bar') | capitalize;
    }
  }
  ```

- 模板继承 block/extends

  - 定义父类模板

    ```njk
    <h1>我是公共模板</h1>
    <div class="leftContent">
        {% block left %}
            这边是左侧的内容
        {% endblock %}
        {% block right %}
            这边是右侧的内容
        {% endblock %}
        {% block someValue %}
            我是一些数据
        {% endblock %}
    </div>
    ```

  - 继承父类模板

    ```njk
    {% extends "common.html" %}
    {% block left %}
        我是左侧的内容1111
    {% endblock %}
    {% block right %}
        我是右侧的内容11111
    {% endblock %}

    {% block someValue %}
        {{ super() }}
    {% endblock %}
    ```

- Macro（宏标签）可以定义可复用的内容，类似与编程语言中的函数

  - 定义

  ```njk
  {% macro pet(animalName,name="小白") %}
  <div>
    这里是一只{{animalName}};他的名字是{{name}}
  </div>
  {% endmacro %}
  ```

  - 调用

  ```njk
  {
    {
      pet('狗狗');
    }
  }
  ```

- include/import

  - include 引入文件

    ```html
    {% include "footer.html" %}
    ```

  - import 导入文件

    - 定义

    ```njk
    {% macro pet(animalName) %}
    <p>这是一只{{animalName}}</p>
    {% endmacro %}
    {% macro book(bookName) %}
    <p>这是一本书，名字叫{{bookName}}</p>
    {% endmacro %}
    ```

    - 调用

    ```njk
    {% import 'someModule.html' as fn %}
    {{fn.pet("狗狗")}}
    {{fn.book("nodejs从入门到实践")}}
    ```

### 使用

server:

```javascript
const Koa = require('koa');
const Router = require('koa-router');
const nunjucks = require('koa-nunjucks-2');
const app = new Koa();
const router = new Router();

app.use(
  nunjucks({
    ext: 'html', //.njk
    path: __dirname + '/views',
    nunjucksConfig: {
      trimBlocks: true, //防止Xss漏铜；
    },
  }),
);

router.get('/', async (ctx) => {
  // ctx.body = "hello";
  await ctx.render('index', {
    username: '张三',
    num: 2,
    arr: [
      {
        name: '张三',
        age: 20,
      },
      {
        name: '李四',
        age: 28,
      },
    ],
    str: 'hello world',
  });
});

router.get('/son1', async (ctx) => {
  await ctx.render('son1');
});

router.get('/import', async (ctx) => {
  await ctx.render('import');
});

app.use(router.routes());
app.listen(8000);
```

views/footer.html:

```html
<h1>我是公共底部</h1>
```

views/index.html:

```njk
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Document</title>
  </head>

  <body>
    <h1>我是标题</h1>
    <p>用户名是：{{username}}</p>

    <!-- 我是注释 -->
    {# 我是nunjucks注释 #}

    {% if num>3 %}
    <p>num值大于三</p>
    {% elseif num<3 %}
    <p>num值小于三</p>
    {% else %}
    <p>num值等于三</p>
    {% endif %}

    <ul>
      {% for item in arr %}
      <li>姓名是：{{item.name}}；年龄是：{{item.age}};</li>
      {% endfor %}
    </ul>

    {{str | replace("world","世界") | capitalize}}

    <!-- macro:宏标签 -->
    {% macro pet(name="狗",sex) %}
    <p>我是一只{{name}},我的性别是{{sex}}</p>
    {% endmacro %}

    {% macro person(name="小明",sex) %}
    <p>我是{{name}},我的性别是{{sex}}</p>
    {% endmacro %}

    {{pet("小狗","公")}}
    {{pet("小猫","公")}}

    {% include 'footer.html' %}
  </body>
</html>
```

views/import.html:

```njk
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Document</title>
  </head>

  <body>
    {% import 'index.html' as obj %}

    {{obj.pet("公")}}
    {{obj.person("男")}}
  </body>
</html>
```

views/parent.html:

```njk
<div>
  <p>我是父级模板</p>

  {% block left %}
  <p>左边内容</p>
  {% endblock %}

  {% block right %} 右边内容 {% endblock %}

  {% block someValue %} 一些数据 {% endblock %}
</div>
```

views/son1.html:

```njk
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Document</title>
  </head>

  <body>
    {% extends 'parent.html' %}

    {% block left %} 我是son1里左侧内容 {% endblock %}

    {% block right %} 我是son1里右侧侧内容 {% endblock %}

    {% block someValue %} {{super()}} {% endblock %}
  </body>
</html>
```
