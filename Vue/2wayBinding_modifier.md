# 2 way binding with central object and modifier

**input binding**:

`v-model` can bind a central object -- blog in this case. Of course we need to include this object in data function.

`lazy` modifier lets the output delays until input blurs. `lazy` uses `onchange` event while `oninput` is default behavior.

**checkbox binding**:

bind values to array. Any selected checkbox will add its value to the array.

**select dropdown binding**:

bind model in `select` tag rather than `option`. selected value will be bind into a string. But if select has multiple attr, it should bind to an array.

```html
<template>
  <div id="add-blog">
    <h2>Add a New Blog Post</h2>
    <form>
      <label>Blog Title:</label>
      <input type="text" v-model.lazy="blog.title" required />
      <label>Blog Content:</label>
      <textarea v-model.lazy.trim="blog.content"></textarea>
      <div id="checkboxes">
        <p>Blog Categories:</p>
        <label>Ninjas</label>
        <input type="checkbox" value="ninjas" v-model="blog.categories" />
        <label>Wizards</label>
        <input type="checkbox" value="wizards" v-model="blog.categories" />
        <label>Mario</label>
        <input type="checkbox" value="mario" v-model="blog.categories" />
        <label>Cheese</label>
        <input type="checkbox" value="cheese" v-model="blog.categories" />
      </div>
      <label>Author:</label>
      <select v-model="blog.author">
        <option v-for="author in authors">{{ author }}</option>
      </select>
    </form>
    <div id="preview">
      <h3>Preview blog</h3>
      <p>Blog title: {{ blog.title }}</p>
      <p>Blog content:</p>
      <p style="white-space: pre">{{ blog.content }}</p>
      <p>Blog Categories:</p>
      <ul>
        <li v-for="category in blog.categories">{{ category }}</li>
      </ul>
      <p>Author: {{ blog.author }}</p>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        blog: {
          title: '',
          content: '',
          categories: [],
          author: '',
        },
        authors: ['The Net Ninja', 'The Angular Avenger', 'The Vue Vindicator'],
      };
    },
    methods: {},
  };
</script>

<style>
  #add-blog * {
    box-sizing: border-box;
  }
  #add-blog {
    margin: 20px auto;
    max-width: 500px;
  }
  label {
    display: block;
    margin: 20px 0 10px;
  }
  input[type='text'],
  textarea {
    display: block;
    width: 100%;
    padding: 8px;
  }
  #preview {
    padding: 10px 20px;
    border: 1px dotted #ccc;
    margin: 30px 0;
  }
  h3 {
    margin-top: 10px;
  }
  #checkboxes input {
    display: inline-block;
    margin-right: 10px;
  }
  #checkboxes label {
    display: inline-block;
    margin-top: 0;
  }
</style>
```
