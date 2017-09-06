Redis是一个开源的，使用C语言编写，面向“键/值”（Key/Value）对类型数据的分布式NoSQL数据库系统，特点是**高性能、持久存储、适应高并发的应用场景**。因此，可以说Redis纯粹为应用而产生，它是一个高性能的key-value数据库，并且还提供了多种语言的API。那么，也许我们会问：到底性能如何呢？以下是官方的bench-mark数据：

> 　　测试完成了**50个并发**执行**100000个请求**。
>
> 　　设置和获取的值是一个256字节字符串。
>
> 　　Linux box是运行Linux 2.6,这是X3320 Xeon 2.5 ghz。
>
> 　　文本执行使用loopback接口(127.0.0.1)。
>
> 　　结果:**读的速度是110000次/s,写的速度是81000次/s** 。（当然不同的服务器配置性能也有所不同）。

　　和Memcached类似，Redis支持存储的value类型相对更多，包括string(字符串)、list(链表)、set(集合)、zset(sorted set --有序集合)和hash（哈希类型）。这些数据类型都支持push/pop、add/remove及取交集并集和差集及更丰富的操作，而且这些操作都是原子性的。在此基础上，Redis支持各种不同方式的排序。与Memcached一样，为了保证效率，数据都是缓存在内存中。区别的是**Redis会周期性的把更新的数据写入磁盘或者把修改操作写入追加的记录文件，并且在此基础上实现了master-slave(主从)同步**（数据可以从主服务器向任意数量的从服务器上同步，从服务器可以是关联其他从服务器的主服务器。）。

　　因此，**Redis的出现，很大程度补偿了Memcached这类key/value存储的不足，在部分场合可以对关系数据库起到很好的补充作用**。

# Redis在Windows上的安装与配置

　　前面介绍了一大堆，现在开始真刀实干！首先，肯定是安装Redis，这里我们选择比较熟悉的Windows平台来进行安装。既然是Windows平台，那么肯定要选择一个Windows版本的Redis安装包（其实NoSQL大部分都是部署在Linux服务器上得，什么原因？大家都懂得，开源+免费=成熟的服务器方案）。

