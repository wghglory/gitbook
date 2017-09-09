# 对于Set结构， 也可以使用数组的解构赋值

```javascript
let [a, b, c] = new Set(["a", "b", "c"])
console.log(a) // "a"
```

> 事实上，只要某种数据结构具有`Iterator`接口，都可以采用数组形式的解构赋值。

```javascript
function* fibs() {
    var a = 0;
    var b = 1;
    while (true) {
        yield a;
        [a, b] = [b, a + b];
    }
}
var [first, second, third, fourth, fifth, sixth] = fibs();
sixth // 5
```

上面代码中， fibs是一个`Generator`函数，原生具有`Iterator`接口。 解构赋值会依次从这个接口获取值。

## 只有 undefined 才能触发默认值

```javascript
[1, undefined, 3].map((x = 'yes') => x); // [ 1, 'yes', 3 ]
```

### 主要用途

1. 交换变量的值: `[x, y] = [y, x];`

1. 从函数返回多个值: 将它们放在数组或对象里返回

    ```javascript
    function example() {
      return [1, 2, 3];
    }
    var [a, b, c] = example();

    // 返回一个对象
    function example() {
      return {
        foo: 1,
        bar: 2
      };
    }
    var { foo, bar } = example();
    ```

1. 函数参数的定义: 解构赋值可以方便地将一组参数与变量名对应起来。

    ```javascript
    // 参数是一组有次序的值
    function f([x, y, z]) { ... }
    f([1, 2, 3])

    // 参数是一组无次序的值
    function f({x, y, z}) { ... }
    f({x:1, y:2, z:3})
    ```

1. 提取 JSON 数据

    ```javascript
    var jsonData = {
      id: 42,
      status: "OK",
      data: [867, 5309]
    }

    let { id, status, data: number } = jsonData;

    console.log(id, status, number) // 42, OK, [867, 5309]
    ```

1. 函数参数的默认值

    ```javascript
    jQuery.ajax = function (url, {
      async = true,
      beforeSend = function () {},
      cache = true,
      complete = function () {},
      crossDomain = false,
      global = true,
      // ... more config
    }) {
      // ... do stuff
    };
    指定参数的默认值，就避免了在函数体内部再写var foo = config.foo || 'default foo'这样的语句。
    ```

1. 遍历Map结构: 任何部署了`Iterator`接口的对象，都可以用`for...of`循环遍历。

    ```javascript
    var map = new Map();
    map.set('first', 'hello');
    map.set('second', 'world');

    for (let [key, value] of map) {
      console.log(key + " is " + value);
    }
    // first is hello
    // second is world
    如果只想获取键名，或者只想获取键值，可以写成下面这样。

    // 获取键名
    for (let [key] of map) {
      // ...
    }

    // 获取键值
    for (let [,value] of map) {
      // ...
    }
    ```

1. 输入模块的指定方法: 加载模块时，往往需要指定输入那些方法。解构赋值使得输入语句非常清晰。

    ```javascript
    const { SourceMapConsumer, SourceNode } = require("source-map");
    ```
