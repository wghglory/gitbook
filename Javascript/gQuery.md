# gQuery

jquery原理 源码 核心架构 事件委托 插件机制

原型上 有对于 string、array、math 工具方法。选择器。模板引擎。extend。通过 extend 又扩充了对事件的封装。

```javascript
//定义一个对象 - 名字是$$
var $$ = function () {};

$$.prototype = {
  constructor: $$,
  init: function () {
    this.stringExtend();
    this.MathExtend();
    this.arrayExtend();
  },
  stringExtend: function () {
    String.prototype.formatString = function (data) {
      return this.replace(/@\((\w+)\)/g, function (match, key) {
        return typeof data[key] === "undefined"
          ? ''
          : data[key];
      });
    };

    /*trim是 ES5 新增的*/
    String.prototype.trim = function () {
      return this.replace(/(^\s*)|(\s*$)/g, "");
    };

    /*字符串-去掉前空白字符 */
    String.prototype.ltrim = function () {
      return this.replace(/(^\s*)/g, "");
    };

    String.prototype.rtrim = function () {
      return this.replace(/(\s*$)/g, "");
    };

    /* 将一个字符串的首字母大写，其它字符小写 */
    String.prototype.capitalize = function () {
      return this
        .trim()
        .replace(/^(\w{1})(.*)/g, function (match, g1, g2) {
          return g1.toUpperCase() + g2.toLowerCase();
        });
    };

    /* 将字符串中的下划线转换成中划线 */
    String.prototype.dashString = function () {
      return this.replace(/\_/g, '-');
    };

    /* 检测字符串是否是空串 */
    String.prototype.isEmpty = function () {
      return this.length === 0;
    };

    /* 找到一个字符串中所有数字 console.log('a55fdaf455454sfdsfaf'.findNum()); */
    String.prototype.findNum = function () {
      return this.match(/\d+/g);
    };

    /* 检测字符串是否包含特定的字符串 */
    String.prototype.includes = function (target) {
      return this.indexOf(target) !== -1;
    };

    /* 对字符串中的特殊字符进行转义，避免XSS */
    String.prototype.escapeHTML = function () {
      // 转义后的字符是可以直接设置成innerHTML的值。 replace(/&/g,
      // '&amp;')这条replace()调用一定要写在所有的特殊字符转义的前面，不然转换后有&符号的会再被转一次
      return this
        .replace(/&/g, '&amp;')
        .replace(/\</g, '&lt;')
        .replace(/\>/g, '&gt;')
        .replace(/\'/g, '&#39;')
        .replace(/\"/g, '&quot;');

      /*var strArr = this.split('');
             for(var pos = 0, l = strArr.length, tmp; pos < l; pos++) {
             tmp = strArr[pos];
             switch(tmp) {
             case '<':
             replaceArr(strArr, pos, '&lt;');
             break;
             case '>':
             replaceArr(strArr, pos, '&gt;');
             break;
             case '\'':
             replaceArr(strArr, pos, '&#39;');
             break;
             case '\"':
             replaceArr(strArr, pos, '&quot;');
             break;
             case '&':
             replaceArr(strArr, pos, '&amp;');
             break;
             default:;
             }
             }
             return strArr.join('');

             function replaceArr(arr, pos, item) {
             return arr.splice(pos, 1, item);
             }*/
    };

    /* 对字符串进行反转义 */
    String.prototype.unescapeHTML = function () {
      return this
        .replace(/&amp;/, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&#39;/g, '\'')
        .replace(/&quot;/g, '\"')
        .replace(/&#(\d+)/g, function ($0, $1) {
          return String.formCharCode(parseInt($1, 10));
        });
    };
    String.prototype.reverse = function () {
      return (this.toString())
        .split('')
        .reverse()
        .join('');
    };
  },
  arrayExtend: function () {
    /* 将数组清空，并返回这个数组的引用*/
    Array.prototype.clear = function () {
      this.length = 0;
      return this;
    };

    /* 返回数组第一项*/
    Array.prototype.first = function () {
      return this[0];
    };

    /* 返回数组最后一项*/
    Array.prototype.last = function () {
      return this[this.length - 1];
    };

    /*计算类*/
    function calc(arr, callback) {
      var ret;
      for (var i = 0; i < arr.length; i++) {
        ret = callback(arr[i], ret);
      }
      return ret;
    }

    Array.prototype.max = function () {
      return calc(this, function (item, max) {
        if (!(max > item)) {
          return item;
        } else {
          return max;
        }
      });
    };
    Array.prototype.min = function () {
      return calc(this, function (item, min) {
        if (!(min < item)) {
          return item;
        } else {
          return min;
        }
      });
    };
    Array.prototype.sum = function () {
      return calc(this, function (item, sum) {
        if (typeof(sum) == 'undefined') {
          return item;
        } else {
          return sum += item;
        }
      });
    };
    Array.prototype.avg = function () {
      if (this.length === 0) {
        return 0;
      }
      return this.sum(this) / this.length;
    };

    //数组的交，并，差集
    /* 返回数组与目标数组的交集组成的数组*/
    Array.prototype.intersect = function (target) {
      var originalArr = this.unique();
      var target = target.unique();
      return originalArr.filter(function (e, i, self) {
        for (var i = 0, l = target.length; i < l; ++i) {
          if (e === target[i]) {
            return true;
          }
        }
        return false;
      });
    };

    /* 返回数组与目标数组的并集组成的数组*/
    Array.prototype.union = function (target) {
      return this
        .concat(target)
        .unique();
    };

    /*返回数组与目标数组的差集组成的数组*/
    Array.prototype.diff = function (target) {
      var originalArr = this.unique(),
        target = target.unique();
      return originalArr.filter(function (e, i, self) {
        for (var i = 0, l = target.length; i < l; ++i) {
          if (e === target[i]) {
            return false;
          }
        }
        return true;
      });
    };

    /* ES5 ES6新增*/
    /*去除数组中的重复项*/
    Array.prototype.unique = function () {
      var a = [];
      var l = this.length;
      for (var i = 0; i < l; i++) {
        for (var j = i + 1; j < l; j++) {
          if (this[i] === this[j])
            j = ++i;
          }
        a.push(this[i]);
      }
      return a;
    };

    /* 对数组的每一项执行回调,这个方法没返回值*/
    Array.prototype.forEach = function (fn, ctx) {
      for (var i = 0, l = this.length; i < l; i++) {
        fn.call(ctx || null, this[i], i, this);
      }
    };

    /*对数组每项运行回调函数，返回由回调函数的结果组成的数组*/
    Array.prototype.map = function (fn, ctx) {
      var ret = [];
      for (var i = 0, l = this.length; i < l; i++) {
        ret.push(fn.call(ctx || null, this[i], i, this));
      }
      return ret;
    };

    /*对数组每项运行回调函数，返回使回调函数返回值为true组成的数组*/
    Array.prototype.filter = function (fn, ctx) {
      var ret = [];
      for (var i = 0, l = this.length; i < l; i++) {
        fn.call(ctx || null, this[i], i, this) && ret.push(this[i]);
      }
      return ret;
    };

    /*对数组每项运行回调函数，如果所有的回调函数都返回true, 则返回true*/
    Array.prototype.every = function (fn, ctx) {
      for (var i = 0, l = this.length; i < l; i++) {
        !!fn.call(ctx || null, this[i], i, this) === false;
        return false;
      }
      return true;
    };

    /*对数组每项运行回调函数，如果有一项回调函数返回true, 则返回true*/
    Array.prototype.some = function (fn, ctx) {
      for (var i = 0, l = this.length; i < l; i++) {
        !!fn.call(ctx || null, this[i], i, this) === true;
        return true;
      }
      return false;
    };

    /**
     * 从左向右（顺利）对数组的每一项(从第二项开始，即下标为1)运行回调函数。
     * 回调函数包含四个参数prev（上一次回调的返回值）, cur（当前数组项）, index（当前数组项的索引）, self（数组本身）
     */
    Array.prototype.reduce = function (callback) {
      var i = 1, //从数组第二个元素开始
        l = this.length,
        callbackRet = this[0];
      for (; i < l; ++i) {
        callbackRet = callback.call(null, callbackRet, this[i], i, this);
      }
      return callbackRet;
    };

    /**
     * 从右向左（逆序）对数组的每一项(从倒数第二项开始，即下标为arr.length - 2)运行回调函数。
     * 回调函数包含四个参数prev（上一次回调的返回值）, cur（当前数组项）, index（当前数组项的索引）, self（数组本身）
     */
    Array.prototype.reduceRight = function (callback) {
      var l = this.length,
        i = l - 2, //从数组倒数第二个元素开始
        callbackRet = this[l - 1]; //回调初始值为数组最后一个元素的值
      for (; i >= 0; --i) {
        callbackRet = callback.call(null, callbackRet, this[i], i, this);
      }
      return callbackRet;
    };

    /**
     * 返回目标值在数组中第一次出现的位置，搜索从左向右进行。
     * 如果目标值在数组中不存在，则返回-1。可以指定一个搜索起始位置。默认为0
     */
    Array.prototype.indexOf = function (target, start) {
      var l = this.length,
        start = ~~start; //可以指定一个搜索起始位置。默认为0。start不传，默认为undefined,~~undefined -> 0
      if (start < 0)
        start = 0; //如果指定的搜索位置小于0，则设置其开始搜索位置为0
      for (; start < l; ++start) {
        if (this[start] === target)
          return start;
        }
      return -1;
    };

    /**
     * 返回目标值在数组中的位置。搜索从右向左进行
     * 如果目标值在数组中不存在，则返回-1。可以指定一个搜索起始位置。默认为数组长度
     */
    Array.prototype.lastIndexOf = function (target, start) {
      var l = this.length;
      if (start === void 0)
        start = this.length;
      else if (start < 0)
        start = 0;
      for (; start >= 0; --start) {
        if (this[start] === target)
          return start;
        }
      return -1;
    };

    /**
     * 对于单一类型的数组，可以使用此方法去重。
     * 但这类数组：[ 'ff', 1, '1' ]会去重失败
     */
    Array.prototype.enhanceUnique = function () {
      var ret = [],
        tempMap = {},
        temp,
        i = 0,
        l = this.length,
        undef = void 0;
      for (; i < l; ++i) {
        temp = this[i];
        if (tempMap[temp] === undef) {
          ret.push(temp);
          tempMap[temp] = true;
        }
      }
      return ret;
    };

    /*去掉数组中的目标元素*/
    Array.prototype.without = function () {
      var args = []
          .slice
          .call(arguments)
          .unique(),
        i = 0,
        l = this.length,
        j = 0,
        k = args.length;

      for (; i < l; ++i) {
        for (; j < k; ++j) {
          if (this[i] === args[j]) {
            this.splice(i, 1);
          }
        }
        j = 0; //将j归0，以便下次循环
      }
      return this;
    };

    /* 递归将数组扁平化*/
    Array.prototype.flatten = function () {
      var ret = [],
        i = 0,
        l = this.length,
        tmp,
        toString = ({}).toString;
      for (; i < l; ++i) {
        tmp = this[i];
        if (toString.call(tmp) === '[object Array]') {
          ret = ret.concat(tmp.flatten());
        } else {
          ret.push(tmp);
        }
      }
      return ret;
    };

    /* 随机返回数组的一项*/
    Array.prototype.random = function (n) {
      // Math.floor():向下取整。Math.floor(1.8) -> 1 Math.ceil():向上取整。Math.ceil(1.1) -> 2 v
      // = Math.random() * n:会产生一个 0 < v < nv的数 v2 = Math.floor(Math.random() *
      // n)：v2为一个大于等于0，小于n的整数
      return this[Math.floor(Math.random() * n || this.length)];
    };

    /* 删除数组指定位置的项*/
    Array.prototype.removeAt = function (pos) {
      this.splice(pos, 1);
      return this;
    };

    /* 检测数组是否包含目标值*/
    Array.prototype.contains = function (target) {
      return this.some(function (e, i, self) {
        return e === target;
      });
    };
  },
  MathExtend: function () {},
  $id: function (id) {
    return document.getElementById(id);
  },
  //去除左边空格
  ltrim: function (str) {
    return str.replace(/(^\s*)/g, '');
  },
  //去除右边空格
  rtrim: function (str) {
    return str.replace(/(\s*$)/g, '');
  },
  //去除空格
  trim: function (str) {
    return str.replace(/(^\s*)|(\s*$)/g, '');
  },
  Ajax: function (URL, fn) {
    var xhr = createXHR(); //返回了一个对象，这个对象IE6兼容。
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status >= 200 && xhr.status < 300 || xhr.status == 304) {
          fn(xhr.responseText);
        } else {
          alert("错误的文件！");
        }
      }
    };
    xhr.open("get", URL, true);
    xhr.send();

    //闭包形式，因为这个函数只服务于ajax函数，所以放在里面
    function createXHR() {
      //本函数来自于《JavaScript高级程序设计 第3版》第21章
      if (typeof XMLHttpRequest != "undefined") {
        return new XMLHttpRequest();
      } else if (typeof ActiveXObject != "undefined") {
        if (typeof arguments.callee.activeXString != "string") {
          var versions = [
              "MSXML2.XMLHttp.6.0", "MSXML2.XMLHttp.3.0", "MSXML2.XMLHttp"
            ],
            i,
            len;

          for (i = 0, len = versions.length; i < len; i++) {
            try {
              new ActiveXObject(versions[i]);
              arguments.callee.activeXString = versions[i];
              break;
            } catch (ex) {
              //skip
            }
          }
        }

        return new ActiveXObject(arguments.callee.activeXString);
      } else {
        throw new Error("No XHR object available.");
      }
    }
  },
  tab: function (id) {
    // var frame = this;
    var box = document.getElementById(id);
    var spans = box.getElementsByTagName('span');
    var lis = box.getElementsByTagName('li');

    for (var i = 0; i < spans.length; i++) {
      spans[i].index = i;
      spans[i].onmouseover = function (e) {
        for (var i = 0; i < spans.length; i++) {
          spans[i].className = '';
          lis[i].className = '';
        }
        this.className = 'select'; // frame.getTarget(e).className = 'select';
        lis[this.index].className = 'select';
      };
    }

  },
  //随机数
  random: function (begin, end) {
    return Math.floor(Math.random() * (end - begin)) + begin;
  },
  // 简单的数据绑定formatString, @(time) => data[time].找到以@开头的字符串，然后用数据替换@之后同名数据 var user
  // = {     "name": "guanghui" }; console.log(formateString("欢迎@(name)来到百度世界",
  // user));
  formatString: function (str, json) {
    return str.replace(/@\((\w+)\)/g, function (match, key) {
      return typeof json[key] === "undefined"
        ? ''
        : json[key];
    });
  },
  //arttemplate语法
  bindTemplate: function (json, renderContainerId, tempId) {
    document.getElementById(renderContainerId).innerHTML = template(tempId, json);
  },
  artTemplate: function (id, html, json) {
    var render = template.compile(html);
    document.getElementById(id).innerHTML = render(json);
  },
  //给一个对象扩充功能
  extendMany: function () {
    var key,
      i = 0,
      len = arguments.length,
      target = null,
      copy;
    if (len === 0) {
      return;
    } else if (len === 1) {
      target = this;
    } else {
      i++;
      target = arguments[0];
    }
    for (; i < len; i++) {
      for (key in arguments[i]) {
        copy = arguments[i][key];
        target[key] = copy;
      }
    }
    return target;
  },
  extend: function (tar, source) {
    for (var i in source) {
      tar[i] = source[i];
    }
    return tar;
  },
  //数据类型检测
  isNumber: function (val) {
    return typeof val === 'number' && isFinite(val);
  },
  isBoolean: function (val) {
    return typeof val === "boolean";
  },
  isString: function (val) {
    return typeof val === "string";
  },
  isUndefined: function (val) {
    return typeof val === "undefined";
  },
  isObject: function (str) {
    if (str === null || typeof str === 'undefined') {
      return false;
    }
    return typeof str === 'object';
  },
  isNull: function (val) {
    return val === null;
  },
  isArray: function (arr) {
    if (arr === null || typeof arr === 'undefined') {
      return false;
    }
    return arr.constructor === Array;
  }
};

//在框架中实例化，这样外面使用的使用就不用实例化了
$$ = new $$();
$$.init();

/*method 1: 我们定义一个事件对象专门放置事件相关操作
var Event = function() {};
Event.prototype = {
    on: function(id, type, fn) {
        //var dom = document.getElementById(id);
        var dom = $$.isString(id) ? document.getElementById(id) : id;
        dom.addEventListener(type, fn, false);

        // if (dom.addEventListener) {
        //     dom.addEventListener(type, fn, false);
        // } else if (dom.attachEvent) { // old IE
        //     dom.attachEvent('on' + type, fn);
        // }
        // demo:
        // $$.event.on('btn', 'click', function() {
        //     alert('success');
        // });
    },
    off: function(id, type, fn) {
        //var dom = document.getElementById(id);
        var dom = $$.isString(id) ? document.getElementById(id) : id;
        dom.removeEventListener(type, fn);

        // if (dom.removeEventListener) {
        //     dom.removeEventListener(type, fn);
        // } else if (dom.detachEvent) {
        //     dom.detachEvent(type, fn);
        // }
    },
    click: function(id, fn) {
        this.on(id, 'click', fn);
    },
    mouseover: function(id, fn) {
        this.on(id, 'mouseover', fn);
    },
    mouseout: function(id, fn) {
        this.on(id, 'mouseout', fn);
    },
    hover: function(id, fnOver, fnOut) {
        if (fnOver) {
            this.on(id, "mouseover", fnOver);
        }
        if (fnOut) {
            this.on(id, "mouseout", fnOut);
        }
    },
    getEvent: function(e) {
        return e ? e : window.event;
    },
    getTarget: function(event) {
        var e = $$.getEvent(event);
        return e.target || e.srcElement;
    },
    preventDefault: function(event) {
        var e = $$.getEvent(event);
        if (e.preventDefault) {
            e.preventDefault();
        } else {
            e.returnValue = false;
        }
    },
    stopPropagation: function(event) {
        var e = $$.getEvent(event);
        if (e.stopPropagation) {
            e.stopPropagation();
        } else {
            e.cancelBubble = true;
        }
    }
};
$$.event = new Event();*/

$$.extend($$, {
  on: function (id, type, fn) {
    //var dom = document.getElementById(id);
    var dom = $$.isString(id)
      ? document.getElementById(id)
      : id;
    dom.addEventListener(type, fn, false);

    // if (dom.addEventListener) {     dom.addEventListener(type, fn, false); } else
    // if (dom.attachEvent) { // old IE     dom.attachEvent('on' + type, fn); }
    // demo: $$.event.on('btn', 'click', function() {     alert('success'); });
  },
  off: function (id, type, fn) {
    //var dom = document.getElementById(id);
    var dom = $$.isString(id)
      ? document.getElementById(id)
      : id;
    dom.removeEventListener(type, fn);

    // if (dom.removeEventListener) {     dom.removeEventListener(type, fn); } else
    // if (dom.detachEvent) {     dom.detachEvent(type, fn); }
  },
  click: function (id, fn) {
    this.on(id, 'click', fn);
  },
  mouseover: function (id, fn) {
    this.on(id, 'mouseover', fn);
  },
  mouseout: function (id, fn) {
    this.on(id, 'mouseout', fn);
  },
  hover: function (id, fnOver, fnOut) {
    if (fnOver) {
      this.on(id, "mouseover", fnOver);
    }
    if (fnOut) {
      this.on(id, "mouseout", fnOut);
    }
  },
  getEvent: function (e) {
    return e
      ? e
      : window.event;
  },
  getTarget: function (event) {
    var e = $$.getEvent(event);
    return e.target || e.srcElement;
  },
  preventDefault: function (event) {
    var e = $$.getEvent(event);
    if (e.preventDefault) {
      e.preventDefault();
    } else {
      e.returnValue = false;
    }
  },
  stopPropagation: function (event) {
    var e = $$.getEvent(event);
    if (e.stopPropagation) {
      e.stopPropagation();
    } else {
      e.cancelBubble = true;
    }
  }
});
```