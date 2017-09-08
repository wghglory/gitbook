# .net interview

### 冒泡排序

```csharp
for (int i = 0; i < data.Length; i++) {
    for (int j = 0; j < data.Length - i - 1; j++) {
        if (data[j] > data[j + 1]) {
            int temp = data[j];
            data[j] = data[j + 1];
            data[j + 1] = temp;
        }
    }
}
```

### StringBuilder vs string

```csharp
string joinWords(string[] words) 
{ 
    string sentence ="";
    foreach (string w in words) 
    {
        sentence += w;
    }
    return sentence; 
}
```

On each concatenation, a new copy of the string is created, and the two strings are copied over, character by character. The first iteration requires us to copy x characters. The second iteration requires copying 2x characters. The third iteration requires 3x, and so on. The total time is O(x + 2x + ... + nx) => O(n^2).

StringBuilder simply **creates a resizable array of all the strings, copying them back to a string** only when necessary. **O(n)**

```csharp
using System.Text;
string joinWords(string[] words) 
{ 
    StringBuilder sentence = new StringBuilder(); 
    foreach (string w in words) 
    {
        sentence.append(w);
    }
    return sentence.toString(); 
}
```



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
9. HttpApplication 也是单例的典型应用。熟悉ASP.Net(IIS)的整个请求生命周期的人应该知道HttpApplication也是单例模式，所有的HttpModule都共享一个HttpApplication实例。

实现方法：

static属性里面new，构造函数private，如果是要求多线程情况，线程安全要double check

#### 实现

> 1.将该类的构造方法定义为私有方法，这样其他处的代码就无法通过调用该类的构造方法来实例化该类的对象，只有通过该类提供的静态方法来得到该类的唯一实例；
> 2.在该类内提供一个静态方法，当我们调用这个方法时，如果类持有的引用不为空就返回这个引用，如果类保持的引用为空就创建该类的实例并将实例的引用赋予该类保持的引用。

#### 饿汉式

- **静态常量(经典写法)**

  ```csharp
  public class Singleton
  {
      private static Singleton _instance = new Singleton();
      private Singleton() { }

      public static Singleton Instance()
      {
          return _instance;
      }
  }
  ```

  * 适用：单/多线程
  * 模式：饿汉式（静态常量）[可用]
  * 优点：写法比较简单，避免了线程同步问题
  * 缺点：没能实现延迟加载

- **静态代码块**

  ```Csharp
  public class Singleton2
  {
      private static Singleton2 _instance;

      static Singleton2()
      {
          _instance = new Singleton2();
      }

      private Singleton2(){}

      public Singleton2 Instance()
      {
          return _instance;
      }
  }
  ```

  * 适用：单/多线程
  * 模式：饿汉式（静态代码块）[可用]
  * 优点：写法比较简单，避免了线程同步问题
  * 缺点：没能实现延迟加载

#### 懒汉式

- **线程不安全**

  ```Csharp
  public class Singleton3
  {
      private static Singleton3 _instance;

      private Singleton3() { }

      public static Singleton3 Instance()
      {
          return _instance ?? (_instance = new Singleton3());
      }
  }
  ```

  * 适用：单线程
  * 模式：懒汉式(线程不安全)[不可用]
  * 优点：适用于单线程，实现简单，延迟加载
  * 缺点：多线程不安全，违背了单列模式的原则

- **线程安全**

  ```Csharp
  public class Singleton4
  {
      private static Singleton4 _instance;
      private static readonly object SyncObject = new object();

      private Singleton4() { }

      public static Singleton4 Instance()
      {
          lock (SyncObject)
          {
              if (_instance == null)
              {
                  _instance = new Singleton4();
              }
          }
          return _instance;
      }
  }
  ```

  适用：单线程

  模式：懒汉式(线程安全)[不推荐]

  优点：线程安全；延迟加载；
  
  缺点：这种实现方式增加了额外的开销，损失了性能(当有多个调用时，第一个调用的会进入lock，而其他的则等待第一个结束后才能调用，后面的依次访问、等待……)

- **双重检查锁定**

  ```Csharp
  public class Singleton5
  {
      private static Singleton5 _instance;
      private static readonly object SyncObject = new object();

      private Singleton5() { }

      public static Singleton5 Instance()
      {
          if (_instance==null)
          {
              lock (SyncObject)
              {
                  if (_instance == null)
                  {
                      _instance = new Singleton5();
                  }
              }
          }
          return _instance;
      }
  }
  ```

  适用：单/多线程

  模式：双重检查锁定(Double-Check Locking)(线程安全)[推荐]

  优点：线程安全；延迟加载；效率较高(只会实例化一次，首先会判断是否实例化过，如果实例化了，直接返回实例，不需要进入lock；如果未实例化，进入lock，就算是多个调用也无妨，第一次调用的会实例化，第二个进入lock时会再次判断是否实例化，这样线程就不会阻塞了。)

  缺点：基本没有

- **静态内部类**

  ```Csharp
  public class Singleton6
  {
      private Singleton6() { }

      private static class SingletonInstance
      {
          public static Singleton6 Instance = new Singleton6();
      }

      public static Singleton6 Instance()
      {
          return SingletonInstance.Instance;
      }
  }
  ```

  适用：单/多线程

  模式：静态内部类(线程安全)[推荐]

  优点：避免了线程不安全；延迟加载；效率高(这种方式跟饿汉式方式采用的机制类似：都是采用了类装载的机制来保证初始化实例时只有一个线程。不同的地方是：饿汉式只要Singleton类被装载就会实例化，没有Lazy-Loading的作用；而静态内部类方式在Singleton类被装载时并不会立即实例化，而是在需要实例化时，调用Instance方法，才会装载SingletonInstance类，从而完成Singleton的实例化。)

  缺点：基本没有


