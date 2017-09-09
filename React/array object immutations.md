# Array with simple types like integer, string

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
  return [
    ...arr.slice(0, index),
    ...arr.slice(index + 1)
  ];
};


/* modify an element by index */
const incrementCounter = (arr, index) => {
  // Old way:
  // return arr
  //  .slice(0, index)
  //  .concat([arr[index] + 1])
  //  .concat(arr.slice(index + 1));

  // ES6 way:
  return [
    ...arr.slice(0, index),
    arr[index] + 1,
    ...arr.slice(index + 1)
  ];
};
```

## Object change

```javascript
const toggleTodo = (todo) => {
  // return Object.assign({}, todo, {
  //   completed: !todo.completed
  // });
  
  return {
    ...todo,
      completed: !todo.completed
  };
};
```

## Array of objects

This mixes creating/updating individual item and array together...

```javascript
const reducer = (state = [], action) => {
  // action : { type: '', payload: obj}
  const obj = action.payload;

  switch (action.type) {
    case 'add':
      return [...state, obj];
    case 'edit':
      return state.map(item => {
        if (item.id === obj.id) {
          return { ...item, ...obj };
        } else {
          return item;
        }
      });
    case 'delete':
      return state.filter(item => item.id !== obj.id);
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
      return state.map(item => individualReducer(item, action));
    case 'delete':
      return state.filter(item => item.id !== obj.id);
    default:
      return state;
  }
};
```