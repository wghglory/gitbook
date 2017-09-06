### `for in` is not recommended:

You can iterate over an array using a `for...in` loop. Note that if someone added new properties to `Array.prototype`, they will also be iterated over by this loop. Therefore this method is "not" recommended.

Another way of iterating over an array that was added with ECMAScript 5 is `forEach()`:

```javascript
['dog', 'cat', 'hen'].forEach(function(currentValue, index, array) {
  // Do something with currentValue or array[index]
});
```

Using `for of`:

```javascript
for(let v of ['dog', 'cat', 'hen']) {
  // Do something 
});
```

