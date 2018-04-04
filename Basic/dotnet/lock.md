# lock

首先先上官方 Msdn 的说法

> lock 关键字可确保当一个线程位于代码的临界区时，另一个线程不会进入该临界区。 如果其他线程尝试进入锁定的代码，则它将一直等待（即被阻止），直到该对象被释放。 lock 关键字在块的开始处调用 Enter，而在块的结尾处调用 Exit。 ThreadInterruptedException 引发，如果 Interrupt 中断等待输入 lock 语句的线程。通常，应避免锁定 public 类型，否则实例将超出代码的控制范围。
>
> 常见的结构 lock (this)、lock (typeof (MyType)) 和 lock ("myLock") 违反此准则：如果实例可以被公共访问，将出现 lock (this) 问题。如果 MyType 可以被公共访问，将出现 lock (typeof (MyType)) 问题。由于进程中使用同一字符串的任何其他代码都将共享同一个锁，所以出现 lock("myLock") 问题。最佳做法是定义 private 对象来锁定, 或 private static 对象变量来保护所有实例所共有的数据。在 lock 语句的正文不能使用 等待 关键字。

Enter 指的是 Monitor.Enter(获取指定对象上的排他锁。)，Exit 指的是 Monitor.Exit(释放指定对象上的排他锁。)

有上面 msdn 的解释及 Exit 方法，可以这样猜测“直到该对象被释放”，”该对象“应该是指锁的对象，对象释放了或者对象改变了，其他的线程才可以进入代码临界区（是不是可以这样来理解？）。

在多线程中，每个线程都有自己的资源，但是代码区是共享的，即每个线程都可以执行相同的函数。这可能带来的问题就是几个线程同时执行一个函数，导致数据的混乱，产生不可预料的结果，因此我们必须避免这种情况的发生。

打个比方，有这样一个情景，很多公司所在的大厦的厕所的蹲位都是小单间型的，也就是一次只能进去一个人，那么为了避免每次进去一个人，那怎么做呢？不就是一个人进去之后顺手把门锁上么？这样你在里面干啥事，外边的人也只能等待你解放完了，才能进入。而蹲位的资源（蹲位，手纸等）是共享的。

最常使用的锁是如下格式的代码段：

```csharp
private static object objlock = new object();
lock (objlock)
{
    //要执行的代码逻辑
}
```

为什么锁的对象是私有的呢？还是以厕所为例子吧，私有就好比，这把锁只有你能访问到，而且最好这把锁不会因为外力而有所改变，别人访问不到，这样才能保证你进去了，别人就进不去了，如果是公有的，就好比你蹲位小单间的锁不是安装在里面而是安装在外边的，别人想不想进就不是你所能控制的了，这样也不安全。

### lock(this)

通过字面的意思就是锁的当前实例对象。那是否对其他实例对象产生影响？那下面看一个例子：

```csharp
namespace Wolfy.LockDemo
{
    class Program
    {
        static void Main(string[] args)
        {
            Test t = new Test();
            Test t2 = new Test();
            Thread[] threads = new Thread[10];
            for (int i = 0; i < threads.Length; i++)
            {
                //通过循环创建10个线程。
                threads[i] = new Thread(() =>
                {
                    t2.Print();
                });
                //为每个线程设置一个名字
                threads[i].Name = "thread" + i;

            }
            //开启创建的十个线程
            for (int i = 0; i < threads.Length; i++)
            {
                threads[i].Start();
            }

            Console.Read();
        }
    }
    class Test
    {
        public void Print()
        {
            lock (this)
            {
                for (int i = 0; i < 5; i++)
                {
                    Console.WriteLine("\t" + Thread.CurrentThread.Name.ToString() + "\t" + i.ToString() + " ");
                }
            }
        }
    }
}
```

如果在不加锁的情况下输出如下：

