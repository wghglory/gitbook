## 单线程

一个时间只能做一件事

## 任务队列

异步队列，运行栈里面放的是同步任务队列。

## 理解 event loop

js运行分为同步任务和异步任务，同步任务先执行，都执行完了才会执行异步任务。以下前2个例子就是先执行同步任务 `console, while` ，之后才执行 `setTimeout` 。

js 引擎把所有同步任务放到**运行栈**中，异步任务不会放在运行栈中。浏览器timer模块拿走 setTimeout，到了时间后（下面例子1s时）才会把任务放到异步队列中（不是遇到 setTimeout就把异步任务放到异步队列中）。单线程的js 执行完所有运行栈中的同步任务后，异步队列中 setTimeout 函数体被放到了运行栈中并执行。运行栈不断监听异步队列是否有任务需要执行，有的话就拿过来执行，这个循环过程就是**事件循环** Event loop.

## 哪些语句被会在异步队列

开启异步任务：

1. `setTimeout, setInterval`
1. DOM 事件，`addEventListener('click',function(){},false)`
1. Promise

## 理解放入到异步队列的时机

是 setTimeout 传入的时间，不是立马放入。

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

for (var i = 0; i < 4; i++) {
    setTimeout(function () {
        console.log(i);
    }, 1000);
}
// 结果为 4 4 4 4
```

for循环是同步任务，在运行栈执行4次。第一次执行时，发现调用 setTimeout，浏览器js引擎并没立马把它放到异步队列。当for同步任务全部执行完毕（1ms以内）后，过了一秒异步队列中有了 setTimeout 里面的函数体。运行栈检测到异步队列中的4个函数体，一个个取到运行栈中依次执行，此时的 i = 4，所以最终结果4 4 4 4