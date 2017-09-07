# [angular-1.3 之ng-model-options指令](http://www.cnblogs.com/liulangmao/p/4105157.html)

**ng-model-options**是angular-1.3新出的一个指令，允许我们控制ng-model何时进行同步。比如:

1. 当某个确定的事件被触发的时候
1. 在指定的防抖动延迟时间之后，这样视图值就会在指定的时间之后被同步到模型.

在angular-1.2版本就可以实现的ng-model双向绑定的核心代码:

```html
<input type="text" ng-model="name">
<p>Hello {{name}}</p>
```

它是实时同步更新的，input中每输入一个字，就立刻同步到数据模型。这是因为每次输入input都会触发一个input的事件，然后angular就会执行的$digest循环，直到模型稳定下来。我们不用手动设置任何事件监听来同步更新视图和模型。

然而由于每次键盘按下都会触发$digest循环，所以当你在输入input内容的时候，angular不得不处理所有绑定在scope上的watch监听。这样它执行的效率就取决于你在scope上绑定了多少watch监听、以及这些监听的回调函数是怎样的，这个代价是十分昂贵的。

如果我们能够自己控制$digest的触发，比如当用户停止输入300毫秒后触发，又或者是当input元素失去焦点的时候再触发，那不是更好么? 于是angular-1.3的ng-model-options就为我们做了这件事。

### 通过 updataOn 指定同步ng-model的时间

ng-model-options提供了一系列的选项去控制ng-model的更新。

通过updateOn参数我们可以定义input触发$digest的事件。举个栗子，我们希望当input失去焦点的时候更新模型，只需要按照如下的配置来实现:

```html
<input type="text" ng-model="name" ng-model-options="{ updateOn: 'blur' }">
<p>Hello {{name}}</p>
```

`ng-model-options="{ updateOn: 'blur' }"`告诉angular在input触发了onblur事件的时候再更新ng-model，而不是每次按下键盘就立即更新model。

[http://plnkr.co/edit/URMCoON9qDFnxdlyiDSS?p=preview ](http://plnkr.co/edit/URMCoON9qDFnxdlyiDSS?p=preview)

如果我们想要保留默认的更新模型事件，另外再给它添加其它触发$digest的事件，可以使用一个特殊的事件: default。通过空格分隔的字符串来给它添加多个事件。下面这段代码能够在输入的时候同步更新模型，并且当input失去焦点的时候也更新模型.

```html
<input type="text" ng-model="name" ng-model-options="{ updateOn: 'default blur' }"/>
<p>Hello {{name}}</p>
```

[http://plnkr.co/edit/6VtaJrCIuO5ePfoz8UXA?p=preview](http://plnkr.co/edit/6VtaJrCIuO5ePfoz8UXA?p=preview) 

(效果其实不太看不出来的...因为虽然blur的时候它在同步，但是其实输入的时候已经同步完了)

### 通过debounce延迟模型更新

接下来让我们看看怎么指定更新的延迟时间。我们可以通过ng-model-options来延迟模型的更新，以此来降低当用户和模型交互时触发的$digest循环的次数。这不仅减少了$digest循环的次数，同时也是处理异步数据模型时提升用户体验度的一个好方法。

想象有这样一个元素: input[type="search"]，每当用户正在输入的时候，数据模型就会更新，并且用最新的字段向后台提交请求。这样是没错的。然而我们很可能并不想让用户每次按键的时候就立刻更新模型，而是希望当用户输入完了一段有意义的搜索字段以后才更新模型。在这种情况下，我们正适合使用ng-model-options的debounce参数。debounce定义了模型更新的延迟毫秒数(需要是整数)。比如刚才提到的这种情况，我们希望当用户停止输入1000毫秒以后再更新模型，停止输入1000毫秒差不多应该就是输入完了一段有意义的内容了吧。我们可以像下面这样，定义debounce参数的值为1000。

```html
<input type="search" ng-model="searchQuery" ng-model-options="{debounce:1000}">
<p>Search results for: {{searchQuery}}</p>
```

现在当输入搜索内容的时候，会有1秒的延迟。[http://plnkr.co/edit/lpFwWsTvZxMGfHFe38Bk?p=preview ](http://plnkr.co/edit/lpFwWsTvZxMGfHFe38Bk?p=preview%20)

我们还可以做更多的配置: 为指定的事件指定延迟时间。为不同的事件指定不同的延时，可以通过给debounce属性定义一个json对象来实现: 属性名代表事件名，属性值代表延迟时间。如果某个事件不需要延迟，那么它的属性值就是0。

下面这个栗子实现了这样的模型: 当用户在input里输入的时候，延迟1000毫秒更新模型，但是当input元素失去焦点的时候，立刻更新模型:

```html
<input type="search" ng-model="searchQuery" ng-model-options="{updateOn:'default blur'，debounce:{default:1000，blur:0}}">
<p>Search results for: {{searchQuery}}</p>
```

[http://plnkr.co/edit/yYsfcjW8KVt9ZESQUSB2?p=preview ](http://plnkr.co/edit/yYsfcjW8KVt9ZESQUSB2?p=preview%20)

### 通过$rollbackViewValue同步模型和视图

由于我们通过ng-model-options来控制了模型的更新时间，所有在很多时候模型和视图就会出现不同步的情况。举个栗子，我们配置ng-model-options，让input在失去焦点的时候同步数据模型，当用户正在输入内容时，数据模型没有发生更新。

假设在这种情境下，你希望在数据模型更新前把视图上的值回滚到它真实的值。这时，$rollbackViewValue可以同步数据模型到视图。这个方法会把数据模型的值返回给视图，同时取消所有的将要发生的延迟同步更新事件。

```html
<div class="container" ng-controller="Rollback">
    <form role="form" name="myForm2" ng-model-options="{ updateOn: 'blur' }">
        <div class="form-group">
            <label>执行了 $rollbackViewValue() 方法</label>
            <input name="myInput1" ng-model="myValue1" class="form-control" ng-keydown="resetWithRollback($event)">
            <p>myValue1: "{{ myValue1 }}"</p>
        </div>

        <div class="form-group">
            <label>没有执行了 $rollbackViewValue() 方法</label>
            <input name="myInput2" ng-model="myValue2" class="form-control" ng-keydown="resetWithoutRollback($event)">
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

myValue1使用了$rollbackViewValue()方法，可以回滚文本域里的值和数据模型同步，但是myValue2是不能的。

> 需要特别注意的一点是，在使用了ng-model-options这种情况下，如果直接修改模型值，有时可能让视图同步，有时却不能，什么意思，看这个栗子:

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

按Esc的时候，不是直接回滚视图值到当前的数据模型，而是先设置数据模型为空，然后再回滚视图值。而myValue2，直接设置数据模型为空，不使用回滚。

在demo里多试几次就会发现，在这种情况下，在myValue2的input里按Esc，有时可以同步视图值为空，有时则不能。

所以，在用了ng-model-opitons的时候，如果在模型没有被视图同步之前需要让视图被模型同步，不能简单通过设置模型，必须使用$rollbackViewValue()方法。