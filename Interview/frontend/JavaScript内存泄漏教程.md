# JavaScript 内存泄漏教程

作者： [阮一峰](http://www.ruanyifeng.com/)

日期： [2017年4月16日](http://www.ruanyifeng.com/blog/2017/04/)

## 一、什么是内存泄漏？

程序的运行需要内存。只要程序提出要求，操作系统或者运行时（runtime）就必须供给内存。

对于持续运行的服务进程（daemon），必须及时释放不再用到的内存。否则，内存占用越来越高，轻则影响系统性能，重则导致进程崩溃。

![img](http://www.ruanyifeng.com/blogimg/asset/2017/bg2017041701-1.png)

不再用到的内存，没有及时释放，就叫做内存泄漏（memory leak）。

有些语言（比如 C 语言）必须手动释放内存，程序员负责内存管理。

```c
char * buffer;
buffer = (char*) malloc(42);

// Do something with buffer
free(buffer);
```

上面是 C 语言代码，`malloc`方法用来申请内存，使用完毕之后，必须自己用`free`方法释放内存。

这很麻烦，所以大多数语言提供自动内存管理，减轻程序员的负担，这被称为"垃圾回收机制"（garbage collector）。

## 二、垃圾回收机制

垃圾回收机制怎么知道，哪些内存不再需要呢？

最常使用的方法叫做["引用计数"](https://en.wikipedia.org/wiki/Reference_counting)（reference counting）：语言引擎有一张"引用表"，保存了内存里面所有的资源（通常是各种值）的引用次数。如果一个值的引用次数是`0`，就表示这个值不再用到了，因此可以将这块内存释放。

![img](http://www.ruanyifeng.com/blogimg/asset/2017/bg2017041703.png)

上图中，左下角的两个值，没有任何引用，所以可以释放。

如果一个值不再需要了，引用数却不为`0`，垃圾回收机制无法释放这块内存，从而导致内存泄漏。

```javascript
const arr = [1, 2, 3, 4];
console.log('hello world');
```

上面代码中，数组`[1, 2, 3, 4]`是一个值，会占用内存。变量`arr`是仅有的对这个值的引用，因此引用次数为`1`。尽管后面的代码没有用到`arr`，它还是会持续占用内存。

如果增加一行代码，解除`arr`对`[1, 2, 3, 4]`引用，这块内存就可以被垃圾回收机制释放了。

```javascript
let arr = [1, 2, 3, 4];
console.log('hello world');
arr = null;
```

上面代码中，`arr`重置为`null`，就解除了对`[1, 2, 3, 4]`的引用，引用次数变成了`0`，内存就可以释放出来了。

因此，并不是说有了垃圾回收机制，程序员就轻松了。你还是需要关注内存占用：那些很占空间的值，一旦不再用到，你必须检查是否还存在对它们的引用。如果是的话，就必须手动解除引用。

## 三、内存泄漏的识别方法

怎样可以观察到内存泄漏呢？

[经验法则](https://www.toptal.com/nodejs/debugging-memory-leaks-node-js-applications)是，如果连续五次垃圾回收之后，内存占用一次比一次大，就有内存泄漏。这就要求实时查看内存占用。

### 3.1 浏览器

Chrome 浏览器查看内存占用，按照以下步骤操作。

![img](http://www.ruanyifeng.com/blogimg/asset/2017/bg2017041704.png)

1. 打开开发者工具，选择 Timeline 面板
1. 在顶部的`Capture`字段里面勾选 Memory
1. 点击左上角的录制按钮。
1. 在页面上进行各种操作，模拟用户的使用情况。
1. 一段时间后，点击对话框的 stop 按钮，面板上就会显示这段时间的内存占用情况。

如果内存占用基本平稳，接近水平，就说明不存在内存泄漏。

![img](http://www.ruanyifeng.com/blogimg/asset/2017/bg2017041705.png)

反之，就是内存泄漏了。

![img](http://www.ruanyifeng.com/blogimg/asset/2017/bg2017041706.png)

### 3.2 命令行

命令行可以使用 Node 提供的[`process.memoryUsage`](https://nodejs.org/api/process.html#process_process_memoryusage)方法。

```javascript
console.log(process.memoryUsage());
// { rss: 27709440,
//  heapTotal: 5685248,
//  heapUsed: 3449392,
//  external: 8772 }
```

`process.memoryUsage`返回一个对象，包含了 Node 进程的内存占用信息。该对象包含四个字段，单位是字节，[含义](http://stackoverflow.com/questions/12023359/what-do-the-return-values-of-node-js-process-memoryusage-stand-for)如下。

![img](http://www.ruanyifeng.com/blogimg/asset/2017/bg2017041702-1.png)

> - rss（resident set size）：所有内存占用，包括指令区和堆栈。
> - heapTotal："堆"占用的内存，包括用到的和没用到的。
> - heapUsed：用到的堆的部分。
> - external： V8 引擎内部的 C++ 对象占用的内存。

判断内存泄漏，以`heapUsed`字段为准。

## 四、WeakMap

前面说过，及时清除引用非常重要。但是，你不可能记得那么多，有时候一疏忽就忘了，所以才有那么多内存泄漏。

最好能有一种方法，在新建引用的时候就声明，哪些引用必须手动清除，哪些引用可以忽略不计，当其他引用消失以后，垃圾回收机制就可以释放内存。这样就能大大减轻程序员的负担，你只要清除主要引用就可以了。

ES6 考虑到了这一点，推出了两种新的数据结构：[WeakSet](http://es6.ruanyifeng.com/#docs/set-map#WeakSet) 和 [WeakMap](http://es6.ruanyifeng.com/#docs/set-map#WeakMap)。它们对于值的引用都是不计入垃圾回收机制的，所以名字里面才会有一个"Weak"，表示这是弱引用。

![img](http://www.ruanyifeng.com/blogimg/asset/2017/bg2017041707.jpg)

下面以 WeakMap 为例，看看它是怎么解决内存泄漏的。

```javascript
const wm = new WeakMap();
const element = document.getElementById('example');
wm.set(element, 'some information');
wm.get(element) // "some information"
```

上面代码中，先新建一个 WeakMap 实例。然后，将一个 DOM 节点作为键名存入该实例，并将一些附加信息作为键值，一起存放在 WeakMap 里面。这时，WeakMap 里面对`element`的引用就是弱引用，不会被计入垃圾回收机制。

也就是说，DOM 节点对象的引用计数是`1`，而不是`2`。这时，一旦消除对该节点的引用，它占用的内存就会被垃圾回收机制释放。WeakMap 保存的这个键值对，也会自动消失。

基本上，如果你要往对象上添加数据，又不想干扰垃圾回收机制，就可以使用 WeakMap。

只要外部的引用消失，WeakMap 内部的引用，就会自动被垃圾回收清除。由此可见，有了它的帮助，解决内存泄漏就会简单很多。