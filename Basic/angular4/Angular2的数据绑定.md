# Angular2 的数据绑定

## 分类

1.  方括号单向数据绑定。

    `[目标]="表达式"`: 数据流动方向为组件 --> 模板

1.  字符串插值绑定。

    `{{表达式}}`: 数据流动方向为组件 --> 模板

1.  圆括号单向数据绑定。

    `(目标)="表达式"`: 数据流动方向为模板 --> 组件。通常用来处理事件。

1.  双向绑定。

    `[(目标)]="表达式"`: 数据流动方向为模板 <--> 组件

## 使用

### 方括号单向数据绑定

绑定属性时需要分清属性(property)和特性(attribute)绑定，绑定样式时有四种可选操作

#### property 绑定

property 是存在于 DOM 里的，例如 input 元素的 value 属性。

```html
<input class="form-control" [value]="model.getProduct(1)?.name || 'None'" />
```

* 为了防止表达式返回 null，在表达式后面跟上一个?
* 每个元素的 property 可以参考[文档](http://developer.mozilla.org/en-US/docs/Web/API/)

#### attribute 绑定

attribute 是存在于 HTML 元素里的，不是所有的 HTML 元素的 property 都和 attribute 相符，比如说 colspan。NG 提供了绑定 attribute 属性的解决办法。

```html
<td [attr.colspan]="model.getProducts().length">
    {{model.getProduct(1)?.name || 'None'}}
</td>
```

#### 类和样式绑定

可以直接绑定 HTML 元素的样式或者类，也可以使用 NG 提供的指令达到目标。

##### 类绑定

有三种方式。

* `[class]="表达式"`: 把表达式的结果替代原来存在的 class

```html
[class]="getClasses(1)"
```

* [class.myClass]="表达式": 根据表达式返回结果添加 myClass 这个类

```html
[class.myClass]="model.getProduct(2).price < 50"
```

* [ngClass]="map": 把 map 对象的值添加到 class 里去，支持三种返回值:字符串,数组,对象

```typescript
//html
[ngClass] = 'map';
//ts
map = {
  'text-xs-center bg-danger': product.name == 'Kayak',
  'bg-info': product.price < 50,
};
```

#### 样式绑定

同样三种方式。不过没有替换样式的写法。

* `[style.color]="表达式"`: 把表达式的结果设置成单个样式属性。

* `[style.font-size.em]="表达式"`: 把表达式的结果设置成指定的样式和单位值。

* `[ngStyle]="map"`: 把样式设置成 map 对象的值。

```typescript
//ts
map = {
  fontSize: '30px',
  'margin.px': 100,
  color: product.price > 50 ? 'red' : 'green',
};
```

### 字符串插值绑定

它被用于宿主元素的文本内容中。也是一种单向数据绑定，常常用于显示某个数据。

```html
<p>{{data||getData()}}</p>
```

### 圆括号单向数据绑定（事件绑定）

* 事件绑定用于响应宿主元素发送的事件。是用户交互的核心。事件种类请参考[文档](http://developer.mozilla.org/en-US/docs/Web/Events)

```html
<td (mouseover)="selectedProduct=item.name">{{i + 1}}</td>
```

* 也可以直接传入一个 Event 对象到组件里去。

```html
<input class="form-control" (input)="getEvent($event)" />
```

* 当需要传入 HTML 元素到组件时，可以借助模板引用变量

```html
<input #product class="form-control" (input)="false" />
```

### 使用双向数据绑定

* 使用 ngModel 指令可以简化了双向绑定的语法。

```html
<input class="form-control" [(ngModel)]="selectedProduct" />
```

* 其实 NG 中的双向绑定就是同时利用了两个方向上的单向绑定,拆开看其实就是：

```html
< input class="form-control" [ngModel]="selectedProduct" (ngModelChange)="selectedProduct=$event.target.value" />
```

## 实现原理

NG 不像 angular1.x 使用脏检查来更新数据，而是使用了 `zone.js` 库来监视数据的变更，当组件里的数据发生了改变，NG 会渲染模板 DOM。当 DOM 的事件被触发了，NG 会改变组件里的数据。
