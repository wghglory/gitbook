# javascript 异步编程

## 回调函数

```javascript
var result = function() {
  setTimeout(() => {
    return 5;
  }, 1000);
};
console.log(result());  // undefined
```

用回调函数处理怎么弄呢？让 result 的参数为一个回调函数就可以了，于是代码变成下面这样

```javascript
var result = function(callback) {
  setTimeout(() => {
    callback(5);
  }, 1000);
};
result(console.log);
```

现在我们用一个真实的io调用替代抢红包，新建一个numbers.txt，在里面写若干个红包金额,代码如下：

```javascript
const fs = require('fs');

const readFileAsArray = function(file, cb) {
  fs.readFile(file, (err, data) => {
    if (err) return cb(err);
    const lines = data.toString().trim().split('\n');
    cb(null, lines);
  });
};

readFileAsArray('./numbers.txt', (err, lines) => {
  if (err) throw err;
  const numbers = lines.map(Number);
  console.log(`分别抢到了${numbers}块红包`);
});
```

定义了一个readFileAsArray函数，传两个参：文件名和回调函数，然后调用这个函数，把回调函数写入第二个参数里，就可以控制代码执行顺序了。不过，回调的缺点就是写多了，层层嵌套，又会造成回调地狱的坑爹情况，代码变得难以维护和阅读。

## Promise

Promise实现了控制反转。原来这个顺序的控制是在代码那边而不是程序员控制，现在有了Promise，控制权就由人来掌握了，通过一系列 Promise 的方法如 then/catch/all/race 等控制异步流程。[Promise文档](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise)

```javascript
const fs = require('fs');

const readFileAsArray = function(file) {
  return new Promise((resolve, reject) => {
    fs.readFile(file, (err, data) => {
      if (err) {
        reject(err);
      }
      const lines = data.toString().split('\n');
      resolve(lines);
    });
  });
};

readFileAsArray('./numbers.txt')
  .then((lines) => {
    const numbers = lines.map(Number);
    console.log(`分别抢到了${numbers}块红包`);
  })
  .catch((error) => console.error(error));
```

在这里已经把控制权交给了程序员，代码也变得更好理解。虽然 Promise 有 **单值/不可取消** 等缺点，不过在现在大部分的情况下实现异步还是够用的。

## await/async

有没有简化的办法呢？ES7推出了一个语法糖：await/async，它的内部封装了 Promise 和 Generator 的组合使用方式

```javascript
const fs = require('fs');

const readFileAsArray = function(file) {
  return new Promise((resolve, reject) => {
    fs.readFile(file, (err, data) => {
      if (err) {
        reject(err);
      }
      const lines = data.toString().split('\n');
      resolve(lines);
    });
  });
};

async function result() {
  try {
    const lines = await readFileAsArray('./numbers.txt');
    const numbers = lines.map(Number);
    console.log(`分别抢到了${numbers}块红包`);
  } catch (err) {
    console.log('await出错！');
    console.log(err);
  }
}

result();
```

这样做的结果是不是让代码可读性更高了！而且也屏蔽了 Promise 和 Generator 的细节。

## event

另一个实现异步的方式是event，回调(promise、await/async)和 event 的关系就像计划经济和市场经济一样，一个是人为的强制性的控制，一个是根据需求和供给这只看不见的手控制。

```javascript
const EventEmitter = require('events');
const fs = require('fs');

class MyEventEmitter extends EventEmitter {
  executeAsync(asyncFunc, args) {
    this.emit('开始');
    console.time('执行耗时');
    asyncFunc(args, (err, data) => {
      if (err) return this.emit('error', err);
      this.emit('data', data);
      console.timeEnd('执行耗时');
      this.emit('结束');
    });
  }
}

const myEventEmitter = new MyEventEmitter();

myEventEmitter.on('开始', () => {
  console.log('开始执行了');
});
myEventEmitter.on('data', (data) => {
  console.log(`分别抢到了${data}块红包`);
});
myEventEmitter.on('结束', () => {
  console.log('结束执行了');
});
myEventEmitter.on('error', (err) => {
  console.error(err);
});

myEventEmitter.executeAsync(fs.readFile, './numbers.txt');
```

这种事件驱动非常灵活，也不刻意去控制代码的顺序，一旦有事件的供给(emit)，它就会立刻消费事件(on)，不过正是因为这样，它的缺点也很明显：让程序的执行流程很不清晰。

### event + promise + await/async

结合 event 和 promise 的写法:

```javascript
const EventEmitter = require('events');
const fs = require('fs');

class MyEventEmitter extends EventEmitter {
  async executeAsync(asyncFunc, args) {
    this.emit('开始');
    try {
      console.time('执行耗时');
      const data = await asyncFunc(args);
      this.emit('data', data);
      console.timeEnd('执行耗时');
      this.emit('结束');
    } catch (err) {
      console.log('出错了!');
      this.emit('error', err);
    }
  }
}

const readFileAsArray = function(file) {
  return new Promise((resolve, reject) => {
    fs.readFile(file, (err, data) => {
      if (err) {
        reject(err);
      }
      const lines = data.toString().split('\r\n');
      resolve(lines);
    });
  });
};

const myEventEmitter = new MyEventEmitter();

myEventEmitter.on('开始', () => {
  console.log('开始执行了');
});
myEventEmitter.on('data', (data) => {
  console.log(`分别抢到了${data}块红包`);
});
myEventEmitter.on('结束', () => {
  console.log('结束执行了');
});
myEventEmitter.on('error', (err) => {
  console.error(err);
});

myEventEmitter.executeAsync(readFileAsArray, './numbers.txt');
```

这种结合的方式基本上可以应付现今的异步场景了，缺点嘛。。。就是代码量比较多

### rxjs

简单介绍下 rxjs 和异步的关系：它可以把数据转化成一股流，无论这个数据是同步得到的还是异步得到的，是单值还是多值。

* `Rx.Observable.of` 来包装单值同步数据
* `Rx.Observable.fromPromise` 来包装单值异步数据
* `Rx.Observable.fromEvent` 来包装多值异步数据

```javascript
const fs = require('fs');
const Rx = require('rxjs');
const EventEmitter = require('events');

class MyEventEmitter extends EventEmitter {
  async executeAsync(asyncFunc, args) {
    this.emit('开始');
    try {
      console.time('执行耗时');
      const data = await asyncFunc(args);
      this.emit('data', data);
      console.timeEnd('执行耗时');
      this.emit('结束');
    } catch (err) {
      console.log('出错了!');
      this.emit('error', err);
    }
  }
}

const readFileAsArray = function(file) {
  return new Promise((resolve, reject) => {
    fs.readFile(file, (err, data) => {
      if (err) {
        reject(err);
      }
      const lines = data.toString().split('\r\n');
      resolve(lines);
    });
  });
};
const myEventEmitter = new MyEventEmitter();

myEventEmitter.executeAsync(readFileAsArray, './numbers.txt');

let dataObservable = Rx.Observable.fromEvent(myEventEmitter, 'data');

let subscription = dataObservable.subscribe(
  (data) => {
    console.log(`分别抢到了${data}块红包`);
  },
  (err) => {
    console.error(err);
  },
  (complete) => {
    console.info('complete!');
  }
);
```

rxjs还有很多重要的概念，比如生产者 Observe 和消费者 Observable、推拉模型、各种方便的操作符和函数式编程等等

> Object.observe() This feature is obsolete