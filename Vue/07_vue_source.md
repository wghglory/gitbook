# vue 工作机制

![Attachment.png](../../assets/images/Attachment-5447562.png)

模拟 Vue1.0 简易版：每个变量对应一个 watcher，程序变大时候性能变差。所以 vue2.0 引入了虚拟 DOM，每个组件对应一个 watcher。

![Attachment.png](../../assets/images/vue-work.png)

## 初始化

在 `new Vue()` 时会调⽤ `init()` 进⾏初始化，会初始化各种实例⽅法、全局⽅法、执⾏⼀些⽣命周期、 初始化 `props、data` 等状态。其中最重要的是 `data` 的「响应化」处理。

初始化之后调⽤ `$mount` 挂载组件，主要执⾏编译和⾸次更新

## 编译

编译模块分为三个阶段

1. parse：使⽤正则解析 `template` 中的 `vue` 的指令(v-xxx) 变量等等 形成抽象语法树 AST
2. optimize：标记⼀些静态节点，⽤作后⾯的性能优化，在 diﬀ 的时候直接略过
3. generate：把第⼀部⽣成的 AST 转化为渲染函数 render function

## 虚拟 dom

Virtual DOM 是 react ⾸创，Vue2 开始⽀持，就是⽤ JavaScript 对象来描述 dom 结构，数据修改的时候，我们先修改虚拟 dom 中的数据，然后数组做 diﬀ，最后再汇总所有的 diﬀ，⼒求做最少的 dom 操作，毕竟 js ⾥对⽐很快，⽽真实的 dom 操作太慢

```javascripton
// vdom

{
  "tag": "div",
  "props": {
    "name": "开课吧",
    "style": {
      "color": "red"
    },
    "onClick": "xx"
  },
  "children": [
    {
      "tag": "a",
      "text": "click me"
    }
  ]
}
```

```html
<div name="开课吧" style="color:red" @click="xx">
  <a>click me</a>
</div>
```

### 更新

数据修改触发 setter，然后监听器会通知进⾏修改，通过对⽐新旧 vdom 树，得到最⼩修改，就是 patch ，然后只需要把这些差异修改即可

## property/Dep/Watcher 对应关系

![image-20190810223709402](../../assets/images/image-20190810223709402.png)

## compile 原理

![image-20190810223609235](../../assets/images/image-20190810223609235.png)

## 代码

```javascript
// vue.js

class MyVue {
  constructor(options) {
    this.$options = options;

    this.$data = options.data;

    // 响应式处理
    this.observe(this.$data);

    new Compile(options.el, this);

    if (options.created) {
      options.created.call(this);
    }
  }

  // data 可能有嵌套，要递归
  observe(value) {
    // 这里只处理 object，demo 不处理 array 的响应式
    if (!value || typeof value !== 'object') {
      return;
    }

    Object.keys(value).forEach((key) => {
      // 响应式处理
      this.defineReactive(value, key, value[key]);
      // 代理data中的属性到vue根上
      this.proxyData(key);
    });
  }

  defineReactive(obj, key, val) {
    // recursive
    this.observe(val);

    const dep = new Dep(); // 每个dep实例和data中每个key有一对一关系

    Object.defineProperty(obj, key, {
      get() {
        // 依赖收集
        Dep.target && dep.addDep(Dep.target);
        return val;
      },
      set(newVal) {
        if (newVal !== val) {
          val = newVal;
          // console.log(key + ' is updated');
          dep.notify();
        }
      },
    });
  }

  // 在vue根上定义属性代理data中的数据
  proxyData(key) {
    // this 指的 MyVue 实例。把 $data 里面内容挂在到 instance 下
    Object.defineProperty(this, key, {
      get() {
        return this.$data[key];
      },
      set(newVal) {
        this.$data[key] = newVal;
      },
    });
  }
}

// 创建Dep：管理所有Watcher
class Dep {
  constructor() {
    // 存储所有依赖
    this.watchers = [];
  }

  addDep(watcher) {
    this.watchers.push(watcher);
  }

  notify() {
    this.watchers.forEach((watcher) => watcher.update());
  }
}

// 创建Watcher：保存data中数值和页面中的挂钩关系
class Watcher {
  constructor(vm, key, cb) {
    // 创建实例时立刻将该实例指向Dep.target便于依赖收集
    this.vm = vm;
    this.key = key;
    this.cb = cb;

    //触发依赖收集
    Dep.target = this;
    this.vm[this.key]; //触发依赖收集
    Dep.target = null;
  }

  // 更新
  update() {
    console.warn(this.key + '更新了！'); // DOM operation in future
    this.cb.call(this.vm, this.vm[this.key]);
  }
}
```

