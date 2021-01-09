# Pure vs impure function

pure function 不修改外部变量包括 DOM，输入参数唯一则返回值唯一，没有负效应，容易测试。

- The function should take in at least one argument.
- The function should return a value or another function.
- The function should not change or mutate any of its arguments.

```javascript
function addToArrayImpure(array, element) {
  array.push(element);
  return array;
}

function addToArrayPure(array, element) {
  return [...array, element];
  // return array.concat(element);
}

function addToObjImpure(obj, prop, value) {
  obj[prop] = value;
  return obj;
}

function addToObjPure(obj, prop, value) {
  return Object.assign({}, obj, {
    [prop]: value,
  });
}

// ES7
function addToObjPureSpread(obj, prop, value) {
  return {
    ...obj,
    [prop]: value,
  };
}

let person = { name: 'guanghui' };
console.log(addToObjPure(person, 'age', 20));

const frederick = {
  name: 'Frederick Douglass',
  canRead: false,
  canWrite: false,
};

const selfEducate = (person) => ({
  ...person,
  canRead: true,
  canWrite: true,
});

console.log(selfEducate(frederick));
console.log(frederick);

// {name: "Frederick Douglass", canRead: true, canWrite: true}
// {name: "Frederick Douglass", canRead: false, canWrite: false}
```

In React, the UI is expressed with pure functions. In the following sample, `Header` is a pure function that can be used to create heading—one elements just like in the previous example. However, this function on its own does not cause side effects because it does not mutate the DOM. This function will create a heading-one element, and it is up to some other part of the application to use that element to change the DOM:

```javascriptx
const Header = (props) => <h1>{props.title}</h1>;
```
