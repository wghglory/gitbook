# [hash碰撞--equals()与hashCode()](http://www.cnblogs.com/Qian123/p/5703507.html)

## **equals()方法详解**

`equals()`方法是用来判断其他的对象是否和该对象相等.

  equals()方法在object类中定义如下：

```Java
public boolean equals(Object obj) {
    return (this == obj);
}
```

很明显是对两个对象的地址值进行的比较（即比较引用是否相同）。但是我们知道，String 、Math、Integer、Double等这些封装类在使用equals()方法时，已经覆盖了object类的equals()方法。

比如在String类中如下：

```java
public boolean equals(Object anObject) {
    if (this == anObject) {
        return true;
    }
    if (anObject instanceof String) {
        String anotherString = (String)anObject;
        int n = count;
        if (n == anotherString.count) {
            char v1[] = value;
            char v2[] = anotherString.value;
            int i = offset;
            int j = anotherString.offset;
            while (n– != 0) {
                if (v1[i++] != v2[j++])
                    return false;
            }
            return true;
        }
    }
    return false;
}
```

很明显，这是进行的内容比较，而已经不再是地址的比较。依次类推Math、Integer、Double 等这些类都是重写了equals()方法的，从而进行的是内容的比较。当然，基本类型是进行值的比较。

它的性质有：

- **自反性**（reflexive）。对于任意不为`null`的引用值x，`x.equals(x)`一定是`true`。
- **对称性**（symmetric）。对于任意不为`null`的引用值`x`和`y`，当且仅当`x.equals(y)`是`true`时，`y.equals(x)`也是`true`。
- **传递性**（transitive）。对于任意不为`null`的引用值`x`、`y`和`z`，如果`x.equals(y)`是`true`，同时`y.equals(z)`是`true`，那么`x.equals(z)`一定是`true`。
- **一致性**（consistent）。对于任意不为`null`的引用值`x`和`y`，如果用于equals比较的对象信息没有被修改的话，多次调用时`x.equals(y)`要么一致地返回`true`要么一致地返回`false`。
- 对于任意不为`null`的引用值`x`，`x.equals(null)`返回`false`。

对于`Object`类来说，`equals()`方法在对象上实现的是差别可能性最大的等价关系，即，对于任意非`null`的引用值`x`和`y`，当且仅当`x`和`y`引用的是同一个对象，该方法才会返回`true`。

**需要注意的是当equals()方法被override时，hashCode()也要被override。按照一般hashCode()方法的实现来说，相等的对象，它们的hash code一定相等。**

## **hashcode() 方法详解**

`hashCode()`方法给对象返回一个hash code值。这个方法被用于hash tables，例如HashMap。

它的性质是：

- 在一个Java应用的执行期间，如果一个对象提供给equals做比较的信息没有被修改的话，该对象多次调用`hashCode()`方法，该方法必须始终如一返回同一个integer。
- 如果两个对象根据`equals(Object)`方法是相等的，那么调用二者各自的`hashCode()`方法必须产生同一个integer结果。
- 并不要求根据`equals(java.lang.Object)`方法不相等的两个对象，调用二者各自的`hashCode()`方法必须产生不同的integer结果。然而，程序员应该意识到对于不同的对象产生不同的integer结果，有可能会提高hash table的性能。

大量的实践表明，由`Object`类定义的`hashCode()`方法对于不同的对象返回不同的integer。

在object类中，hashCode定义如下：

```Java
public native int hashCode();
```

 说明是一个本地方法，它的实现是根据本地机器相关的。当然我们可以在自己写的类中覆盖hashcode()方法，比如String、Integer、Double等这些类都是覆盖了hashcode()方法的。例如在String类中定义的hashcode()方法如下

```Java
public int hashCode() {
    int h = hash;
    if (h == 0) {
        int off = offset;
        char val[] = value;
        int len = count;
        for (int i = 0; i < len; i++) {
            h = 31 * h + val[off++];
        }
        hash = h;
    }
    return h;
}
```

解释一下这个程序（String的API中写到）：s[0]*31^(n-1) + s[1]*31^(n-2) + … + s[n-1]
​      使用 int 算法，这里 s[i] 是字符串的第 i 个字符，n 是字符串的长度，^ 表示求幂（空字符串的哈希码为 0）。

