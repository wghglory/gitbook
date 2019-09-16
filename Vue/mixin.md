# mixin

为了提取不同组件相同的功能。比如 showBlog 展示 blog title and content，listBlog 只展示 title。但是他们都有一个过滤 searchTerm 来显示过滤后 blog 的功能。这个 computed 属性可以提取出来。

**components/showBlog.vue**:

```html
<template>
  <div id="show-blogs">
    <h1>All Blog Articles</h1>
    <input type="text" v-model="search" placeholder="search blogs" />
    <div v-for="blog in filteredBlogs" class="single-blog">
      <h2>{{ blog.title }}</h2>
      <article>{{ blog.body }}</article>
    </div>
  </div>
</template>

<script>
  import searchMixin from '../mixins/searchMixin';

  export default {
    data() {
      return {
        blogs: [],
        search: '',
      };
    },
    created() {
      this.$http.get('http://jsonplaceholder.typicode.com/posts').then(function(data) {
        this.blogs = data.body.slice(0, 10);
      });
    },
    mixins: [searchMixin],
  };
</script>
```

**components/listBlogs.vue**:

```html
<template>
  <div id="show-blogs">
    <h1>List Blog Titles</h1>
    <input type="text" v-model="search" placeholder="search blogs" />
    <div v-for="blog in filteredBlogs" class="single-blog">
      <h2>{{ blog.title }}</h2>
    </div>
  </div>
</template>

<script>
  import searchMixin from '../mixins/searchMixin';

  export default {
    data() {
      return {
        blogs: [],
        search: '',
      };
    },
    created() {
      this.$http.get('http://jsonplaceholder.typicode.com/posts').then(function(data) {
        this.blogs = data.body.slice(0, 10);
      });
    },
    mixins: [searchMixin],
  };
</script>
```

**mixins/searchMixin.js**：

```javascript
export default {
  computed: {
    filteredBlogs: function() {
      return this.blogs.filter((blog) => {
        return blog.title.match(this.search);
      });
    },
  },
};
```
