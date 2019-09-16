# 安装和启动

- install

  ```bash
  memcached.exe -d install
  ```

- start

  ```bash
  memcached.exe -d start
  ```

- stop

  ```bash
  memcached.exe -d stop
  ```

- unInstall

  ```bash
  memcached.exe -d uninstall
  ```

以上的安装和启动都是在默认环境下进行的，在安装时可设置如下参数：

- Memcached **默认使用端口是 11211**
- 默认**最大连接数是 1024 个**
- 默认最大使用内存是 64M
- 默认每个键值对，值存储空间为 1M

> - -p 监听的端口
> - -l 连接的 IP 地址, 默认是本机
> - -d start 启动 memcached 服务
> - -d restart 重起 memcached 服务
> - -d stop|shutdown 关闭正在运行的 memcached 服务
> - -d install 安装 memcached 服务
> - -d uninstall 卸载 memcached 服务
> - -u 以身份运行 (仅在以 root 运行的时候有效)
> - -m 最大内存使用，单位 MB。**默认 64MB **
> - -M 内存耗尽时返回错误，而不是删除项
> - -c 最大同时连接数，**默认是 1024 **
> - -f 块大小增长因子，默认是 1.25
> - -n 最小分配空间，key+value+flags 默认是 48
> - -h 显示帮助

怎么才知道 Memcached 服务已经安装成功并启动了呢? cmd 命令 `services.msc`

