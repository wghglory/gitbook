# throttle debounce 两种优化技巧

resize 当节点尺寸发生变化时，触发这个事件。通常用在 window 上，这样可以监听浏览器窗口的变化。通常用在复杂布局和响应式上。出于对性能的考虑，你可以使用函数 throttle 或者 debounce 技巧来进行优化。

throttle 方法大体思路就是在某一段时间内无论多次调用，只执行一次函数，到达时间就执行；

debounce 方法大体思路就是在某一段时间内等待是否还会重复调用，如果不会再调用，就执行函数；如果还有重复调用，则不执行继续等待。

<https://css-tricks.com/debouncing-throttling-explained-examples/>

