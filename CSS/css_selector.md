# CSS 选择器

## 属性选择器

如果你想选择包含 `title` 属性的 `div`：

```
div[title]
```

选择包含 `title` 属性的子元素，只需要加个空格：

```
div [title]
```

选择 `title` 内容是 `dna` 的元素：

```
div[title="dna"]
```

选择 `title` 属性包含 `dna` 单词的元素：

> 注意 dna 需要是单词，也就是用空格分割，比如 “my beautiful dna” 或 “mutating dna is fun!”

```
div[title~="dna"]
```

和正则类似，选择 `title` 属性中，以 `dna` 结尾的元素：

```
div[title$="dna"]
```

以 `dna` 开头：

```
div[title^="dna"]
```

如果希望选择 `dna` 或 `dna-zh`，但不希望匹配 `dnaer`，可以：

> 这种场景一般用在国际化，比如 en en-us 就可以用 `|="en"`

```
div[title|="dna"]
```

只要包含 `dna` 这三个字符就选中：

```
div[title*="dna"]
```

真的很像正则，你可以用 `i` 标识匹配时大小写不敏感：

```
div[title*="dna" i]
```

如果你想找到一个 `a` 标签，拥有 `title` 属性并且 className 以 `genes` 结尾，可以这样：

```
a[title][class$="genes"]
```

## 获取标签的值

```html
<style>
  p[title]:hover::after {
    content: '::after content and display title: ' attr(title);
    display: block;
    color: rebeccapurple;
  }
</style>

<p title="p has a title?">Hover in this p tag and see its title attr at the end(:after).</p>
```

## 改变下载标签的 icon

```html
<style>
  a[download][href$='jpg']::before {
    content: url(assets/edit-tools.svg);
    width: 24px;
    height: 24px;
    display: inline-block;
    margin-right: 10px;
    vertical-align: middle;
  }
</style>

<a download="newname.jpg" target="_blank" href="assets/myw3schoolsimage.jpg">
  href 必须同源且服务器下 host 才能 download。Add icon by css ::before
</a>
```

## Details

```html
<style>
  details[open] {
    background-color: hotpink;
  }
</style>

<details>
  <summary>List of Genes</summary>
  Roddenberry Hackman
</details>
```

## Event selector

```html
<style>
  /* 为 JS 事件着色，比如触发的鼠标事件可以作为选择器： */
  [OnMouseOver] {
    color: burlywood;
  }

  [OnMouseOver]::after {
    content: 'JS function to be called: ' attr(OnMouseOver);
  }
</style>

<div onmouseover="over()" style="height:100px;margin:10px 0;background:blue">
  mouseover will be selected in css by [OnMouseOver].
</div>
```
