# [angular-1.3 之 ng-model-options 指令](http://www.cnblogs.com/liulangmao/p/4105157.html)

**ng-model-options**是 angular-1.3 新出的一个指令，允许我们控制 ng-model 何时进行同步。比如:

1.  当某个确定的事件被触发的时候
1.  在指定的防抖动延迟时间之后，这样视图值就会在指定的时间之后被同步到模型.

在 angular-1.2 版本就可以实现的 ng-model 双向绑定的核心代码:

```html
<input type="text" ng-model="name" />
<p>Hello {{name}}</p>
```

它是实时同步更新的，input 中每输入一个字，就立刻同步到数据模型。这是因为每次输入 input 都会触发一个 input 的事件，然后 angular 就会执行的\$digest 循环，直到模型稳定下来。我们不用手动设置任何事件监听来同步更新视图和模型。

然而由于每次键盘按下都会触发\$digest 循环，所以当你在输入 input 内容的时候，angular 不得不处理所有绑定在 scope 上的 watch 监听。这样它执行的效率就取决于你在 scope 上绑定了多少 watch 监听、以及这些监听的回调函数是怎样的，这个代价是十分昂贵的。

如果我们能够自己控制\$digest 的触发，比如当用户停止输入 300 毫秒后触发，又或者是当 input 元素失去焦点的时候再触发，那不是更好么?  于是 angular-1.3 的 ng-model-options 就为我们做了这件事。

### 通过 updataOn 指定同步 ng-model 的时间

ng-model-options 提供了一系列的选项去控制 ng-model 的更新。

通过 updateOn 参数我们可以定义 input 触发\$digest 的事件。举个栗子，我们希望当 input 失去焦点的时候更新模型，只需要按照如下的配置来实现:

```html
<input type="text" ng-model="name" ng-model-options="{ updateOn: 'blur' }" />
<p>Hello {{name}}</p>
```

`ng-model-options="{ updateOn: 'blur' }"`告诉 angular 在 input 触发了 onblur 事件的时候再更新 ng-model，而不是每次按下键盘就立即更新 model。

