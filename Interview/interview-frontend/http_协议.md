# 特点

- **无连接**：连接一次就断掉，不会保持连接
- **无状态**：一次连接后，服务器不回去记住上次请求的状态，通过session才能实现。
- 简单快速：每个资源都是固定的，统一资源符。uri输入就可访问想要的
- 灵活：通过一个Http协议就可以完成不同数据类型的传输。只需要更改头文件中的数据类型。

## 报文组成

* 请求报文：请求行、请求头、空行、请求体
  * 请求行：http方法、页面地址、协议、版本
  * 请求头：key-value，告诉服务端请求内容

* 响应报文：状态行、响应头、空行、响应体
  * 状态行：200 ok

## 方法

Get, post, put, delete, head(获取报文头)

## post get 区别

1. get 在浏览器中回退是无害的，post会再次提交
1. get url参数完整保存在浏览器历史记录，post不行
1. get 浏览器自动缓存。post需要主动去缓存
1. get 相对post不安全，参数暴露在url中
1. get 参数url中，post在 request body 中
1. get 请求参数长度有限制，post没有限制
1. get 只接受 ASCII字符，post无限制
1. get 的url可以被收藏，post不行

## 状态码

```
1xx 指示信息
2xx success
3xx redirect
4xx client error
5xx server error

206: video/audio文件大的时候，客户端发送了带 range 头的 get 请求，服务器完成了他
301: moved permanently
302: Redirect
304: Not modified，可以用之前缓存的数据
400：bad request
401: unauthorized
403: forbidden
404: not found
500: internal server error
503: server down
```

## 持久化连接

http 1.1 支持，Keep-Alive 模式

## 管线化

* 持久连接下：请求1 --> 响应1 --> 请求2 --> 响应2
* 管线化：请求和响应都打包：请求123 --> 响应123

1. 管线化是通过持久连接完成，至少1.1
1. 只有get、head请求可以管线化，post有限制
1. 初次建立不应该启动管线化、因为服务端不一定支持1.1
1. 不会带来性能提升，很多服务端对他支持不好，现代浏览器chrome默认不开启