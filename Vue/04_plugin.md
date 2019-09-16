# Vue plugin

```js
// 插件定义
MyPlugin.install = function(Vue, options) {
  // 1. 添加全局⽅法或属性
  Vue.myGlobalMethod = function() {
    // 逻辑...
  };

  // 2. 添加全局资源
  Vue.directive('my-directive', {
    bind(el, binding, vnode, oldVnode) {
      // 逻辑...
    },
  });

  // 3. 注⼊组件选项

  Vue.mixin({
    created: function() {
      // 逻辑...
    },
  });

  // 4. 添加实例⽅法
  Vue.prototype.$myMethod = function(methodOptions) {
    // 逻辑...
  };
};

// 插件使⽤
Vue.use(MyPlugin);
```

## demo: move bus to a plugin

```js
// plugins/bus.js

class Bus {
  constructor() {}
  emit() {}
  on() {}
}

Bus.install = function(Vue) {
  // Vue.prototype.$bus = new Bus();
  Vue.prototype.$bus = new Vue(); // event bus
};

export default Bus;
```

Use this plugin:

```js
// main.js

import Bus from './plugins/bus';

Vue.use(Bus);
```
