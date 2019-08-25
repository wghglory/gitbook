# Vue Mixin

混⼊ (mixin) 提供了⼀种分发 Vue 组件中可复⽤功能的灵活⽅式

```js
// 定义⼀个混⼊对象
var myMixin = {
  created: function() {
    this.hello();
  },
  methods: {
    hello: function() {
      console.log('hello from mixin!');
    },
  },
};

// 定义⼀个使⽤混⼊对象的组件
var Component = Vue.extend({ mixins: [myMixin] });
```

## demo:

```js
// mixins/emitter.js

// refer https://github.com/ElemeFE/element/blob/dev/src/mixins/emitter.js 参考 broadcast, dispatch

export default {
  methods: {
    // child 向 root 发
    $dispatch(eventName, data) {
      let parent = this.$parent;
      // 查找父元素
      while (parent) {
        // 父元素用$emit触发
        parent.$emit(eventName, data);
        // 递归查找父元素
        parent = parent.$parent;
      }
    },

    // current 向 children 发
    $broadcast(eventName, data) {
      broadcast.call(this, eventName, data);
    },
  },
};

function broadcast(eventName, data) {
  this.$children.forEach((child) => {
    // 子元素触发$emit
    child.$emit(eventName, data);
    if (child.$children.length) {
      // 递归调用，通过call修改this指向 child
      broadcast.call(child, eventName, data);
    }
  });
}
/* moved from main.js
Vue.prototype.$dispatch = function(eventName, data) {
  let parent = this.$parent;
  // 查找父元素
  while (parent) {
    // 父元素用$emit触发
    parent.$emit(eventName, data);
    // 递归查找父元素
    parent = parent.$parent;
  }
};

Vue.prototype.$broadcast = function(eventName, data) {
  broadcast.call(this, eventName, data);
}; */
```

Use the mixin in a component:

```js
<template>
</template>

<script>
import emitter from '@/mixins/emitter';

export default {
  mixins: [emitter],
  methods: {
    onInput(e) {
      this.$dispatch('validate'); // mixin emitter dispatch
    }
  }
};
</script>
```

