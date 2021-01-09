# Redis

Redis 是一个开源的，使用 C 语言编写，面向“键/值”（Key/Value）对类型数据的分布式 NoSQL 数据库系统，特点是**高性能、持久存储、适应高并发的应用场景**。因此，可以说 Redis 纯粹为应用而产生，它是一个高性能的 key-value 数据库，并且还提供了多种语言的 API。那么，也许我们会问：到底性能如何呢？以下是官方的 bench-mark 数据：

> - 测试完成了**50 个并发**执行**100000 个请求**。
> - 设置和获取的值是一个 256 字节字符串。
> - Linux box 是运行 Linux 2.6,这是 X3320 Xeon 2.5 ghz。
> - 文本执行使用 loopback 接口(127.0.0.1)。
> - 结果:**读的速度是 110000 次/s,写的速度是 81000 次/s** 。（当然不同的服务器配置性能也有所不同）。

和 Memcached 类似，Redis 支持存储的 value 类型相对更多，包括 string(字符串)、list(链表)、set(集合)、zset(sorted set --有序集合)和 hash（哈希类型）。这些数据类型都支持 push/pop、add/remove 及取交集并集和差集及更丰富的操作，而且这些操作都是原子性的。在此基础上，Redis 支持各种不同方式的排序。与 Memcached 一样，为了保证效率，数据都是缓存在内存中。区别的是**Redis 会周期性的把更新的数据写入磁盘或者把修改操作写入追加的记录文件，并且在此基础上实现了 master-slave(主从)同步**（数据可以从主服务器向任意数量的从服务器上同步，从服务器可以是关联其他从服务器的主服务器。）。

因此，**Redis 的出现，很大程度补偿了 Memcached 这类 key/value 存储的不足，在部分场合可以对关系数据库起到很好的补充作用**。

## Redis 在 Windows 上的安装与配置

前面介绍了一大堆，现在开始真刀实干！首先，肯定是安装 Redis，这里我们选择比较熟悉的 Windows 平台来进行安装。既然是 Windows 平台，那么肯定要选择一个 Windows 版本的 Redis 安装包（其实 NoSQL 大部分都是部署在 Linux 服务器上得，什么原因？大家都懂得，开源+免费=成熟的服务器方案）。

