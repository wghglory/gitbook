# 面向对象继承

## 类的声明和实例化

```javascript
/**
  * 类的声明 构造函数模拟类
  */
var Animal = function () {
    this.name = 'Animal';
};

/**
  * es6中class的声明
  */
class Animal2 {
    constructor() {
        this.name = 'Animal2';
    }
}

/**
  * 实例化
  */
console.log(new Animal(), new Animal2());
```

## 继承和继承方式

本质就是通过原型链。

### 1. 借助构造函数实现继承

原理：实例化子类时，父类构造函数执行，传入this，指向了实例化的子类。父类属性挂在到子类中

缺点：只实现了部分继承。只能继承构造函数中的属性方法，父类原型上方法或属性不会被继承。say不存在

```javascript
function Parent1() {
  this.name = 'parent1';
}
Parent1.prototype.say = function () {};

function Child1() {
  Parent1.call(this); //父类构造函数执行，传入this，指向了实例化的子类。父类属性挂在到子类中。也可以apply
  this.type = 'child1';
}
console.log(new Child1(), new Child1().say());  // 报错，没有 say
```

### 2. 借助原型链实现继承

原理：子类原型对象 指向 父类的实例。我们已知 `子类实例.__proto__` 就是子类的原型对象，即 `构造函数.prototype` (`new Child2().__proto__ === Child2.prototype`)。加上条件 `Child2.prototype = new Parent2();` 后，`new Child2().__proto__ === new Parent2()`。所以子实例中的 `__proto__` 通过原型链查找到了父类的属性方法 `new Child2().__proto__.name` 。

缺点：多个子类实例没有隔离。因为原型对象的属性大家公用。父类中增加了新的属性，那么所有实例都会同时改变，如果某个来自父类的属性值发生了变化，那么其他实例也都随着发生变化，因为所有实例的 `__proto__` 都是同一个，所以相互之间会有影响。

```javascript
function Parent2() {
  this.name = 'parent2';
  this.play = [1, 2, 3];
}

function Child2() {
  this.type = 'child2';
}

Child2.prototype = new Parent2(); //子类原型对象 指向 父类的实例

var s1 = new Child2();
var s2 = new Child2();
s1.__proto__ === s2.__proto__ //true
console.log(s1.play, s2.play);
s1.play.push(4);
console.log(s1.play, s2.play); //缺点：此时他俩引用一处，没有隔离。因为原型对象的属性大家公用
```

### 3. 组合方式

优点：有方法1 和 2的优势

缺点：

1. 只看s3，不考虑s4的情况下，父类构造函数执行了2次。`new Parent3()`, `Parent3.call(this)`
1. Child3 constructor 指向错误到了 parent

```javascript
function Parent3() {
  this.name = 'parent3';
  this.play = [1, 2, 3];
}

function Child3() {
  Parent3.call(this);
  this.type = 'child3';
}

Child3.prototype = new Parent3();

var s3 = new Child3();
var s4 = new Child3();
s3.play.push(4);
console.log(s3.play, s4.play);
```

### 4. 组合继承的优化1

原理：子类原型对象 = 父类原型对象，解决了2次执行构造函数的问题

缺点：还是子类的构造函数指向不对。

```javascript
function Parent4() {
  this.name = 'parent4';
  this.play = [1, 2, 3];
}

function Child4() {
  Parent4.call(this);
  this.type = 'child4';
}
Child4.prototype = Parent4.prototype;
var s5 = new Child4();
var s6 = new Child4();
console.log(s5, s6);

console.log(s5 instanceof Child4, s5 instanceof Parent4); //true,不知道到底谁直接创建的
console.log(s5.constructor); //Parent4！指向错误
```

### 5. 组合继承的优化2，完美方案

原理：`Object.create()` 创建的对象指向 Parent 原型对象，所以 Child 和 Parent 通过创建的对象进行了关联。不像第四个方法 Parent 和 Child 指向同一个引用。导致 constructor 即使修正后，也只能都指向 Parent 或者都 Child，即给 Child.prototype.constructor 修正为 Child 构造函数后，Parent 的 constructor 也被修成 Child 构造函数了。

```javascript
function Parent5() {
  this.name = 'parent5';
  this.play = [1, 2, 3];
}

function Child5() {
  Parent5.call(this);
  this.type = 'child5';
}

var x = Object.create(Parent5.prototype);
console.log(x.__proto__ === Parent5.prototype)  //true,新对象的上级原型链是 Parent5 原型对象，继承了 Parent5 的一切
Child5.prototype = x   //子类原型对象指向x，子实例通过 __proto__ 找到上一级 x。关系为 Child5 --> x --> Parent5
Child5.prototype.constructor = Child5 // 修正

var s7 = new Child5();
console.log(s7 instanceof Child5, s7 instanceof Parent5); //true true
console.log(s7.constructor); //Child5
```

---

Object.create polyfill:

```javascript
function create(obj) {
  if (Object.create) {
    return Object.create(obj);
  }

  function F() {}
  F.prototype = obj;
  return new F();  // 返回 obj 的上层原型对象
}
```