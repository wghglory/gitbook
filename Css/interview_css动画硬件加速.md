# [用 CSS 开启硬件加速来提高网站性能](http://www.cnblogs.com/rubylouvre/p/3471490.html)

* 只允许改变 transform、opacity，其它属性不要动，避免重新计算布局(reflow)
* 对动画元素应用 transform: translate3d(0, 0, 0)、will-change: transform 等，开启硬件加速
* 动画元素尽量用 fixed、absolute 定位方式，避免 reflow
* 对动画元素应用高一点的 z-index，减少复合层数量

## 硬件加速是非规范的

很多情况下，开启硬件加速确实能带来明显的性能提升，但是，这部分内容是非规范的，W3C并没有相关规范说明其中细节，所以通过一些技巧（例如transform: translate3d(0, 0, 0)）开启硬件加速是规范之外的行为，可能得到性能提升，也可能带来严重的性能问题。

### GPU 合成代价

GPU是独立的一部分，有自己的处理器、内存核数据处理模型，那么意味着通过 CPU 在内存里创建的图像数据无法直接与 GPU 共享，需要打包发送给GPU，GPU 收到后才能执行我们期望的一系列操作，这个过程需要时间，而打包数据需要内存。

需要的内存取决于：

* 复合层的数量
* 复合层的大小

如果复合层太多太大，内存会被迅速消耗，然后掉帧（卡顿、闪烁）现象，甚至浏览器/应用崩溃也就很合理了。

### 创建复合层

浏览器在一些情况下会创建复合层，例如：

显示复合层：

* 3D transforms: translate3d, translateZ and so on;
* `<video>, <canvas> and <iframe>` elements;
* animation of transform and opacity via Element.animate();
* animation of transform and opacity via СSS transitions and animations;
* position: fixed;
* will-change;

隐式复合层：

* 位于复合层之上的元素会被创建复合层（B 的 z-index 大于 A，对 A 做动画，B 也会被塞进独立的复合层）

很容易理解，A 在动画过程中可能会与 B 产生重叠，被 B遮住，那么 GPU 需要每帧对 A 图层做动画，然后再与B图层合成，才能得到正确结果，所以B无论如何都要被塞进复合层，连同 A 一起交给 GPU

隐式创建复合层主要出于重叠考虑，如果浏览器不确定会不会发生重叠，那么就要把不确定的东西都塞进复合层，所以，从这个角度看，高 z-index 原则是有道理的

### 硬件加速的优缺点

优点：

* 动画非常流畅，能达到 60fps
* 动画执行过程在独立线程里，不受计算密集的JS任务影响

缺点：

* 把元素塞进复合层时需要额外重绘，有时很慢（可能需要整页重绘）
* 复合层数据传递给GPU有额外时耗，取决于复合层的数量和大小，这在中低端设备可能会导致闪烁
* 每个复合层都要消耗一部分内存，移动设备上内存很贵，过多占用会导致浏览器/应用崩溃
* 存在隐式复合层的问题，不注意的话内存飙升
* 文字模糊，元素有时会变形

### 性能优化技巧

1. 尽量避免隐式复合层

复合层直接影响repaint、内存消耗：动画开始时创建复合层、结束时删除复合层，都会引起repaint，而动画开始时必须把图层数据发送给GPU，内存消耗集中在这里。两条建议：

* 给动画元素应用高z-index，最好直接作为body的子元素，对于嵌套很深的动画元素，可以复制一个到body下，仅用于实现动画效果
* 给动画元素应用will-change，浏览器会提前把这些元素塞进复合层，可以让动画开始/结束时更流畅些，但不能滥用，在不需要的时候赶紧去掉，减少内存消耗

2. 只改变 transform 和 opacity
3. 减少复合层的大小：减小width、height，减少传递给GPU的数据，由 GPU 做scale放大展示，视觉效果无差异（多用于纯色背景元素，对不太重要的图片也可以进行5%到10%的宽高压缩），例如：

