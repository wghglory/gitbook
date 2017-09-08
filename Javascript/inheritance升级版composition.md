# aggregation composition 组合

组合比继承好啊。下面的例子，生成了一个三维的带颜色的立方体。如果用继承做，需在继承类中写三维和颜色代码，但三维和颜色并没有抽离出来。如果又有个圆形希望变成三维和带颜色，又要在继承类中写三维和颜色代码。和立方体的代码不方便维护。

```javascript
// npm install aggregation
var aggregation = require('aggregation/es6');

var aggregation = (baseClass, ...mixins) => {
  let base = class _Combined extends baseClass {
    constructor(...args) {
      super(...args);
      mixins.forEach((mixin) => {
        mixin.prototype.initializer.call(this);
      });
    }
  };
  let copyProps = (target, source) => {
    Object.getOwnPropertyNames(source).concat(Object.getOwnPropertySymbols(source)).forEach((prop) => {
      if (prop.match(/^(?:constructor|prototype|arguments|caller|name|bind|call|apply|toString|length)$/)) return;
      Object.defineProperty(target, prop, Object.getOwnPropertyDescriptor(source, prop));
    });
  };
  mixins.forEach((mixin) => {
    copyProps(base.prototype, mixin.prototype);
    copyProps(base, mixin);
  });
  return base;
};
```

具体使用：

```javascript
class Colored {
  initializer() {
    this._color = 'white';
  }
  get color() {
    return this._color;
  }
  set color(v) {
    this._color = v;
  }
}

class ZCoord {
  initializer() {
    this._z = 0;
  }
  get z() {
    return this._z;
  }
  set z(v) {
    this._z = v;
  }
}

// base class
class Shape {
  constructor(x, y) {
    this._x = x;
    this._y = y;
  }
  get x() {
    return this._x;
  }
  set x(v) {
    this._x = v;
  }
  get y() {
    return this._y;
  }
  set y(v) {
    this._y = v;
  }
}

// Shape is base. Colored, ZCoord are features
class Rectangle extends aggregation(Shape, Colored, ZCoord) {}

var rect = new Rectangle(7, 42);
rect.z = 1000;
rect.color = 'red';
console.log(rect.x, rect.y, rect.z, rect.color);
```
