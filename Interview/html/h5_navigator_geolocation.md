# H5 地址信息位置

```javascript
if ('geolocation' in navigator) {
  navigator.geolocation.getCurrentPosition(function(position) {
    console.log(position);
  });
}
```