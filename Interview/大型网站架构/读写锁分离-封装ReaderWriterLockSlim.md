# [读写锁分离－－封装ReaderWriterLockSlim](http://www.cnblogs.com/blqw/p/3475734.html)

> ## ReaderWriterLockSlim 类
>
> 表示用于管理资源访问的锁定状态，可实现多线程读取或进行独占式写入访问。
>
> 使用 ReaderWriterLockSlim 来保护由多个线程读取但每次只采用一个线程写入的资源。 ReaderWriterLockSlim 允许多个线程均处于读取模式，允许一个线程处于写入模式并独占锁定状态，同时还允许一个具有读取权限的线程处于可升级的读取模式，在此模式下线程无需放弃对资源的读取权限即可升级为写入模式。
>
> **注意** ReaderWriterLockSlim 类似于 ReaderWriterLock，只是简化了递归、升级和降级锁定状态的规则。 ReaderWriterLockSlim 可避免多种潜在的死锁情况。 此外，ReaderWriterLockSlim 的性能明显优于 ReaderWriterLock。 建议在所有新的开发工作中使用 ReaderWriterLockSlim。

## 主要属性,方法

属性:

IsReadLockHeld 　　获取一个值，该值指示当前线程是否已进入读取模式的锁定状态。
IsWriteLockHeld	　  获取一个值，该值指示当前线程是否已进入写入模式的锁定状态。

方法:

EnterReadLock       尝试进入读取模式锁定状态。
ExitReadLock         减少读取模式的递归计数，并在生成的计数为 0（零）时退出读取模式。
EnterWriteLock      尝试进入写入模式锁定状态。
ExitWriteLock        减少写入模式的递归计数，并在生成的计数为 0（零）时退出写入模式。

