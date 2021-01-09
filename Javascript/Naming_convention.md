# Naming convention

```javascript
var __proto__; // private
var _time; // private

var obj = {
  __proto__: {},
};

function myFun() {
  let local;
  const LOCAL = 2;

  var obj = {
    ATTR: {},
  };
}

myFun.EVENT_TYPE = 1;

var obj = {
  DIR: { TOP: 1, BOTTOM: 2, LEFT: 3, RIGHT: 4 },
};
```

```html
<div data-vue-name="vue hello"></div>
```
