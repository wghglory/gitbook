# css reset 重置

见移动端 scss.md

## 如何修改 chrome 记住密码后自动填充表单的黄色背景 ？

```css
input:-webkit-autofill,
textarea:-webkit-autofill,
select:-webkit-autofill {
  background-color: rgb(250, 255, 189); /* #FAFFBD; */
  background-image: none;
  color: rgb(0, 0, 0);
}
```

## 让页面里的字体变清晰，变细用 CSS 怎么做？

```css
-webkit-font-smoothing: antialiased;
```
