# dynamic components

我们有时候想动态切换不同的组件。`<component is="form-one"></component>` 就可以实现。我们可以进一步通过 v-bind 进行绑定。

keep-alive 的作用: 默认在切换 component 时候之前的组件被 destroy，所以再回到原来的组件一切需要重新创建，之前填写的数据，data 里面的数据都重置，如果想不去 destroy，还 retain 之前的状态需要 keep-alive。

react 里面是通过 `{this.state.something && <SomeComponent></SomeComponent>}` 实现。改变 state 就可以动态渲染或删除组件。

```html
<template>
    <div>
        <keep-alive>
            <component v-bind:is="dynamicForm"></component>
        </keep-alive>
        <!-- 不再直接写 <form-one></form-one> -->
        <button v-on:click="dynamicForm = 'form-one'">Show form one</button>
        <button v-on:click="dynamicForm = 'form-two'">Show form two</button>
    </div>
</template>

<script>
import formOne from './components/formOne.vue';
import formTwo from './components/formTwo.vue';

export default {
    components: {
        'form-one': formOne,
        'form-two': formTwo
    },
    data () {
        return {
            dynamicForm: 'form-one'
        }
    }
}
</script>
```
