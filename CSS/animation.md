# 动画

与 Transition 不同，CSS3 动画不需要触发就能开始。虽然仍可以向 `:hover` 状态添加一个动画，在鼠标移上时播放。但也可以让动画在页面加载后就开始。

动画的基础是一组关键帧。可以认为 Transition 只支持两个关键帧，而动画支持多个关键帧。

## 定义关键帧

```css
@keyframes animationName {
    from {
        /* list CSS properties here */
    }
    to {
        /* list CSS properties here */
    }
}
```

`@keyframes` 不是一个 CSS 属性，它是一个规则（rule）。(其他 CSS 规则如 `@import` `@media`。)

至少得有两个关键帧。可以使用关键字 `from` 和 `to` 创建开始帧的结束帧。例如，让元素渐现的动画：

```css
@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}
```

可以使用百分比创建多个帧。关键字 `from` 和 `to` 可以用 `0%` 和 `100%` 代替。

```css
@keyframes backgroundGlow {
    from {
        background-color: yellow;
    }
    50% {
        background-color: blue;
    }
    to {
        background-color: red;
    }
}
```

每个帧内可以放多个属性：

```css
@keyframes growAndGlow {
    from {
        background-color: yellow;
    }
    50% {
        transform: scale(1.5);
        background-color: blue;
    }
    to {
        transform: scale(3);
        background-color: red;
    }
}
```

若多个百分比使用同一组属性（帧）则可以造成暂停的效果。例如下面的例子，从 25% 到 75%（即一半的时间）一直停在蓝色上：

```css
@keyframes glow {
    from {
        background-color: yellow;
    }
    25%, 75% {
        background-color: blue;
    }
    to {
        background-color: red;
    }
}
```

如果多个时刻的关键帧相同，可以将它们列在一起。例如，20% 的时候蓝色，40% 的时候橙色，60% 的时候再回到蓝色……

```css
@keyframes glow {
    from {
        background-color: yellow;
    }
    20%, 60% {
        background-color: blue;
    }
    40%, 80% {
        background-color: orange;
    }
    to {
        background-color: red;
    }
}
```

## 施加动画

对元素施加动画，在页面加载后立即指定动画。利用这点可以实现介绍性的动画。

还可以对伪类施加（`:hover`、`:active`、`:target`、`:focus`）。或者施加到一个 CSS 类上，然后通过 Javascript 动态的将 CSS 类应用到某个元素上。

CSS3 提供了一些动画相关的属性，控制动画播放的方式和时间。最少需要指定动画名和持续时间：

```css
@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

.announcement {
    animation-name: fadeIn;
    animation-duration: 1s;
}
```

> 将动画名放在引号内，不是必须的，但可以防止与 CSS 关键字冲突。

可以同时施加多个动画，如 fadeIn 和 blink；指定不同的持续时间：

```css
animation-name: fadeIn, blink;
animation-duration: 1s, 3s;
```

与 transitions 一样，时间单位可以是秒（s）或毫秒（ms）。

## 动画调速

通过 `animation-timing-function` 控制动画速度。可以使用 cubic-Bezier 曲线，或内建的关键字（`linear`, `ease`, `ease-in`, `ease-out`, `ease-in-out`）。

调速函数可以控制整个动画或特定帧。

```css
.announcement {
    animation-name: fadeIn;
    animation-duration: 1s;
    animation-timing-function: ease-out;
}
```

控制帧速度：

```css
@keyframes growAndGlow {
    from {
        background-color: yellow;
        animation-timing-function: cubic-bezier(1, .03, 1, .115);
    }
    50% {
        transform: scale(1.5);
        background-color: blue;
        animation-timing-function: linear;
    }
    to {
        transform: scale(3);
        background-color: red;
    }
}
```

## 延迟、重复、方向、结束状态

利用 `animation-delay` 延迟动画开始：

```css
.announcement {
    animation-name: fadeIn;
    animation-duration: 1s;
    animation-delay: 1s;
}
```

控制动画播放次数：

```css
animation-iteration-count: 10;
```

`animation-iteration-count: infinite` 会导致动画持续播放。

若动画播放超过一次，默认下一次动画开始时会重头播放。如果想让动画正一次，反一次，利用 `animation-direction: alternate`。（默认是 `normal`）

动画完成后（如果动画持续多次，指多次重复都结束后，即“最后的最后”），默认元素回到动画开始前的状态。例如若动画放大按钮，动画结束后，按钮默认缩小的原来的状态。**如果要让元素停在动画结束的状态，设置属性 `animation-fill-mode: forwards`**。

## 速记写法

`animation` 属性组合了以下属性：animation-name, animation-duration, animation-timing-function, animation-iteration-count, animation-direction, animation-delay, animation-fill-mode。

```css
.fade {
    animation-name: fadeOut;
    animation-duration: 2s;
    animation-timing-function: ease-in-out;
    animation-iteration-count: 2;
    animation-direction: alternate;
    animation-delay: 5s;
    animation-fill-mode: forwards;
}
```

可以简写成：

```css
.fade {
    animation: fadeOut 2s ease-in-out 2 alternate 5s forwards;
}
```

若要对元素施加多个动画，只需要逗号分隔多个列表。如施加 `fadeOut` 和 `glow`：

```css
.fade {
    animation: fadeOut 2s ease-in-out 2 alternate 5s forwards, glow 5s;
}
```

## 暂停动画

属性 `animation-play-state` 控制动画的重放。它接收两个关键字 `running` 或 `paused`。后者暂停动画。