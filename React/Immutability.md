# Immutability

## Why immutability

1. 方便我们追踪对象改变的属性
1. react 每个状态都不可变，reducer 作为一个纯函数，根据之前的 state 和 action 计算出一下个 state。纯函数不能由负效应，不可改变的 state 使得 reducer 能够输出唯一可以预测的值

> immutability 要求复制对象，复制对象难道不影响性能吗？
>
> 首先属性不多，其次并没有过分深层嵌套。比起来检查每个属性是否改变更高效，而且很容易知道改变前和改变后以及改变的因素，能够方便 debug 和追踪状态改变。最后通过 `!==` 检测 `prevStore` 和当前 `store` 是否相等，即是否来自同一个地址，无需检测每一个属性。检测时配合 `shouldComponentUpdate`

---

In a functional program, data is immutable. It never changes. Instead of changing the original data structures, we build changed copies of those data structures and use them instead.

Consider an object that represents the color `lawn`:

```javascript
let color_lawn = {
    title: "lawn",
    color: "#00FF00",
    rating: 0
}
```

We could build a function that would rate colors, and use that function to change the rating of the `color` object:

```javascript
function rateColor(color, rating) {
  color.rating = rating
  return color
}

console.log(rateColor(color_lawn, 5).rating)     // 5
console.log(color_lawn.rating)                   // 5
```

In JavaScript, function arguments are references to the actual data. Setting the color’s rating like this is bad because it changes or mutates the original color object. We can rewrite the `rateColor` function so that it does not harm the original goods (the `color` object): ==Object.assign({}, color, {rating:rating})==

```javascript
var rateColor = function(color, rating) {
   return Object.assign({}, color, {rating:rating})
}

console.log(rateColor(color_lawn, 5).rating)      // 5
console.log(color_lawn.rating)                    // 4
```

**Here, we used `Object.assign` to change the color rating. `Object.assign` is the copy machine; it takes a blank object, copies the color to that object, and overwrites the rating on the copy. Now we can have a newly rated color object without having to change the original.**

We can write the same function using an ES6 arrow function along with the **ES7 object spread operator**. This `rateColor` function uses the spread operator to copy the color into a new object and then overwrite its rating:

```javascript
const rateColor = (color, rating) =>
    ({
        ...color,
        rating
    })

```

This emerging JavaScript version of the `rateColor` function is exactly the same as the previous one. It treats color as an immutable object, does so with less syntax, and looks a little bit cleaner. Notice that we wrap the returned object in parentheses. With arrow functions, this is a required step since the arrow can’t just point to an object’s curly braces.

---

Let’s consider an array of color names:

```javascript
let list = [
    { title: "Rad Red"},
    { title: "Lawn"},
    { title: "Party Pink"}
]
```

We could create a function that will add colors to that array using `Array.push`:

```javascript
var addColor = function(title, colors) {
  colors.push({ title: title })
  return colors;
}

console.log(addColor("Glam Green", list).length)        // 4
console.log(list.length)                                // 4
```

However, `Array.push` is not an immutable function. This `addColor` function changes the original array by adding another field to it. In order to keep the `colors` array immutable, we must use `Array.concat` instead:

```javascript
const addColor = (title, array) => array.concat({title})

console.log(addColor("Glam Green", list).length)        // 4
console.log(list.length)                                // 3
```

`Array.concat` concatenates arrays. In this case, it takes a new object, with a new color title, and adds it to a copy of the original array.

You can also use the ES6 spread operator to concatenate arrays in the same way it can be used to copy objects. Here is the emerging JavaScript equivalent of the previous `addColor` function:

```javascript
const addColor = (title, list) => [...list, {title}]
```

This function copies the original list to a new array and then adds a new object containing the color’s title to that copy. It is immutable.
