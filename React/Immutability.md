# Immutability 对象不可变性

**Most valuable reference**: <https://redux.js.org/recipes/structuringreducers/immutableupdatepatterns>

通过复制一个新的对象，使得新对象和老对象不引用同一个地址。这样在一个 reducer 函数中不去直接修改老对象的属性，而是创建一个新对象并根据 action 修改其属性并返回。

```javascript
var player = {
  score: 1,
  name: 'Jeff',
};

var newPlayer = Object.assign({}, player, { score: 2 });
// Now player is unchanged, but newPlayer is {score: 2, name: 'Jeff'}

// Or if you are using object spread syntax proposal, you can write:
var newPlayer = {
  ...player,
  score: 2,
};
```

## Why Immutability

1.  因为我们知道修改之前和修改之后的状态，方便我们追踪对象改变的属性
1.  Because `shouldComponentUpdate` or `PureComponent` does a shallow comparison of old and new values, 即只需要 === 比较引用地址是否相同。如果不遵循 不可变性，在原对象修改属性，=== 永远相同，Then UI won't change.
1.  reducer 作为一个纯函数，根据之前的 state 和 action 计算出一下个 state。纯函数不能有负效应，对象的不可改变性使得 reducer 能够输出唯一可以预测的值

> immutability 要求复制对象，复制对象难道不影响性能吗？
>
> 首先属性不多，其次并没有过分深层嵌套。比起检查每个属性是否改变更高效，而且很容易知道改变前和改变后以及改变的因素，能够方便 debug 和追踪状态改变。最后通过 `!==` 检测 `prevStore` 和当前 `store` 是否相等，即是否来自同一个地址，无需检测每一个属性。检测时配合 `shouldComponentUpdate`

## Immutability Use Case

### Array with simple types like number, string

```javascript
/* push a new element */
const addCounter = (arr) => {
  // return arr.concat([0]); // old way
  return [...arr, 0]; // ES6 way
};

/* remove an element by index */
const removeCounter = (arr, index) => {
  // Old way:
  //return arr
  //  .slice(0, index)
  //  .concat(arr.slice(index + 1));

  // ES6 way:
  return [...arr.slice(0, index), ...arr.slice(index + 1)];
};

/* modify an element by index */
const incrementCounter = (arr, index) => {
  // Old way:
  // return arr
  //  .slice(0, index)
  //  .concat([arr[index] + 1])
  //  .concat(arr.slice(index + 1));

  // ES6 way:
  return [...arr.slice(0, index), arr[index] + 1, ...arr.slice(index + 1)];
};
```

### Object Change

```javascript
const toggleTodo = (todo) => {
  // return Object.assign({}, todo, {
  //   completed: !todo.completed
  // });

  return {
    ...todo,
    completed: !todo.completed,
  };
};
```

### Array of Objects

This mixes creating/updating individual item and array together...

```javascript
const reducer = (state = [], action) => {
  // action : { type: '', payload: obj}
  const obj = action.payload;

  switch (action.type) {
    case 'add':
      return [...state, obj];
    case 'edit':
      return state.map((item) => {
        if (item.id === obj.id) {
          return { ...item, ...obj }; //  用新对象 obj 覆盖掉老 object
        } else {
          return item;
        }
      });
    case 'delete':
      return state.filter((item) => item.id !== obj.id);
    default:
      return state;
  }
};
```

**reducer composition. Separate individual and array**:

```javascript
const individualReducer = (state, action) => {
  // action : { type: '', payload: obj}
  const obj = action.payload;

  switch (action.type) {
    case 'add':
      return obj;
    case 'edit':
      if (state.id === obj.id) return { ...state, ...obj };
      else return state;
    default:
      return state;
  }
};

const arrayReducer = (state = [], action) => {
  // action : { type: '', payload: obj}
  const obj = action.payload;

  switch (action.type) {
    case 'add':
      return [...state, individualReducer(undefined, action)];
    case 'edit':
      return state.map((item) => individualReducer(item, action));
    case 'delete':
      return state.filter((item) => item.id !== obj.id);
    default:
      return state;
  }
};
```

---

In a functional program, data is immutable. It never changes. Instead of changing the original data structures, we build changed copies of those data structures and use them instead.

Consider an object that represents the color `lawn`:

```javascript
let color_lawn = {
  title: 'lawn',
  color: '#00FF00',
  rating: 0,
};
```

We could build a function that would rate colors, and use that function to change the rating of the `color` object:

```javascript
function rateColor(color, rating) {
  color.rating = rating;
  return color;
}

console.log(rateColor(color_lawn, 5).rating); // 5
console.log(color_lawn.rating); // 5
```

In JavaScript, function arguments are references to the actual data. Setting the color's rating like this is bad because it changes or mutates the original color object. We can rewrite the `rateColor` function so that it does not harm the original goods (the `color` object): ==`Object.assign({}, color, {rating:rating})`==

```javascript
var rateColor = function(color, rating) {
  return Object.assign({}, color, { rating: rating });
};

console.log(rateColor(color_lawn, 5).rating); // 5
console.log(color_lawn.rating); // 4
```

**Here, we used `Object.assign` to change the color rating. `Object.assign` is the copy machine; it takes a blank object, copies the color to that object, and overwrites the rating on the copy. Now we can have a newly rated color object without having to change the original.**

We can write the same function using an ES6 arrow function along with the **ES7 object spread operator**. This `rateColor` function uses the spread operator to copy the color into a new object and then overwrite its rating:

```javascript
const rateColor = (color, rating) => ({
  ...color,
  rating,
});
```

This emerging JavaScript version of the `rateColor` function is exactly the same as the previous one. It treats color as an immutable object, does so with less syntax, and looks a little bit cleaner. Notice that we wrap the returned object in parentheses. With arrow functions, this is a required step since the arrow can't just point to an object's curly braces.

---

Let's consider an array of color names:

```javascript
let list = [{ title: 'Rad Red' }, { title: 'Lawn' }, { title: 'Party Pink' }];
```

We could create a function that will add colors to that array using `Array.push`:

```javascript
var addColor = function(title, colors) {
  colors.push({ title: title });
  return colors;
};

console.log(addColor('Glam Green', list).length); // 4
console.log(list.length); // 4
```

However, `Array.push` is not an immutable function. This `addColor` function changes the original array by adding another field to it. In order to keep the `colors` array immutable, we must use `Array.concat` instead:

```javascript
const addColor = (title, array) => array.concat({ title });

console.log(addColor('Glam Green', list).length); // 4
console.log(list.length); // 3
```

`Array.concat` concatenates arrays. In this case, it takes a new object, with a new color title, and adds it to a copy of the original array.

You can also use the ES6 spread operator to concatenate arrays in the same way it can be used to copy objects. Here is the emerging JavaScript equivalent of the previous `addColor` function:

```javascript
const addColor = (title, list) => [...list, { title }];
```

This function copies the original list to a new array and then adds a new object containing the color's title to that copy. It is immutable.