​       想要弄明白hashCode的作用，必须要先知道Java中的集合。　　
​       总的来说，Java中的集合（Collection）有两类，一类是List，再有一类是Set。前者集合内的元素是有序的，元素可以重复；后者元素无序，但元素不可重复。这里就引出一个问题：要想保证元素不重复，可两个元素是否重复应该依据什么来判断呢？
​        这就是Object.equals方法了。但是，如果每增加一个元素就检查一次，那么当元素很多时，后添加到集合中的元素比较的次数就非常多了。也就是说，如果集合中现在已经有1000个元素，那么第1001个元素加入集合时，它就要调用1000次equals方法。这显然会大大降低效率。
​       于是，Java采用了哈希表的原理。哈希（Hash）实际上是个人名，由于他提出一哈希算法的概念，所以就以他的名字命名了。哈希算法也称为散列算法，是将数据依特定算法直接指定到一个地址上，初学者可以简单理解，hashCode方法实际上返回的就是对象存储的物理地址（实际可能并不是）。
​       这样一来，当集合要添加新的元素时，先调用这个元素的hashCode方法，就一下子能定位到它应该放置的物理位置上。如果这个位置上没有元素，它就可以直接存储在这个位置上，不用再进行任何比较了；如果这个位置上已经有元素了，就调用它的equals方法与新元素进行比较，相同的话就不存了，不相同就散列其它的地址。所以这里存在一个冲突解决的问题。这样一来实际调用equals方法的次数就大大降低了，几乎只需要一两次。

简而言之，在集合查找时，hashcode 能大大降低对象比较次数，提高查找效率

Java对象的eqauls方法和hashCode方法是这样规定的：

**1、相等（相同）的对象必须具有相等的哈希码（或者散列码）。**

**2、如果两个对象的hashCode相同，它们并不一定相同。**

**关于第一点，相等（相同）的对象必须具有相等的哈希码（或者散列码），为什么？**

想象一下，假如两个Java对象A和B，A和B相等（eqauls结果为true），但A和B的哈希码不同，则A和B存入HashMap时的哈希码计算得到的HashMap内部数组位置索引可能不同，那么A和B很有可能允许同时存入HashMap，显然相等/相同的元素是不允许同时存入HashMap，HashMap不允许存放重复元素。

**关于第二点，两个对象的hashCode相同，它们并不一定相同**

也就是说，不同对象的hashCode可能相同；假如两个Java对象A和B，A和B不相等（eqauls结果为false），但A和B的哈希码相等，将A和B都存入HashMap时会发生哈希冲突，也就是A和B存放在HashMap内部数组的位置索引相同这时HashMap会在该位置建立一个链接表，将A和B串起来放在该位置，显然，该情况不违反HashMap的使用原则，是允许的。当然，哈希冲突越少越好，尽量采用好的哈希算法以避免哈希冲突。

 所以，Java对于eqauls方法和hashCode方法是这样规定的：

> 1.如果两个对象相同，那么它们的hashCode值一定要相同；
>
> 2.如果两个对象的hashCode相同，它们并不一定相同（这里说的对象相同指的是用eqauls方法比较）， 如不按要求去做了，会发现相同的对象可以出现在Set集合中，同时，增加新元素的效率会大大下降。
>
> 3.equals()相等的两个对象，hashcode()一定相等；equals()不相等的两个对象，却并不能证明他们的hashcode()不相等。
>
> 换句话说，equals()方法不相等的两个对象，hashcode()有可能相等（我的理解是由于哈希码在生成的时候产生冲突造成的）。反过来，hashcode()不等，一定能推出equals()也不等；hashcode()相等，equals()可能相等，也可能不等。

在object类中，hashcode()方法是本地方法，返回的是对象的地址值，而object类中的equals()方法比较的也是两个对象的地址值，如果equals()相等，说明两个对象地址值也相等，当然hashcode()也就相等了；**在String类中，equals()返回的是两个对象内容的比较**，当两个对象内容相等时，Hashcode()方法根据String类的重写代码的分析，也可知道hashcode()返回结果也会相等。以此类推，可以知道Integer、Double等封装类中经过重写的equals()和hashcode()方法也同样适合于这个原则。当然没有经过重写的类，在继承了object类的equals()和hashcode()方法后，也会遵守这个原则。

## Hashset、Hashmap、Hashtable与hashcode()和equals()的密切关系

Hashset是继承Set接口，Set接口又实现Collection接口，这是层次关系。那么Hashset、Hashmap、Hashtable中的存储操作是根据什么原理来存取对象的呢？

​        下面以HashSet为例进行分析，我们都知道：在hashset中不允许出现重复对象，元素的位置也是不确定的。在hashset中又是怎样判定元素是否重复的呢？在java的集合中，判断两个对象是否相等的规则是：
​         1.判断两个对象的hashCode是否相等

​             如果不相等，认为两个对象也不相等，完毕
​             如果相等，转入2
​           （这一点只是为了提高存储效率而要求的，其实理论上没有也可以，但如果没有，实际使用时效率会大大降低，所以我们这里将其做为必需的。）

