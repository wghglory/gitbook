# shift operator 位运算

## 左移 (<<)

将第一个操作数向左移动第二个操作数指定的位数，空出的位置补 0。左移相当于乘。左移一位相当于乘 2。左移两位相当于乘 4。左移三位相当于乘 8。

```javascript
x << 1 === x * 2;
x << 2 === x * (2 ^ 2);
x << 3 === x * 8;
x << 4 === x * (2 ^ 4);
```

## 右移 (>>)

将第一个操作数向右移动第二个操作数所指定的位数，空出的位置补 0。右移相当于整除。右移一位相当于除以 2。右移两位相当于除以 4。右移三位相当于除以 8。

```javascript
x >> 1 === x / 2;
x >> 2 === x / 4;
x >> 3 === x / 8;
x >> 4 === x / 16;
```