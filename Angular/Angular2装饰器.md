# Angular 2 装饰器

装饰器是一个函数，它将元数据添加到类、类成员（属性、方法）和函数参数。

装饰器是一个 JavaScript 的语言特性，装饰器在 TypeScript 里已经实现，并被推荐到了 ES2016（也就是 ES7）。

要想应用装饰器，把它放到被装饰对象的上面或左边。

Angular 使用自己的一套装饰器来实现应用程序各部件之间的相互操作

`@NgModule` 装饰器，它接收一个用来描述模块属性的元数据对象。其中最重要的属性是：

    declarations - 声明本模块中拥有的视图类。 Angular 有三种视图类：组件、指令和管道。
    exports - declarations 的子集，可用于其它模块的组件模板。
    imports - 本模块声明的组件模板需要的类所在的其它模块。
    providers - 服务的创建者，并加入到全局服务列表中，可用于应用任何部分。
    bootstrap - 指定应用的主视图（称为根组件），它是所有其它视图的宿主。只有根模块才能设置bootstrap属性。

`@Component` 组件装饰器，它把紧随其后的类标记成了组件类。能接受一个配置对象， Angular 会基于这些信息创建和展示组件及其视图。

    moduleId - 为与模块相关的 URL（例如templateUrl）提供基地址。
    selector - CSS 选择器，它告诉 Angular 在父级 HTML 中查找<hero-list>标签，创建并插入该组件。 例如，如果应用的 HTML 包含<hero-list></hero-list>， Angular 就会把HeroListComponent的一个实例插入到这个标签中。
    templateUrl - 组件 HTML 模板的模块相对地址，如前所示。
    providers - 组件所需服务的依赖注入提供商数组。 这是在告诉 Angular：该组件的构造函数需要一个HeroService服务，这样组件就可以从服务中获得数据

`@Injectable` 装饰器，声明当前类有一些依赖，当依赖注入器创建该类的实例时，这些依赖应该被注入到构造函数中。

`@Pipe({...})`装饰器，声明当前类是一个管道，并且提供关于该管道的元数据

`@Directive` 装饰器，声明当前类是一个指令，并提供关于该指令的元数据

`@Input() @Output() @HostBinding @HostListener @ContentChild` 装饰器:

| 装饰器                                                | 介绍                                                                                                  |
| ----------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `@Input() myProperty;`                                | 声明一个输入属性，以便我们可以通过属性绑定更新它。(比如： `<my-cmp [my-property]="someExpression">`). |
| `@Output() myEvent = new EventEmitter();`             | 声明一个输出属性，以便我们可以通过事件绑定进行订阅。(比如：`<my-cmp (my-event)="doSomething()">`).    |
| `@HostBinding('[class.valid]') isValid;`              | 把宿主元素的属性(比如 CSS 类：`valid`)绑定到指令/组件的属性(比如：`isValid`)。                        |
| `@HostListener('click', ['$event']) onClick(e) {...}` | 通过指令/组件的方法(例如`onClick`)订阅宿主元素的事件(例如`click`)，可选传入一个参数(`$event`)。       |
| `@ContentChild(myPredicate) myChildComponent;`        | 把组件内容查询(`myPredicate`)的第一个结果绑定到类的`myChildComponent`属性。                           |
| `@ContentChildren(myPredicate) myChildComponents;`    | 把组件内容查询(`myPredicate`)的全部结果，绑定到类的`myChildComponents`属性。                          |
| `@ViewChild(myPredicate) myChildComponent;`           | 把组件视图查询(`myPredicate`)的第一个结果绑定到类的`myChildComponent`属性。对指令无效。               |
| `@ViewChildren(myPredicate) myChildComponents;`       | 把组件视图查询(`myPredicate`)的全部结果绑定到类的`myChildComponents`属性。对指令无效                  |
