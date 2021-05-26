--

Date: 2021-05-27

--

# Style Guide

https://v3.vuejs.org/style-guide/#multi-word-component-names-essential

## Multi-word component names

Bad:

```js
app.component('todo', {});

export default { name: 'Todo' };
```

Good:

```js
app.component('todo-item', {});

export default { name: 'TodoItem' };
```

## Component files

Bad:

```js
// defining them in a file is bad
app.component('TodoList', {});
app.component('TodoItem', {});
```

Good:

```js
// components/TodoList.vue
app.component('TodoList', {});

// components/TodoItem.vue
app.component('TodoItem', {});
```

## Base component names

Bad:

```
components/
|- MyButton.vue
|- VueTable.vue
|- Icon.vue
```

Good:

```
components/
|- BaseButton.vue
|- BaseTable.vue
|- BaseIcon.vue
```

```
components/
|- AppButton.vue
|- AppTable.vue
|- AppIcon.vue
```

```
components/
|- VButton.vue
|- VTable.vue
|- VIcon.vue
```

## Single-instance component names

**Components that should only ever have a single active instance should begin with the `The` prefix, to denote that there can be only one.**

Bad:

```
components/
|- Heading.vue
|- MySidebar.vue
```

Good:

```
components/
|- TheHeading.vue
|- TheSidebar.vue
```

## Tightly coupled component names

**Child components that are tightly coupled with their parent should include the parent component name as a prefix.**

Bad:

```
components/
|- TodoList.vue
|- TodoItem.vue
|- TodoButton.vue
```

```
components/
|- SearchSidebar.vue
|- NavigationForSearchSidebar.vue
```

```
components/
|- TodoList/
   |- Item/
      |- index.vue
      |- Button.vue
   |- index.vue
```

This isn't recommended, as it results in:

Many files with similar names, making rapid file switching in code editors more difficult. Many nested sub-directories, which increases the time it takes to browse components in an editor's sidebar.

Good:

```
components/
|- TodoList.vue
|- TodoListItem.vue
|- TodoListItemButton.vue
```

```
components/
|- SearchSidebar.vue
|- SearchSidebarNavigation.vue
```

## Order of words in component names

**Component names should start with the highest-level (often most general) words and end with descriptive modifying words.**

Bad:

```
components/
|- ClearSearchButton.vue
|- ExcludeFromSearchInput.vue
|- LaunchOnStartupCheckbox.vue
|- RunSearchButton.vue
|- SearchInput.vue
|- TermsCheckbox.vue
```

Good:

```
components/
|- SearchButtonClear.vue
|- SearchButtonRun.vue
|- SearchInputQuery.vue
|- SearchInputExcludeGlob.vue
|- SettingsCheckboxTerms.vue
|- SettingsCheckboxLaunchOnStartup.vue
```
