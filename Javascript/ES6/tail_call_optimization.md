# 尾调优化 Tail call optimization (TCO)

## 尾递归

使用一个 accumulator 参数来保存之前的计算的结果。这样计算到 N 的时候，之前栈计算的内容，都是可以抛弃不用保存的。这就解决一个递归很重要的问题，即栈溢出。在尾递归中，之前计算的结果都已经积累并以参数的形式交给下一次操作了，之前的函数留存在栈上的数据都可以清空。 **尾递归使递归在调用堆栈上不会产生堆积** 。

缺点: 将思路转换为循环的思路导致可读性的下降，而可读性是传统递归最大的优点。

### 两个案例

传统递归：

```javascript
// This is just a short reminder of this great explanation:
// http://www.2ality.com/2015/06/tail-call-optimization.html

// not TCO
function factorial(n) {
  if (n <= 0) return 1;

  return n * factorial(n - 1); // here, the main recursive call not in a tail position because of the `n` context.
}
```

```
factorial(6)
  6 * factorial(5)
    5 * factorial (4)
      4 * factorial(3)
        3 * factorial(2)
          2 * factorial(1)
            1 * factorial(0)
              1
            (resuming previous execution) 1 * 1 = 1
          (resuming…) 2 * 1 = 2
        (…) 3 * 2 = 6
      … 4 * 6 = 24
    5 * 24 = 120
  6 * 120 = 720
factorial(6) = 720
```

call stack needs to keep the previous result for calculating the next. 每次重复的过程调用都使得调用链条不断加长，系统不得不使用栈进行数据保存和恢复。

尾递归：

```javascript
// TCO
function factorial(n) {
  var result = recursiveFactorial(n, 1);
  console.log(result);
}

function recursiveFactorial(n, accumulator) {
  if (n <= 0) return accumulator;

  return recursiveFactorial(n - 1, n * accumulator);
}
```

```
factorial(6)
  inner anonymous function (recursiveFactorial) gets called with (n = 6, res = 1)
    recursiveFactorial(5, 1 * 6)
      recursiveFactorial(4, 6 * 5)
        recursiveFactorial(3, 30 * 4)
          recursiveFactorial(2, 120 * 3)
            recursiveFactorial(1, 360 * 2)
              recursiveFactorial(0, 720)
                720
              720
            720
          720
        720
      720
    720
  recursiveFactorial(6, 1) = 720
factorial(6) = 720
```

以 f(6) 为例，以上尾递归类似：

```javascript
var res = 1;
var n = 6;

while (n > 1) {
  res = res * n;
  n--;
}
```

案例 2：

```javascript
// 然后再用最著名的Fibonacci数列来举例，传统的递归是:
function FibonacciRecursively(n) {
  return n < 2 ? n : FibonacciRecursively(n - 1) + FibonacciRecursively(n - 2);
}

// 尾递归是累加
function FibonacciTailRecursively(n, acc1, acc2) {
  if (n == 0) return acc1;
  return FibonacciTailRecursively(n - 1, acc2, acc1 + acc2);
}
```

### 编译器是怎样优化尾递归的

我们知道递归调用是通过栈来实现的，每调用一次函数，系统都将函数当前的变量、返回地址等信息保存为一个栈帧压入到栈中，那么一旦要处理的运算很大或者数据很多，有可能会导致很多函数调用或者很大的栈帧，这样不断的压栈，很容易导致栈的溢出。

尾递归的特性：函数在递归调用之前已经把所有的计算任务已经完毕了，他只要把得到的结果全交给子函数就可以了，无需保存什么，子函数其实可以不需要再去创建一个栈帧，直接在当前栈帧上把原先的数据覆盖即可。相对的，如果是普通的递归，函数在递归调用之前并没有完成全部计算，还需要调用递归函数完成后才能完成运算任务。比如`return n * factorial(n - 1);` 这句话，`factorial(n)` 在算完 `factorial(n-1)` 之后才能得到 `n * factorial(n - 1)` 的运算结果然后才能返回。

综上所述，尾递归的时候，不会去不断创建新的栈帧，而是在当前的栈帧上不断的去更新覆盖，一来防止栈溢出，二来节省了调用函数时创建栈帧的开销。

## 尾调用

尾调用为 `tail-call`。尾递归也是一种尾调用，但是尾调用并不一定是尾递归。尾调用更广。

尾调用是指 **一个函数的最后一个动作是一个函数调用** 的情形。称这个调用位置为 **尾位置** 。如果尾位置调用这个函数自己，那才可以称为 **尾递归** 。

尾调用的重要性，在于它可以不在调用栈上面添加一个新的堆栈帧 call stack frame – 而是**更新它**。

当一个函数调用时，电脑必须记住调用函数的位置，即返回位置，才可以在调用结束时带着返回值回到该位置，返回位置一般存在调用栈上。在尾调用的情况下，电脑不需要记住尾调用的位置而是可以从被调用的函数直接带着返回值返回到调用函数的返回位置。尾调用消除即是在不改变当前调用栈的情况下调到新函数的一种优化。

尾调用优化就是以对尾调用这种情况，进行尾调用的消除，以不用添加新的堆栈，只是更新它，来提高效率。只有当某个函数的最后一个操作仅仅是调用其它函数，而不会将其函数返回值另作他用的情况下，进行尾调用优化。
