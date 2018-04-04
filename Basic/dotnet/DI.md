# DI 原理解析及 Castle、Unity 框架使用

控制反转（Inversion of Control）目的是解耦合

==DI 基本原理本质上是通过容器来反射创建实例==

```csharp
class Person
{
    public void Say()
    {
        Console.WriteLine("Person's say method is Called");
    }
}

// 反射代码(className:类的全限定名)
private static object CreateInstance(Assembly assembly, string className)
{
    var type = assembly.GetType(className);
    return type != null ? Activator.CreateInstance(type) : null;
}

// 执行(XX为命名空间)
static void Main(string[] args)
{
    var obj = CreateInstance(Assembly.GetExecutingAssembly(), "XX.Person");
    var person = obj as Person;
    if (person != null)
    {
        person.Say();
    }
    Console.ReadKey();
}
```

在上面能看到 1 个问题，一般情况下既然使用 DI，就不知道具体的注入对象，所以强调面向接口编程。所以实际上一般先定义接口，再通过 DI 容器创建对象。

```csharp
interface IPerson
{
    void Say();
}
class Person : IPerson
{
    public void Say()
    {
        Console.WriteLine("Person's say method is Called");
    }
}

//执行
static void Main(string[] args)
{
    var obj = CreateInstance(Assembly.GetExecutingAssembly(), "Demo.Person");
    var person = obj as IPerson;
    if (person != null)
    {
        person.Say();
    }
    Console.ReadKey();
}
```

DI 框架流行的有 Castle Windsor, Unity...(Autofac, Spring.Net)

==在 DI 框架中，一般需要将对象注册到容器中，然后从容器解析出来。==

#### Castle

`Install-Package Castle.Windsor`

```csharp
//待注入类
interface ITransient
{

}

interface IPerson
{
    void Say();
}
class Person : IPerson, ITransient
{
    public void Say()
    {
        Console.WriteLine("Person's say method is Called");
    }
}
```

```csharp
//注册解析方式一
static void Main(string[] args)
{
    using (var container = new WindsorContainer())
    {
        container.Register(Component.For<Person, IPerson>());
        var person = container.Resolve<IPerson>();
        person.Say();
    }
    Console.ReadKey();
}
```

```csharp
//注册解析方式二
public class AssmInstaller : IWindsorInstaller
{
    public void Install(IWindsorContainer container, IConfigurationStore store)
    {
        container.Register(Classes.FromThisAssembly()   //选择Assembly
            .IncludeNonPublicTypes()                    //约束Type
            .BasedOn<ITransient>()                         //约束Type
            .WithService.DefaultInterfaces()            //匹配类型
            .LifestyleTransient());                     //注册生命周期
    }
}

static void Main(string[] args)
{
    using (var container = new WindsorContainer())
    {
        container.Install(new AssmInstaller());
        var person = container.Resolve<IPerson>();
        person.Say();
    }
    Console.ReadKey();
}
```

构造函数注入

```csharp
class Task : ITransient
{
    public IPerson Person { get; set; }
    public Task(IPerson person)
    {
        Person = person;
        Person.Say();
    }
}

static void Main(string[] args)
{
    using (var container = new WindsorContainer())
    {
        container.Install(new AssmInstaller());
        container.Resolve<Task>();
    }
    Console.ReadKey();
}
```

属性注入

```csharp
class Task : ITransient
{
    public IPerson Person { get; set; }
    public Task()
    {
    }
    public void Say()
    {
        Person.Say();
    }
}

static void Main(string[] args)
{
    using (var container = new WindsorContainer())
    {
        container.Install(new AssmInstaller());
        container.Resolve<Task>().Say();
    }
    Console.ReadKey();
}
```

MVC 集成

`Install-Package Castle.Windsor.Mvc`

Application_Start 注册

```csharp
protected void Application_Start()
{
    RouteConfig.RegisterRoutes(RouteTable.Routes);
    var container = new WindsorContainer()
        .Install(FromAssembly.This());
    var controllerFactory = new WindsorControllerFactory(container.Kernel);
    ControllerBuilder.Current.SetControllerFactory(controllerFactory);
}
```

Installer 注册

```csharp
public class AssmInstaller : IWindsorInstaller
{
    public void Install(IWindsorContainer container, IConfigurationStore store)
    {
        container.Register(Classes.FromThisAssembly()
            .IncludeNonPublicTypes()
            .BasedOn<ITransient>()
            .WithService.DefaultInterfaces()
            .LifestyleTransient());
        container.Register(Classes.FromThisAssembly()
            .BasedOn<Controller>()
            .LifestyleTransient()
            );
    }
}
```

这样 Castle Windsor 就能接管解析 Controller 了

---

#### Unity

`Install-Package Unity`

待注入类

```csharp
public interface IPerson
{
    void Say();
}
public class Person : IPerson
{
    public void Say()
    {
        Console.WriteLine("Person's say method is Called");
    }
}
```

注册解析一

```csharp
static void Main(string[] args)
{
    using (var container = new UnityContainer())
    {
        container.RegisterType<IPerson, Person>(new TransientLifetimeManager());
        var person = container.Resolve<IPerson>();
        person.Say();
    }
    Console.ReadKey();
}
```

注册解析二

```csharp
static void Main(string[] args)
{
    using (var container = new UnityContainer())
    {
        container.RegisterInstance<IPerson>(new Person());
        var person = container.Resolve<IPerson>();
        person.Say();
    }
    Console.ReadKey();
}
```

构造函数注入

```csharp
class Task : ITask
{
    public IPerson Person { get; set; }
    public Task(IPerson person)
    {
        Person = person;
        Person.Say();
    }
}

public interface ITask
{

}

static void Main(string[] args)
{
    using (var container = new UnityContainer())
    {
        container.RegisterInstance<IPerson>(new Person());
        container.RegisterType<ITask, Task>();
        container.Resolve<ITask>();
    }
    Console.ReadKey();
}
```

属性注入

```csharp
class Task : ITask
{
    [Dependency]
    public IPerson Person { get; set; }
    public Task(IPerson person)
    {
        Person = person;
    }
    public void Say()
    {
        Person.Say();
    }
}

static void Main(string[] args)
{
    using (var container = new UnityContainer())
    {
        container.RegisterInstance<IPerson>(new Person());
        container.RegisterType<ITask, Task>();
        var task = container.Resolve<ITask>();
        task.Say();
    }
    Console.ReadKey();
}
```

MVC 集成

`Install-Package Unity.Mvc`

Application_Start 注册

```csharp
protected void Application_Start()
{
    RouteConfig.RegisterRoutes(RouteTable.Routes);
    var container = new UnityContainer();
    container.RegisterType<IPerson, Person>();
    DependencyResolver.SetResolver(new UnityDependencyResolver(container));
}
```

这样 Unity 就接管了 Controller 的创建
