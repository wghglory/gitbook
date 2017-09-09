# getStyle

```javascript
function getStyle(obj, attr) {
  if (obj.currentStyle) {
    return obj.currentStyle[attr];  // IE
  } else {
    return getComputedStyle(obj, false)[attr];  // standard
  }
}
```