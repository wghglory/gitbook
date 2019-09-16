# Unit test

`vue add @vue/unit-jest 和 vue add @vue/e2e-cypress`

jest.config.js

```js
module.exports = {
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.{js,vue}'],
};
```

components/test.vue

```vue
<template>
  <div>
    <span>{{ message }}</span>
    <button @click="changeMsg">点击</button>
  </div>
</template>

<script>
export default {
  data() {
    return { message: 'vue-text', count: 0 };
  },
  created() {
    this.message = '开课吧';
  },
  methods: {
    changeMsg() {
      if (this.count > 1) {
        this.message = 'count⼤于1';
      } else {
        this.message = '按钮点击';
      }
    },
    changeCount() {
      this.count += 1;
    },
  },
};
</script>
```

tests/unit/test.spec.js

```js
// 导⼊ Vue.js 和组件，进⾏测试
import Vue from 'vue';
import { mount } from '@vue/test-utils';

import TestComp from '@/components/Test.vue';

describe('TestComp', () => {
  // 检查原始组件选项
  it('由created⽣命周期', () => {
    expect(typeof TestComp.created).toBe('function');
  });

  // 评估原始组件选项中的函数的结果
  it('初始data是vue-text', () => {
    // 检查data函数存在性
    expect(typeof TestComp.data).toBe('function');
    // 检查data返回的默认值
    const defaultData = TestComp.data();
    expect(defaultData.message).toBe('vue-text');
  });

  it('mount之后测data是开课吧', () => {
    const vm = new Vue(TestComp).$mount();
    expect(vm.message).toBe('开课吧');
  });

  it('按钮点击后', () => {
    const wrapper = mount(TestComp);
    wrapper.find('button').trigger('click');
    // 测试数据变化
    expect(wrapper.vm.message).toBe('按钮点击');
    // 测试html渲染结果
    expect(wrapper.find('span').html()).toBe('<span>按钮点击</span>');
    // 等效的⽅式
    expect(wrapper.find('span').text()).toBe('按钮点击');
  });
});
```

## e2e test

e2e/specs/test.js

```js
// 借⽤浏览器的能⼒，站在⽤户测试⼈员的⻆度，输⼊框，点击按钮等，完全模拟⽤户，这个和具体的框 架关系不⼤，完全模拟浏览器⾏为
// https://docs.cypress.io/api/introduction/api.html

describe('My First Test', () => {
  it('Visits the app root url', () => {
    cy.visit('/');
    cy.contains('h2', 'Custom Form');
  });
});
```