```html
<div id="a"></div>
<div id="b"></div>

<style>
#a, #b {
    will-change: transform;
    background-color: #f00;
}

#a {
    width: 100px;
    height: 100px;
}

#b {
    width: 10px;
    height: 10px;
    transform: scale(10);
}
</style>
```

最终显示的两个红色块在视觉上没有差异，但减小了90%的内存消耗

4. 考虑对子元素动画与容器动画

容器动画可能存在不必要的内存消耗，比如子元素之间的空隙，也会被当做有效数据发送给GPU，如果对各个子元素分别应用动画，就能避免这部分的内存消耗

例如 12道太阳光线旋转，转容器就把容器整张图都发送给GPU，单独转12道光线就去掉了光线之间的11条空隙，能够节省一半内存

5. 早早关注复合层的数量和大小

从一开始就关注复合层，尤其是隐式创建的复合层，避免后期优化影响布局

复合层的大小比数量影响更大，但浏览器会做一些优化操作，把几个复合层整合成一个，叫 `Layer Squashing`，但有时一个大复合层比几个小复合层消耗的内存更多，有必要的话可以手动去掉这种优化：

6. 不要滥用硬件加速

没事不要乱加transform: translateZ(0)、will-change: transform等强制开启硬件加速的属性，GPU 合成存在缺点和不足，而且是非标准的行为，最好情况能带来显著性能提升，最坏情况可能会让浏览器崩溃

---

CSS animations, transforms 以及 transitions 不会自动开启GPU加速，而是由浏览器的缓慢的软件渲染引擎来执行。当浏览器检测到页面中某个 DOM元素应用了某些 CSS 规则时就会开启，最显著的特征的元素的 3D 变换。

虽然我们可能不想对元素应用3D变换，可我们一样可以开启3D引擎。例如我们可以用 `transform: translateZ(0);` 来开启硬件加速 。

```css
.cube {
   transform: translateZ(0);
   /* Or */
   transform: rotateZ(360deg);
   /* Other transform properties here */
}
```

在 Chrome and Safari中，当我们使用 CSS transform 或者 animation 时可能会有页面闪烁的效果，下面的代码可以修复此情况：

```css
.cube {
   backface-visibility: hidden;
   perspective: 1000;
   /* Other transform properties here */
}
```

在webkit内核的浏览器中，另一个行之有效的方法是

```css
cube {
   transform: translate3d(0, 0, 0);
  /* Other transform properties here */
}
```

原生的移动端应用(Native mobile applications)总是可以很好的运用GPU，这是为什么它比网页应用(Web apps)表现更好的原因。硬件加速在移动端尤其有用，因为它可以有效的减少资源的利用。

在使用动画的时候不要用 top, left, 使用 transform: translate. Render tree 的元素被分到图层中，图层被 GPU 形成渲染文理。**transform 属性不会触发浏览器的 repaint，而 left 和 top 则会一直触发 repaint**.

## 使用硬件加速的注意事项

* 不能让每个元素都启用硬件加速，这样会暂用很大的内存，使页面会有很强的卡顿感。
* GPU渲染会影响字体的抗锯齿效果。这是因为 GPU 和 CPU 具有不同的渲染机制，即使最终硬件加速停止了，文本还是会在动画期间显示得很模糊。

## 总结

* 使用 GPU 可以优化动画效果
* GPU 渲染动会达到 60fps
* 使用对 GPU 友好的 CSS 属性
* 理解强制触发硬件加速的 transform 技巧

如果仅仅为了开启硬件加速而随便乱用，那是不明智的。小心使用这些方法，如果通过你的测试，结果确是提高了性能，你才可以使用这些方法。使用GPU可能会导致严重的性能问题，因为它增加了内存的使用，而且它会减少移动端设备的电池寿命。

### reference

<http://www.ayqy.net/blog/css%E5%8A%A8%E7%94%BB%E4%B8%8Egpu/>