​         2.判断两个对象用equals运算是否相等
​            如果不相等，认为两个对象也不相等
​            如果相等，认为两个对象相等（equals()是判断两个对象是否相等的关键）
​            为什么是两条准则，难道用第一条不行吗？不行，因为前面已经说了，hashcode()相等时，equals()方法也可能不等，所以必须用第2条准则进行限制，才能保证加入的为非重复元素。

例1：

```java
package com.bijian.study;

import java.util.HashSet;
import java.util.Iterator;
import java.util.Set;

public class HashSetTest {

    public static void main(String args[]) {
        String s1 = new String("aaa");
        String s2 = new String("aaa");
        System.out.println(s1 == s2);
        System.out.println(s1.equals(s2));
        System.out.println(s1.hashCode());
        System.out.println(s2.hashCode());
        Set hashset = new HashSet();
        hashset.add(s1);
        hashset.add(s2);
        Iterator it = hashset.iterator();
        while (it.hasNext()) {
            System.out.println(it.next());
        }
    }
}
```

运行结果：

```
false
true
96321
96321
aaa
```

这是因为String类已经重写了equals()方法和hashcode()方法，所以hashset认为它们是相等的对象，进行了重复添加。

例2

```java
package com.bijian.study;

import java.util.HashSet;
import java.util.Iterator;

public class HashSetTest {

    public static void main(String[] args) {
        HashSet hs = new HashSet();
        hs.add(new Student(1, "zhangsan"));
        hs.add(new Student(2, "lisi"));
        hs.add(new Student(3, "wangwu"));
        hs.add(new Student(1, "zhangsan"));

        Iterator it = hs.iterator();
        while (it.hasNext()) {
            System.out.println(it.next());
        }
    }
}

class Student {
    int num;
    String name;

    Student(int num, String name) {
        this.num = num;
        this.name = name;
    }

    public String toString() {
        return num + ":" + name;
    }
}
```

运行结果：

```
1:zhangsan
3:wangwu
2:lisi
1:zhangsan
```

为什么hashset添加了相等的元素呢，这是不是和hashset的原则违背了呢？回答是：没有。因为在根据hashcode()对两次建立的new Student(1,“zhangsan”)对象进行比较时，生成的是不同的哈希码值，所以hashset把他当作不同的对象对待了，当然此时的equals()方法返回的值也不等。

​        为什么会生成不同的哈希码值呢？上面我们在比较s1和s2的时候不是生成了同样的哈希码吗？原因就在于我们自己写的Student类并没有重新自己的hashcode()和equals()方法，所以在比较时，是继承的object类中的hashcode()方法，而object类中的hashcode()方法是一个本地方法，比较的是对象的地址（引用地址），使用new方法创建对象，两次生成的当然是不同的对象了，造成的结果就是两个对象的hashcode()返回的值不一样，所以Hashset会把它们当作不同的对象对待。

​        怎么解决这个问题呢？答案是：在Student类中重新hashcode()和equals()方法。

```java
class Student {
    int num;
    String name;

    Student(int num, String name) {
        this.num = num;
        this.name = name;
    }

    public int hashCode() {
        return num * name.hashCode();
    }

    public boolean equals(Object o) {
        Student s = (Student) o;
        return num == s.num && name.equals(s.name);
    }

    public String toString() {
        return num + ":" + name;
    }
}
```

运行结果：

```
1:zhangsan
3:wangwu
2:lisi
```

可以看到重复元素的问题已经消除，根据重写的方法，即便两次调用了new Student(1,"zhangsan")，我们在获得对象的哈希码时，根据重写的方法hashcode()，获得的哈希码肯定是一样的，当然根据equals()方法我们也可判断是相同的，所以在向hashset集合中添加时把它们当作重复元素看待了。

**重写equals()和hashcode()小结：**

1. 重点是equals，重写hashCode只是技术要求（为了提高效率）
1. 为什么要重写equals呢？因为在java的集合框架中，是通过equals来判断两个对象是否相等的
1. 在hibernate中，经常使用set集合来保存相关对象，而set集合是不允许重复的。在向HashSet集合中添加元素时，其实只要重写equals()这一条也可以。但当hashset中元素比较多时，或者是重写的equals()方法比较复杂时，我们只用equals()方法进行比较判断，效率也会非常低，所以引入了hashCode()这个方法，只是为了提高效率，且这是非常有必要的。比如可以这样写：

```java
public int hashCode(){
   return 1; //等价于hashcode无效
}
```

这样做的效果就是在比较哈希码的时候不能进行判断，因为每个对象返回的哈希码都是1，每次都必须要经过比较equals()方法后才能进行判断是否重复，这当然会引起效率的大大降低。