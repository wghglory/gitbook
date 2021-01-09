# 实现弹窗组件

弹窗这类组件的特点是它们在当前 vue 实例例之外独⽴立存在，通常挂载于 body；它们是通过 JS 动态创建的，不需要在任何组件中声明。常⻅见使⽤用姿势：

```javascript
this.$create(Notice, { title: '社会你杨哥喊你来搬砖', message: '提示信息', duration: 1000 }).show();
```

## create

create 函数⽤于动态创建指定组件实例并挂载⾄ body

```javascript
import Vue from 'vue';

// 创建指定组件实例并挂载于 body 上
export default function create(Component, props) {
  // 0. 创建 vue 实例
  const vm = new Vue({
    // render provides a function h, which renders VNode. render函数将传⼊入组件配置对象转换为虚拟dom
    render(h) {
      return h(Component, { props });
    },
  }).$mount(); // 执⾏行行挂载函数，但未指定挂载⽬目标，表示只执⾏行行初始化⼯工作。不允许直接挂在 body 上，后续通过 document.body 原生挂载

  // 1. 上面的 vm 去帮我们创建组件实例
  // Ctor = Vue.extend({ data });
  // new Ctor();

  // 2. 通过$children获取该组件实例
  console.log(vm.$root);
  const comp = vm.$children[0];

  // 3. append to body
  document.body.appendChild(vm.$el); // 虚拟 dom component instance .$el 找到 nativeElement

  // 4. clear func
  comp.remove = () => {
    document.body.removeChild(vm.$el);
    vm.$destroy();
  };

  // 5. 返回组件实例
  return comp;
}
```

## 创建通知组件，Notice.vue

```html
<template>
  <div v-if="isShow" class="modal">
    <h3>
      {{ title }}
      <button @click="hide">&times;</button>
    </h3>
    <p>{{ message }}</p>
  </div>
</template>

<script>
  export default {
    props: {
      title: {
        type: String,
        default: '',
      },
      message: {
        type: String,
        default: '',
      },
      duration: {
        type: Number,
        default: 10000,
      },
    },
    data() {
      return {
        isShow: false,
      };
    },
    methods: {
      show() {
        this.isShow = true;
        setTimeout(() => {
          this.hide();
        }, this.duration);
      },
      hide() {
        this.isShow = false;
        this.remove();
      },
    },
  };
</script>
```

## 使⽤ create api

测试 components/form/index.vue

```javascript
<script>
import Notice from '@/components/notice';
import create from '@/utils/create';

export default {
  methods: {
    onLogin() {
      // 弹窗实例
      let notice;

      this.$refs.loginForm.validate((isValid) => {
        notice = create(Notice, {
          title: 'xxx',
          message: isValid ? '登录！！！' : '有错！！！',
          duration: 10000
        });

        notice.show();
      });
    }
  }
};
</script>
```

## Understand render function

```javascript
render(h) {
  return h(tag, {props}, [children])
}
```

Render second parameter: createElement 函数

```javascripton
{
  // 与 `v-bind:class` 的 API 相同，
  // 接受⼀个字符串、对象或字符串和对象组成的数组
  "class": {
    "foo": true,
    "bar": false
  },
  // 与 `v-bind:style` 的 API 相同，
  // 接受⼀个字符串、对象，或对象组成的数组
  "style": {
    "color": "red",
    "fontSize": "14px"
  },
  // 普通的 HTML 特性
  "attrs": {
    "id": "foo"
  },
  // 组件 prop
  "props": {
    "myProp": "bar"
  },
  // DOM 属性
  "domProps": {
    "innerHTML": "baz"
  },
  // 事件监听器在 `on` 属性内，
  // 但不再⽀持如 `v-on:keyup.enter` 这样的修饰器。
  // 需要在处理函数中⼿动检查 keyCode。
  "on": {
    "click": this.clickHandler
  }
}
```

demo:

```javascript
// I want to render this html to UI: <div id="box" class="foo"><span>aaa</span></div>

// Vue create a component MyComp, in template we can <MyComp></MyComp>
Vue.component('MyComp', {
  // way1: won't work in vue-cli project since pre-compile is not supported
  // template: '<div id="box" class="foo"><span>aaa</span></div>'

  // way 2
  render(h) {
    return h('div', { class: { foo: true }, attrs: { id: 'box' } }, [
      h('span', 'test render function'),
    ]);
  },

  // way 3: jsx via babel loader sugar
  // render(h) {
  //   return (
  //     <div id="box" class="foo">
  //       <span>test render function</span>
  //     </div>
  //   );
  // }
});
```
