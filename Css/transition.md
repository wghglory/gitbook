# Transition

CSS Transition 是最简单形式的动画：从一个可视状态变换到另一个可视状态。如果需要更多状态，需要使用关键帧动画。

例子：鼠标以上后，图片旋转。

```css
img.tilt:hover {
    transform: rotate(7.5deg);
    transition: 2s all;
}
```

值顺序不重要。可以是 `2s all` 或 `all 2s`。若时间需要精确到毫秒，可以使用小数加秒 `transition: 2.35s all;` 的形式，或毫秒形式 `transition: 2350ms all;`。

当鼠标移出时，元素**立即**回到了其初始状态。但有时你期望恢复初始状态也有平滑的动画。方法是将 `:hover` 中  `transition` 声明移到默认样式中，`:hover` 中只保留 `transform`。背后的原理是，将一个属性放入默认样式，不管进出状态，transition 都生效。

如果在动画过程中鼠标移出或移入，transition 会被打断，会平滑的反转。这个特性非常好！

`transition` 中可以只指定时间：`transition: 2s;`。

一般会把 `transition` 放入默认样式（如 `.navButto`）而不是最终样式（如 `.navButton:hover`）。==但对于下拉菜单，下列也可以缓慢动画，但收起最好非常快的完成，为此，可以在默认样式中使用 `transition-delay: 5s;`，但在最终样式（:hover）覆盖：`transition-delay: 0;`。==

**不是所有的 CSS 属性都可以参与动画**。可以参与的属性包括颜色和尺寸类的：

* transform
* color, background-color, border-color, opacity
* border-width, font-size, height, width
* letter-spacing, line-height, word-spacing
* margin, padding
* 定位属性，top, left, right, bottom

You can find a complete list at **www.w3.org/TR/css3-transitions/#animatable-properties**.

只要 CSS 属性改变都可以触发 transition，包括通过 Javascript 改变 CSS 属性。

transition 包含四个控制属性，分别控制参与动画的属性、动画时间、动画类型、延迟时间（可选）。

`transition-property` 指定参与动画的属性。多个属性逗号风格。值 `all` 表示动画所有改变的 CSS 属性。

`transition-duration` 属性指定动画时间。单位可以是秒或毫秒。

每个属性的动画时间可以不同。为此，需要对应使用 `transition-duration` 和 `transition-property`（逗号分隔），如：

```css
transition-property: color, background-color, border-color;
transition-duration: .25s, .75s, 2s;
```

## 延时

延迟时间直接加到 `transition` 后面：

```css
transition: 2s 4s;
```

延迟不仅对动画开始有效，对动画反转回到起点也有效。例如上面的代码，动画会延迟 4 秒后开始；结束后会延迟 4 秒后再回到起始状态。（注意，鼠标在图片上停留至少4秒动画才会开始。{{因为一旦移出，进入反转动画状态。}}）

```css
transition-delay: .5s;
```

有时不想让所有属性都延时触发，可以为每个属性分别指定延时：

```css
transition-property: color, background-color, border-color;
transition-duration: 1s, 1s, .5s;
transition-delay: 0, 0, 1s;
```

在某些浏览器中左右移动的动画可能不够流畅。使用 `translateX` 替代 `left`，会更流畅，适合移动绝对或相对定位的元素。

```css
img.tilt {
    width: 300px; height: 300px; float: left;
    transition-property: opacity, translateX;
    transition-duration: 2s, 4s;
}
img.tilt:hover {
    opacity: .2;
    transform: translateX(60px);
}
```

## Easing 函数

CSS3动画默认使用 `ease`。可以使用其他缓动，如 `linear`：

```css
transition: 2s transform linear;
```

独立的属性是 `transition-timing-function`。改属性可以取五个值：`linear`, `ease`, `ease-in`, `ease-out`, `ease-in-out`. 若不指定该属性，默认使用 `ease`。

要观看这些缓动函数的区别，参见：**www.the-art-of-web.com/css/timing-function/**。

`transition-timing-function` 属性还接受 cubic-bezier 值。The Bezier curve plots the progress of the animation over time. By adjusting two control points you can control how the line curves: the steeper the line, the faster the animation, the flatter the line, the slower.

```css
transition-timing-function: cubic-bezier(.20, .96, .74, .07);
```

Cubic Bezier 曲线最好通过工具创建盒测试。参见：<https://matthewlein.com/tools/ceaser>

可以对不同的属性施加不同的缓动函数。

### Transition 速记

四个属性 `transition-property` `transition-duration` `transition-timing-function` `transition-duration` 可以合并成一个 `transition` 属性。空格分隔，分别列出要动画的属性、时常、缓动函数、延时：

```css
transition: all 1s ease-in .5s;
```

缓动函数和延时可不设

```css
transition: all 1s;
transition: background-color 1s;
```

属性位置只能填 `all` 或单个CSS属性。如果要动画多个属性，需要每个属性一个完整配置，逗号分隔。

```css
transition: color 1s, background-color 1s, border-color .5s 1s;
```