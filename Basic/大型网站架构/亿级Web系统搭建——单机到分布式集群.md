# Web 负载均衡

Web 负载均衡（Load Balancing），简单地说就是给我们的服务器集群分配“工作任务”，而采用恰当的分配方式，对于保护处于后端的 Web 服务器来说，非常重要。

[![img](http://cms.csdnimg.cn/article/201411/06/545b7269976ae.jpg) ](http://cms.csdnimg.cn/article/201411/06/545b7269976ae.jpg)

负载均衡的策略有很多，我们从简单的讲起哈。

## 1. HTTP 重定向

当用户发来请求的时候，Web 服务器通过修改 HTTP 响应头中的 Location 标记来返回一个新的 url，然后浏览器再继续请求这个新 url，实际上就是页面重定向。通过重定向，来达到“负载均衡”的目标。例如，我们在下载 PHP 源码包的时候，点击下载链接时，为了解决不同国家和地域下载速度的问题，它会返回一个离我们近的下载地址。重定向的 HTTP 返回码是 302，如下图：

[![img](http://cms.csdnimg.cn/article/201411/06/545b7298ef853.jpg) ](http://cms.csdnimg.cn/article/201411/06/545b7298ef853.jpg)

如果使用 PHP 代码来实现这个功能，方式如下：

[![img](http://cms.csdnimg.cn/article/201411/06/545b72b687e30_middle.jpg?_=51639) ](http://cms.csdnimg.cn/article/201411/06/545b72b687e30.jpg)

这个重定向非常容易实现，并且可以自定义各种策略。但是，它在大规模访问量下，性能不佳。而且，给用户的体验也不好，实际请求发生重定向，增加了网络延时。

## 2. 反向代理负载均衡

反向代理服务的核心工作主要是转发 HTTP 请求，扮演了浏览器端和后台 Web 服务器中转的角色。因为它工作在 HTTP 层（应用层），也就是网络七层结构中的第七层，因此也被称为“七层负载均衡”。可以做反向代理的软件很多，比较常见的一种是 Nginx。

[![img](http://cms.csdnimg.cn/article/201411/06/545b72f9413e5.jpg) ](http://cms.csdnimg.cn/article/201411/06/545b72f9413e5.jpg)

Nginx 是一种非常灵活的反向代理软件，可以自由定制化转发策略，分配服务器流量的权重等。反向代理中，常见的一个问题，就是 Web 服务器存储的 session 数据，因为一般负载均衡的策略都是随机分配请求的。同一个登录用户的请求，无法保证一定分配到相同的 Web 机器上，会导致无法找到 session 的问题。

解决方案主要有两种：

1.  配置反向代理的转发规则，让同一个用户的请求一定落到同一台机器上（通过分析 cookie），复杂的转发规则将会消耗更多的 CPU，也增加了代理服务器的负担。
2.  将 session 这类的信息，专门用某个独立服务来存储，例如 redis/memchache，这个方案是比较推荐的。

反向代理服务，也是可以开启缓存的，如果开启了，会增加反向代理的负担，需要谨慎使用。这种负载均衡策略实现和部署非常简单，而且性能表现也比较好。但是，它有“单点故障”的问题，如果挂了，会带来很多的麻烦。而且，到了后期 Web 服务器继续增加，它本身可能成为系统的瓶颈。

## 3. IP 负载均衡

IP 负载均衡服务是工作在网络层（修改 IP）和传输层（修改端口，第四层），比起工作在应用层（第七层）性能要高出非常多。原理是，他是对 IP 层的数据包的 IP 地址和端口信息进行修改，达到负载均衡的目的。这种方式，也被称为“四层负载均衡”。常见的负载均衡方式，是 LVS（Linux Virtual Server，Linux 虚拟服务），通过 IPVS（IP Virtual Server，IP 虚拟服务）来实现。

[![img](http://cms.csdnimg.cn/article/201411/06/545b75677f774_middle.jpg?_=23785) ](http://cms.csdnimg.cn/article/201411/06/545b75677f774.jpg)

在负载均衡服务器收到客户端的 IP 包的时候，会修改 IP 包的目标 IP 地址或端口，然后原封不动地投递到内部网络中，数据包会流入到实际 Web 服务器。实际服务器处理完成后，又会将数据包投递回给负载均衡服务器，它再修改目标 IP 地址为用户 IP 地址，最终回到客户端。

[![img](http://cms.csdnimg.cn/article/201411/06/545b75c339318.jpg) ](http://cms.csdnimg.cn/article/201411/06/545b75c339318.jpg)

上述的方式叫 LVS-NAT，除此之外，还有 LVS-RD（直接路由），LVS-TUN（IP 隧道），三者之间都属于 LVS 的方式，但是有一定的区别，篇幅问题，不赘叙。

IP 负载均衡的性能要高出 Nginx 的反向代理很多，它只处理到传输层为止的数据包，并不做进一步的组包，然后直接转发给实际服务器。不过，它的配置和搭建比较复杂。

## 4. DNS 负载均衡

DNS（Domain Name System）负责域名解析的服务，域名 url 实际上是服务器的别名，实际映射是一个 IP 地址，解析过程，就是 DNS 完成域名到 IP 的映射。而一个域名是可以配置成对应多个 IP 的。因此，DNS 也就可以作为负载均衡服务。

[![img](http://cms.csdnimg.cn/article/201411/06/545b76eb8dfd6_middle.jpg?_=13745) ](http://cms.csdnimg.cn/article/201411/06/545b76eb8dfd6.jpg)

这种负载均衡策略，配置简单，性能极佳。但是，不能自由定义规则，而且，变更被映射的 IP 或者机器故障时很麻烦，还存在 DNS 生效延迟的问题。 **5. DNS/GSLB 负载均衡**

我们常用的 CDN（Content Delivery Network，内容分发网络）实现方式，其实就是在同一个域名映射为多 IP 的基础上更进一步，通过 GSLB（Global Server Load Balance，全局负载均衡）按照指定规则映射域名的 IP。一般情况下都是按照地理位置，将离用户近的 IP 返回给用户，减少网络传输中的路由节点之间的跳跃消耗。

[![img](http://cms.csdnimg.cn/article/201411/06/545b77297877e_middle.jpg?_=30724) ](http://cms.csdnimg.cn/article/201411/06/545b77297877e.jpg)

图中的“向上寻找”，实际过程是 LDNS（Local DNS）先向根域名服务（Root Name Server）获取到顶级根的 Name Server（例如.com 的），然后得到指定域名的授权 DNS，然后再获得实际服务器 IP。

[![img](http://cms.csdnimg.cn/article/201411/06/545b77510fec6.jpg) ](http://cms.csdnimg.cn/article/201411/06/545b77510fec6.jpg)

CDN 在 Web 系统中，一般情况下是用来解决大小较大的静态资源（html/Js/Css/图片等）的加载问题，让这些比较依赖网络下载的内容，尽可能离用户更近，提升用户体验。

例如，我访问了一张 imgcache.gtimg.cn 上的图片（腾讯的自建 CDN，不使用 qq.com 域名的原因是防止 http 请求的时候，带上了多余的 cookie 信息），我获得的 IP 是 183.60.217.90。

[![img](http://cms.csdnimg.cn/article/201411/06/545b7776e06ce.jpg) ](http://cms.csdnimg.cn/article/201411/06/545b7776e06ce.jpg)

这种方式，和前面的 DNS 负载均衡一样，不仅性能极佳，而且支持配置多种策略。但是，搭建和维护成本非常高。互联网一线公司，会自建 CDN 服务，中小型公司一般使用第三方提供的 CDN。
