# Asp.Net SignalR 集群会遇到的问题

当客户端数量上来，一台 server 自然是吃不消的。多个 server 集群部署是必然的解决方案。再通过负载均衡，嗯 简直是完美。但是问题也接踵而来。每个 server 只能管理到当前 server 下的 client，比如 server1 要给连接在 server2 的 client 发一条消息是实现不了的。

这时我们需要“底板”中间件，什么叫底板 ，也就是在 server 的集群上再加一层，由底板来维护这些 server，像上面 server1 给连接在 server2 的 client 发消息，底板会告诉 server2 给 client 发一条消息。就达到了我们需要的效果

常用的有 Redis 与 SqlServer，其实 Redis 性能是最优的。

## SqlServer 来做底板

需要下载 nuget 包 Microsoft.AspNet.SignalR.SqlServer 然后在 startup 类中进行配置,也是非常简单的,数据库是 signalR。把程序运行一下，我们会得到以下这些表

![sql server](http://images2015.cnblogs.com/blog/832799/201701/832799-20170125215008175-129172576.png)

![table](http://images2015.cnblogs.com/blog/832799/201701/832799-20170125215010034-1464102998.png)

## redis 来做底板

需要下载 nuget 包 Microsoft.AspNet.SignalR.Redis 同样在 startup 类中进行配置，

```csharp
GlobalHost.DependencyResolver.UseRedis("localhost", 6379, string.Empty, "signalR");
```

![redis](http://images2015.cnblogs.com/blog/832799/201701/832799-20170125215013050-1082965491.png)
