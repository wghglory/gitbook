# [Flex box](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)

学习：<http://flexboxfroggy.com/#zh-cn>

## flex 多列

```css
.container {
  display: flex;
}
.initial {
  flex: initial;
  width: 200px;
  min-width: 100px;
}
.none {
  flex: none;
  width: 200px;
}
.flex1 {
  flex: 1;
}
.flex2 {
  flex: 2;
}
```

## 居中

```css
.vertical-container {
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

## flex container

```css
.container {
  display: flex; /* or inline-flex */
  flex-direction: row | row-reverse | column | column-reverse;
  flex-wrap: nowrap | wrap | wrap-reverse;
  flex-flow: <'flex-direction'> || <'flex-wrap'>;
  justify-content: flex-start | flex-end | 'center' | 'space-between' | space-around | 'space-evenly';
  align-items: flex-start | flex-end | center | baseline | stretch;
  align-content: flex-start | flex-end | center | space-between | space-around | stretch;
}
```

### justify-content

![justify-content](https://cdn.css-tricks.com/wp-content/uploads/2013/04/justify-content-2.svg)

`justify-content: flex-start | flex-end | center | space-between | space-around | space-evenly;`

`justify-content` 中使用多的有 `center, space-between, space-evenly`

* `flex-start` (default): items are packed toward the start line
* `flex-end`: items are packed toward to end line
* `center`: items are centered along the line
* `space-between`: items are evenly distributed in the line; first item is on the start line, last item on the end line
* `space-around: items are evenly distributed in the line with equal space around them. Note that visually the spaces aren't equal, since all the items have equal space on both sides. The first item will have one unit of space against the container edge, but two units of space between the next item because that next item has its own spacing that applies.
* `space-evenly`: items are distributed so that the spacing between any two items (and the space to the edges) is equal.

### align-items

![align-items](https://cdn.css-tricks.com/wp-content/uploads/2014/05/align-items.svg)

This defines the default behavior for how flex items are laid out along the cross axis on the current line.

```css
.container {
  align-items: flex-start | flex-end | center | baseline | stretch;
}
```

* `flex-start`: cross-start margin edge of the items is placed on the cross-start line
* `flex-end`: cross-end margin edge of the items is placed on the cross-end line
* `center`: items are centered in the cross-axis
* `baseline`: items are aligned such as their baselines align
* `stretch` (default): stretch to fill the container (still respect min-width/max-width)

### align-content (多行才起作用)

![align-content](https://css-tricks.com/wp-content/uploads/2013/04/align-content.svg)

This aligns a flex container's lines within when there is extra space in the cross-axis, similar to how justify-content aligns individual items within the main-axis.

> Note: this property has no effect when there is only one line of flex items.

```css
.container {
  align-content: flex-start | flex-end | center | space-between | space-around | stretch;
}
```

* `flex-start`: lines packed to the start of the container
* `flex-end`: lines packed to the end of the container
* `center`: lines packed to the center of the container
* `space-between`: lines evenly distributed; the first line is at the start of the container while the last one is at the end
* `space-around`: lines evenly distributed with equal space around each line
* `stretch` (default): lines stretch to take up the remaining space

### flex-direction

![flex-direction](https://css-tricks.com/wp-content/uploads/2013/04/flex-direction2.svg)

### flex-wrap

![flex-wrap](https://css-tricks.com/wp-content/uploads/2014/05/flex-wrap.svg)

## flex items

### flex

This is the shorthand for `flex-grow, flex-shrink and flex-basis` combined. The second and third parameters (flex-shrink and flex-basis) are optional. Default is `0 1 auto`. 只设置一个参数是比例 `flex-grow`

```css
.item {
  flex: none | [ <'flex-grow'> <'flex-shrink'>? || <'flex-basis'> ]
}
```

### align-self

![align-self](https://css-tricks.com/wp-content/uploads/2014/05/align-self.svg)

This allows the default alignment (or the one specified by align-items) to be overridden for individual flex items.

Please see the align-items explanation to understand the available values.

```css
.item {
  align-self: auto | flex-start | flex-end | center | baseline | stretch;
}
```

> Note that float, clear and vertical-align have no effect on a flex item.

### order

![order](https://css-tricks.com/wp-content/uploads/2013/04/order-2.svg)

```css
.item {
  order: <integer>;
}
```

### flex-grow

![flex-grow](https://css-tricks.com/wp-content/uploads/2014/05/flex-grow.svg)

每个 item 占用比例

```css
.item {
  flex-grow: <number>; /* default 0 */
}
```

### flex-basis

This defines the default size of an element before the remaining space is distributed. It can be a length (e.g. 20%, 5rem, etc.) or a keyword. The auto keyword means "look at my width or height property" (which was temporarily done by the main-size keyword until deprecated). The content keyword means "size it based on the item's content" - this keyword isn't well supported yet, so it's hard to test and harder to know what its brethren max-content, min-content, and fit-content do.

```css
.item {
  flex-basis: <length> | auto; /* default auto */
}
```

If set to 0, the extra space around content isn't factored in. If set to auto, the extra space is distributed based on its flex-grow value.

![flex-basis](https://www.w3.org/TR/css-flexbox-1/images/rel-vs-abs-flex.svg)

### flex-shrink

This defines the ability for a flex item to shrink if necessary.

```css
.item {
  flex-shrink: <number>; /* default 1 */
}
```

> Negative numbers are invalid.

## reference

<http://www.jqhtml.com/6319.html>