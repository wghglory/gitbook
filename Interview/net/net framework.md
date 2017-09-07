### Describe the Events in the Life Cycle of a Web Application.

A web application starts when a browser requests a page of the application first time. The request is received by the IIS which then starts ASP.NET worker process (**aspnet_wp.exe**). The worker process then allocates a process space to the assembly and loads it. An **application_start** event occurs followed by **Session_start**. The request is then processed by the ASP.NET engine and sends back response in the form of HTML. The user receives the response in the form of page.

The page can be submitted to the server for further processing. The page submitting triggers postback event that causes the browser to send the page data, also called as view state to the server. When server receives view state, it creates new instance of the web form. The data is then restored from the view state to the control of the web form in Page_Init event.

The data in the control is then available in the Page_load event of the web form. The cached event is then handled and finally the event that caused the postback is processed. The web form is then destroyed. When the user stops using the application, Session_end event occurs and session ends. The default session time is 20 minutes. The application ends when no user accessing the application and this triggers Application_End event. Finally all the resources of the application are reclaimed by the Garbage collector.

### What is connection pooling and how to enable and disable connection pooling?

Connection pool is created when we open connection first time. When a new connection is created with same connection string as the first one, it reuses the same and existing connection object from the pool without creating a new one.

If the connection string is different then a new connection pooling will be created, thus won't use the existing connection object.

By default, we have connection pooling enabled in .Net. To disable connection pooling, set `Pooling = false` in the connection string.

### 单例模式

资源共享的情况下，避免由于资源操作时导致的性能或损耗等。
控制资源的情况下，方便资源之间的互相通信。如线程池等。

1. Windows的Task Manager（任务管理器）
2. windows的Recycle Bin（回收站）也是典型的单例应用。在整个系统运行过程中，回收站一直维护着仅有的一个实例。
3. 网站的计数器，一般也是采用单例模式实现，否则难以同步。
4. 应用程序的日志应用，一般都何用单例模式实现，这一般是由于共享的日志文件一直处于打开状态，因为只能有一个实例去操作，否则内容不好追加。
5. Web应用的配置对象的读取，一般也应用单例模式，这个是由于配置文件是共享的资源。
6. 数据库连接池的设计一般也是采用单例模式，因为数据库连接是一种数据库资源。数据库软件系统中使用数据库连接池，主要是节省打开或者关闭数据库连接所引起的效率损耗，这种效率上的损耗还是非常昂贵的，因为何用单例模式来维护，就可以大大降低这种损耗。
7. 多线程的线程池的设计一般也是采用单例模式，这是由于线程池要方便对池中的线程进行控制。
8. 操作系统的文件系统，也是大的单例模式实现的具体例子，一个操作系统只能有一个文件系统。
9. HttpApplication 也是单位例的典型应用。熟悉ASP.Net(IIS)的整个请求生命周期的人应该知道HttpApplication也是单例模式，所有的HttpModule都共享一个HttpApplication实例。

实现方法：
static属性里面new，构造函数private，如果是要求多线程情况，线程安全要double check

### State the differences between the *Dispose()* and *Finalize()*

CLR uses the Dispose and Finalize methods to perform garbage collection of run-time objects of .NET applications.

The **Finalize** method is called automatically by the **runtime**. CLR has a garbage collector (**GC**), which periodically checks for objects in heap that are no longer referenced by any object or program. It calls the Finalize method to free the memory used by such objects. The _Dispose_ method is called by the _programmer_. Dispose is another method to release the memory used by an object. The Dispose method needs to be explicitly called in code to dereference an object from the heap. The Dispose method can be invoked only by the classes that implement the _IDisposable_ interface.

### Differentiate between managed and unmanaged code?

_Managed code is the code that is executed directly by the CLR instead of the operating system. The code compiler first compiles the managed code to intermediate language (IL)_ code, also called as MSIL code. This code doesn't depend on machine configurations and can be executed on different machines. 

Managed code execution order:
1. Choosing a language compiler (JIT)
2. Compiling the code to MSIL
3. Compiling MSIL to native code
4. Executing the code.

_Unmanaged code is the code that is executed directly by the operating system outside the CLR environment._ It is directly compiled to native machine code which depends on the machine configuration.
In the managed code, since the execution of the code is governed by CLR, the runtime provides different services, such as garbage collection, type checking, exception handling, and security support. These services help provide uniformity in platform and language-independent behavior of managed code applications. In the unmanaged code, the allocation of memory, type safety, and security is required to be taken care of by the developer. If the unmanaged code is not properly handled, it may result in memory leak. Examples of unmanaged code are ActiveX components and Win32 APIs that execute beyond the scope of native CLR.

### Describe the roles of CLR in .NET Framework.

CLR provides an environment to execute .NET applications on target machines. CLR is also a common runtime environment for all .NET code irrespective of their programming language, as the compilers of respective language in .NET Framework convert every source code into a common language known as MSIL or IL (Intermediate Language). CLR also provides various services to execute processes, such as memory management service and security services. CLR performs various tasks to manage the execution process of .NET applications.

The responsibilities of CLR are listed as follows:

* Automatic memory management
* Garbage Collection
* Code Access Security
* Code verification
* JIT compilation of .NET code

### Explain covariance(协变) and contra-variance(逆变) in .NET Framework 4.0. Give an example for each.
In .NET 4.0, the CLR supports covariance and contravariance of types in generic interfaces and delegates. Covariance enables you to cast a generic type to its base types, that is, you can assign a instance of type `IEnumerable<derived>` to a variable of type `IEnumerable<base>`. For example,

```csharp
IEnumerable<string> str1= new List<string> ();
IEnumerable<object> str2= str1;
```

Contravariance allows you to assign a variable of `Action<base>` to a variable of type `Action<derived>`. For example,

```csharp
IComparer<object> obj1 = GetComparer() 
IComparer<string> obj2 = obj1;
```

.NET framework 4.0 uses some language keywords (out and in) to annotate covariance and contra-variance. Out is used for covariance, while in is used for contra-variance.

**Variance can be applied only to reference types, generic interfaces, and generic delegates. These cannot be applied to value types and generic types.**

### httpHandler, httpModule