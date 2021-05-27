# Vue Template Syntax

https://v3.vuejs.org/guide/template-syntax.html#shorthands

**v-bind**:

```html
<!-- full syntax -->
<a v-bind:href="url"> ... </a>

<!-- shorthand -->
<a :href="url"> ... </a>

<!-- shorthand with dynamic argument -->
<a :[key]="url"> ... </a>
```

**v-on**:

```html
<!-- full syntax -->
<a v-on:click="doSomething"> ... </a>

<!-- shorthand -->
<a @click="doSomething"> ... </a>

<!-- shorthand with dynamic argument -->
<a @[event]="doSomething"> ... </a>
```

```html
<!-- This will trigger a compiler warning. -->
<a v-bind:['foo' + bar]="value"> ... </a>
```

**v-once**:

```html
<span v-once>This will never change: {{ msg }}</span>
```

**v-html**:

```html
<p>Using v-html directive: <span v-html="rawHtml"></span></p>
```

## Modifiers

```html
<form v-on:submit.prevent="onSubmit">...</form>
```