当然还有其他很多方法,比如[EnterUpgradeableReadLock](http://msdn.microsoft.com/zh-cn/library/vstudio/system.threading.readerwriterlockslim.enterupgradeablereadlock(v=vs.100).aspx)进入可以升级到写入模式的读取模式..

## 应用

来对比一个老式的lock写法

```Csharp
private object _Lock = new object();

private void Read()
{
    lock (_Lock)
    {
        //具体方法实现
    }
}
```

**读写锁分离**

```Csharp
private ReaderWriterLockSlim _LockSlim = new ReaderWriterLockSlim();

private void Read()
{
    try
    {
        _LockSlim.EnterReadLock();
        //具体方法实现
    }
    finally
    {
        _LockSlim.ExitReadLock();
    }
}

private void Write()
{
    try
    {
        _LockSlim.EnterWriteLock();
        //具体方法实现
    }
    finally
    {
        _LockSlim.ExitWriteLock();
    }
}
```

看上下2种写法:

从性能的角度来说,肯定是读写锁分离更好了，特别是大多数场合(读取操作远远多余写入操作)

从可读性和代码美观度来说，就是上面的lock要简洁的多了，维护起来也更清晰

所以我希望重新封装ReaderWriterLockSlim，当然我第一想到的就是利用using语法糖的特性封装一个新的对象

## 封装

**Code平台: UsingLock**

**由于是利用的using的语法,所以我直接取名叫UsingLock，简单好记**

```csharp
using System;
using System.Threading;

namespace blqw
{

    /// <summary> 使用using代替lock操作的对象,可指定写入和读取锁定模式
    /// </summary>
    public class UsingLock<T>
    {
        #region 内部类

        /// <summary> 利用IDisposable的using语法糖方便的释放锁定操作
        /// <para>内部类</para>
        /// </summary>
        private struct Lock : IDisposable
        {
            /// <summary> 读写锁对象
            /// </summary>
            private ReaderWriterLockSlim _Lock;
            /// <summary> 是否为写入模式
            /// </summary>
            private bool _IsWrite;
            /// <summary> 利用IDisposable的using语法糖方便的释放锁定操作
            /// <para>构造函数</para>
            /// </summary>
            /// <param name="rwl">读写锁</param>
            /// <param name="isWrite">写入模式为true,读取模式为false</param>
            public Lock(ReaderWriterLockSlim rwl, bool isWrite)
            {
                _Lock = rwl;
                _IsWrite = isWrite;
            }
            /// <summary> 释放对象时退出指定锁定模式
            /// </summary>
            public void Dispose()
            {
                if (_IsWrite)
                {
                    if (_Lock.IsWriteLockHeld)
                    {
                        _Lock.ExitWriteLock();
                    }
                }
                else
                {
                    if (_Lock.IsReadLockHeld)
                    {
                        _Lock.ExitReadLock();
                    }
                }
            }
        }

        /// <summary> 空的可释放对象,免去了调用时需要判断是否为null的问题
        /// <para>内部类</para>
        /// </summary>
        private class Disposable : IDisposable
        {
            /// <summary> 空的可释放对象
            /// </summary>
            public static readonly Disposable Empty = new Disposable();
            /// <summary> 空的释放方法
            /// </summary>
            public void Dispose() { }
        }

        #endregion

        /// <summary> 读写锁
        /// </summary>
        private ReaderWriterLockSlim _LockSlim = new ReaderWriterLockSlim();

        /// <summary> 保存数据
        /// </summary>
        private T _Data;

        /// <summary> 使用using代替lock操作的对象,可指定写入和读取锁定模式
        /// <para>构造函数</para>
        /// </summary>
        public UsingLock()
        {
            Enabled = true;
        }

        /// <summary> 使用using代替lock操作的对象,可指定写入和读取锁定模式
        /// <para>构造函数</para>
        /// <param name="data">为Data属性设置初始值</param>
        public UsingLock(T data)
        {
            Enabled = true;
            _Data = data;
        }

        /// <summary> 获取或设置当前对象中保存数据的值
        /// </summary>
        /// <exception cref="MemberAccessException">获取数据时未进入读取或写入锁定模式</exception>
        /// <exception cref="MemberAccessException">设置数据时未进入写入锁定模式</exception>
        public T Data
        {
            get
            {
                if (_LockSlim.IsReadLockHeld || _LockSlim.IsWriteLockHeld)
                {
                    return _Data;
                }
                throw new MemberAccessException("请先进入读取或写入锁定模式再进行操作");
            }
            set
            {
                if (_LockSlim.IsWriteLockHeld == false)
                {
                    throw new MemberAccessException("只有写入模式中才能改变Data的值");
                }
                _Data = value;
            }
        }

        /// <summary> 是否启用,当该值为false时,Read()和Write()方法将返回 Disposable.Empty
        /// </summary>
        public bool Enabled { get; set; }

        /// <summary> 进入读取锁定模式,该模式下允许多个读操作同时进行
        /// <para>退出读锁请将返回对象释放,建议使用using语块</para>
        /// <para>Enabled为false时,返回Disposable.Empty;</para>
        /// <para>在读取或写入锁定模式下重复执行,返回Disposable.Empty;</para>
        /// </summary>
        public IDisposable Read()
        {
            if (Enabled == false || _LockSlim.IsReadLockHeld || _LockSlim.IsWriteLockHeld)
            {
                return Disposable.Empty;
            }
            else
            {
                _LockSlim.EnterReadLock();
                return new Lock(_LockSlim, false);
            }
        }

        /// <summary> 进入写入锁定模式,该模式下只允许同时执行一个读操作
        /// <para>退出读锁请将返回对象释放,建议使用using语块</para>
        /// <para>Enabled为false时,返回Disposable.Empty;</para>
        /// <para>在写入锁定模式下重复执行,返回Disposable.Empty;</para>
        /// </summary>
        /// <exception cref="NotImplementedException">读取模式下不能进入写入锁定状态</exception>
        public IDisposable Write()
        {
            if (Enabled == false || _LockSlim.IsWriteLockHeld)
            {
                return Disposable.Empty;
            }
            else if (_LockSlim.IsReadLockHeld)
            {
                throw new NotImplementedException("读取模式下不能进入写入锁定状态");
            }
            else
            {
                _LockSlim.EnterWriteLock();
                return new Lock(_LockSlim, true);
            }
        }
    }
}
```

方法:

Read()     进入读取锁定模式

Write()    进入写入锁定模式

属性：

Data        UsingLock中可以保存一个数据，由当前线程中的环境判断是否可以读取或设置该对象

Enabled   是否启用当前组件..这个有妙用，下面介绍

## 使用场合

```csharp
/// <summary> 假设有这样一个队列系统
/// </summary>
class MyQueue:IEnumerable<string>
{
    List<string> _List;
    UsingLock<object> _Lock;
    public MyQueue(IEnumerable<string> strings)
    {
        _List = new List<string>(strings);
        _Lock = new UsingLock<object>();
    }

    /// <summary> 获取第一个元素.并且从集合中删除
    /// </summary>
    public string LootFirst()
    {
        using (_Lock.Write())
        {
            if (_List.Count == 0)
            {
                _Lock.Enabled = false;
                return null;
            }
            var s = _List[0];
            _List.RemoveAt(0);
            return s;
        }
    }

    public int Count { get { return _List.Count; } }
            
    /// <summary> 枚举当前集合的元素
    /// </summary>
    public IEnumerator<string> GetEnumerator()
    {
        using (_Lock.Read())
        {
            foreach (var item in _List)
            {
                yield return item;
            }
        }
    }

    System.Collections.IEnumerator System.Collections.IEnumerable.GetEnumerator()
    {
        return GetEnumerator();
    }
}
```

我这里假设了一个队列系统，把最容易出现问题的修改集合和枚举集合2个操作公开出来，方便在多线程中测试效果

以下为测试代码:

```
static void Main(string[] args)
{
    //建立一个字符串集合,总数为1000
    List<string> list = new List<string>(1000);
    for (int i = 0; i < list.Capacity; i++)
    {
        list.Add("字符串:" + i);
    }

    MyQueue mq = new MyQueue(list);
    //保存最后一个值,等下用于做比较
    string last = list[list.Count - 1];
    //开启1000个线程,同时执行LootFirst方法,并打印出结果
    for (int i = 0; i < list.Capacity; i++)
    {
        ThreadPool.QueueUserWorkItem(o =>
        {
            Console.WriteLine(mq.LootFirst());
        });
    }
    //在主线程中不停调用mq的遍历方法,这样的操作是很容易出现线程争抢资源的,如果没有锁定访问机制,就会出现异常
    while (mq.Count > 0)
    {
        foreach (var item in mq)
        {
            //如果最后一个值还在,就输出 "还在"
            if (item == last)
            {
                Console.WriteLine("还在");
            }
        }
    }
}
```

测试结果

Release模式下也是很轻松就跑完了,证明访问的同步控制部分是可以正常工作的

![img-c](http://images.cnitblog.com/blog/349367/201312/15210117-2a15516bd7964e35a7a254b1d39d86dd.jpg)

## 使用详细说明

语法上是不是跟lock比较类似了?Enabled属性的作用在这里就可见一斑了

![img-c500](http://images.cnitblog.com/blog/349367/201312/15210531-fe276066992847f89c0c1e51d7c7b12d.jpg)

![img-c500](http://images.cnitblog.com/blog/349367/201312/15210539-47f814dd091e49748f5984caba975fad.jpg)

这部分比较简单,就不多说了.....

## 对比无lock

当然写完可以用,还需要和原始的方式比较一下,不然不知道优劣

对比无lock模式

![img-c](http://images.cnitblog.com/blog/349367/201312/15210806-49e44e32a56f48d4a89bcfb02261e632.jpg)

将using代码注释,果然出现了异常

## 对比原始单一lock

对比原始lock模式,这次需要加上时间

UsingLock VS 单一lock

![img-c](http://images.cnitblog.com/blog/349367/201312/15211232-59f454e3e3c741f682e87b83dc0ff220.jpg)

---

![img-c](http://images.cnitblog.com/blog/349367/201312/15211313-2515bc98f48241749430f76a78bfe9d2.jpg)

##  Code平台下载

https://code.csdn.net/snippets/112634

