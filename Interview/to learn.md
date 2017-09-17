移动端
混合式 原生

前端动画：
* DOM动画，位置变化
* svg path 动画
  * <http://www.cnblogs.com/coco1s/p/6225973.html>
  * <http://isux.tencent.com/svg-animate.html>
* css3动画

微信开发、小程序

vue源码 阿里经常问

<https://github.com/getify/You-Dont-Know-JS/blob/master/up%20%26%20going/ch1.md>

<https://github.com/wwwebman/front-end-interview-questions>

<https://segmentfault.com/a/1190000010880049>

vue react 源码解析

Build the layout and interactions of common web applications, such as the Netflix browser site.
Implement widgets like a date picker, carousel or e-commerce cart.
Write a function similar to debounce or clone an object deeply.

Execution context, especially lexical scope and closures.
Hoisting, function & block scoping and function expressions & declarations.
Binding – specifically call, bind, apply and lexical this.
Object prototypes, constructors and mixins.
Composition and high order functions.
Event delegation and bubbling.
Type Coercion using typeof, instanceof and Object.prototype.toString.
Handling asynchronous calls with callbacks, promises, await and async.
When to use function declarations and expressions.

DOM

How to traverse and manipulate the DOM is important, and this is where most candidates struggle if they have been depending on jQuery or have been writing a lot of React & Angular type apps recently. You might not do this on a daily basis since most of us are using an abstraction of sorts, but without using a library you should know how to do the following:

Selecting or finding nodes using document.querySelector and in older browsers document.getElementsByTagName.
Traversal up and down – Node.parentNode, Node.firstChild, Node.lastChild and Node.childNodes.
Traversal left and right – Node.previousSibling and Node.nextSibling.
Manipulation – add, remove, copy, and create nodes in the DOM tree. You should know operations such as how to change the text content of a node and toggle, remove or add a CSS classname.
Performance – touching the DOM can be expensive when you have many nodes, you should at least know about document fragments and node caching.