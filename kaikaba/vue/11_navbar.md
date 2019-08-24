# 根据 ACL 动态生成 navbar

## 导航菜单⽣成

导航菜单是根据路由信息并结合权限判断⽽动态⽣成的。它需要⽀持路由的多级嵌套，所以这⾥要⽤到递归组件。

菜单结构是典型递归组件，利⽤之前实现的 tree 组件。

数据准备，添加 getter ⽅法，store/index.js

```js
getters: { permission_routes: state => state.permission.routes, }
```

修改 sidemenu/index.vue

```html
<template>
  <div>
    <ul>
      <!-- 传递base-path是由于⼦路由是相对地址 -->
      <Item
        v-for="route in permission_routes"
        :model="route"
        :key="route.path"
        :base-path="route.path"
      ></Item>
    </ul>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import Item from './Item';

  export default {
    components: {
      Item,
    },
    computed: {
      ...mapGetters(['permission_routes']),
    },
  };
</script>
```

Item.vue 改造

```html
<template>
  <!-- 1.hidden存在则不显示 -->
  <li v-if="!model.hidden">
    <div @click="toggle">
      <!-- 2.设置icon才显示图标 -->
      <Icon v-if="model.meta && model.meta.icon" :name="model.meta.icon"></Icon>
      <!-- 3.设置title：如果是folder仅显示标题和展开状态 -->
      <span v-if="isFolder">
        <span v-if="model.meta && model.meta.title">{{ model.meta.title }} </span> [{{ open ? '-' :
        '+' }}]
      </span>
      <!-- 4.如果是叶⼦节点，显示为链接 -->
      <template v-else>
        <router-link v-if="model.meta && model.meta.title" :to="resolvePath(model.path)"
          >{{ model.meta.title }}</router-link
        >
      </template>
    </div>
    <!-- 5.⼦树设置base-path -->
    <ul v-show="open" v-if="isFolder">
      <Item
        class="item"
        v-for="route in model.children"
        :model="route"
        :key="route.path"
        :base-path="resolvePath(model.path)"
      ></Item>
    </ul>
  </li>
</template>

<script>
  import path from 'path';

  export default {
    name: 'Item',
    props: {
      model: Object,
      // 新增basePath保存⽗路由path
      basePath: { type: String, default: '' },
    },
    data: function() {
      return {
        open: false, // 打开状态
      };
    },
    computed: {
      isFolder: function() {
        // 是否有子树
        return this.model.children && this.model.children.length;
      },
    },
    methods: {
      // 拼接⼦路由完整path
      resolvePath(routePath) {
        return path.resolve(this.basePath, routePath);
      },
      toggle: function() {
        if (this.isFolder) {
          this.open = !this.open;
        }
      },
    },
  };
</script>
```

## 利⽤ element-ui 做⼀个更⾼逼格的导航

```vue
// sidebar/index.vue

<template>
  <div>
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item
          v-for="route in permission_routes"
          :key="route.path"
          :item="route"
          :base-path="route.path"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import SidebarItem from './SidebarItem';

export default {
  components: { SidebarItem },
  computed: {
    ...mapGetters(['permission_routes']),
    activeMenu() {
      const route = this.$route;
      const { meta, path } = route; // 默认激活项
      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      return path;
    },
    variables() {
      return {
        menuText: '#bfcbd9',
        menuActiveText: '#409EFF',
        menuBg: '#304156',
      };
    },
  },
};
</script>
```

```vue
// sidebar/sidebarItem.vue

<template>
  <div v-if="!item.hidden" class="menu-wrapper">
    <template
      v-if="
        hasOneShowingChild(item.children, item) &&
          (!onlyOneChild.children || onlyOneChild.noShowingChildren) &&
          !item.alwaysShow
      "
    >
      <router-link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)">
        <el-menu-item
          :index="resolvePath(onlyOneChild.path)"
          :class="{ 'submenu-title-noDropdown': !isNest }"
        >
          <Item
            :icon="onlyOneChild.meta.icon || (item.meta && item.meta.icon)"
            :title="onlyOneChild.meta.title"
          />
        </el-menu-item>
      </router-link>
    </template>

    <el-submenu v-else ref="subMenu" :index="resolvePath(item.path)" popperappend-to-body>
      <template v-slot:title>
        <Item v-if="item.meta" :icon="item.meta && item.meta.icon" :title="item.meta.title" />
      </template>
      <sidebar-item
        v-for="child in item.children"
        :key="child.path"
        :is-nest="true"
        :item="child"
        :base-path="resolvePath(child.path)"
        class="nest-menu"
      />
    </el-submenu>
  </div>
</template>

<script>
import path from 'path';
import Item from './Item';

export default {
  name: 'SidebarItem',
  components: { Item },
  props: {
    // route object
    item: { type: Object, required: true },
    isNest: { type: Boolean, default: false },
    basePath: { type: String, default: '' },
  },
  data() {
    this.onlyOneChild = null;
    return {};
  },
  methods: {
    hasOneShowingChild(children = [], parent) {
      const showingChildren = children.filter((item) => {
        if (item.hidden) {
          return false;
        } else {
          // 如果只有⼀个⼦菜单时设置
          this.onlyOneChild = item;
          return true;
        }
      });

      // 当只有⼀个⼦路由，该⼦路由默认显示
      if (showingChildren.length === 1) {
        return true;
      }

      // 没有⼦路由则显示⽗路由
      if (showingChildren.length === 0) {
        this.onlyOneChild = { ...parent, path: '', noShowingChildren: true };

        return true;
      }

      return false;
    },
    resolvePath(routePath) {
      return path.resolve(this.basePath, routePath);
    },
  },
};
</script>
```

```vue
// sidebar/item.vue

<script>
export default {
  name: 'MenuItem',
  functional: true,
  props: { icon: { type: String, default: '' }, title: { type: String, default: '' } },
  render(h, context) {
    const { icon, title } = context.props;
    const vnodes = [];

    if (icon) {
      vnodes.push(<Icon name={icon} />);
    }

    if (title) {
      vnodes.push(<span slot='title'>{title}</span>);
    }
    return vnodes;
  },
};
</script>
```

