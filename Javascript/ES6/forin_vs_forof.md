# [Difference between `for...of` and `for...in`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of)

The `for...in` loop will iterate over all enumerable properties of an object. Note that if someone added new properties to `Array.prototype`, they will also be iterated over by this loop. Therefore this method is "not" recommended.

The `for...of` syntax is specific to **collections**, rather than all objects. It will iterate in this manner over the elements of any collection that has a `[Symbol.iterator]` property.

The following example shows the difference between a `for...of` loop and a `for...in` loop.

```javascript
Object.prototype.objCustom = function () {};
Array.prototype.arrCustom = function () {};

let iterable = [3, 5, 7];
iterable.foo = 'hello';

for (let i in iterable) {
  if (iterable.hasOwnProperty(i)) {
    console.log(i); // logs 0, 1, 2, "foo"
  }
  // console.log(i); // logs 0, 1, 2, "foo", "arrCustom", "objCustom"
}

for (let i of iterable) {
  console.log(i); // logs 3, 5, 7
}
```

---

Using `for of`:

```javascript
for(let v of ['dog', 'cat', 'hen']) {
  // Do something
});
```

Another way of iterating over an array that was added with ECMAScript 5 is `forEach()`:

```javascript
['dog', 'cat', 'hen'].forEach(function(currentValue, index, array) {
  // Do something with currentValue or array[index]
});
```