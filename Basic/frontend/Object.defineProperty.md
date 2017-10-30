# Object.defineProperty

vue.js 和 avalon.js 都是通过它实现双向绑定的。。而且 Object.observe 也被草案发起人撤回了。。所以 defineProperty 更有必要了解了

```javascript
var guanghui = {};
Object.defineProperty(guanghui, 'age', {
  value: 12
});
console.log(guanghui.age); // 12
```

## 传入参数

* 第一个参数:目标对象
* 第二个参数:需要定义的属性或方法的名字。
* 第三个参数:目标属性所拥有的特性。（descriptor）

## descriptor

* value: 属性的值(不用多说了)
* writable: 如果为false，属性的值就不能被重写,只能为只读了
* configurable: 总开关，一旦为false，就不能再设置他的（value，writable，configurable）
* enumerable: 是否能在 `for...in` 循环中遍历出来或在 `Object.keys` 中列举出来。
* get:一会细说
* set:一会细说

### descriptor 默认值

```javascript
var guanghui = {};
Object.defineProperty(guanghui, 'age', {
  value: 12
});
console.log(guanghui.age); // 12
```

我们只设置了 value，别的并没有设置，但是 **第一次的时候**可以简单的理解为（暂时这样理解）它会默认帮我们把 writable，configurable，enumerable 都设上值，而且值还都是false。。也就是说，上面代码和下面是等价的的（ **仅限于第一次设置的时候**）

```javascript
var guanghui = {};
Object.defineProperty(guanghui, 'age', {
  value: 12,
  writable: false,
  enumerable: false,
  configurable: false
});

console.log(guanghui.age); // 12
```

### configurable

总开关，第一次设置 false 之后，，第二次什么设置也不行了，比如说

```javascript
var a = {};
Object.defineProperty(a, 'b', {
  configurable: false
});
Object.defineProperty(a, 'b', {
  configurable: true
});
//error: Uncaught TypeError: Cannot redefine property: b
```

就会报错了。。注意上面讲的默认值。。。如果第一次不设置它会怎样。。会帮你设置为false。。所以。。第二次。再设置他会怎样？。。对喽，，会报错

### writable

如果设置为 false，就变成只读了。。

```javascript
var guanghui = {};
Object.defineProperty(guanghui, 'age', {
  value: 12
});
console.log(guanghui.age); // 12

console.log(guanghui.age); // 打印 12
guanghui.age = 25; // 没有错误抛出（在严格模式下会抛出，即使之前已经有相同的值）
console.log(guanghui.age); // 打印 12， 赋值不起作用。
```

### enumerable

属性特性 enumerable 定义了对象的属性是否可以在 `for...in` 循环和 `Object.keys()` 中被枚举。

```javascript
var guanghui = {};
Object.defineProperty(guanghui, 'age', {
  value: 12,
  enumerable: true
});

console.log(Object.keys(guanghui));  // 打印[ 'age' ]
```

改为false

```javascript
var guanghui = {};
Object.defineProperty(guanghui, 'age', {
  value: 12,
  enumerable: false
});

console.log(Object.keys(guanghui));  // nothing
```

### set 和 get

在 descriptor 中不能 **同时**设置访问器 (get 和 set) 和 writable 或 value，否则会错，就是说想用(get 和 set)，就不能用（writable 或 value中的任何一个）

```javascript
var a = {};
Object.defineProperty(a, 'b', {
  set: function(newValue) {
    console.log('你要赋值给我,我的新值是' + newValue);
  },
  get: function() {
    console.log('你取我的值');
    return 2; //注意这里，我硬编码返回2
  }
});
a.b = 1; // 你要赋值给我,我的新值是1
console.log(a.b); // 你取我的值  // 2
```

 “b” 赋值 或者 取值的时候会分别触发 set 和 get 对应的函数

这就是实现 observe 的关键啊。。