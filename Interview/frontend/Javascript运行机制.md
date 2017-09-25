# 单线程

一个时间只能做一件事

## 任务队列

异步队列，运行栈里面放的是同步任务队列。

## 理解 event loop

js 运行分为同步任务和异步任务，同步任务先执行，都执行完了才会执行异步任务。以下前2个例子就是先执行同步任务 `console, while` ，之后才执行 `setTimeout` 。

js 引擎把所有同步任务放到**运行栈**中，异步任务不会放在运行栈中，而是放到 `event table`。浏览器 timer模块 拿走 setTimeout，到了时间后（下面例子1s时）从 `event table` 把任务放到 `异步队列 event queue` 中（注意：不是遇到 setTimeout 就把异步任务放到异步队列中，即使 setTimeout 时间设置0，浏览器一般默认给 4ms。setTimeout 的时间就是 `event table` 把任务放到 `event loop` 的时间）。单线程的 js 执行完所有运行栈中的同步任务后，异步队列中的任务被放到了运行栈中并执行。运行栈不断监听异步队列是否有任务需要执行，有的话就拿过来执行，这个循环过程就是**事件循环** Event loop.

So when exactly can functions in the event queue move over to the call stack?

Well, the JavaScript engine follows a very simple rule: there’s a process that constantly checks whether the call stack is empty, and **whenever it’s empty, it checks if the event queue has any functions waiting to be invoked**. If it does, then the first function in the queue gets invoked and moved over into the call stack. If the event queue is empty, then this monitoring process just keeps on running indefinitely. And voila — what I just described is the infamous Event Loop!

## 哪些语句被会在异步队列

开启异步任务：

1. `setTimeout, setInterval`
1. DOM 事件，`addEventListener('click', function(){}, false)`
1. Promise

## 理解放入到异步队列的时机

异步任务放入到异步队列的时机是 setTimeout 传入的时间，不是立马放入。即使时间传入0，默认 4ms。

## 例子

```javascript
console.log(1);
setTimeout(function () {
    console.log(2);
}, 0);
console.log(3);
console.log(4);
// 结果为 1 3 4 2

console.log('A');
setTimeout(function () {
    console.log('B');
}, 0);
while (1) {

}
// 结果为：A
// B 永远不会输出。运行栈 while 没执行完毕，不会去查看异步队列。

for (var i = 0; i < 4; i++) {
    setTimeout(function () {
        console.log(i);
    }, 1000);
}
// 结果为 4 4 4 4
```

for 循环是同步任务，在运行栈执行4次。第一次执行时，发现调用 setTimeout，浏览器 js 引擎并没立马把它放到异步队列。当 for 同步任务全部执行完毕（1ms以内）后，过了一秒异步队列中有了 4个 setTimeout 里面的函数体。运行栈检测到异步队列中的4个函数体，一个个取到运行栈中依次执行，此时的 i = 4，所以最终结果4 4 4 4。（几乎是同时出现结果，而不是 1s 出现一个）

想要结果为 0 1 2 3 的办法：

1. let 形成块级作用域
1. for 循环里面每个 li[i].index = i;
1. 使用闭包

```javascript
for (var i = 0; i < 4; i++) {
  (function(i) {
    setTimeout(function() {
      console.log(i);
    }, 1000);
  })(i);
}
```