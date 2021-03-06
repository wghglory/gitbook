# 原型链和原型

```
new 构造函数 --> 实例对象
实例对象.__proto__ === 原型对象 === 构造函数.prototype
原型对象.constructor === 构造函数
```

![原型链](http://om1o84p1p.bkt.clouddn.com/1503746533.png?imageMogr2/thumbnail/!70p)

## 创建对象方法

1.  对象字面量的方式、内置工厂 new Object

    ```javascript
    let o1 = { name: 'hello' }; // Object { name : 'hello' }
    let o11 = new Object({ name: 'hi' }); // Object { name: 'hi' }

    var wcDog = new Object();
    wcDog.name = '旺财';
    wcDog.age = 3;
    ```

1.  用 function 来模拟无参的构造函数

    ```javascript
    function Person() {}
    var person = new Person(); //定义一个function，如果使用 new "实例化"，该 function 可以看作是一个 Class
    person.name = 'Mark';
    person.age = '25';
    person.work = function() {
      alert(person.name + ' hello...');
    };
    person.work();
    ```

1.  用 function 来模拟参构造函数来实现（用 this 关键字定义构造的上下文属性。每个实例属性不同，方法一般不在这定义，应定义到原型中）

    ```javascript
    function Pet(name, age, hobby) {
      this.name = name; //this作用域：当前对象
      this.age = age;
      this.hobby = hobby;
      this.eat = function() {
        alert('我叫' + this.name + ',我喜欢' + this.hobby + ',是个程序员');
      };
    }

    var maidou = new Pet('麦兜', 25, 'coding'); //实例化、创建对象
    maidou.eat(); //调用eat方法
    ```

1.  用原型方式来创建(所有实例共有属性和方法)

    ```javascript
    function Dog() {}
    Dog.prototype.name = '旺财';
    Dog.prototype.eat = function() {
      alert(this.name + '是个吃货');
    };
    var wangcai = new Dog();
    wangcai.eat();
    ```

1.  用混合方式来创建

    ```javascript
    function Car(name, price) {
      this.name = name;
      this.price = price;
    }
    Car.prototype.sell = function() {
      alert('我是' + this.name + '，我现在卖' + this.price + '万元');
    };
    var camry = new Car('凯美瑞', 27);
    camry.sell();
    ```

1.  `Object.create` 传入原型对象 x，得到对象 y 是 x 原型链下一级（创建新空对象，继承自原型对象，这里继承 p）

    ```javascript
    var p = { name: 'hello' };
    let o3 = Object.create(p); // Object { }
    o3.name === 'hello'; // true, 其实是o3本身没有name，是通过原型链找到p,拿到了name。即o3.__proto__ === p
    ```

### Object.create 的原理

```javascript
Object.create = function(obj) {
  function F() {}
  F.prototype = obj;
  return new F(); // 返回 F 的原型对象是 obj
};
```

## 基本概念

### 原型

`构造函数.prototype` 就是原型对象。

### 构造函数

```javascript
F.prototype.constructor === F; // true. F是构造函数，构造函数的prototype是原型对象，这里为Object{constructor: function, __proto__: Object}，原型对象中constructor指向了构造函数
```

### 实例

```javascript
o2.__proto__ === F.prototype; // 实例的__proto__ 指向构造函数的prototype,即原型对象。
```

### 原型链

实例通过 `__proto__` 向上找到对应的原型对象，原型对象还可以通过 `__proto__` 找到上一级原型对象，一直到 `Object.prototype` 顶端停止。原型链依靠的是 `__proto__` 而不是 prototype

一些公用的方法不要放在构造函数中，因为那样实例化后每个实例都在内存中拷贝了一份。公共的方法和属性放在原型对象上。实例都可以通过原型链找到原型对象，原型对象上的方法被所有实例所共有。先找自己实例内部，没找到找最近一层原型对象，没找到的话一层一层向上查找。如果都没找到，原路返回告诉他没找到。如果中间找到了就不再向上查找

特点：JavaScript 对象是通过引用来传递的，我们创建的每个新对象实体中并没有一份属于自己的原型副本。当我们修改原型时，与之相关的对象也会继承这一改变。当我们需要一个属性的时，Javascript 引擎会先看当前对象中是否有这个属性，如果没有的话，就会通过 `__proto__` 查找他的原型对象是否有这个属性，如此递推下去，一直检索到 Object 内建对象。

### instanceOf 原理

简单说判断实例是不是由某个构造函数创建的。原理是判断 `实例.__proto__` 和 `构造函数.prototype` (原型对象)是不是同一个引用。但注意，A 继承 B，a 由 A 实例化创建，`a instanceOf A,B,Object` 都对，只要在原型链上级都算。这样的话就不能精确判断 a 到底是 A 还是 B 直接生成的。

这时候用 constructor 更加严谨

```javascript
a.__proto__.constructor === A; //true    原型的constructor 指向 构造函数 A
a.__proto__.constructor === Object; //false
```

![instanceOf](http://om1o84p1p.bkt.clouddn.com/1503746406.png?imageMogr2/thumbnail/!70p)

### new 原理

1.  一个新空对象创建，继承自原型对象 (`构造函数.prototype`)
1.  构造函数执行，执行时参数传入，上下文 this 指向新对象
1.  看构造函数结果，如果返回对象，则前两步白忙活直接返回这个对象；如果不返回对象，则返回 step 1 中的新对象

```javascript
// func 是构造函数
var newSimulate = function(func) {
  var o = Object.create(func.prototype); //step1 新对象继承自原型对象
  var temp = func.call(o); //step2 构造函数执行，修改 this 指向

  if (typeof temp === 'object') {
    //step3 判断构造函数返回结果
    return temp;
  } else {
    return o;
  }
};
```