![img-c](http://images.cnitblog.com/blog/511616/201501/082136069846335.png)

从上面的输出结果也可以看出，线程出现了争抢的现象，而这并不是我们想要的结果，我们想要的是，每次只有一个线程去执行 Print 方法。那我们就尝试一下 `lock(this)`

```csharp
class Test
{
    public void Print()
    {
        lock (this)
        {
            for (int i = 0; i < 5; i++)
            {
                Console.WriteLine("\t" + Thread.CurrentThread.Name.ToString() + "\t" + i.ToString() + " ");
            }
        }
    }
}
```

输出结果

![img-c](http://images.cnitblog.com/blog/511616/201501/082140575787589.png)

从输出结果，觉得大功告成了，可是现在情况又来了，在项目中的其他的地方，有同事也这样写了这样的代码，又创建了一个 Test 对象，而且他也知道使用多线程执行耗时的工作，那么就会出现类似下面的代码。

```csharp
namespace Wolfy.LockDemo
{
    class Program
    {
        static void Main(string[] args)
        {
            Test t = new Test();
            Test t2 = new Test();
            t2.Age = 20;
            Thread[] threads = new Thread[10];
            for (int i = 0; i < threads.Length; i++)
            {
                //通过循环创建10个线程。
                threads[i] = new Thread(() =>
                {
                    t.Print();
                    t2.Print();
                });
                //为每个线程设置一个名字
                threads[i].Name = "thread" + i;

            }

            //开启创建的十个线程
            for (int i = 0; i < threads.Length; i++)
            {
                threads[i].Start();
            }

            Console.Read();
        }
    }
    class Test
    {
        public int Age { get; set; }
        public void Print()
        {
            lock (this)
            {
                for (int i = 0; i < 5; i++)
                {
                    Console.WriteLine("\t" + Thread.CurrentThread.Name.ToString() + "\t" + i.ToString() + " ");
                }
            }
        }
    }
}
```

这里为 Test 加了一个 Age 属性，为了区别当前创建的对象不是同一个对象。

输出的结果为

![img-c](http://images.cnitblog.com/blog/511616/201501/082156037965301.png)

在输出的结果中已经出现了线程抢占执行的情况了，而不是一个线程执行完另一个线程在执行。

### lock(private obj)

那么我们现在使用一个全局的私有的对象试一试。

```csharp
namespace Wolfy.LockDemo
{
    class Program
    {
        private static object objLock = new object();
        static void Main(string[] args)
        {
            Test t = new Test();
            Test t2 = new Test();
            t2.Age = 20;
            Thread[] threads = new Thread[10];
            for (int i = 0; i < threads.Length; i++)
            {
                //通过循环创建10个线程。
                threads[i] = new Thread(() =>
                {
                    lock (objLock)
                    {
                        t.Print();
                        t2.Print();
                    }
                });
                //为每个线程设置一个名字
                threads[i].Name = "thread" + i;

            }


            //开启创建的十个线程
            for (int i = 0; i < threads.Length; i++)
            {
                threads[i].Start();
            }

            Console.Read();
        }
    }
    class Test
    {
        public int Age { get; set; }
        public void Print()
        {
            for (int i = 0; i < 5; i++)
            {
                Console.WriteLine("\t" + Thread.CurrentThread.Name.ToString() + "\t" + i.ToString() + " ");
            }
        }
    }
}
```

输出的结果

![img-c](http://images.cnitblog.com/blog/511616/201501/082201353431213.png)

从输出的结果也可以看出，有序的，每次进来一个线程执行。

那通过上面的比较可以有这样的一个结论，lock 的结果好不好，还是关键看锁的谁，如果外边能对这个谁进行修改，lock 就失去了作用。所以一般情况下，使用静态的并且是只读的对象。

也就有了类似下面的代码

```csharp
private static readonly object objLock = new object();
```

你可能会说，不对啊，你下面的代码跟上面的代码不一样啊，为什么就得出这样的结论？难道就不能把 Object 放在 test 类中么，放在 test 类中的话，在 new Test()的时候，其实放在 Test 中也是可以的，只要保证 objLock 在外部是无法修改的就可以。

上面说的最多的是 lock 对象，那么它能不能 lock 值类型？

答案是否定的，如

![img-c](http://images.cnitblog.com/blog/511616/201501/082211312504626.png)

当然 lock(null)也是不行的，如图

![img-c](http://images.cnitblog.com/blog/511616/201501/082223247964767.png)

虽然编译可以通过，但是运行就会出错。

### lock(string)

string 也是应用类型，从语法上来说是没有错的。

但是锁定字符串尤其危险，因为字符串被公共语言运行库 (CLR)“暂留”。 这意味着整个程序中任何给定字符串都只有一个实例，就是这同一个对象表示了所有运行的应用程序域的所有线程中的该文本。因此，只要在应用程序进程中的任何位置处具有相同内容的字符串上放置了锁，就将锁定应用程序中该字符串的所有实例。通常，最好避免锁定 public 类型或锁定不受应用程序控制的对象实例。例如，如果该实例可以被公开访问，则 lock(this) 可能会有问题，因为不受控制的代码也可能会锁定该对象。这可能导致死锁，即两个或更多个线程等待释放同一对象。出于同样的原因，锁定公共数据类型（相比于对象）也可能导致问题。而且 lock(this)只对当前对象有效，如果多个对象之间就达不到同步的效果。lock(typeof(Class))与锁定字符串一样，范围太广了。

### 总结

1.  lock 的是引用类型的对象，string 类型除外。
1.  ==lock 推荐的做法是使用静态的、只读的、私有的对象。==
1.  保证 lock 的对象在外部无法修改才有意义，如果 lock 的对象在外部改变了，对其他线程就会畅通无阻，失去了 lock 的意义。
