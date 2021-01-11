# Promise

[Promise visualization](http://bevacqua.github.io/promisees/#)

```javascript
function example() {
  // do some work
  if (successful) {
    return result;
  } else {
    throw new Error('failed');
  }
}
```

Promise constructor:

```javascript
new Promise(function(resolve, reject) {
  // do some work
  if (successful) {
    resolve(result);
  } else {
    reject(throw new Error('failed'));
  }
});
```

If your promise only has resolved, below is the same:

```javascript
new Promise(function(resolve, reject) {
  resolve(someValue);
});

Promise.resolve(someValue);
```

```javascript
new Promise((resolve) => {
  console.log('aaaa');
  resolve();
})
  .then((val) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('bbbb');
        resolve(100);
      }, 1000);
    });
  })
  .then((val) => {
    console.log('cccc', val);
  })
  .catch((e) => {});

// aaaa
// 一秒后
// bbbb
// cccc 100
```

## A real demo

```javascript
// sync
navigator.geolocation.getCurrentPosition(
  function(position) {
    console.log(position.coords.latitude);
  },
  function(err) {
    console.error(err.message);
  },
);

// promise creator
function getCurrentPositionWithPromise() {
  return new Promise(function(resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);

    // navigator.geolocation.getCurrentPosition(function(position){
    //   resolve(position);
    // }, function(err){
    //   reject(err.message);
    // })
  });
}

// use promise creator
getCurrentPositionWithPromise
  .then((res) => {
    console.log(res.coords.latitude);
    return res;
  })
  .catch((err) => console.log(err.message));

async function main() {
  try {
    let p = await getCurrentPositionWithPromise();
    console.info(p.coords.latitude);
  } catch (e) {
    console.error(e.message);
  }
}

main();
```

## Promise 回调在 react 中的应用

> 参见 React/SetStateAsync.md

在 react component 中经常需要执行一个函数去 setHigherLevelComponentState，而等到高层 component 状态更新完毕后去进行当前 component 的一些操作

**高层 component：** 通过 props 把该方法传给孩子

```javascript
function setOutlines(obj, actionType) {
  let outlines = [];

  switch (actionType) {
    case 'add':
      outlines = [...this.state.outlines, obj];
      break;
    case 'edit':
      outlines = this.state.outlines.map((i) => {
        if (i.id == obj.id) {
          return { ...i, ...obj };
        } else {
          return i;
        }
      });
      break;
    case 'delete':
      outlines = this.state.outlines.filter((item) => item.id != obj.id);
      break;
    default:
      break;
  }

  return new Promise((resolve, reject) => {
    this.setState({ outlines }, () => {
      resolve();
    });
  });
}
```

**低层 component：** 在提交表单更新了 outlines 数据后，会 re-render，此时滚动滚动条到最低端看到刚添加的数据

```javascript
function submitAddForm() {
  this.props
    .setOutlines(
      {
        id: uid(),
        detail: this.addText.value,
      },
      'add',
    )
    .then(() => {
      console.log(this.mainBox.scrollTop, this.listBox.scrollHeight);
      this.mainBox.scrollTop = this.listBox.scrollHeight || 0;
    });

  this.closeModal();
}
```

### Promise 链

```javascript
function foo(result) {
  console.log(result);
  return result + result;
}

let promise = new Promise((resolve, reject) => {
  try {
    setTimeout(() => {
      resolve('hello');
    }, 250);
  } catch (e) {
    reject(new Error('exception!'));
  }
});

//手动链接
promise
  .then(foo)
  .then(foo)
  .then(foo);
//控制台输出： hello
//			   hellohello
//			   hellohellohellohello

//动态链接
var funcs = [foo, foo, foo];
funcs.forEach(function(func) {
  promise = promise.then(func);
});

//精简后的动态链接
var funcs = [foo, foo, foo];
funcs.reduce(function(prev, current) {
  return prev.then(current);
}, promise);

// ----------------------- Promise 创建函数 --------------------------

let createPromise = (para) =>
  new Promise((resolve, reject) => {
    setTimeout(function() {
      resolve(para);
    }, 250);
  });

//手动链接
createPromise('hello')
  .then(foo)
  .then(foo)
  .then(foo);
//控制台输出： hello
//			   hellohello
//			   hellohellohellohello

//动态链接
var funcs = [foo, foo, foo];
var temp = createPromise('hello');
funcs.forEach(function(func) {
  temp = temp.then(func);
});

// 精简后的动态链接
var funcs = [foo, foo, foo];
funcs.reduce(function(prev, current) {
  return prev.then(current);
}, createPromise('hello'));
```

### Promise.all

```javascript
Promise.all([3, promise, foo])
  .then((res) => console.log(res))
  .catch((reject) => {
    console.log('err');
  });
// [ 3, 'hello', [Function: foo] ]
```

### Promise.race

```javascript
Promise.race([3, promise, foo])
  .then((res) => console.log(res))
  .catch((reject) => {
    console.log('err');
  });
// 3
```

### demo

```javascript
function msgAfterTimeout(msg, who, timeout) {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(`${msg} Hello ${who}!`), timeout);
  });
}
msgAfterTimeout('', 'Foo', 100)
  .then((msg) => msgAfterTimeout(msg, 'Bar', 200))
  .then((msg) => {
    console.log(`done after 300ms:${msg}`);
  });

// done after 300ms: Hello Foo! Hello Bar!

// ---Promise.all---

function fetchAsync(url, timeout, onData, onError) {
  // ...
}

let fetchPromised = (url, timeout) => {
  return new Promise((resolve, reject) => {
    fetchAsync(url, timeout, resolve, reject);
  });
};
Promise.all([
  fetchPromised('http://backend/foo.txt', 500),
  fetchPromised('http://backend/bar.txt', 500),
  fetchPromised('http://backend/baz.txt', 500),
]).then(
  (data) => {
    let [foo, bar, baz] = data;
    console.log(`success: foo=${foo} bar=${bar} baz=${baz}`);
  },
  (err) => {
    console.log(`error: ${err}`);
  },
);
```

## reference

手写一个 promise：<https://github.com/panyifei/Front-end-learning/blob/master/框架以及规范/Promise.md>
