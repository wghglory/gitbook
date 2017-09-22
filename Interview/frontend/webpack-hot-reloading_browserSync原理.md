# webpack 热插拔 hot reloading 原理

webpack-hot-middleware 中间件是 webpack 的一个 plugin，通常结合 webpack-dev-middleware 一起使用。借助它可以实现浏览器的无刷新更新（热更新），即 webpack 里的 HMR（Hot Module Replacement）。内部使用 Server-sent event(SSE)。

SSE 参看 `Websocket_vs_polling.md`

# browser-sync 原理

一个网页里的所有交互动作（包括滚动，输入，点击等等），可以实时地同步到其他所有打开该网页的设备，能够节省大量的手工操作时间，从而带来流畅的开发调试体验。目前 browser-sync 可以结合 Gulp 或 Grunt 一起使用，其 API 请参考：[Browser-sync API](http://www.browsersync.cn/docs/api/)。

EventSource 的使用是比较便捷的，那为什么 browser-sync 不使用 EventSource 技术进行代码推送呢？这是因为 browser-sync 插件共做了两件事：

* 开发更新了一段新的逻辑，服务器实时推送代码改动信息。数据流：服务器 —> 浏览器，使用 EventSource 技术同样能够实现。
* 用户操作网页，滚动、输入或点击等，操作信息实时发送给服务器，然后再由服务器将操作同步给其他已打开的网页。数据流：浏览器 —> 服务器 —> 浏览器，该部分功能 EventSource 技术已无能为力。

browser-sync 使用 WebSocket 技术达到实时推送代码改动和用户操作两个目的。至于它是如何计算推送内容，根据不同推送内容采取何种响应策略，不在本次讨论范围之内。

WebSocket 参看 `Websocket_vs_polling.md`
