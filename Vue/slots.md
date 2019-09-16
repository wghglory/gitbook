# Vue slot 和组件封装

slot 典型使用场景就是 组件封装，能确保最终显示的 UI 样式，开发者只需要关心具体要传入什么控件。有点类似 react 中的 children props。

下面的例子：每个元素写上 slot=“xxx” attr，在子级 form-helper 内部通过 `<slot name="xxx"></slot>` 确定渲染位置。

_App.vue_: 父级组件

```html
<template>
  <div>
    <form-helper>
      <div slot="form-header">
        <h3>{{ title }}</h3>
        <p>This is some info about the form</p>
      </div>
      <div slot="form-fields">
        <input type="text" placeholder="name" required />
        <input type="password" placeholder="password" required />
      </div>
      <div slot="form-controls">
        <button v-on:click="handleSubmit">Submit</button>
      </div>
    </form-helper>
  </div>
</template>

<script>
  import formHelper from './components/formHelper.vue';

  export default {
    components: {
      'form-helper': formHelper,
    },
    data() {
      return {
        title: 'This is the title of a form',
      };
    },
    methods: {
      handleSubmit: function() {
        alert('thanks for submitting');
      },
    },
  };
</script>
```

_formHelper.vue_: 子组件

```html
<template>
  <div>
    <h1>Please fill out our form...</h1>
    <form>
      <div id="form-header">
        <slot name="form-header"></slot>
      </div>
      <div id="form-fields">
        <slot name="form-fields"></slot>
      </div>
      <div id="form-controls">
        <slot name="form-controls"></slot>
      </div>
      <div id="useful-links">
        <ul>
          <li><a href="#">link 1</a></li>
          <li><a href="#">link 2</a></li>
          <li><a href="#">link 3</a></li>
          <li><a href="#">link 4</a></li>
        </ul>
      </div>
    </form>
  </div>
</template>

<script>
  export default {
    components: {},
    data() {
      return {};
    },
    methods: {},
  };
</script>

<style scoped>
  h1 {
    text-align: center;
  }
  form {
    width: 100%;
    max-width: 960px;
    margin: 0 auto;
  }
  #useful-links ul {
    padding: 0;
  }
  #useful-links li {
    display: inline-block;
    margin-right: 10px;
  }
  form > div {
    padding: 20px;
    background: #eee;
    margin: 20px 0;
  }
  #form-header {
    background: #ddd;
    border: 1px solid #bbb;
  }
</style>
```
