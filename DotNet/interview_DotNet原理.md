# .Net 原理

## Asp.net 原理

![aspnet](http://om1o84p1p.bkt.clouddn.com/1508745926.png)

下面是请求管道中的19个事件。

HttpContext：ecb → HttpWorkerRequest → HttpContext

HttpApplicationFactory. 获取了HttpApplication实例之后。

1. BeginRequest: 开始处理请求
1. AuthenticateRequest 授权验证请求，获取用户授权信息
1. PostAuthenticateRequest 获取成功
1. AunthorizeRequest 授权，一般来检查用户是否获得权限
1. PostAuthorizeRequest: 获得授权
1. ResolveRequestCache: 获取页面缓存结果
1. PostResolveRequestCache 已获取缓存   当前请求映射到MvcHandler（pr）：  创建控制器工厂 ，创建控制器，调用action执行，view→response //action   Handler : PR()
1. PostMapRequestHandler 创建页面对象:创建 最终处理当前http请求的 Handler  实例：  第一从HttpContext中获取当前的PR Handler   ，Create
1. PreAcquireRequestState 获取Session
1. PostAcquireRequestState 获得Session
1. PreRequestHandlerExecute:准备执行页面对象，执行页面对象的ProcessRequest方法
1. PostRequestHandlerExecute 执行完页面对象了
1. ReleaseRequestState 释放请求状态
1. PostReleaseRequestState 已释放请求状态
1. UpdateRequestCache 更新缓存
1. PostUpdateRequestCache 已更新缓存
1. LogRequest 日志记录
1. PostLogRequest 已完成日志
1. EndRequest 完成

## MVC 5

![mvc](http://om1o84p1p.bkt.clouddn.com/1508745486.png)
