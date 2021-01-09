# 组件化常用技术

## 组件传值、通信

### 1. 父组件 => 子组件：

- #### 属性 props

```javascript
// parent passes msg to child:
<HelloWorld msg="Welcome to Your Vue.js App" />;

// child props:
{
  msg: String;
}
```

- #### 引用 refs

```javascript
// parent attaches ref to child:
<HelloWorld ref="hw"/>

// parent
mounted() {
  this.$refs.hw.xx = 'xxx'
}
```

- #### 子组件 children

```javascript
<HelloWorld />

// parent
mounted() {
  this.$children[0].xx = 'xxx' // ❎子元素不保证顺序，所以 children[0] 可能不是想要的！！！无需 ref，少用
}
```

### 2. 子组件 => 父组件：自定义事件

```javascript
// child:
this.$emit('add', param)

// parent:
<Cart @add="cartAdd($event)"></Cart>

// ⚠️: 事件的监听者是 child，谁 emit 谁监听！helloWorld 监听了 @childEmit，只不过是 parent 执行了回调函数
```

### 3. 兄弟组件：通过共同祖辈组件

通过共同的祖辈组件搭桥，`$parent` 或 `$root`。

```javascript
// brother1
this.$parent.$on('foo', handle);

// brother2
this.$parent.$emit('foo');
```

### 4. 祖先和后代之间

> `provide/inject`：能够实现祖先给后代传值，常用高阶插件、组件库提供用例，**并不推荐直接用于应用程序代码中**。

```javascript
// ancestor
provide() { return {foo: 'foo value'} }

// descendant
inject: ['foo']
```

### 5. 任意两个组件之间：事件总线 或 vuex

- 事件总线：创建一个 Bus 类负责事件派发、监听和回调管理。

> 实践中可以直接用 Vue 替代 Bus，因为它已经实现了影响的功能

```javascript
// Bus：事件派发、监听和回调管理 class Bus{
class Bus {
  constructor() {
    /* {
      eventName1:[fn1,fn2],
      eventName2:[fn3,fn4],
    } */
    this.callbacks = {};
  }

  callbacks;

  $on(name, fn) {
    this.callbacks[name] = this.callbacks[name] || [];

    this.callbacks[name].push(fn);
  }
  $emit(name, args) {
    if (this.callbacks[name]) {
      this.callbacks[name].forEach((cb) => cb(args));
    }
  }
}

// main.js
Vue.prototype.$bus = new Bus();

// child1
this.$bus.$on('foo', handle);

// child2
this.$bus.$emit('foo');
```

- vuex：创建唯一的全局数据管理者 store，通过它管理数据并通知组件状态变更

## 插槽

Vue 2.6.0 之后采用全新 v-slot 语法取代之前的 slot、slot-scope

- #### 匿名插槽

```javascript
// comp1
<div>
	<slot></slot>
</div>

// parent
<comp>hello</comp>
```

- #### 具名插槽

```javascript
// comp2
<div>
  <slot></slot>
  <slot name="content"></slot>
</div>

// parent
<Comp2>
  <!-- 默认插槽用default做参数 -->
  <template v-slot:default>具名插槽</template>

  <!-- 具名插槽用插槽名做参数 -->
  <template v-slot:content>内容...</template>
</Comp2>
```

- #### 作用域插槽（数据部分来自父元素，部分来自子元素）

```javascript
// Comp3
<template>
  <div>
    <h4>作用域插槽</h4>
    <!-- 通过绑定指定作用域，部分数据来自子元素，部分来自父元素 -->
    <p><slot :foo="bar"></slot></p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      bar: 'bar value',
    };
  },
};
</script>

// parent
<Comp3>
  <!-- 把v-slot的值指定为作用域上下文对象 -->
  <template v-slot:default="ctx"> 来自子组件数据：{{ctx.foo}} </template>
</Comp3>
```

## 表单组件实现

- ### Input

  - 双向绑定：@input、:value 派发校验事件
  - 派发校验事件

  ```javascript
  <template>
    <div><input :value="value" @input="onInput" v-bind="$attrs" /></div>
  </template>

  <script>
  export default {
    inheritAttrs: false,
    props: { value: { type: String, default: '' } },
    methods: {
      onInput(e) {
        this.$emit('input', e.target.value);

        this.$parent.$emit('validate');
      },
    },
  };
  </script>
  ```

- ### FormItem

  - 给 Input 预留插槽 - slot
  - 能够展示 label 和校验信息
  - 能够进行校验

  ```javascript
  <template>
    <div>
      <label v-if="label">{{ label }}</label>
      <slot></slot>
      <p v-if="errorMessage">{{ errorMessage }}</p>
    </div>
  </template>

  <script>
  import Schema from 'async-validator';

  export default {
    inject: ['form'],
    props: {
      label: { type: String, default: '' },
      prop: { type: String },
    },
    data() {
      return { errorMessage: '' };
    },
    mounted() {
      this.$on('validate', () => {
        this.validate();
      });
    },

    methods: {
      validate() {
        // 做校验
        const value = this.form.model[this.prop];
        const rules = this.form.rules[this.prop]; // npm i async-validator -S
        const desc = { [this.prop]: rules };

        const schema = new Schema(desc); // return的是校验结果的Promise
        return schema.validate({ [this.prop]: value }, (errors) => {
          if (errors) {
            this.errorMessage = errors[0].message;
          } else {
            this.errorMessage = '';
          }
        });
      },
    },
  };
  </script>
  ```

- ### Form

  - 给 FormItem 留插槽
  - 设置数据和校验规则
  - 全局校验

  ```javascript
  <template>
    <div>
      <slot></slot>
    </div>
  </template>

  <script>
  export default {
    provide() {
      return { form: this };
    },
    props: { model: { type: Object, required: true }, rules: { type: Object } },
    methods: {
      validate(cb) {
        const tasks = this.$children.filter((item) => item.prop).map((item) => item.validate());

        // 所有任务都通过才算校验通过
        Promise.all(tasks)
          .then(() => cb(true))
          .catch(() => cb(false));
      },
    },
  };
  </script>
  ```

## 异步更新

```javascript
<span id="s">{{ foo }}</span>;

s.innerHTML; // foo 假设原始值 foo
this.foo = 'bar';
s.innerHTML; // foo

this.$nextTick(() => {
  s.innerHTML; // bar
});
```
