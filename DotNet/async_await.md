# async and await

需要完善异步操作，如多线程委托写法

```csharp
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace AsyncProgramming
{
    class Program
    {
        static void Main(string[] args)
        {
            #region 同步
            //Console.WriteLine("start");
            ////模拟延迟操作
            //Thread.Sleep(3000);
            //Console.WriteLine("end");
            //Console.ReadKey();
            #endregion

            #region .net 4.0
            //Console.WriteLine("main start");   //step 1
            ////模拟延迟操作，耗时操作交给新线程
            //Thread thread = new Thread(() =>
            //{
            //    Console.WriteLine("child thread starts");  //step 3
            //    //子线程处理
            //    Thread.Sleep(3000);
            //    Console.WriteLine("child thread end");  //step 4
            //});
            //thread.Start();
            //Console.WriteLine("main end");  //step 2
            //Console.ReadKey();
            #endregion

            #region .net 4.5

            Console.WriteLine("main start... threadId: " + Thread.CurrentThread.ManagedThreadId);  //step 1
            //模拟延迟操作，耗时操作交给新线程

            Do();

            Console.WriteLine("main end... threadId: " + Thread.CurrentThread.ManagedThreadId);  //step 3
            Console.ReadKey();
            #endregion
        }

        async static void Do()
        {
            Console.WriteLine("child thread starts... threadId: " + Thread.CurrentThread.ManagedThreadId);  //step 2
            await Task.Delay(3000);  //await 要求方法必须异步方法 async
            //await后代码都会交给新线程执行。
            Console.WriteLine("child thread end... threadId: " + Thread.CurrentThread.ManagedThreadId);  //step 4
        }
    }
}
```
