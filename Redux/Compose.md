# Compose

redux compose 是从右向左。跟自己用 reduce 写的相反。

Redux also comes with a `compose` function that you can use to compose several functions into a single function. It also composes functions from right to left as opposed to from left to right.

If we just wanted to get a comma-delimited list of color titles, we could use this one crazy line of code:

```javascript
console.log(
  store
    .getState()
    .colors.map((c) => c.title)
    .join(', '),
);
```

A more functional approach would be to break this down into smaller functions and compose them into a single function:

```javascript
import { compose } from 'redux';

// right to left
const print = compose(
  (list) => console.log(list),
  (titles) => titles.join(', '),
  (map) => map((c) => c.title),
  (colors) => colors.map.bind(colors),
  (state) => state.colors,
);

print(store.getState());
```

The `compose` function takes in functions as arguments and invokes the rightmost first. First it obtains the colors from state, then it returns a bound `map` function, followed by an array of color titles, which are joined as a comma-delimited list and finally logged to the console.
