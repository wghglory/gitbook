# throttle debounce 两种优化技巧

resize 当节点尺寸发生变化时，触发这个事件。通常用在 window 上，这样可以监听浏览器窗口的变化。通常用在复杂布局和响应式上。出于对性能的考虑，你可以使用函数 throttle 或者 debounce 技巧来进行优化。

**throttle**: 某一段时间内无论多次调用，只执行一次函数，到达时间就执行。预先设定一个执行周期，当调用动作的时刻大于等于执行周期则执行该动作，然后进入下一个新周期。好比一台自动的饮料机，按拿铁按钮，在出饮料的过程中，不管按多少这个按钮，都不会连续出饮料，中间按钮的响应会被忽略，必须要等这一杯的容量全部出完之后，再按拿铁按钮才会出下一杯。

**debounce**: 某一段时间内等待是否还会重复调用，如果不会再调用，就执行函数；如果还有重复调用，则不执行继续等待。如果用手指一直按住一个弹簧，它将不会弹起直到你松手为止。也就是说当调用动作 n 毫秒后，才会执行该动作，若在这 n 毫秒内又调用此动作则将重新计算执行时间。一部电梯停在某一个楼层，当有一个人进来后，20 秒后自动关门，这 20 秒的等待期间，又一个人按了电梯进来，这 20 秒又重新计算，直到电梯关门那一刻才算是响应了事件。

## 总结

当有持续性动作的时候，Throttle 降低频率持续性触发，而 Debounce 和 Immediate 只会触发一次，且 Debounce 在动作之后触发，Immediate 在动作之前触发。

```javascript
/* 每次清除之前的定时器，开启新的定时任务，如果规定时间 delta 内再次运行，继续清计时器。直到时间超过规定时间，执行任务 */
function debounce(fn, delta, context) {
  var timeoutID = null;

  return function() {
    clearTimeout(timeoutID);

    var args = arguments;
    timeoutID = setTimeout(function() {
      fn.apply(context, args);
    }, delta);
  };
}

function immediate(fn, delta, context) {
  var timeoutID = null;
  var safe = true;

  return function() {
    var args = arguments;

    if (safe) {
      fn.call(context, args);
      safe = false;
    }

    clearTimeout(timeoutID);
    timeoutID = setTimeout(function() {
      safe = true;
    }, delta);
  };
}

/* 首次执行，且立马标记 safe = false。开启定时器，规定时间到了后标记重置，所以规定时间内又想执行无效 */
function throttle(fn, delta, context) {
  var safe = true;

  return function() {
    var args = arguments;

    if (safe) {
      fn.call(context, args);

      safe = false;
      setTimeout(function() {
        safe = true;
      }, delta);
    }
  };
}

// alternate implementation
function throttleRender(fn, delta, context) {
  return function() {
    var args = arguments;
    var then = 0;

    function repeat(now) {
      requestAnimationFrame(repeat);
      if (now - then >= delta) {
        then = now;
        fn.call(context, args);
      }
    }

    requestAnimationFrame(repeat);
  };
}

/**
 * 具体使用：
 */
document.addEventListener('mousemove', throttle(() => console.log('throttle'), 1000));

document.addEventListener('mousemove', debounce(() => console.log('debounce'), 1000));

document.addEventListener('mousemove', immediate(() => console.log('immediate'), 1000));
```

<https://zhirzh.github.io/2016/10/20/timing-controls-3> <https://css-tricks.com/debouncing-throttling-explained-examples/>
