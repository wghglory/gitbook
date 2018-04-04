# requestAnimationFrame 为何性能好？为何不用 setTimeout

**国庆北京高速，最多每 16.7s 通过一辆车，结果，突然插入一批 `setTimeout` 的军车，强行要 10s 通过。显然，这是超负荷的**，要想顺利进行，只能让第三辆车直接消失（正如显示绘制第三帧的丢失）。然，这是不现实的，于是就有了会堵车！

同样的，显示器 16.7ms 刷新间隔之前发生了其他绘制请求(`setTimeout`)，导致所有第三帧丢失，继而导致**动画断续显示**（堵车的感觉），这就是过度绘制带来的问题。不仅如此，这种计时器频率的降低也会对电池使用寿命造成负面影响，并会降低其他应用的性能。

**这也是为何 `setTimeout` 的定时器值推荐最小使用 16.7ms 的原因（16.7 = 1000 / 60, 即每秒 60 帧）。**

而 `requestAnimationFrame` 就是为了这个而出现的。我所做的事情很简单，**跟着浏览器的绘制走，如果浏览设备绘制间隔是 16.7ms，那我就这个间隔绘制；如果浏览设备绘制间隔是 10ms, 我就 10ms 绘制。这样就不会存在过度绘制的问题，动画不会掉帧。**

## 内部原理

浏览器每次要重绘，就会通知 `requestAnimationFrame`，在同样的时间间隔里进行动画。

1.  如果有多个 `requestAnimationFrame` 动画，浏览器只要通知一次就可以了。而 `setTimeout` 貌似是多个独立绘制
1.  页面最小化了，或者被 Tab 切换关灯了。页面是不会重绘的，自然，`requestAnimationFrame` 动画不会执行。页面绘制全部停止，资源高效利用。

## requestAnimationFrame 优于 setTimeout/setInterval 的地方

在于它是由浏览器专门为动画提供的 API，在运行时浏览器会自动优化方法的调用，并且如果页面不是激活状态下的话，动画会自动暂停，有效节省了 CPU 开销。

1.  requestAnimationFrame 会把每一帧中的所有 DOM 操作集中起来，在一次重绘或回流中就完成，并且重绘或回流的时间间隔紧紧跟随浏览器的刷新频率，一般来说，这个频率为每秒 60 帧。
1.  在隐藏或不可见的元素中，requestAnimationFrame 将不会进行重绘或回流，这当然就意味着更少的的 cpu，gpu 和内存使用量。

```javascript
(function() {
  var lastTime = 0;
  var vendors = ['webkit', 'moz'];
  for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
    window.cancelAnimationFrame =
      window[vendors[x] + 'CancelAnimationFrame'] ||
      window[vendors[x] + 'CancelRequestAnimationFrame']; // name has changed in Webkit
  }

  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = function(callback, element) {
      var currentTime = new Date().getTime();
      var timeToCall = Math.max(0, 16.7 - (currentTime - lastTime));
      var id = window.setTimeout(function() {
        callback(currentTime + timeToCall);
      }, timeToCall);
      lastTime = currentTime + timeToCall;
      return id;
    };
  }
  if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = function(id) {
      clearTimeout(id);
    };
  }
})();
```
