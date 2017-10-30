# 一、Redis API For .Net

　　首先，不得不说 Redis 官方提供了众多的API开发包，但是**目前Redis官方版本不支持.Net直接进行连接，需要使用一些第三方的开源类库**。目前最流行的就是**ServiceStack.Redis**这个开源项目，其在GitHub上的下载地址为：[https://github.com/ServiceStack/ServiceStack.Redis](https://github.com/ServiceStack/ServiceStack.Redis)

　　进入下载页面，点击“**Download Zip**”按钮，即可下载该API包。解压该Zip包后，其实我们所用到的只是其中的几个DLL而已，打开build/release/MonoDevelop文件夹，看到里边还有一个zip包，这里边就是我们所需的DLL了。

![img-c](http://images.cnitblog.com/i/381412/201407/031437271998293.jpg)

　　再次解压这个Zip包，可以看到其中包含如下图所示的DLL文件，这几个也是我们今天所要引入VS的DLL库，有了它们，我们就可以在程序端和Redis服务端进行对话了，是不是很赞？

![img-c](http://images.cnitblog.com/i/381412/201407/031438213872350.jpg)

　　这时，我们就可以在VS中新建一个控制台项目，命名为RedisDemo，然后新建一个Lib文件夹用来存放我们的DLL文件，然后添加对这些DLL引用。至此，就是万事俱备只欠东风了，我们接下来会在程序中调用Redis客户端和Redis服务端进行通信，了解Redis API为我们提供的丰富的数据类型。

![img-c](http://images.cnitblog.com/i/381412/201407/031447581529920.jpg)

## 二、Redis中常用数据类型

　    Redis目前提供五种数据类型：string(字符串)、list（链表）、Hash（哈希）、set（集合）及zset(sorted set)  （有序集合）。现在，我们一一来看看这五种数据类型的基本使用方法。在开始介绍之前，我们先使用刚刚引入的Redis API建立一个 Redis 客户端对象，有了这个客户端对象，我们才能和Redis服务端进行通信，且看下面的一行代码。我们需要事先指定好Redis服务端的IP地址和端口号，然后根据这两个信息建立一个RedisClient的对象实例，通过这个实例所带的方法和服务端通信。

```Csharp
using System;
using System.Collections.Generic;
using ServiceStack.Redis;

namespace RedisDemo.FirstStart
{
    class Program
    {
        //Redis服务器IP地址
        static string localHostIP = "127.0.0.1";
        //Redis服务端口号
        static int redisServicePort = 6379;

        static void Main(string[] args)
        {
            var redisClient = new RedisClient(localHostIP, redisServicePort);

            Console.ReadKey();
        }
    }
}
```

## 2.1 String 字符串

　　**String是最常用的一种数据类型**，普通的key/value存储都可以归为此类 。一个Key对应一个Value，string类型是二进制安全的。Redis的string可以包含任何数据，比如jpg图片(生成二进制)或者序列化的对象。

```Csharp
static void StringTypeDemo(RedisClient redisClient)
{
    //向Redis中添加一个Key/Value对
    redisClient.Set<string>("username", "edisonchou");
    //从Redis中读取一个Value值
    string userName = redisClient.Get<string>("username");

    Console.WriteLine("The value from Redis is {0}", userName);
}
```

　　运行效果如下：

![img-c](http://images.cnitblog.com/i/381412/201407/041012492624715.jpg)

## 2.2 Hash

　　Hash是一个string 类型的field和value的**映射表**。Hash**特别适合存储对象**，相对于将对象的每个字段存成单个string 类型。一个对象存储在Hash类型中会占用更少的内存，并且可以更方便的存取整个对象。

　　这里借用[群叔](http://www.cnblogs.com/qunshu/p/3196972.html)的描述，我们简单举个实例来描述下Hash的应用场景，比如我们要存储一个用户信息对象数据，包含以下信息：用户ID为查找的key，存储的value用户对象包含姓名，年龄，生日等信息，如果用普通的key/value结构来存储，主要有以下2种存储方式：

　　第一种方式将用户ID作为查找key,把其他信息封装成一个对象以序列化的方式存储，这种方式的缺点是，**增加了序列化/反序列化的开销**，并且在需要修改其中一项信息时，需要把整个对象取回，并且修改操作需要对并发进行保护，引入CAS等复杂问题。

　　第二种方法是这个用户信息对象有多少成员就存成多少个key-value对儿，用用户ID+对应属性的名称作为唯一标识来取得对应属性的值，虽然省去了序列化开销和并发问题，但是用户ID为重复存储，如果存在大量这样的数据，**内存浪费严重的**。

　　因此，基于以上两种方式的缺陷，Redis提供的Hash很好的解决了这个问题，**Redis的Hash实际是内部存储的Value为一个HashMap**，并提供了直接存取这个Map成员的接口。

　　也就是说，Key仍然是用户ID, value是一个Map，这个Map的key是成员的属性名，value是属性值，这样对数据的修改和存取都可以直接通过其内部Map的Key(Redis里称内部Map的key为field), 也就是通过**key(用户ID) + field(属性标签)** 就可以操作对应属性数据了，既不需要重复存储数据，也不会带来序列化和并发修改控制的问题，也就很好的解决了问题。

　　下面我们在VS中来看看Hash类型如何Code：

```csharp
static void HashTypeDemo(RedisClient redisClient)
{
    redisClient.SetEntryInHash("user", "userinfo", "cool boy");
    redisClient.SetEntryInHash("user", "useraccount", "5000");

    List<string> keyList = redisClient.GetHashKeys("user");

    foreach (string key in keyList)
    {
        Console.WriteLine(key);
        string value = redisClient.GetValueFromHash("user", key);
        Console.WriteLine("user:{0}:{1}", key, value);
    }
}
```

　　运行结果如下图：

![img-c](http://images.cnitblog.com/i/381412/201407/041041240591462.jpg)

### 2.3 List 链表

　　List是一个链表结构，主要功能是push与pop，获取一个范围的所有的值等，操作中key理解为链表名字。 Redis的List类型其实就是一个每个子元素都是string类型的**双向链表，**我们可以通过push或pop操作从链表的头部或者尾部添加删除元素，这样**List既可以作为栈，又可以作为队列**。它即可以支持反向查找和遍历，更方便操作，不过带来了部分额外的内存开销。Redis内部的很多实现，包括发送缓冲队列等也都是用的这个数据结构。

　　（1）现在我们首先来看看List作为（Stack）栈类型的使用：　

*![img-c](http://images.cnitblog.com/i/381412/201407/041048273095834.jpg)*

　　那么在VS中如何来Code呢？通过Push与Pop操作Stack

```csharp
static void StackTypeDemo(RedisClient redisClient)
{
    redisClient.PushItemToList("userenname", "edisonchou");
    redisClient.PushItemToList("userenname", "wncudchou");
    redisClient.PushItemToList("userenname", "milkye");
    redisClient.PushItemToList("userenname", "dickgu");

    int length = redisClient.GetListCount("userenname");
    for (int i = 0; i < length; i++)
    {
        Console.WriteLine(redisClient.PopItemFromList("userenname"));
    }
}
```

　　运行效果如下：

![img-c](http://images.cnitblog.com/i/381412/201407/041054498553704.jpg)

　　（2）下面我们来看看List作为（Queue）队列的使用：

![img-c](http://images.cnitblog.com/i/381412/201407/041103320274863.jpg)

　　那么在VS中如何Code呢？通过DeQueue和EnQueue操作Queue

```Csharp
static void QueueTypeDemo(RedisClient redisClient)
{
    redisClient.EnqueueItemOnList("account", "马云");
    redisClient.EnqueueItemOnList("account", "马化腾");
    redisClient.EnqueueItemOnList("account", "李彦宏");

    int length = redisClient.GetListCount("account");
    for (int i = 0; i < length; i++)
    {
        Console.WriteLine(redisClient.DequeueItemFromList("account"));
    }
}
```

　　运行效果如下：

![img-c](http://images.cnitblog.com/i/381412/201407/041104299348821.jpg)

### 2.4 Set 集合

　　Set是string类型的**无序集合**。set是通过hash table实现的，添加、删除和查找，对集合我们可以取并集、交集、差集，可以非常方便的实现如共同关注、共同喜好、二度好友等功能，对上面的所有集合操作，你还可以使用不同的命令选择将结果返回给客户端还是存集到一个新的集合中。

　　与List比较而言，set对外提供的功能与list类似是一个列表的功能，特殊之处在于**set是可以自动排重的**，当你需要存储一个列表数据，又不希望出现重复数据时，set是一个很好的选择，并且set提供了判断某个成员是否在一个set集合内的重要接口，这个也是list所不能提供的。

　　那么在VS中我们使用Set来Code一下，先增加两个Set集合，然后对其进行交集、并集与差集运算：

```csharp
static void SetTypeDemo(RedisClient redisClient)
{
    redisClient.AddItemToSet("a3", "ddd");
    redisClient.AddItemToSet("a3", "ccc");
    redisClient.AddItemToSet("a3", "tttt");
    redisClient.AddItemToSet("a3", "sssh");
    redisClient.AddItemToSet("a3", "hhhh");
    redisClient.AddItemToSet("a4", "hhhh");
    redisClient.AddItemToSet("a4", "h777");

    Console.WriteLine("-------------求a3集合------------");

    HashSet<string> hashSet = redisClient.GetAllItemsFromSet("a3");
    foreach (string value in hashSet)
    {
        Console.WriteLine(value);
    }

    Console.WriteLine("-------------求并集------------");

    hashSet.Clear();
    hashSet = redisClient.GetUnionFromSets(new string[] { "a3", "a4" });
    foreach (string value in hashSet)
    {
        Console.WriteLine(value);
    }

    Console.WriteLine("-------------求交集------------");

    hashSet.Clear();
    hashSet = redisClient.GetIntersectFromSets(new string[] { "a3", "a4" });
    foreach (string value in hashSet)
    {
        Console.WriteLine(value);
    }

    Console.WriteLine("-------------求差集------------");

    hashSet.Clear();
    hashSet = redisClient.GetDifferencesFromSet("a3", new string[] { "a4" });
    foreach (string value in hashSet)
    {
        Console.WriteLine(value);
    }
}
```

　　运行效果如下：

![img-c](http://images.cnitblog.com/i/381412/201407/041110362775407.jpg)

### 2.5 Sorted Set 有序集合

　　Sorted Set 是set的一个升级版本，又被称为ZSet，它在set的基础上增加了一个顺序的属性，这一属性在添加修改。元素的时候可以指定，每次指定后，zset(表示有序集合)会自动重新按新的值调整顺序。**可以理解为有列的表，一列存 value，一列存顺序**。操作中key理解为zset的名字。

　　sorted set的使用场景与set类似，区别是**set不是自动有序的，而sorted set可以通过用户额外提供一个优先级(score)的参数来为成员排序**，并且是插入有序的，即自动排序。**当你需要一个有序的并且不重复的集合列表，那么可以选择sorted set数据结构。**此外，还可以用Sorted Sets来做带权重的队列，比如普通消息的score为1，重要消息的score为2，然后工作线程可以选择按score的倒序来获取工作任务。让重要的任务优先执行。

　　下面，我们在VS中编写对Sorted Set的操作代码，输出时会按字母的有序顺序输出：

```Csharp
static void SortedSetTypeDemo(RedisClient redisClient)
{
    redisClient.AddItemToSortedSet("a5", "ffff");
    redisClient.AddItemToSortedSet("a5", "bbbb");
    redisClient.AddItemToSortedSet("a5", "gggg");
    redisClient.AddItemToSortedSet("a5", "cccc");
    redisClient.AddItemToSortedSet("a5", "waaa");

    List<string> list = redisClient.GetAllItemsFromSortedSet("a5");
    foreach (string str in list)
    {
        Console.WriteLine(str);
    }
}
```

　　运行效果如下：

![img-c](http://images.cnitblog.com/i/381412/201407/041115396053376.jpg)

### 参考文献

（1）传智播客公开课，王承伟主讲，http://bbs.itcast.cn/thread-26525-1-1.html

（2）群叔，《Redis数据类型详解及Redis适用场景》，http://www.cnblogs.com/qunshu/p/3196972.html

### 附件下载

ServiceStack.Redis：[http://pan.baidu.com/s/1sjtxe5v](http://pan.baidu.com/s/1sjtxe5v)