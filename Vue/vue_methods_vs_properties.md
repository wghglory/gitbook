# Data Properties and Methods

https://v3.vuejs.org/guide/data-methods.html

## Data Properties

```js
const app = Vue.createApp({
  data() {
    return { count: 4 };
  },
});

const vm = app.mount('#app');

console.log(vm.$data.count); // => 4
console.log(vm.count); // => 4

// Assigning a value to vm.count will also update $data.count
vm.count = 5;
console.log(vm.$data.count); // => 5

// ... and vice-versa
vm.$data.count = 6;
console.log(vm.count); // => 6
```

> It is possible to add a new property directly to the component instance without including it in data. However, because this property isn't backed by the reactive \$data object, it won't automatically be tracked by Vue's reactivity system.

> Vue uses a `$` prefix when exposing its own built-in APIs via the component instance. It also reserves the prefix `_` for internal properties. **You should avoid using names for top-level data properties that start with either of these characters**.

## Methods

```js
const app = Vue.createApp({
  data() {
    return { count: 4 };
  },
  methods: {
    increment() {
      // `this` will refer to the component instance
      this.count++;
    },
  },
});

const vm = app.mount('#app');

console.log(vm.count); // => 4

vm.increment();

console.log(vm.count); // => 5
```

```html
<button @click="increment">Up vote</button>
```

```html
<span :title="toTitleDate(date)">
  {{ formatDate(date) }}
</span>
```

Methods called from a template **should not have any side effects**, such as changing data or triggering asynchronous processes. If you find yourself tempted to do that you should probably use a **lifecycle hook** instead.

## Debouncing and Throttling

```js
// introduce lodash
app.component('save-button', {
  created() {
    // Debouncing with Lodash
    this.debouncedClick = _.debounce(this.click, 500);
  },
  unmounted() {
    // Cancel the timer when the component is removed
    this.debouncedClick.cancel();
  },
  methods: {
    click() {
      // ... respond to click ...
    },
  },
  template: `
    <button @click="debouncedClick">
      Save
    </button>
  `,
});
```

## Computed Caching vs Methods

```js
// in component
computed: {
  // a computed getter
  publishedBooksMessage() {
    // `this` points to the vm instance
    return this.author.books.length > 0 ? 'Yes' : 'No'
  }
},

methods: {
  calculateBooksMessage() {
    return this.author.books.length > 0 ? 'Yes' : 'No'
  }
}
```

> **computed properties are cached based on their reactive dependencies. a method invocation will always run the function whenever a re-render happens without cache.**

This also means the following computed property will never update, because `Date.now()` is not a reactive dependency:

```js
computed: {
  now() {
    return Date.now()
  }
}
```

## Computed Setter

```js
computed: {
  fullName: {
    // getter
    get() {
      return this.firstName + ' ' + this.lastName
    },
    // setter
    set(newValue) {
      const names = newValue.split(' ')
      this.firstName = names[0]
      this.lastName = names[names.length - 1]
    }
  }
}
```

## Watchers

**While computed properties are more appropriate in most cases, there are times when a custom watcher is necessary. That's why Vue provides a more generic way to react to data changes through the `watch` option. This is most useful when you want to perform asynchronous or expensive operations in response to changing data.**

```html
<div id="watch-example">
  <p>
    Ask a yes/no question:
    <input v-model="question" />
  </p>
  <p>{{ answer }}</p>
</div>

<script src="https://cdn.jsdelivr.net/npm/axios@0.12.0/dist/axios.min.js"></script>
<script>
  const watchExampleVM = Vue.createApp({
    data() {
      return {
        question: '',
        answer: 'Questions usually contain a question mark. ;-)',
      };
    },
    watch: {
      // whenever question changes, this function will run
      question(newQuestion, oldQuestion) {
        if (newQuestion.indexOf('?') > -1) {
          this.getAnswer();
        }
      },
    },
    methods: {
      getAnswer() {
        this.answer = 'Thinking...';
        axios
          .get('https://yesno.wtf/api')
          .then((response) => {
            this.answer = response.data.answer;
          })
          .catch((error) => {
            this.answer = 'Error! Could not reach the API. ' + error;
          });
      },
    },
  }).mount('#watch-example');
</script>
```
