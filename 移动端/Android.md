[toc]

# 疑难杂症

## Android

### Android WebView `:active` 失效

Android WebView `:active` 失效，即点击瞬间的效果无法被触发。最简单的解决办法是，添加：

```html
<body ontouchstart="">
```

详情讨论见：http://stackoverflow.com/questions/4940429/how-to-simulate-active-css-pseudo-class-in-android-on-non-link-elements