（1）进入 GitHub 的 Redis 相关包下载页面：[https://github.com/MSOpenTech/redis](https://github.com/MSOpenTech/redis)

（2）选择相应版本，我这里选择的是 2.6 的版本，点击 Download ZIP 按钮进行下载；

（3）打开压缩包，可以看到我们下载的其实是一个完整的 Redis-2.6 的包，包含了 bin、src 等文件夹，src 是源码，而 bin 则是编译好的执行文件，也是我们主要使用的东东。进入 bin 目录，可以看到里面又有两个目录，一个是 32 位操作系统使用的，另一个则是 64 位操作系统使用的。

（4）我所使用的是 64 位系统，所以我将 redisbin64.zip 拷贝出来，解压后移动至我的 D:/Redis 目录中，可以看到解压后的内容包含以下的一些可执行 exe 文件：

下面来看看这几个可执行 exe 文件都是干嘛用的？

①**redis-server.exe**：服务程序，也是最最最核心的一个程序。说到底，Redis 也就是我们服务器系统上一直运行的一个服务甚至就是一个进程而已。

②redis-check-dump.exe：本地数据库检查

③redis-check-aof.exe：更新日志检查

④redis-benchmark.exe：性能测试，用以模拟同时由 N 个客户端发送 M 个 SETs/GETs 查询。上面所提到的测试结果就是使用的该程序来进行的。

⑤redis-cli.exe： 服务端开启后，我们的客户端就可以输入各种命令测试了，例如 GET、SET 等操作；

另外，将刚刚下载的包里边的**redis.conf**默认配置文件拷贝到工作目录中（我的是 D:/Redis），redis.conf 主要是一些 Redis 的默认服务配置，包括默认端口号（一般默认 6379）啊之类的配置。

![-c](http://om1o84p1p.bkt.clouddn.com/2017-03-14-030157289964052.jpg)

（5）既然我们知道了 redis-server.exe 是最核心的一个程序，那么我们就首先来将它开启。这里需要在 Windows 的命令行界面中来开启，首先在运行窗口输入 cmd 进入命令窗口，使用 cd 命令切换到指定的目录（我是将刚刚解压的文件放在了 D:/Redis 文件夹下）

![-c](http://om1o84p1p.bkt.clouddn.com/2017-03-14-030154054348230.jpg)

（6）最后就是惊心动魄地开启 Redis 的服务了，输入一句简单的命令：**redis-server.exe redis.conf**

![-c](http://om1o84p1p.bkt.clouddn.com/2017-03-14-030159446376126.jpg)

这里需要注意的是：开启 Redis 服务后，命令行窗口不要关闭，一旦关闭，Redis 服务也会相应关闭。因此，我们一般会将其改为 Windows 服务，并且设置为开机自动启动，就像我们数据库服务器中的 SQL Server 服务和 Web 服务器中的 IIS 服务一样。

（7）究竟我们的 Redis 安装好了没呢？我们可以通过新打开（记得是新打开一个，而不是将原来那个关闭了）一个 cmd 窗口使用 redis-cli.exe 来测试一下：redis-cli.exe -h 服务器 IP –p 端口

![-c](http://om1o84p1p.bkt.clouddn.com/2017-03-14-030218180744353.jpg)

（8）既然每次都需要在命令窗口中开启 Redis 服务不爽，那我们就动手将其改为 Windows 服务，让它自动启动。通过在网上查找，我在 CSDN 找到了一个批处理文件和一个 RedisService 的可执行文件，并将这两个文件拷贝到指定的 Redis 目录（我的是 D:/Redis）：

![-c](http://om1o84p1p.bkt.clouddn.com/2017-03-14-031047248401630.jpg)

其中，install-service 这个批处理文件的代码如下：

```shell
@echo off
set cur_path=%cd% sc create redis-instance binpath= "\"%cur_path%\RedisService.exe\" %cur_path%\redis.conf" start= "auto" DisplayName= "Redis"
```

意思是在我们的 Windows 中创建一个 Redis 的服务实例，指定要启动的程序路径与配置文件路径。这里需要注意的是：RedisService 是另外的一个 exe，不是我们刚刚下载下来就有的，这个 RedisService.exe 的下载地址为：[http://pan.baidu.com/s/1sjrvmTf](http://pan.baidu.com/s/1sjrvmTf)。启动模式设置为 auto 代表自动启动，显示的服务名称为 Redis。这样，一个 bat 文件就做好了，点击运行之后，一个 Redis 的 Windows 服务也出现在了我们的 Windows 服务列表中，如下图所示：

![-c](http://om1o84p1p.bkt.clouddn.com/2017-03-14-030244435276318.jpg)

### 参考文献

（1）传智播客 Redis 公开课，王承伟主讲，http://bbs.itcast.cn/thread-26525-1-1.html

（2）NoSQL 百度百科，http://baike.baidu.com/view/2677528.htm

（3）孙立，《NoSQL 开篇—为什么使用 NoSQL》，http://www.infoq.com/cn/news/2011/01/nosql-why/

（4）Redis 百度百科，http://baike.baidu.com/view/4595959.htm

（5）Ruthless，《Windows 下安装 Redis》，http://www.cnblogs.com/linjiqin/archive/2013/05/27/3101694.html

（6）张善友，《在 Windows 上以服务方式运行 Redis》，http://www.cnblogs.com/shanyou/archive/2013/01/17/redis-on-windows.html

### 附件下载

（1）Redis-2.6 服务包：[http://pan.baidu.com/s/1dDEKojJ](http://pan.baidu.com/s/1dDEKojJ)

（2）Redis 注册 Windows 服务的批处理文件：[http://pan.baidu.com/s/1jGJtNXs](http://pan.baidu.com/s/1jGJtNXs)

（3）Redis 注册 Windows 服务的启动程序（RedisServcie.exe）：[http://pan.baidu.com/s/1sjrvmTf](http://pan.baidu.com/s/1sjrvmTf)
