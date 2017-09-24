# offsetWidth/offsetHeight,clientWidth/clientHeight 与 scrollWidth/scrollHeight 的区别

* offsetWidth/offsetHeight 返回值包含 content + padding + border，效果与 `e.getBoundingClientRect()` 相同
* clientWidth/clientHeight 返回值只包含 content + padding，如果有滚动条，也不包含滚动条
* scrollWidth/scrollHeight 返回值包含 content + padding + 溢出内容的尺寸

![img](https://github.com/qiu-deqing/FE-interview/raw/master/img/element-size.png)