![img](http://upload-images.jianshu.io/upload_images/1845730-a813cccd253572a9.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

检测 Memcached 服务是否成功启动：

> 使用 telnet 命令连接到登录台：telnet 服务器 IP 地址 11211（11211 是默认的 Memcached 服务端口号）打印当前 Memcache 服务器状态：**stats**
>
> 可以看到，通过 stats 命令列出了一系列的 Memcached 服务状态信息
>
> ![img](http://upload-images.jianshu.io/upload_images/1845730-49418587e7e6e1b7.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

## 先把 memcached 用起来

下载客户端的 4 个 dll，`IcSharpCode.SharpZipLib.dll，log4net.dll，Memcached.ClientLibrary.dll，Commons.dll`

新建一个简单控制台应用程序

```csharp
using Memcached.ClientLibrary;
using System;

namespace Tdf.RedisCacheTest
{
    class AMemcached
    {
        public static MemcachedClient cache;
        static AMemcached()
        {
            string[] servers = { "127.0.0.1:11211" };
            // 初始化池
            SockIOPool pool = SockIOPool.GetInstance();
            // 设置服务器列表
            pool.SetServers(servers);
            // 各服务器之间负载均衡的设置比例
            pool.SetWeights(new int[] { 1 });
            // 初始化时创建连接数
            pool.InitConnections = 3;
            // 最小连接数
            pool.MinConnections = 3;
            // 最大连接数
            pool.MaxConnections = 5;
            // 连接的最大空闲时间，下面设置为6个小时（单位ms），超过这个设置时间，连接会被释放掉
            pool.MaxIdle = 1000 * 60 * 60 * 6;
            // socket连接的超时时间，下面设置表示不超时（单位ms），即一直保持链接状态
            pool.SocketConnectTimeout = 0;
            // 通讯的超时时间，下面设置为3秒（单位ms），.Net版本没有实现
            pool.SocketTimeout = 1000 * 3;
            // 维护线程的间隔激活时间，下面设置为30秒（单位s），设置为0时表示不启用维护线程
            pool.MaintenanceSleep = 30;
            // 设置SocktIO池的故障标志
            pool.Failover = true;
            // 是否对TCP/IP通讯使用nalgle算法，.net版本没有实现
            pool.Nagle = false;
            // socket单次任务的最大时间（单位ms），超过这个时间socket会被强行中端掉，当前任务失败。
            pool.MaxBusy = 1000 * 10;
            pool.Initialize();
            cache = new MemcachedClient();
            // 是否启用压缩数据：如果启用了压缩，数据压缩长于门槛的数据将被储存在压缩的形式
            cache.EnableCompression = false;
            // 压缩设置，超过指定大小的都压缩
            cache.CompressionThreshold = 1024 * 1024;
        }
    }

    class Program
    {
        static void Main(string[] args)
        {
            // 存入key为userName，value为Bobby的一个缓存
            AMemcached.cache.Add("userName", "Bobby");
            // 读出key为a的缓存值
            var s = AMemcached.cache.Get("userName");
            // 输出
            Console.WriteLine(s);
            Console.Read();
        }
    }
}
```

### memcached 分布式缓存的设置与应用

```csharp
string[] servers = { "127.0.0.1:11211", "192.168.2.100:11211" };
// 初始化池
SockIOPool pool = SockIOPool.GetInstance();
// 设置服务器列表
pool.SetServers(servers);
// 各服务器之间负载均衡的设置比例
pool.SetWeights(new int[] { 1, 10 });
```

> Note：
>
> - 在 172.18.5.66，与 192.168.10.121 两台机器上装 memcached 服务端。
> - pool.SetWeights 这里的 1 跟 10 意思是，负载均衡比例，假如 11000 条数据，大致数据分布为：172.18.5.66 分布 1000 条数据左右。另外一台为 10000 条左右。
> - memcached 服务端并不具备负载均衡的能力，而是**memcachedClient 实现的，具体存取数据实现的核心是采用一致性 Hash 算法**，把 key-value 分布到某一台服务器中里边。

### memcached 的数据压缩机制

```csharp
// 是否启用压缩数据：如果启用了压缩，数据压缩长于门槛的数据将被储存在压缩的形式
cache.EnableCompression = false;
// 压缩设置，超过指定大小的都压缩
cache.CompressionThreshold = 1024 * 1024;
```

> Note：
>
> - 这个处理是在 MemcachedClient 对象中，设置这个 EnableCompression 属性，是否使用压缩的意思，如果启用啦压缩功能 ,则**IcSharpCode.SharpZipLib 类库**会在数据超过预设大小时，进行数据压缩处理。
> - CompressionThreshold 这个属性是压缩的阀值，默认是 15K，如果超过设定的阀值则使用 memcached 的通讯协议，存数据时给每个数据项分配一个 16 为的 flag 表示，用作记录是否有压缩，如果有压缩则提取数据是进行解压。如果没有超过阀值则不压缩，直接存储。

### 使用客户端多个 SocketIO 池

```csharp
using Memcached.ClientLibrary;
using System;

namespace Tdf.RedisCacheTest
{
    class AMemcached
    {
        public MemcachedClient cache;
        public AMemcached(string poolName)
        {
            string[] servers = { "127.0.0.1:11211", "192.168.2.100:11211" };
            // 初始化池
            SockIOPool pool = SockIOPool.GetInstance();
            // 设置服务器列表
            pool.SetServers(servers);
            // 各服务器之间负载均衡的设置比例
            pool.SetWeights(new int[] { 1, 10 });
            // 初始化时创建连接数
            pool.InitConnections = 3;
            // 最小连接数
            pool.MinConnections = 3;
            // 最大连接数
            pool.MaxConnections = 5;
            // 连接的最大空闲时间，下面设置为6个小时（单位ms），超过这个设置时间，连接会被释放掉
            pool.MaxIdle = 1000 * 60 * 60 * 6;
            // socket连接的超时时间，下面设置表示不超时（单位ms），即一直保持链接状态
            pool.SocketConnectTimeout = 0;
            // 通讯的超时时间，下面设置为3秒（单位ms），.Net版本没有实现
            pool.SocketTimeout = 1000 * 3;
            // 维护线程的间隔激活时间，下面设置为30秒（单位s），设置为0时表示不启用维护线程
            pool.MaintenanceSleep = 30;
            // 设置SocktIO池的故障标志
            pool.Failover = true;
            // 是否对TCP/IP通讯使用nalgle算法，.net版本没有实现
            pool.Nagle = false;
            // socket单次任务的最大时间（单位ms），超过这个时间socket会被强行中端掉，当前任务失败。
            pool.MaxBusy = 1000 * 10;
            pool.Initialize();
            cache = new MemcachedClient();
            // 是否启用压缩数据：如果启用了压缩，数据压缩长于门槛的数据将被储存在压缩的形式
            cache.EnableCompression = false;
            // 压缩设置，超过指定大小的都压缩
            cache.CompressionThreshold = 1024 * 1024;
        }
    }

    class Program
    {
        static void Main(string[] args)
        {
            // 存入key为userName，value为Bobby的一个缓存
            new AMemcached("poolName").cache.Add("b", 123);
            // AMemcached.cache.Add("userName", "Bobby");
            // 读出key为a的缓存值
            var s = new AMemcached("poolName").cache.Get("userName");
            // 输出
            Console.WriteLine(s);
            Console.Read();

        }
    }
}
```

### 说说 memcached 的故障转移处理

```csharp
// 设置 SocketIO 池的故障标志
pool.Failover = true;
```

> Note：memcached 的故障转移是一套正常节点发生故障变为死节点时的处理机制。
>
> - 开启故障转移：如果发生 socket 异常，则该节点被添加到存放死节点属性的 hostDead 中，新请求被映射到 dead server，检测尝试连接死节点的时间间隔属性 hostDeadDuration（默认设置为 100ms），如果没有达到设定的间隔时间则 key 会被映射到可用的 server 处理，如果达到了时间间隔，则尝试重新链接，连接成功将此节点从 hostDead 中去除，连接失败则间隔时间翻倍存放，下次重新连接时间会被拉长。
> - 不开启故障转移：新的请求都会被映射到 dead server 上，尝试重新建立 socket 链接，如果连接失败，返回 null 或者操作失败。

### 说说 key-value 中的 key 与 value

- key 在服务端的长度限制为 250 个字符，建议使用较短的 key 但不要重复。
- value 的大小限制为 1mb，如果大拉，可以使用压缩，如果还大，那可能拆分到多个 key 中。

## Memcached 客户端使用封装

### 抽象出来了一个接口

```csharp
using System;

namespace Tdf.Memcached
{
    public interface IMemcached
    {
        void Add(string key, object value);
        void Add(string key, object value, DateTime expiredDateTime);
        void Update(string key, object value);
        void Update(string key, object value, DateTime expiredDateTime);
        void Set(string key, object value);
        void Set(string key, object value, DateTime expiredTime);
        void Delete(string key);
        object Get(string key);
        bool KeyExists(string key);
    }
}
```

### MemcacheHelper.cs

```csharp
using Memcached.ClientLibrary;
using System;
using System.Configuration;

namespace Tdf.Memcached
{
    /// <summary>
    /// 基于Memcached.ClientLibrary 封装使用 Memcached 信息
    /// 读取缓存存放在服务器
    /// </summary>
    public class MemcacheHelper
    {
        /// <summary>
        /// 字段_instance,存放注册的缓存信息
        /// </summary>
        private static MemcacheHelper _instance;

        /// <summary>
        /// 缓存客户端
        /// </summary>
        private readonly MemcachedClient _client;

        /// <summary>
        /// 受保护类型的缓存对象，初始化一个新的缓存对象
        /// </summary>
        protected MemcacheHelper()
        {
            // 读取app.Config中需要缓存的服务器地址信息，可以传递多个地址，使用";"分隔
            string[] serverList = ConfigurationManager.AppSettings["readWriteHosts"].Split(new char[] { ';' });

            try
            {
                // 初始化池
                var sockIoPool = SockIOPool.GetInstance();
                // 设置服务器列表
                sockIoPool.SetServers(serverList);
                // 各服务器之间负载均衡的设置比例
                sockIoPool.SetWeights(new int[] { 1 });
                // 初始化时创建连接数
                sockIoPool.InitConnections = 3;
                // 最小连接数
                sockIoPool.MinConnections = 3;
                // 最大连接数
                sockIoPool.MaxConnections = 5;
                // 连接的最大空闲时间，下面设置为6个小时（单位ms），超过这个设置时间，连接会被释放掉
                sockIoPool.MaxIdle = 1000 * 60 * 60 * 6;
                // socket连接的超时时间，下面设置表示不超时（单位ms），即一直保持链接状态
                sockIoPool.SocketConnectTimeout = 0;
                // 通讯的超时时间，下面设置为3秒（单位ms）,.Net版本没有实现
                sockIoPool.SocketTimeout = 1000 * 3;
                // 维护线程的间隔激活时间，下面设置为30秒（单位s），设置为0时表示不启用维护线程
                sockIoPool.MaintenanceSleep = 30;
                // 设置SocktIO池的故障标志
                sockIoPool.Failover = true;
                // 是否对TCP/IP通讯使用nalgle算法，.net版本没有实现
                sockIoPool.Nagle = false;
                // socket单次任务的最大时间（单位ms），超过这个时间socket会被强行中端掉，当前任务失败。
                sockIoPool.MaxBusy = 1000 * 10;
                sockIoPool.Initialize();
                // 实例化缓存对象
                _client = new MemcachedClient();
                // 是否启用压缩数据：如果启用了压缩，数据压缩长于门槛的数据将被储存在压缩的形式
                _client.EnableCompression = false;
                // 压缩设置，超过指定大小的都压缩
                _client.CompressionThreshold = 1024 * 1024;
            }
            catch (Exception ex)
            {
                // 错误信息写入事务日志
                throw new Exception(ex.Message);
            }
        }

        /// <summary>
        /// 获取缓存的实例对象，方法调用的时候使用
        /// </summary>
        /// <returns></returns>
        public static MemcacheHelper GetInstance()
        {
            return _instance;
        }

        /// <summary>
        /// 添加缓存信息(如果存在缓存信息则直接重写设置，否则添加)
        /// 使用：MemcacheHelper.GetInstance().Add(key,value)
        /// </summary>
        /// <param name="key">需要缓存的键</param>
        /// <param name="value">需要缓存的值</param>
        public void Add(string key, object value)
        {
            if (_client.KeyExists(key))
            {
                _client.Set(key, value);
            }
            _client.Add(key, value);
        }

        /// <summary>
        /// 添加缓存信息
        /// 使用：MemcacheHelper.GetInstance().Add(key,value,Datetime.Now())
        /// </summary>
        /// <param name="key">需要缓存的键</param>
        /// <param name="value">需要缓存的值</param>
        /// <param name="expiredDateTime">设置的缓存的过时时间</param>
        public void Add(string key, object value, DateTime expiredDateTime)
        {
            _client.Add(key, value, expiredDateTime);
        }

        /// <summary>
        /// 修改缓存的值
        /// 使用：MemcacheHelper.GetInstance().Update(key,value)
        /// </summary>
        /// <param name="key">需要修改的键</param>
        /// <param name="value">需要修改的值</param>
        public void Update(string key, object value)
        {
            _client.Replace(key, value);
        }

        /// <summary>
        /// 修改缓存的值
        /// 使用：MemcacheHelper.GetInstance().Update(key,value,Datetime.Now())
        /// </summary>
        /// <param name="key">需要修改的键</param>
        /// <param name="value">需要修改的值</param>
        /// <param name="expiredDateTime">设置的缓存的过时时间</param>
        public void Update(string key, object value, DateTime expiredDateTime)
        {
            _client.Replace(key, value, expiredDateTime);
        }

        /// <summary>
        /// 设置缓存
        /// 使用：MemcacheHelper.GetInstance().Set(key,value)
        /// </summary>
        /// <param name="key">设置缓存的键</param>
        /// <param name="value">设置缓存的值</param>
        public void Set(string key, object value)
        {
            _client.Set(key, value);
        }

        /// <summary>
        /// 设置缓存，并修改过期时间
        /// 使用：MemcacheHelper.GetInstance().Set(key,value,Datetime.Now())
        /// </summary>
        /// <param name="key">设置缓存的键</param>
        /// <param name="value">设置缓存的值</param>
        /// <param name="expiredTime">设置缓存过期的时间</param>
        public void Set(string key, object value, DateTime expiredTime)
        {
            _client.Set(key, value, expiredTime);
        }

        /// <summary>
        /// 删除缓存
        /// 使用：MemcacheHelper.GetInstance().Delete(key)
        /// </summary>
        /// <param name="key">需要删除的缓存的键</param>
        public void Delete(string key)
        {
            _client.Delete(key);
        }

        /// <summary>
        /// 获取缓存的值
        /// 使用：MemcacheHelper.GetInstance().Get(key)
        /// </summary>
        /// <param name="key">传递缓存中的键</param>
        /// <returns>返回缓存在缓存中的信息</returns>
        public object Get(string key)
        {
            return _client.Get(key);
        }

        /// <summary>
        /// 缓存是否存在
        /// 使用：MemcacheHelper.GetInstance().KeyExists(key)
        /// </summary>
        /// <param name="key">传递缓存中的键</param>
        /// <returns>如果为true，则表示存在此缓存，否则比表示不存在</returns>
        public bool KeyExists(string key)
        {
            return _client.KeyExists(key);
        }

        /// <summary>
        /// 注册Memcache缓存(在Global.asax的Application_Start方法中注册)
        /// 使用：MemcacheHelper.RegisterMemcache();
        /// </summary>
        public static void RegisterMemcache()
        {
            if (_instance == null)
            {
                _instance = new MemcacheHelper();
            }
        }
    }
}
```

## App.config

```csharp
<?xml version="1.0" encoding="utf-8"?>
<configuration>
    <startup>
        <supportedRuntime version="v4.0" sku=".NETFramework,Version=v4.5.2" />
    </startup>
    <appSettings>
      <add key="readWriteHosts" value="127.0.0.1:11211" />
    </appSettings>
  <runtime>
    <assemblyBinding xmlns="urn:schemas-microsoft-com:asm.v1">
      <dependentAssembly>
        <assemblyIdentity name="IcSharpCode.SharpZipLib" publicKeyToken="1b03e6acf1164f73" culture="neutral" />
        <bindingRedirect oldVersion="0.0.0.0-0.84.0.0" newVersion="0.84.0.0" />
      </dependentAssembly>
    </assemblyBinding>
  </runtime>
</configuration>
```

### Program.cs

```csharp
using System;
using Tdf.Memcached;

namespace Tdf.MemcachedTest
{
    class Program
    {
        static void Main(string[] args)
        {
            // 注册Memcache缓存
            MemcacheHelper.RegisterMemcache();

            // 添加缓存信息(如果存在缓存信息则直接重写设置，否则添加)
            MemcacheHelper.GetInstance().Add("userName", "Bobby");

            // 缓存是否存在
            var tf = MemcacheHelper.GetInstance().KeyExists("userName");
            Console.WriteLine(tf);

            // 获取缓存的值
            var s = MemcacheHelper.GetInstance().Get("userName");
            Console.WriteLine(s);
            Console.Read();

        }
    }
}
```

到此，我们已经完成了一个最小化的 memcached 集群读写测试 Demo。但是，在实际的开发场景中，远不仅仅是存储一个字符串，更多的是存储一个自定义的类的实例对象。这就需要使用到序列化，下面我们来新加一个类 Claim，让其作为可序列化的对象来存储进 Memcached 中。注意：**需要为该类加上 [Serializable] 的特性**！

```csharp
using System;
using Tdf.Memcached;

namespace Tdf.MemcachedTest
{
    [Serializable]
    public class Claim
    {
        public int UserId { get; set; }
        public string UserName { get; set; }
    }

    class Program
    {
        static void Main(string[] args)
        {
            // 注册Memcache缓存
            MemcacheHelper.RegisterMemcache();

            // 自定义对象存储
            Claim claim = new Claim();
            claim.UserId = 694802856;
            claim.UserName = "难念的经";

            MemcacheHelper.GetInstance().Add("Claim", claim);

            Claim newMyObj = MemcacheHelper.GetInstance().Get("Claim") as Claim;
            Console.WriteLine("Hello,My UserId is {0} and UserName is {1}", newMyObj.UserId, newMyObj.UserName);

            Console.Read();

        }
    }
}
```

![img](http://upload-images.jianshu.io/upload_images/1845730-0934f0d56246f898.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
