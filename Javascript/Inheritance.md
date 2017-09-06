# Inheritance(继承)

### Compose Inheritance

##### example 1:

```javascript
// Base
var Person = function(name, age) {
    this.name = name;
    this.age = age;
}
Person.prototype = {
    constructor: Person,
    say: function() {
        console.log('Hello Everyone!');
    }
};

// 学生类,继承自人
var Student = function(name, age, lesson) {
    Person.call(this, name, age);  //继承了构造器属性
    // Person.apply(this, arguments);
    this.lesson = lesson;
};
Student.prototype = new Person();  //继承了Person.prototype
Student.prototype.getTeacher = function() {
    console.log("Mr Zhang");
};

//使用
var xiaoWang = new Student('wang', 20, 'javascript');
var xiaoLi = new Student('li', 30, 'javascript');
console.log(xiaoWang.name); //wang
console.log(xiaoWang.age); //20
console.log(xiaoWang.lesson); //javascript
console.log(xiaoLi.name);  //li
xiaoWang.say();  //'Hello Everyone!'
xiaoLi.say();  //'Hello Everyone!'
console.log(xiaoWang.say === xiaoLi.say);  //true
console.log(xiaoWang.getTeacher === xiaoLi.getTeacher);  //true
```

##### example 2:

```javascript
// 教师类,继承自人
var Teacher = function(name, age, subject) {
    Person.call(this, name, age);
    this.subject = subject;
};
Teacher.prototype = new Person();
Teacher.prototype.giveLecture = function() {
    console.log('网页平面');
};

//使用
var tc = new Teacher('zhang', 25, 'javascript');
console.log(tc.name);  //zhang
console.log(tc.age);  //25
console.log(tc.subject);  //javascript
tc.giveLecture();  //网页平面
tc.say(); //'Hello Everyone!'
console.log(tc.say === xiaoWang.say);   //true
```

##### example 3:

```javascript
//定义产品对象
function Base() {
  /*产品名称*/
  this.name = '';
  /*普通价格*/
  this.normalPrice = 144;
  /*团购价格*/
  this.youhuijia = 120;
  /*已经购买的人数*/
  this.buySum = 100;
  /*轮播图片列表*/
  this.images = [];
}
Base.prototype = {
  Constructor: Base,
  /*普通购买*/
  buy: function () {},
  /*绑定图片列表*/
  bindDOMImage: function () {
    var str = '';
    for (var i = 0, len = this.images.length; i < len; i++) {
      str += '<li>';
      str += '<img class="etalage_thumb_image" src="' + this.images[i].small + '" class="img-responsive" />';
      str += '<img class="etalage_source_image" src="' + this.images[i].small + '" class="img-responsive" />';
      str += '</li>';
    }
    $('#etalage').html(str);

    /*jquery插件实现的幻灯片特效*/
    $('#etalage').etalage({thumb_image_width: 250, thumb_image_height: 300});
  },
  /*绑定详细信息*/
  bindDOMDetail: function () {},
  /*绑定事件*/
  bindEvents: function () {},
  /*团购*/
  groupBuy: function () {},
  /*添加到购物车*/
  addCart: function () {}
};

//继承的固定格式
/*构造函数中写法*/

var Book = function () {
  Base.call(this, arguments);
  this.author = '糖葫芦';
  this.publisher = '清华大学出版社';
  this.pages = 333;
  this.publishTimes = 2;
  this.type = 'IT教育';
  this.publishTime = '2016-09-09';
};
/*原型写法*/
Book.prototype = new Base();
/*重写 覆盖基类方法*/
Book.prototype.bindDOMDetail = function () {

  var str = '';
  str += '<h1>' + this.name + '</h1>';
  str += '<ul class="rating">';
  str += '<li><a href="#" id="buyCount">' + this.buySum + '</a>人购买</li>';
  str += '<div class="clearfix"></div>';
  str += '</ul>';
  str += '<div class="price_single">';
  str += '<span class="reducedfrom" >$' + this.normalPrice + '</span>';
  str += '<span class="actual" >$' + this.youhuijia + '</span>';
  str += '<a href="#">优惠价</a>';
  str += '</div>';
  str += '<h2 class="quick">作者:</h2>';
  str += '<p class="quick_desc" >' + this.author + '</p>';
  str += '<h2 class="quick">出版日期:</h2>';
  str += '<p class="quick_desc" >' + this.publishTime + '</p>';
  str += '<h2 class="quick">出版社:</h2>';
  str += '<p class="quick_desc" >' + this.publisher + '</p>';
  str += '<h2 class="quick">页数:</h2>';
  str += '<p class="quick_desc" >' + this.pages + '</p>';
  str += '<h2 class="quick">分类:</h2>';
  str += '<p class="quick_desc" >' + this.type + '</p>';

  $('.bookdetail').html(str);
};

//Book.prototype.constructor = Book;
Book.prototype.readTry = function () {};
Book.prototype.readAll = function () {};

/*不能使用如下写法，因为这个写法相当于重新定义一个原型对象*/
//Book.prototype = {}
```

### ES2015 class extends

```javascript
// es6
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class ColorPoint extends Point {
    constructor(x, y, color) {
        // this.color = color; // ReferenceError
        super(x, y);
        this.color = color; // 正确
    }
}
// 子类的constructor方法没有调用super之前就使用this关键字会报错，而放在super方法之后就是正确的。
// 下面是生成子类实例的代码。

let cp = new ColorPoint(25, 8, 'green');
console.log(cp.x);
console.log(cp.y);
console.log(cp.color);
```