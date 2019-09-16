# vuex 数据管理

Vuex 是⼀个专为 Vue.js 应⽤开发的状态管理模式，集中式存储管理应⽤所有组件的状态。

Vuex 遵循“单向数据流”理念，易于问题追踪以及提⾼代码可维护性。

Vue 中多个视图依赖于同⼀状态时，视图间传参和状态同步⽐较困难，Vuex 能够很好解决该问题。

![vuex.png](../../assets/images/vuex.png)

## 整合 vuex

```bash
vue add vuex
```

### 核⼼概念

- state 状态、数据
- mutations 更改状态的函数
- actions 异步操作
- store 包含以上概念的容器

### 状态和状态变更

state 保存数据状态，mutations ⽤于修改状态(like reducer)

```js
// store.js

export default new Vuex.Store({
  state: { count: 0 },
  mutations: {
    increment(state, n = 1) {
      state.count += n;
    },
  },
});
```

使⽤状态，vuex/index.vue, commit like dispatch an action

```js
<template>
  <div>
    <div>冲啊，⼿榴弹扔了{{ $store.state.count }}个</div>
    <button @click="add">扔⼀个</button>
  </div>
</template>

<script>
export default {
  methods: {
    add() {
      this.$store.commit('increment');
    },
  },
};
</script>
```

### 派⽣状态 - getters

从 state 派⽣出新状态，类似计算属性

```js
export default new Vuex.Store({
  getters: {
    score(state) {
      return `共扔出：${state.count}`;
    },
  },
});
```

登录状态⽂字，App.vue

```html
<span>{{$store.getters.score}}</span>
```

### 动作 - actions

复杂业务逻辑，类似于 controller, effect。或者多个 commit 一起执行

```js
export default new Vuex.Store({
  actions: {
    incrementAsync({ commit }) {
      setTimeout(() => {
        commit('increment', 2);
      }, 1000);
    },
  },
});
```

使⽤ actions：

```js
<template>
  <div id="app">
    <div>冲啊，⼿榴弹扔了{{ $store.state.count }}个</div>
    <button @click="addAsync">蓄⼒扔俩</button>
  </div>
</template>

<script>
export default {
  methods: {
    addAsync() {
      this.$store.dispatch('incrementAsync');
    },
  },
};
</script>
```

## 模块化

按模块化的⽅式编写代码，store.js

```js
const count = {
  namespaced: true,
  // ...
};

export default new Vuex.Store({ modules: { a: count } });
```

使⽤变化，components/vuex/module.vue

```js
<template>
  <div id="app">
    <div>冲啊，⼿榴弹扔了{{ $store.state.a.count }}个</div>
    <p>{{ $store.getters['a/score'] }}</p>
    <button @click="add">扔⼀个</button> <button @click="addAsync">蓄⼒扔俩</button>
  </div>
</template>

<script>
export default {
  methods: {
    add() {
      this.$store.commit('a/increment');
    },
    addAsync() {
      this.$store.dispatch('a/incrementAsync');
    },
  },
};
</script>
```

## vuex 原理解析

初始化：Store 声明、install 实现，，vuex-my.js：

```js
let Vue;

function install(_Vue) {
  Vue = _Vue;

  // 这样store执⾏的时候，就有了Vue，不⽤import
  // 这也是为啥Vue.use必须在新建store之前
  Vue.mixin({
    beforeCreate() {
      // 这样才能获取到传递进来的store
      // 只有root元素才有store，所以判断⼀下
      if (this.$options.store) {
        Vue.prototype.$store = this.$options.store;
      }
    },
  });
}

class Store {
  constructor(options = {}) {
    this.state = new Vue({ data: options.state });
    this.mutations = options.mutations || {};
  }

  // 注意这⾥⽤箭头函数形式，后⾯actions实现时会有作⽤
  commit = (type, arg) => {
    this.mutations[type](this.state, arg);
  };
}

export default { Store, install };
```

### 实现 actions

```js
class Store {
  constructor(options = {}) {
    this.actions = options.actions;
  }

  dispatch(type, arg) {
    this.actions[type]({ commit: this.commit, state: this.state }, arg);
  }
}
```

### 实现 getters

```js
class Store {
  constructor(options = {}) {
    options.getters && this.handleGetters(options.getters);
  }

  handleGetters(getters) {
    this.getters = {}; // 定义this.getters
    // 遍历getters选项，为this.getters定义property
    // 属性名就是选项中的key，只需定义get函数保证其只读性
    Object.keys(getters).forEach((key) => {
      // 这样这些属性都是只读的

      Object.defineProperty(this.getters, key, {
        get: () => {
          // 注意依然是箭头函数
          return getters[key](this.state);
        },
      });
    });
  }
}
```
