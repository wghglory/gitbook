# 闭包是什么？closure

内层函数可以访问外层函数的变量。外层函数的局部变量得到暂存。

专业说法：当一个内部函数引用其外部函数的变量时，就形成了一个闭包。

闭包就是一个具有封闭功能与包裹功能的结构，是为了实现具有私有访问空间的函数的，函数可以构成闭包，因为函数内部定义的数据函数外部无法访问，即函数具有封闭性；函数可以封装代码即具有包裹性，所以函数可以构成闭包。

## 闭包有三个特性：

- 函数嵌套函数
- 函数内部可以引用外部的参数和变量
- 参数和变量不会被垃圾回收机制回收

## 闭包有什么用，使用场景

当我们需要在模块中定义一些变量，并希望这些变量一直保存在内存中但又不会“污染”全局的变量时，就可以用闭包来定义这个模块。

## 闭包的缺点

闭包的缺点就是常驻内存，会增大内存使用量，使用不当很容易造成内存泄露。

## 函数套函数就是闭包吗？

不是！当一个内部函数被其外部函数之外的变量引用时，才会形成了一个闭包。
