# 最佳实践

## 项⽬配置

- npm run eject
- vue.conﬁg.js

做⼀些基础配置：指定应⽤上下⽂、端⼝号、主⻚ title

```javascript
// vue.config.js
const port = 7070;
const title = 'vue in practice';

module.exports = {
  publicPath: '/best-practice', // 部署应⽤包时的基本 URL
  devServer: {
    port
  },
  configureWebpack: {
    // 向index.html注⼊标题
    name: title
  }
};

// index.html
<title><%= webpackConfig.name %></title>
```

### 链式操作：演示 webpack 规则配置，custom icon

范例：项⽬要使⽤ icon，传统⽅案是图标字体(字体⽂件+样式⽂件)，不便维护；svg ⽅案采⽤ svgsprite-loader ⾃动加载打包，⽅便维护。

使⽤ icon 前先安装依赖：svg-sprite-loader

```shell
npm i svg-sprite-loader -D
```

```shell
vue inspect -h
Usage: inspect [options] [paths...]

inspect the webpack config in a project with vue-cli-service

Options:
  --mode <mode>
  --rule <ruleName>      inspect a specific module rule
  --plugin <pluginName>  inspect a specific plugin
  --rules                list all module rule names
  --plugins              list all plugin names
  -v --verbose           Show full function definitions in output
  -h, --help             output usage information
```

复制图标 svg code，存⼊ src/icons/svg 中。修改规则和新增规则：

vue.conﬁg.js

```javascript
  chainWebpack(config) {
    // 配置svg规则排除icons⽬录中svg⽂件处理
    config.module.rule('svg').exclude.add(resolve('src/icons'));

    // 新增icons规则，设置svg-sprite-loader处理icons⽬录中的svg
    config.module
      .rule('icons') //新增icons规则
      .test(/\.svg$/) //匹配后缀
      .include.add(resolve('src/icons')) //加入include array
      .end() //add完上下⽂是数组不是icons规则，使⽤end()回退
      .use('svg-sprite-loader') // 添加loader
      .loader('svg-sprite-loader') // 切换上下文到loader
      .options({ symbolId: 'icon-[name]' }) //指定选项
      .end();
  }
```

检查配置：

```shell
vue inspect --rule svg

/* config.module.rule('svg') */
{
  test: /\.(svg)(\?.*)?$/,
  exclude: [
    '/Users/guanghuiw/My/kaikaba/vue-learning/src/icons'
  ],
  use: [
    {
      loader: 'file-loader',
      options: {
        name: 'img/[name].[hash:8].[ext]'
      }
    }
  ]
}
```

图标⾃动导⼊

```javascript
/* 图标自动导入, note main.js needs import './icons'; */
import Vue from 'vue';
import Icon from '@/components/Icon.vue';

// 利用webpack 的require.context自动导入
const req = require.context('./svg', false, /\.svg$/); // 遍历加载上下⽂中所有项

// 返回的req是只去加载svg目录中的模块的函数
req.keys().map(req);
// console.log(req.keys()); // ["./qq.svg", "./wechat.svg"]

// Icon组件全局注册一下
Vue.component('Icon', Icon);
```

创建 Icon 组件:

```vue
<!-- ./components/Icon.vue -->
<template>
  <svg :class="svgClass" aria-hidden="true" v-on="$listeners">
    <use :xlink:href="iconName" />
  </svg>
</template>

<script>
export default {
  name: 'Icon',
  props: {
    name: {
      type: String,
      required: true,
    },
    className: {
      type: String,
      default: '',
    },
  },
  computed: {
    iconName() {
      return `#icon-${this.name}`;
    },
    svgClass() {
      if (this.className) {
        return 'svg-icon ' + this.className;
      } else {
        return 'svg-icon';
      }
    },
  },
};
</script>

<style scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
```

注册:

```javascript
// icons/index.js
/* 图标自动导入, note main.js needs import './icons'; */
import Vue from 'vue';
import Icon from '@/components/Icon.vue';

// Icon组件全局注册一下
Vue.component('Icon', Icon);

// main.js
import './icons';
```

使⽤:

```html
<!-- App.vue -->
<Icon name="qq" class-name="my-icon"></Icon> <Icon name="wechat" class-name="my-icon"></Icon>
```