[http://plnkr.co/edit/URMCoON9qDFnxdlyiDSS?p=preview ](http://plnkr.co/edit/URMCoON9qDFnxdlyiDSS?p=preview)

如果我们想要保留默认的更新模型事件，另外再给它添加其它触发\$digest 的事件，可以使用一个特殊的事件: default。通过空格分隔的字符串来给它添加多个事件。下面这段代码能够在输入的时候同步更新模型，并且当 input 失去焦点的时候也更新模型.

```html
<input type="text" ng-model="name" ng-model-options="{ updateOn: 'default blur' }" />
<p>Hello {{name}}</p>
```

[http://plnkr.co/edit/6VtaJrCIuO5ePfoz8UXA?p=preview](http://plnkr.co/edit/6VtaJrCIuO5ePfoz8UXA?p=preview)

(效果其实不太看不出来的...因为虽然 blur 的时候它在同步，但是其实输入的时候已经同步完了)

### 通过 debounce 延迟模型更新

接下来让我们看看怎么指定更新的延迟时间。我们可以通过 ng-model-options 来延迟模型的更新，以此来降低当用户和模型交互时触发的$digest 循环的次数。这不仅减少了$digest 循环的次数，同时也是处理异步数据模型时提升用户体验度的一个好方法。

想象有这样一个元素: input[type="search"]，每当用户正在输入的时候，数据模型就会更新，并且用最新的字段向后台提交请求。这样是没错的。然而我们很可能并不想让用户每次按键的时候就立刻更新模型，而是希望当用户输入完了一段有意义的搜索字段以后才更新模型。在这种情况下，我们正适合使用 ng-model-options 的 debounce 参数。debounce 定义了模型更新的延迟毫秒数(需要是整数)。比如刚才提到的这种情况，我们希望当用户停止输入 1000 毫秒以后再更新模型，停止输入 1000 毫秒差不多应该就是输入完了一段有意义的内容了吧。我们可以像下面这样，定义 debounce 参数的值为 1000。

```html
<input type="search" ng-model="searchQuery" ng-model-options="{debounce:1000}" />
<p>Search results for: {{searchQuery}}</p>
```

现在当输入搜索内容的时候，会有 1 秒的延迟。[http://plnkr.co/edit/lpFwWsTvZxMGfHFe38Bk?p=preview ](http://plnkr.co/edit/lpFwWsTvZxMGfHFe38Bk?p=preview%20)

我们还可以做更多的配置: 为指定的事件指定延迟时间。为不同的事件指定不同的延时，可以通过给 debounce 属性定义一个 json 对象来实现: 属性名代表事件名，属性值代表延迟时间。如果某个事件不需要延迟，那么它的属性值就是 0。

下面这个栗子实现了这样的模型: 当用户在 input 里输入的时候，延迟 1000 毫秒更新模型，但是当 input 元素失去焦点的时候，立刻更新模型:

```html
<input
  type="search"
  ng-model="searchQuery"
  ng-model-options="{updateOn:'default blur'，debounce:{default:1000，blur:0}}"
/>
<p>Search results for: {{searchQuery}}</p>
```

[http://plnkr.co/edit/yYsfcjW8KVt9ZESQUSB2?p=preview ](http://plnkr.co/edit/yYsfcjW8KVt9ZESQUSB2?p=preview%20)

### 通过\$rollbackViewValue 同步模型和视图

由于我们通过 ng-model-options 来控制了模型的更新时间，所有在很多时候模型和视图就会出现不同步的情况。举个栗子，我们配置 ng-model-options，让 input 在失去焦点的时候同步数据模型，当用户正在输入内容时，数据模型没有发生更新。

假设在这种情境下，你希望在数据模型更新前把视图上的值回滚到它真实的值。这时，\$rollbackViewValue 可以同步数据模型到视图。这个方法会把数据模型的值返回给视图，同时取消所有的将要发生的延迟同步更新事件。

```html
<div class="container" ng-controller="Rollback">
  <form role="form" name="myForm2" ng-model-options="{ updateOn: 'blur' }">
    <div class="form-group">
      <label>执行了 $rollbackViewValue() 方法</label>
      <input
        name="myInput1"
        ng-model="myValue1"
        class="form-control"
        ng-keydown="resetWithRollback($event)"
      />
      <p>myValue1: "{{ myValue1 }}"</p>
    </div>

    <div class="form-group">
      <label>没有执行了 $rollbackViewValue() 方法</label>
      <input
        name="myInput2"
        ng-model="myValue2"
        class="form-control"
        ng-keydown="resetWithoutRollback($event)"
      />
      <p>myValue2: "{{ myValue2 }}"</p>
    </div>
  </form>
</div>
```

```javascript
app.controller('Rollback'，function($scope) {
    $scope.resetWithRollback = function(e) {
        if (e.keyCode == 27) {  // press esc
            $scope.myForm2.myInput1.$rollbackViewValue();
        }
    };
    $scope.resetWithoutRollback = function(e) {
        if (e.keyCode == 27) {  // press esc
            angular.noop()
        }
    }
});
```

[http://plnkr.co/edit/iMY8IqH5f8NLuIAxY8zN?p=preview ](http://plnkr.co/edit/iMY8IqH5f8NLuIAxY8zN?p=preview%20)

myValue1 使用了\$rollbackViewValue()方法，可以回滚文本域里的值和数据模型同步，但是 myValue2 是不能的。

> 需要特别注意的一点是，在使用了 ng-model-options 这种情况下，如果直接修改模型值，有时可能让视图同步，有时却不能，什么意思，看这个栗子:

```javascript
app.controller('Rollback'，function($scope) {
    $scope.resetWithRollback = function(e) {
        if (e.keyCode == 27) {
            $scope.myValue1 = ''; //使用了$rollbackViewValue，总是可以同步视图，清空myValue1值
            $scope.myForm2.myInput1.$rollbackViewValue();
        }
    };
    $scope.resetWithoutRollback = function(e) {
        if (e.keyCode == 27) { //并不是每次都可以成功的同步的，有时可以，有时不可以.
            $scope.myValue2 = '';
        }
    }
});
```

[http://plnkr.co/edit/vve2Xh7LROQLQFa6FFrn?p=preview](http://plnkr.co/edit/vve2Xh7LROQLQFa6FFrn?p=preview)

按 Esc 的时候，不是直接回滚视图值到当前的数据模型，而是先设置数据模型为空，然后再回滚视图值。而 myValue2，直接设置数据模型为空，不使用回滚。

在 demo 里多试几次就会发现，在这种情况下，在 myValue2 的 input 里按 Esc，有时可以同步视图值为空，有时则不能。

所以，在用了 ng-model-opitons 的时候，如果在模型没有被视图同步之前需要让视图被模型同步，不能简单通过设置模型，必须使用\$rollbackViewValue()方法。
