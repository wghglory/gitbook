# custom directive

## globally 实现 2 个自定义 directive。

`v-rainbow` 用于给 array 数据遍历时显示随机颜色。`v-theme` 用于设置 div 的宽度，类似 bootstrap container。

```html
<template>
  <div v-theme:column="'narrow'" id="show-blogs">
    <h1>All Blog Articles</h1>
    <div v-for="blog in blogs" class="single-blog">
      <h2 v-rainbow>{{ blog.title }}</h2>
      <article>{{ blog.body }}</article>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        blogs: [],
      };
    },
    created() {
      this.$http.get('http://jsonplaceholder.typicode.com/posts').then(function(data) {
        this.blogs = data.body.slice(0, 10);
      });
    },
  };
</script>
```

**main.js**:

```javascript
import Vue from 'vue';
import VueResource from 'vue-resource';
import App from './App.vue';

// Use vue-resource package
Vue.use(VueResource);

// global filter
Vue.filter('to-uppercase', function(value) {
  return value.toUpperCase();
});

// Global Custom directives
Vue.directive('rainbow', {
  bind(el, binding, vnode) {
    el.style.color =
      '#' +
      Math.random()
        .toString(16)
        .slice(2, 8);
  },
});

Vue.directive('theme', {
  bind(el, binding, vnode) {
    // =后面的通过 value 获取。v-theme:column="wide"
    if (binding.value == 'wide') {
      el.style.maxWidth = '1260px';
    } else if ((binding.value = 'narrow')) {
      el.style.maxWidth = '560px';
    }
    // :后面的通过 arg 获取。v-theme:column="something"
    if (binding.arg == 'column') {
      el.style.background = '#ddd';
      el.style.padding = '20px';
    }
  },
});

new Vue({
  el: '#app',
  render: (h) => h(App),
});
```

## locally register

```html
<template>
  <div id="show-blogs">
    <h1>All Blog Articles</h1>
    <input type="text" v-model="search" placeholder="search blogs" />
    <div v-for="blog in filteredBlogs" class="single-blog">
      <h2 v-rainbow>{{ blog.title | toUppercase }}</h2>
      <article>{{ blog.body }}</article>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        blogs: [],
        search: '',
      };
    },
    methods: {},
    created() {
      this.$http.get('http://jsonplaceholder.typicode.com/posts').then(function(data) {
        this.blogs = data.body.slice(0, 10);
      });
    },
    computed: {
      filteredBlogs: function() {
        return this.blogs.filter((blog) => {
          return blog.title.match(this.search);
        });
      },
    },
    filters: {
      /*'to-uppercase': function(value){
            return value.toUpperCase();
        }*/
      toUppercase(value) {
        return value.toUpperCase();
      },
    },
    directives: {
      rainbow: {
        bind(el, binding, vnode) {
          el.style.color =
            '#' +
            Math.random()
              .toString(16)
              .slice(2, 8);
        },
      },
    },
  };
</script>
```
