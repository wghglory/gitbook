# Vue typescript

## 准备⼯作

1. 新建⼀个基于 ts 的 vue 项⽬

`vue create vue-ts`

选项选择：

- ⾃定义选项 - Manually select features
- 添加 ts ⽀持 - TypeScript
- 基于类的组件 - y
- tslint

2. 已存在项⽬

`vue add @vue/typescript`

## Class and Function

class 是语法糖，它指向的就是构造函数。

```ts
class Person {
  // 类指向构造函数

  constructor(private name: string, private age: number) {
    // constructor是默认⽅法，new实例时⾃动调⽤
    this.name = name;
    // 属性会声明在实例上，因为this指向实例
    this.age = age;
  }

  public say() {
    // ⽅法会声明在原型上
    return '我的名字叫' + this.name + '今年' + this.age + '岁了';
  }
}

console.log(typeof Person); // function
console.log(Person === Person.prototype.constructor); // true

// 等效于
function Person(name, age) {
  this.name = name;

  this.age = age;
}
Person.prototype.say = function() {
  return '我的名字叫' + this.name + '今年' + this.age + '岁了';
};
```

## Generic and Decorator

```ts
/* generic */

export interface Result<T> {
  ok: 0 | 1;
  data: T[];
}

export interface Feature {
  id: number;
  name: string;
}
```

```vue
// hello.vue

<template>
  <div>
    <div v-for="feature in features" :key="feature.id">
      {{ feature.name }}
    </div>
    <p>回车添加 feature</p>
    <input type="text" @keydown.enter="addFeature" />
    <p>Total count: {{ count }}</p>
    <hr />
    <p>msg from parent: {{ msg }}</p>
    <p>boy in ts: {{ boy }}</p>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator';

import { Feature } from '@/models/feature';
import { Result } from '@/models/result';

function getData<T>(): Promise<Result<T>> {
  const data: any[] = [{ id: 1, name: 'hello' }, { id: 2, name: 'world' }];

  // return Promise.resolve<Result<T>>({ ok: 1, data });
  return new Promise((resolve) => setTimeout(() => resolve({ ok: 1, data }), 1000));
}

@Component({
  // 这里最好传与 hello 不是密切相关的内容，比如 mixin，component。props 还是放在里面好。
  props: {
    msg: {
      type: String,
      default: 'hhh~',
    },
  },
})
export default class Hello extends Vue {
  @Prop({ type: String, default: 'derek~' })
  private boy!: string;

  // 相当 data 属性
  private features: Feature[] = [];

  constructor() {
    super();
  }

  @Watch('features', {
    immediate: true,
    deep: true,
  })
  private featuresChange(newVal: any, oldVal: any) {
    console.log(newVal, oldVal);
  }

  // 不给 emit 传参，事件名就是方法名；
  @Emit()
  private addFeature(event: any) {
    const feature = { id: this.features.length + 1, name: event.target.value };
    this.features.push(feature);

    event.target.value = '';

    // 如果没有返回值，形参是事件参数
    // 有返回值，返回值就是事件参数
    return feature;
  }

  private async created() {
    console.log('created lifecycle');

    this.features = (await getData<Feature>()).data;
  }

  get count() {
    return this.features.length;
  }
}
</script>

<style scoped></style>
```

Parent Component:

```vue
<template>
  <Hello msg="about page" @add-feature="wow"></Hello>
</template>

<script>
import Hello from '@/components/Hello';
import Feature from '@/models/feature';

export default {
  name: 'about',
  components: { Hello },

  methods: {
    wow(feature) {
      alert(feature.name);
    },
  },
};
</script>
```

## vuex

安装: `npm i vuex-class -S`

定义状态，store.js

```ts
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    features: [{ id: 1, name: 'hello' }, { id: 2, name: 'world' }],
  },
  mutations: {
    addFeatureMutation(state: any, featureName) {
      state.features.push({ id: state.features.length + 1, name: featureName });
    },
  },
  actions: {
    addFeatureAction({ commit }, featureName) {
      commit('addFeatureMutation', featureName);
    },
  },
});
```

Hello.vue 使用 vuex。

```ts
import { State, Action, Mutation } from 'vuex-class';

@Component
export default class Feature extends Vue {
  // 状态、动作、变更映射
  @State features!: string[];
  @Action addFeatureAction;
  @Mutation addFeatureMutation;

  private addFeature(event) {
    this.addFeatureAction(event.target.value);
    // or
    // this.addFeatureMutation(event.target.value);
    event.target.value = '';
  }
}
```

## Function overloading

```ts
/**
 * function overloading
 */

// declaration
function getInfo(param: object): string;
function getInfo(param: string | number): object;

// implementation
function getInfo(param: any): any {
  if (typeof param === 'object') {
    return 'derek';
  } else {
    return { name: param };
  }
}

// usage
getInfo('ddd');
```

## Decorator 原理

```ts
/* Decorator */
// 1. 类装饰器
function log(target: Function) {
  // target is the constructor
  console.log(target === Foo); // true
  target.prototype.log = function() {
    console.log(this.bar);
  };
}

@log
class Foo {
  @mua
  public girl!: string;

  public bar = 'bar';

  @dong
  public baz(val: string) {
    this.bar = val;
  }
}

const foo = new Foo();
// @ts-ignore
foo.log();

// 2. ⽅法装饰器
function dong(target: any, name: string, descriptor: any) {
  // target是原型或构造函数 Foo {}，name是⽅法名 baz，descriptor是属性描述符 { value: [Function: baz], ... }
  // ⽅法的定义⽅式：Object.defineProperty(target, name, descriptor)
  console.log(target[name] === descriptor.value);

  // 这⾥通过修改descriptor.value扩展了bar⽅法
  const baz = descriptor.value; // 之前的⽅法
  descriptor.value = function(val: string) {
    console.log('dong~~');

    baz.call(this, val);
  };
  return descriptor;
}
foo.baz('derek');

// 3. 属性装饰器
function mua(target: any, name: string) {
  // target是原型或构造函数，name是属性名
  console.log(target === Foo.prototype);
  target[name] = 'mua~~~';
}
console.log(foo.girl);
```

## 自己实现一个装饰器

```vue
<template>
  <div>{{ msg }}</div>
</template>

<script lang="ts">
import { Prop, Vue } from 'vue-property-decorator';

function Component(options: any) {
  return function(target: Function) {
    return Vue.extend(options);
  };
}

@Component({
  props: { msg: { type: String, default: '' } },
})
export default class Decorator extends Vue {}
</script>

<style scoped></style>
```

探究 vue-property-decorator 中各装饰器实现原理
