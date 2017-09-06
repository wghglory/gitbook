对于复合类型的变量，变量名不指向数据，而是指向数据所在的地址。命令只是保证变量名指向的地址不变，并不保证该地址的数据不变，所以将一个对象声明为常量必须非常小心。

```javascript
const foo = {}; 
foo.prop = 123; 
foo.prop // 123 
foo = {}; // TypeError: "foo" is read-only
```
 
上面代码中，常量储存的是一个地址，这个地址指向一个对象。不可变的只是这个地址，即不能指向另一个地址，但对象本身是可变的，所以依然可以为其添加新属性。


完全冻结对象：包含冻结对象本身和对象属性

```javascript
var constantize = (obj) => {
  Object.freeze(obj);
  Object.keys(obj).forEach((key, value) => {
      if (typeof obj[key] === 'object') {
        constantize(obj[key]);
      }
    });
};
```
