# javascript array.reduce

We often need to take a list of things and convert that into just one item - whether an integer, an object, or another array.

```javascript
var scores = [89, 76, 47, 95];
var initialValue = 0;
var reducer = function(accumulator, item) {
  return accumulator + item;
};
var total = scores.reduce(reducer, initialValue);
var average = total / scores.length;
```

You'll notice .reduce takes in two values, a callback function and an initial value. The callback (reducer) function has two parameters.

The first time the reducer function is called, it's going to be passed the initialValue you gave it (the 2nd argument to .reduce) and the first item in the actual array. So in our example above the first time that our reducer function runs, accumulator is going to be 0 and item is going to be 89. Remember, the goal is to transform an array into a single value. We currently have two numbers, 0 and 89, and are goal is to get that to one value. Because we're wanting to find the sum of every item in the array, we'll add 89 + 0 to get 89. That brings up a very important step. The thing that gets returned from the reducer function will then be passed as the accumulator the next time the function runs. So when reducer runs again, accumulator will be 89 and item will now be the second item in the array, 76. This pattern continues until we have no more items in the array and we get the summation of all of our reducer functions, which is 307.

.reduce can be used for more than transforming an array of numbers. It's all about that initialValue that you pass to reduce. **If you want the end result to be an object (therefore converting an array into an object), have the initialValue be an object and add properties to that object as you go**.

Here's an example of how you would do that below. You have an array of foods and you want to transform that to an object whose keys are the food itself and whose values are how many votes that food received.

```javascript
var votes = ['tacos', 'pizza', 'pizza', 'tacos', 'fries', 'ice cream', 'ice cream', 'pizza'];
var initialValue = {};
var reducer = function(tally, vote) {
  if (!tally[vote]) {
    tally[vote] = 1;
  } else {
    tally[vote] = tally[vote] + 1;
  }
  return tally;
};
var result = votes.reduce(reducer, initialValue); // {tacos: 2, pizza: 3, fries: 1, ice cream: 2}
```

In our api.js, getStarCount will sum up each repo's star:

```javascriptx
function getStarCount(repos) {
  return repos.data.reduce(function(count, repo) {
    return count + repo.stargazers_count;
  }, 0);
}
```

## map is 阉割版的 reduce

```javascript
// map
const keys = arr.map((p) => p.key);

//reduce
const keys = arr.reduce((accu, current) => {
  return [...accu, current.key];
}, []);
```

现在 arr 里面有个 categoryId，在他 =1 的时候我不想获取值，希望进行下次循环

```javascript
const keys = products[0].analysis.reduce((accu, current) => {
  if (current.categoryId === 1) return accu;
  else {
    return [...accu, current.key];
  }
}, []);

const values = product.analysis.reduce((accu, current, index) => {
  if (current.categoryId === 1) return accu;

  return [
    ...accu,
    {
      analysisId: current.analysisId,
      yaosu: current.key,
      y: current.value,
      productId: product.id,
      productName: product.name,
    },
  ];
}, []);
```
