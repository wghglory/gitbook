# [模块化: AMD, CMD, CommonJS, UMD](https://segmentfault.com/a/1190000004873947)

* AMD 模块以浏览器第一的原则发展，异步加载模块，**依赖前置提前加载**，代表 RequireJS。RequireJS 从 2.0 开始，也改成可以延迟执行
* CMD 异步加载，**延迟执行**，**依赖后置就近加载**，代表 seajs
* CommonJS 模块以服务器第一原则发展，选择**同步加载**，Node.js 使用
* UMD 是 AMD 和 CommonJS 的糅合
* ES6 import

## AMD (Asynchronous Module Definition)，代表 RequireJs

<mark>AMD 是 RequireJS 在推广过程中对模块定义的规范化产出，**AMD 是异步加载模块，推崇依赖前置。**</mark>

```javascript
define('module1', ['jquery'], ($) => {
  //do something...
});
```

代码中依赖被前置，当定义模块（module1）时，就会加载依赖（jquery）

`define(id?, dependencies?, factory)`

第一个参数 id 为字符串类型，表示了模块标识，为可选参数。若不存在则模块标识应该默认定义为在加载器中被请求脚本的标识。如果存在，那么模块标识必须为顶层的或者一个绝对的标识。第二个参数，dependencies ，是一个当前模块依赖的，已被模块定义的模块标识的数组字面量。第三个参数，factory，是一个需要进行实例化的函数或者一个对象。

通过参数的排列组合，这个简单的 API 可以从容应对各种各样的应用场景，如下所述。

* 定义无依赖的模块

```javascript
define({
  add: function(x, y) {
    return x + y;
  },
});
```

* 定义有依赖的模块

```javascript
define(['alpha'], function(alpha) {
  return {
    verb: function() {
      return alpha.verb() + 1;
    },
  };
});
```

* 定义数据对象模块

```javascript
define({
  users: [],
  members: [],
});
```

* 具名模块

```javascript
define("alpha", [ "require", "exports", "beta" ], function( require, exports, beta ){
    export.verb = function(){
        return beta.verb();
        // or:
        return require("beta").verb();
    }
});
```

* 包装模块

```javascript
define(function(require, exports, module) {
  var a = require('a'),
    b = require('b');

  exports.action = function() {};
});

// Or

require(['foo', 'bar'], function(foo, bar) {
  foo.func();
  bar.func();
});
```

不考虑多了一层函数外，格式和 Node.js 是一样的：使用 require 获取依赖模块，使用 exports 导出 API。

除了 define 外，AMD 还保留一个关键字 require。require 作为规范保留的全局标识符，可以实现为 module loader，也可以不实现。

## CMD (Common Module Definition 公共模块定义)

CMD 是 SeaJS 在推广过程中对模块定义的规范化产出，对于模块的依赖，CMD 是延迟执行，推崇依赖就近。

```javascript
define((require, exports, module) => {
  module.exports = {
    fun1: () => {
      var $ = require('jquery');
      return $('#test');
    },
  };
});
```

如上代码，只有当真正执行到 fun1 方法时，才回去执行 jquery。

同时 CMD 也是延自 CommonJS Modules/2.0 规范

### RequireJs seajs 比较

```javascript
//AMD
define(['./a', './b'], function(a, b) {
  //依赖一开始就写好
  a.test();
  b.test();
});

//CMD
define(function(require, exports, module) {
  //依赖可以就近书写
  var a = require('./a');
  a.test();
  //软依赖
  if (status) {
    var b = require('./b');
    b.test();
  }
});
```

> 虽然 AMD 也支持 CMD 写法，但依赖前置是官方文档的默认模块定义写法。
>
> AMD 的 API 默认是一个当多个用，CMD 严格的区分推崇职责单一。例如：AMD 里 require 分全局的和局部的。CMD 里面没有全局的 require，提供 `seajs.use()` 来实现模块系统的加载启动。CMD 里每个 API 都简单纯粹。

## CommonJS

提到 CMD，就不得不提起 CommonJS，CommonJS 是服务端模块的规范，由于 Node.js 被广泛认知。

根据 CommonJS 规范，一个单独的文件就是一个模块。加载模块使用 require 方法，该方法读取一个文件并执行，最后返回文件内部的 module.exports 对象。

```javascript
//file1.js
module.exports = {
  a: 1,
};

//file2.js
var f1 = require('./file1');
var v = f1.a + 2;
module.exports = {
  v: v,
};
```

CommonJS 加载模块是同步的，所以只有加载完成才能执行后面的操作。像 Node.js 主要用于服务器的编程，加载的模块文件一般都已经存在本地硬盘，所以加载起来比较快，不用考虑异步加载的方式，所以 CommonJS 规范比较适用。但如果是浏览器环境，要从服务器加载模块，这是就必须采用异步模式。所以就有了 AMD CMD 解决方案。

## UMD（Universal Module Definition \* 通用模块定义）

UMD 是 AMD 和 CommonJS 的一个糅合。AMD 是浏览器优先，异步加载；CommonJS 是服务器优先，同步加载。

既然要通用，怎么办呢？那就先判断是否支持 node.js 的模块，存在就使用 node.js；再判断是否支持 AMD（define 是否存在），存在则使用 AMD 的方式加载。这就是所谓的 UMD。

```javascript
((root, factory) => {
  if (typeof define === 'function' && define.amd) {
    //AMD
    define(['jquery'], factory);
  } else if (typeof exports === 'object') {
    //CommonJS
    var $ = require('jquery');
    module.exports = factory($);
  } else {
    //都不是，浏览器全局定义
    root.testModule = factory(root.jQuery);
  }
})(this, ($) => {
  //do something...  这里是真正的函数体
});
```

## ES6 import

ES6 modules 的 import 和 export statements 相比完全动态的 CommonJS require，有着本质的区别。

1.  只能作为模块顶层的语句出现，不能出现在 function 里面或是 if 里面。（ECMA-262 15.2)
1.  import 的模块名只能是字符串常量。(ECMA-262 15.2.2)
1.  不管 import 的语句出现的位置在哪里，在模块初始化的时候所有的 import 都必须已经导入完成。换句话说，ES6 imports are hoisted。(ECMA-262 15.2.1.16.4 - 8.a)
1.  import binding 是 immutable 的，类似 const。比如说你不能 `import { a } from './a`' 然后给 a 赋值个其他什么东西。(ECMA-262 15.2.1.16.4 - 12.c.3)

这些设计虽然使得灵活性不如 CommonJS 的 require，但却保证了 ES6 modules 的依赖关系是确定 (deterministic) 的，和运行时的状态无关，从而也就保证了 ES6 modules 是可以进行可靠的静态分析的。对于主要在服务端运行的 Node 来说，所有的代码都在本地，按需动态 require 即可。但对于要下发到客户端的 web 代码而言，要做到高效的按需使用，不能等到代码执行了才知道模块的依赖，必须要从模块的静态分析入手。这是 ES6 modules 在设计时的一个重要考量，也是为什么没有直接采用 CommonJS。正是基于这个基础上，才使得 tree-shaking 成为可能（这也是为什么 rollup 和 webpack 2 都要用 ES6 module syntax 才能 tree-shaking），所以说与其说 tree-shaking 这个技术怎么了不起，不如说是 ES6 module 的设计在模块静态分析上的种种考量值得赞赏。

## 自执行函数简单实现不暴露私有成员

```javascript
var module1 = (function() {
  var _count = 0;
  var m1 = function() {
    //...
  };
  var m2 = function() {
    //...
  };
  return {
    x: m1,
    y: m2,
  };
})();
```
