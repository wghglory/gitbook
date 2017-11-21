# Vue Components' Communication by props and event

## Parent to Child -- props

props 用于 parent component 发送到 child component。

_App.vue_:

```html
<template>
  <app-child v-bind:msg="message"></app-child>
</template>

<script>
import Child from './components/Child.vue'

export default {
  components: {
    'app-child': Child
  },
  data() {
    return {
      message: 'hello'
    }
  }
}
</script>
```

_Child.vue_:

```html
<template>
  <div>{{ msg }}</div>
</template>

<script>
  export default {
    // props: ['msg'],
    props: {
      'msg': {
        type: String,
        required
      }
    },

    data() {
      return {
      }
    }
  }
</script>
```

需要注意的点：

1. Parent 使用 `v-bind` 进行 props 传递, Child 用 props 接收
1. Child props 也可以完成 validation

## primitive and reference types

* primitive types: string, number, boolean
* reference types: array, object

假设 Parent 传递的 props 是一个 array，这个 array 的 props 被多个 Child 使用，则在一个 Child 中进行修改 array，其实是修改了 data source，因为是通过引用传递的。这样其他 Child 的数据也会被改变。对数据共享来说是好事。Children 之间没有对 reference types 进行隔离。

如果 Parent 传递的 props 是 primitive types，一个 Child 修改只影响自身，其他 Child 不会被修改。如果希望数据同步，有这两做法：

1. 被修改的 Child emit event，Parent 订阅这个 event，回调函数中修改属性，这样所以 Children 重新渲染
1. 不通过 Parent，希望 Child2 直接关注 Child1 的状态，使用 event bus

## Child to Parent -- Event

_App.vue_: 父级通过 `v-on:子组件 emit 名字 = 回调函数` 实现对子组件事件的订阅。回调函数进行数据处理。

```html
<template>
  <div>
    <app-header v-bind:title="title" v-on:changeTitle="updateTitle($event)"></app-header>
    <app-footer v-bind:title="title"></app-footer>
  </div>
</template>

<script>
import Header from './components/Header.vue';
import Footer from './components/Footer.vue';

export default {
  components: {
    'app-header': Header,
    'app-footer': Footer
  },
  data () {
    return {
      title: 'Vue Wizards'
    }
  },
  methods: {
    updateTitle: function(updatedTitle){
      this.title = updatedTitle;
    }
  }
}
</script>
```

_Header.vue_: 子组件在某个函数中 emit 某个自定义事件和数据 -- `this.$emit('changeTitle', 'Vue Ninjas');`

```html
<template>
  <h1 v-on:click="changeTitle">{{ title }}</h1>
</template>

<script>
export default {
    props: {
      title: {
        type: String,
        required: true
      }
    },
    data(){
      return{ }
    },
    methods: {
      changeTitle: function(){
        this.$emit('changeTitle', 'Vue Ninjas');
      }
    }
}
</script>
```

_Footer.vue_: 另一个子组件因为父级 title props 改变而重新渲染，数据也就改变了。

```html
<template>
  <footer>
    <p>Copyright 2017 {{ title }}</p>
  </footer>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true
    }
  },
  data(){
    return{
    }
  }
}
</script>
```

## Event bus

Event bus is a vue instance.

_main.js_:

```javascript
export const bus = new Vue();
```

_Header.vue_: 引起变化的子组件。

```html
<template>
  <h1 v-on:click="changeTitle">{{ title }}</h1>
</template>

<script>
// 引入 event bus
import { bus } from '../main';

export default {
  props: {
    title: {
      type: String,
      required: true
    }
  },
  data(){
    return{
    }
  },
  methods: {
    changeTitle: function(){
      // 修改自己的 title 属性
      this.title = 'Vue Ninjas';
      // 向 bus emit 事件
      bus.$emit('titleChanged', 'Vue Ninjas');
    }
  }
}
</script>
```

_Footer.vue_: 关心 Header 的子组件。

```html
<template>
  <footer>
    <p>Copyright 2017 {{ title }}</p>
  </footer>
</template>

<script>
// 引入 event bus
import { bus } from '../main';

export default {
  props: {
    title: {
      type: String,
      required: true
    }
  },
  data(){
    return{
    }
  },
  // 生命周期钩子，创建时候 bus 就订阅事件
  created(){
    bus.$on('titleChanged', (data) => {
      this.title = data;
    });
  }
}
</script>
```
