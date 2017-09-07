# [文件并发(日志处理)--队列--Redis+Log4Net](http://www.cnblogs.com/jiekzou/p/4403561.html)

> 多线程操作同一个文件时会出现并发问题。解决的一个办法就是给文件加锁(lock)，但是这样的话，一个线程操作文件时，其它的都得等待，这样的话性能非常差。另外一个解决方案，就是先将数据放在队列中，然后开启一个线程，负责从队列中取出数据，再写到文件中。

在这之前，有必要先了解下Redis，关于Redis的介绍可以参考我的这篇博文：[ASP.NET Redis 开发](http://www.cnblogs.com/jiekzou/p/4487356.html)

Redis工具和所需资料代码全下载，地址：[http://pan.baidu.com/s/155F6A](http://pan.baidu.com/s/155F6A)

下面我们讲解一个实际项目中应用的案例，关于日志的处理.这里是使用ASP.NET MVC项目作为Demo。

## 方式一：使用队列

思路：把所有产生的日志信息存放到一个队列里面，然后通过新建一个线程，不断的从这个队列里面读取异常信息，然后往日志里面写。也就是所谓的生产者、消费者模式。

**1. 新建一个类MyErrorAttribute**

```csharp
using System.Web.Mvc;
public class MyErrorAttribute: HandleErrorAttribute {
    public static Queue <Exception> ExceptionQueue = new Queue <Exception> ();
    public override void OnException(ExceptionContext filterContext) {
        ExceptionQueue.Enqueue(filterContext.Exception);
        filterContext.HttpContext.Response.Redirect("~/Error.html");
        base.OnException(filterContext);
    }
}
```

**2. 在FilterConfig类中进行如下修改：**

```csharp
public class FilterConfig {
    public static void RegisterGlobalFilters(GlobalFilterCollection filters){
        //filters.Add(new HandleErrorAttribute());      
        filters.Add(new MyErrorAttribute());
    }

    string filePath = Server.MapPath("~/Logs/");
    ThreadPool.QueueUserWorkItem(o => {
        while (true) {
            if (MyErrorAttribute.ExceptionQueue.Count > 0) {
                Exception ex = MyErrorAttribute.ExceptionQueue.Dequeue();
                if (ex != null) {
                    string fileName = filePath + DateTime.Now.ToString("yyyy-MM-dd") + ".txt";
                    File.AppendAllText(fileName, ex.Message);
                }
                else {
                    Thread.Sleep(50);
                }
            }
            else {
                Thread.Sleep(50);
            }
        }
    });
}
```

## 方式二：使用 Redis 与 Log4Net 完成分布式日志记录

在程序最开始加入`log4net.Config.XmlConfigurator.Configure()`

在要打印日志的地方`LogManager.GetLogger(typeof(Program)).Debug(“信息”);` 。通过LogManager.GetLogger传递要记录的日志类类名获得这个类的ILog（这样在日志文件中就能看到这条日志是哪个类输出的了），然后调用Debug方法输出消息。因为一个类内部不止一个地方要打印日志，所以一般把ILog声明为一个static字段。

`Private static ILog logger = LogManager.GetLogger(typeof(Test))`

输出错误信息用ILog.Error方法，第二个参数可以传递Exception对象。log.Error("错误"+ex)，log.Error("错误",ex)

- Appender：可以将日志输出到不同的地方，不同的输出目标对应不同的Appender：RollingFileAppender（滚动文件）、AdoNetAppender（数据库）、SmtpAppender （邮件）等。
- level（级别）：标识这条日志信息的重要级别None>Fatal>ERROR>WARN>DEBUG>INFO>ALL，设定一个Level，那么低于这个Level的日志是不会被写到Appender中的.

Log4Net还可以设定多个Appender，可以实现同时将日志记录到文件、数据、发送邮件等；可以设定不同的Appender的不同的Level，可以实现普通级别都记录到文件，Error以上级别发送邮件；可以实现对不同的类设定不同的Appender；还可以自定义Appender，这样可以自己实现将Error信息发短信等.



1. 配置Log4Net，在Web.config中添加如下配置：

    ```xml
    <configSections>  
        <!-- For more information on Entity Framework configuration, visit http://go.microsoft.com/fwlink/?LinkID=237468 -->  
        <section name="entityFramework" type="System.Data.Entity.Internal.ConfigFile.EntityFrameworkSection, EntityFramework, Version=5.0.0.0,   
    Culture=neutral, PublicKeyToken=b77a5c561934e089" requirePermission="false" />  
        <section name="log4net" type="log4net.Config.Log4NetConfigurationSectionHandler, log4net"/>  
    </configSections>  
    <log4net>  
        <!-- OFF, FATAL, ERROR, WARN, INFO, DEBUG, ALL -->  
        <!-- Set root logger level to ERROR and its appenders -->  
        <root>  
          <level value="ALL"/>  
          <appender-ref ref="SysAppender"/>  
        </root>  
        <!-- Print only messages of level DEBUG or above in the packages -->  
        <logger name="WebLogger">  
          <level value="DEBUG"/>  
        </logger>  
        <appender name="SysAppender" type="log4net.Appender.RollingFileAppender,log4net" >  
          <param name="File" value="App_Data/" />  
          <param name="AppendToFile" value="true" />  
          <param name="RollingStyle" value="Date" />  
          <param name="DatePattern" value=""Logs_"yyyyMMdd".txt"" />  
          <param name="StaticLogFileName" value="false" />  
          <layout type="log4net.Layout.PatternLayout,log4net">  
            <param name="ConversionPattern" value="%d [%t] %-5p %c - %m%n" />  
            <param name="Header" value="----------------------header--------------------------" />  
            <param name="Footer" value="----------------------footer--------------------------" />  
          </layout>  
        </appender>  
        <appender name="consoleApp" type="log4net.Appender.ConsoleAppender,log4net">  
          <layout type="log4net.Layout.PatternLayout,log4net">  
            <param name="ConversionPattern" value="%d [%t] %-5p %c - %m%n" />  
          </layout>  
        </appender>  
    </log4net>  
    ```

1. ServiceStack.dll、ServiceStack.Interfaces.dll、ServiceStack.ServiceInterface.dll、log4net.dll的引用，然后新建一个类MyErrorAttribute

    ```cSharp
    using System.Web.Mvc;
    using ServiceStack.Redis;
    public static IRedisClientsManager clientsManager = new PooledRedisClientManager(new string[] { "127.0.0.1:6379" });
    public static IRedisClient         redisClient    = clientsManager.GetClient();
    
    public override void OnException(ExceptionContext filterContext)
    {
        redisClient.EnqueueItemOnList("errorMsg", filterContext.Exception.ToString());
        filterContext.HttpContext.Response.Redirect("~/Error.html");
        base.OnException(filterContext);
    }
    ```

1. 在FilterConfig类中进行如下修改：

    ```csharp
    public class FilterConfig
    {
        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            //filters.Add(new HandleErrorAttribute());
    
            //filters.Add(new MyErrorAttribute());
            filters.Add(new MyExceptionAttribute());
        }
    }
    ```

1. 在Gobal.asax.cs中的Application_Start事件里添加如下代码：

    ```cSharp
    log4net.Config.XmlConfigurator.Configure(); //获取Log4Net配置信息
    ThreadPool.QueueUserWorkItem(o =>
    {
        while (true)
        {
            if (MyExceptionAttribute.redisClient.GetListCount("errorMsg") > 0)
            {
                string msg = MyExceptionAttribute.redisClient.DequeueItemFromList("errorMsg");
                if (!string.IsNullOrEmpty(msg))
                {
                    ILog logger = LogManager.GetLogger("testError");
                    logger.Error(msg);               //将异常信息写入Log4Net中
                }
                else
                {
                    Thread.Sleep(50);
                }
            }
            else
            {
                Thread.Sleep(50);
            }
        }
    });
    ```





