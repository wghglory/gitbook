//es6.ruanyifeng.com

http: // es6
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class ColorPoint extends Point {
  constructor(x, y, color) {
    // this.color = color; // ReferenceError
    super(x, y);
    this.color = color; // 正确
  }
}
// 子类的 constructor 方法没有调用 super 之前就使用 this 关键字会报错，而放在 super 方法之后就是正确的。
// 下面是生成子类实例的代码。

let cp = new ColorPoint(25, 8, 'green');
console.log(cp.x);
console.log(cp.y);
console.log(cp.color);