　　（1）进入GitHub的Redis相关包下载页面：[https://github.com/MSOpenTech/redis](https://github.com/MSOpenTech/redis)

　　（2）选择相应版本，我这里选择的是2.6的版本，点击Download ZIP按钮进行下载；

　　（3）打开压缩包，可以看到我们下载的其实是一个完整的Redis-2.6的包，包含了bin、src等文件夹，src是源码，而bin则是编译好的执行文件，也是我们主要使用的东东。进入bin目录，可以看到里面又有两个目录，一个是32位操作系统使用的，另一个则是64位操作系统使用的。

　　（4）我所使用的是64位系统，所以我将redisbin64.zip拷贝出来，解压后移动至我的D:/Redis目录中，可以看到解压后的内容包含以下的一些可执行exe文件：

　　下面来看看这几个可执行exe文件都是干嘛用的？

　　①**redis-server.exe**：服务程序，也是最最最核心的一个程序。说到底，Redis也就是我们服务器系统上一直运行的一个服务甚至就是一个进程而已。 

　　②redis-check-dump.exe：本地数据库检查

　　③redis-check-aof.exe：更新日志检查

　　④redis-benchmark.exe：性能测试，用以模拟同时由N个客户端发送M个 SETs/GETs 查询。上面所提到的测试结果就是使用的该程序来进行的。

　　⑤redis-cli.exe： 服务端开启后，我们的客户端就可以输入各种命令测试了，例如GET、SET等操作；

　　另外，将刚刚下载的包里边的**redis.conf**默认配置文件拷贝到工作目录中（我的是D:/Redis），redis.conf主要是一些Redis的默认服务配置，包括默认端口号（一般默认6379）啊之类的配置。

![-c](http://om1o84p1p.bkt.clouddn.com/2017-03-14-030157289964052.jpg)

　　（5）既然我们知道了redis-server.exe是最核心的一个程序，那么我们就首先来将它开启。这里需要在Windows的命令行界面中来开启，首先在运行窗口输入cmd进入命令窗口，使用cd命令切换到指定的目录（我是将刚刚解压的文件放在了D:/Redis文件夹下）

![-c](http://om1o84p1p.bkt.clouddn.com/2017-03-14-030154054348230.jpg)

　　（6）最后就是惊心动魄地开启Redis的服务了，输入一句简单的命令：**redis-server.exe redis.conf**

![-c](http://om1o84p1p.bkt.clouddn.com/2017-03-14-030159446376126.jpg)

　　这里需要注意的是：开启Redis服务后，命令行窗口不要关闭，一旦关闭，Redis服务也会相应关闭。因此，我们一般会将其改为Windows服务，并且设置为开机自动启动，就像我们数据库服务器中的SQL Server服务和Web服务器中的IIS服务一样。

　　（7）究竟我们的Redis安装好了没呢？我们可以通过新打开（记得是新打开一个，而不是将原来那个关闭了）一个cmd窗口使用redis-cli.exe来测试一下：redis-cli.exe -h 服务器IP –p 端口

![-c](http://om1o84p1p.bkt.clouddn.com/2017-03-14-030218180744353.jpg)

　　（8）既然每次都需要在命令窗口中开启Redis服务不爽，那我们就动手将其改为Windows服务，让它自动启动。通过在网上查找，我在CSDN找到了一个批处理文件和一个RedisService的可执行文件，并将这两个文件拷贝到指定的Redis目录（我的是D:/Redis）：

![-c](http://om1o84p1p.bkt.clouddn.com/2017-03-14-031047248401630.jpg)

　　其中，install-service这个批处理文件的代码如下：

```bash
@echo off
set cur_path=%cd% sc create redis-instance binpath= "\"%cur_path%\RedisService.exe\" %cur_path%\redis.conf" start= "auto" DisplayName= "Redis"
```

　　意思是在我们的Windows中创建一个Redis的服务实例，指定要启动的程序路径与配置文件路径。这里需要注意的是：RedisService是另外的一个exe，不是我们刚刚下载下来就有的，这个RedisService.exe的下载地址为：[http://pan.baidu.com/s/1sjrvmTf](http://pan.baidu.com/s/1sjrvmTf)。启动模式设置为auto代表自动启动，显示的服务名称为Redis。这样，一个bat文件就做好了，点击运行之后，一个Redis的Windows服务也出现在了我们的Windows服务列表中，如下图所示：

![-c](http://om1o84p1p.bkt.clouddn.com/2017-03-14-030244435276318.jpg)

# 参考文献

（1）传智播客Redis公开课，王承伟主讲，http://bbs.itcast.cn/thread-26525-1-1.html

（2）NoSQL百度百科，http://baike.baidu.com/view/2677528.htm

（3）孙立，《NoSQL开篇—为什么使用NoSQL》，http://www.infoq.com/cn/news/2011/01/nosql-why/

（4）Redis百度百科，http://baike.baidu.com/view/4595959.htm

（5）Ruthless，《Windows下安装Redis》，http://www.cnblogs.com/linjiqin/archive/2013/05/27/3101694.html

（6）张善友，《在Windows上以服务方式运行Redis》，http://www.cnblogs.com/shanyou/archive/2013/01/17/redis-on-windows.html

# 附件下载

（1）Redis-2.6服务包：[http://pan.baidu.com/s/1dDEKojJ](http://pan.baidu.com/s/1dDEKojJ)

（2）Redis注册Windows服务的批处理文件：[http://pan.baidu.com/s/1jGJtNXs](http://pan.baidu.com/s/1jGJtNXs)

（3）Redis注册Windows服务的启动程序（RedisServcie.exe）：[http://pan.baidu.com/s/1sjrvmTf](http://pan.baidu.com/s/1sjrvmTf)




