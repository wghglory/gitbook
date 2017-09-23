# 特点

- **无连接**：连接一次就断掉，不会保持连接
- **无状态**：一次连接后，服务器不回去记住上次请求的状态，通过 session 才能实现。
- 简单快速：每个资源都是固定的，统一资源符。uri 输入就可访问想要的
- 灵活：通过一个 Http 协议就可以完成不同数据类型的传输。只需要更改头文件中的数据类型。

## 概念

**HTTP(超文本传输协议)是利用 TCP 在两台电脑(通常是Web服务器和客户端)之间传输信息的协议**。客户端使用 Web 浏览器发起 HTTP 请求给 Web 服务器，Web服务器发送被请求的信息给客户端。

基本概念：

* 连接(Connection)：一个传输层的实际环流，它是建立在两个相互通讯的应用程序之间。
* 消息(Message)：HTTP通讯的基本单位，包括一个结构化的八元组序列并通过连接传输。
* 请求(Request)：一个从客户端到服务器的请求信息包括应用于资源的方法、资源的标识符和协议的版本号
* 响应(Response)：一个从服务器返回的信息包括HTTP协议的版本号、请求的状态(例如“成功”或“没找到”)和文档的MIME类型。
* 资源(Resource)：由URI标识的网络数据对象或服务。
* 实体(Entity)：数据资源或来自服务资源的回映的一种特殊表示方法，它可能被包围在一个请求或响应信息中。一个实体包括实体头信息和实体的本身内容。
* 客户机(Client)：一个为发送请求目的而建立连接的应用程序。
* 用户[代理](http://search.china.alibaba.com/wiki/k-%B4%FA%C0%ED_n-y.html)(Useragent)：初始化一个请求的客户机。它们是浏览器、编辑器或其它用户工具。
* 服务器(Server)：一个接受连接并对请求返回信息的应用程序。
* 源服务器(Origin server)：是一个给定资源可以在其上驻留或被创建的服务器。
* 代理(Proxy)：一个中间程序，它可以充当一个服务器，也可以充当一个客户机，为其它客户机建立请求。请求是通过可能的翻译在内部或经过传递到其它的服务器中。一个代理在发送请求信息之前，必须解释并且如果可能重写它。代理经常作为通过防火墙的客户机端的门户，代理还可以作为一个帮助应用来通过协议处理没有被用户代理完成的请求。
* 网关(Gateway)：一个作为其它服务器中间媒介的服务器。与代理不同的是，网关接受请求就好象对被请求的资源来说它就是源服务器；发出请求的客户机并没有意识到它在同网关打交道。网关经常作为通过防火墙的服务器端的门户，网关还可以作为一个协议翻译器以便存取那些存储在非HTTP系统中的资源。
* 通道(Tunnel)：是作为两个连接中继的中介程序。一旦激活，通道便被认为不属于HTTP通讯，尽管通道可能是被一个HTTP请求初始化的。当被中继的连接两端关闭时，通道便消失。当一个门户(Portal)必须存在或中介(Intermediary)不能解释中继的通讯时通道被经常使用。
* 缓存(Cache)：反应信息的局域存储。

关闭连接：

客户和服务器双方都可以通过关闭套接字来结束TCP/IP对话

## 报文组成

* 请求报文：请求行、请求头、空行、请求体
  * 请求行：http方法、页面地址、协议、版本
  * 请求头：key-value，告诉服务端请求内容，主要包括用户可以接受的数据类型、长度、压缩方法、最后一次修改时间、数据有效期等。
  * 请求体: querystring 数据

```
GET /s?wd=123 HTTP/1.1
Host: www.baidu.com
Connection: keep-alive
Cache-Control: max-age=0
Upgrade-Insecure-Requests: 1
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8
Accept-Encoding: gzip, deflate, br
Accept-Language: en-US,en;q=0.8,zh-CN;q=0.6,zh;q=0.4
Cookie: BAIDUID=018F6C542AEBDD4BABBF2C9676C0A403:FG=1; BIDUPSID=018F6C542AEBDD4BABBF2C9676C0A403; PSTM=1500562781; BDUSS=JvVTRJREhSMU5hYzI1YXdxTlJ-MmpleG5FWWRhaEpqfkdCdU1wQ2xQV1o1SnRaTUFBQUFBJCQAAAAAAAAAAAEAAADhSHEId2dod2dod2doMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJlXdFmZV3RZS3; FP_UID=635a3378dd9e2582a7e9586bec6f5eef; BD_HOME=1; BD_UPN=123253; H_PS_645EC=5b16fh1nNVxPkD6rR22rlqdK5ervWuwkuAVls33WqmXJ%2BKNe%2BmW%2FWS3YQKXZYSDmdYd%2F; BDORZ=B490B5EBF6F3CD402E515D22BCDA1598; BDRCVFR[feWj1Vr5u3D]=I67x6TjHwwYf0; BD_CK_SAM=1; PSINO=1; BDSVRTM=249; H_PS_PSSID=1464_21121_17001_20928

[Query String Parameters below]

wd=%E5%85%89%E8%BE%89&rsv_spt=1&rsv_iqid=0x872d077600036af2&issp=1&f=8&rsv_bp=0&rsv_idx=2&ie=utf-8&tn=baiduhome_pg&rsv_enter=1&rsv_sug3=9&rsv_sug1=6&rsv_sug7=101&rsv_sug2=0&inputT=1495&rsv_sug4=2335
```

* 响应报文：状态行、响应头、空行、响应体
  * 状态行：200 ok

```
HTTP/1.1 200 OK
Bdpagetype: 3
Bdqid: 0xe68631a400033973
Bduserid: 141641953
Cache-Control: private
Ckpacknum: 2
Ckrndstr: 400033973
Connection: Keep-Alive
Content-Encoding: gzip
Content-Type: text/html;charset=utf-8
Date: Sat, 23 Sep 2017 04:55:44 GMT
P3p: CP=" OTI DSP COR IVA OUR IND COM "
Server: BWS/1.1
Set-Cookie: BDRCVFR[feWj1Vr5u3D]=mk3SLVN4HKm; path=/; domain=.baidu.com
Set-Cookie: BD_CK_SAM=1;path=/
Set-Cookie: PSINO=1; domain=.baidu.com; path=/
Set-Cookie: BDSVRTM=24; path=/
Set-Cookie: H_PS_PSSID=1464_21121_17001_20928; path=/; domain=.baidu.com
Strict-Transport-Security: max-age=172800
Vary: Accept-Encoding
X-Powered-By: HPHP
X-Ua-Compatible: IE=Edge,chrome=1
Transfer-Encoding: chunked
```

## 方法

Get, post, put, delete, head(获取报文头)

## post get 区别

1. get 请求参数长度有限制，post 没有限制
1. get 相对 post 不安全，参数暴露在 url 中
1. get 参数 url 中，post 在 request body 中
1. get 在浏览器中回退是无害的，post 会再次提交
1. get url 参数完整保存在浏览器历史记录，post 不行
1. get 浏览器自动缓存。post 需要主动去缓存
1. get 只接受 ASCII字符，post 无限制
1. get 的 url 可以被收藏，post 不行

## 状态码

* 1XX：指示信息-表示请求已接受，继续处理
* 2XX：成功-表示请求已被成功接收
  * 200 OK ：客户端请求成功
  * 206 Partial Content：video/audio 文件大的时候，客户端发送了带 range 头的 get 请求，服务器完成了他
* 3XX：重定向-要完成请求必须进行更进一步的操作
  * 301 Move Permanently：所请求的页面已经转移至新的URL
  * 302 Found：所请求的页面已经临时转移到新的URL
  * 304 Not Modified：客户端有缓冲的文档并发出一个条件性的请求，服务器告诉客户，原来缓冲的文档还可以继续使用
* 4XX：客户端错误-请求有语法错误或请求无法实现
  * 400 Bad Request：客户端请求有语法错误，不能被服务器所理解
  * 401 Unauthorized：请求未经授权，这个状态代码必须和WWW-Authenticate报头域一起使用
  * 403 Forbidden：对被请求页面的访问被禁止
  * 404 Not Found：请求资源不存在
* 5XX：服务错误-服务器未能实现合法的请求
  * 500 Internal Server Error：服务器发生不可预期的错误原来缓冲的文档还可以继续使用
  * 503 Server Unavailable：请求未完成，服务器临时过载或当机，一段事件后恢复正常

## 持久化连接

http 1.1 支持，Keep-Alive 模式

## 管线化

* 持久连接下：请求1 --> 响应1 --> 请求2 --> 响应2
* 管线化：请求和响应都打包：请求123 --> 响应123

1. 管线化是通过持久连接完成，至少 1.1
1. 只有 get、head 请求可以管线化，post有限制
1. 初次建立不应该启动管线化、因为服务端不一定支持1.1
1. 不会带来性能提升，很多服务端对他支持不好，现代浏览器 chrome 默认不开启