```javascript
// 遍历dom结构，解析指令和插值表达式
class Compile {
  // el-带编译模板，vm-KVue实例
  constructor(el, vm) {
    this.$vm = vm;
    this.$el = document.querySelector(el);

    // 把模板中的内容移到片段操作，dom操作会提⾼效率
    this.$fragment = this.node2Fragment(this.$el);
    // 执行编译，同时进⾏依赖收集
    this.compile(this.$fragment);
    // 放回$el中
    this.$el.appendChild(this.$fragment);
  }

  // 移动DOM 到 fragment，之后再放回来
  node2Fragment(el) {
    // 创建片段
    const fragment = document.createDocumentFragment();

    let child;
    while ((child = el.firstChild)) {
      fragment.appendChild(child);
    }
    return fragment;
  }

  compile(el) {
    const childNodes = el.childNodes;
    Array.from(childNodes).forEach((node) => {
      if (node.nodeType === 1) {
        // 元素
        // console.log('编译元素' + node.nodeName);
        this.compileElement(node);
      } else if (this.isInterpolation(node)) {
        // 插值表达式，只关心 {{xxx}}
        // console.log('编译插值文本' + node.textContent);
        this.compileText(node);
      }

      // 递归子节点
      if (node.children && node.childNodes.length > 0) {
        this.compile(node);
      }
    });
  }

  // 文本替换 {{xxxx}}
  compileText(node) {
    // console.log(RegExp.$1);
    // console.log(this.$vm[RegExp.$1]);

    // 表达式
    const exp = RegExp.$1;
    this.update(node, this.$vm, exp, 'text'); //  text 指令和 v-text 指令都调用同一方法
  }

  compileElement(node) {
    // 关心属性：k-text 最终会执行 text()。<div k-model="foo" k-text="test" @click="onClick">
    const nodeAttrs = node.attributes;
    Array.from(nodeAttrs).forEach((attr) => {
      // 规定：k-xxx="yyy"
      const attrName = attr.name; //k-xxx
      const exp = attr.value; //yyy
      if (this.isDirective(attrName)) {
        const dir = attrName.substring(2);
        this[dir] && this[dir](node, this.$vm, exp);
      }
      if (this.isEvent(attrName)) {
        const dir = attrName.substring(1);
        this.eventHandler(node, this.$vm, exp, dir);
      }
    });
  }

  // 事件处理理: 给node添加事件监听，dir-事件名称
  // 通过vm.$options.methods[exp]可获得回调函数
  eventHandler(node, vm, exp, dir) {
    let fn = vm.$options.methods && vm.$options.methods[exp];
    if (dir && fn) {
      node.addEventListener(dir, fn.bind(vm));
    }
  }

  isInterpolation(node) {
    return node.nodeType == 3 && /\{\{(.*)\}\}/.test(node.textContent);
  }

  isDirective(attr) {
    return attr.indexOf('k-') === 0;
  }

  isEvent(attr) {
    return attr.indexOf('@') === 0;
  }

  update(node, vm, exp, dir) {
    const updaterFn = this[dir + 'Updater'];
    updaterFn && updaterFn(node, this.$vm[exp]); // 首次初始化

    // 创建Watcher实例，依赖收集完成了
    new Watcher(this.$vm, exp, function(value) {
      updaterFn && updaterFn(node, value);
    });
  }

  text(node, vm, exp) {
    this.update(node, vm, exp, 'text');
  }
  textUpdater(node, value) {
    node.textContent = value;
  }

  html(node, vm, exp) {
    this.update(node, vm, exp, 'html');
  }
  htmlUpdater(node, value) {
    node.innerHTML = value;
  }

  model(node, vm, exp) {
    this.update(node, vm, exp, 'model');
    node.addEventListener('input', (e) => {
      vm[exp] = e.target.value;
    });
  }
  modelUpdater(node, value) {
    node.value = value;
  }
}
```

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Vue Reactive Demo</title>
  </head>

  <body>
    <div id="app">
      <p>Name: {{name}}</p>
      <p k-text="name"></p>
      <p>Age: {{age}}</p>
      <input type="text" k-model="name" />
      <button @click="changeName">Change name</button>
      <div k-html="html"></div>
    </div>
    <script src="./compile.js"></script>
    <script src="./vue-my.js"></script>

    <script>
      const app = new MyVue({
        el: '#app',
        data: {
          name: 'I am test.',
          age: 12,
          html: '<button>这是一个按钮</button>',
        },
        created() {
          console.log('开始啦');
          setTimeout(() => {
            this.name = '我是测试';
          }, 1500);
        },
        methods: {
          changeName() {
            this.name = '哈喽，开课吧';
            this.age = 1;
          },
        },
      });
    </script>
  </body>
</html>
```
