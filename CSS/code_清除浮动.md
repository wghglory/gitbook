# 清除浮动，触发 BFC

```css
.clear {
  zoom: 1;
}
.clear:after {
  content: '';
  display: block;
  clear: both;
}

/*给浮动元素的父级加
<div class="clear">
    <div class="float"></div>
</div>
*/

/* other methods
1.给父级也加浮动
2.给父级加display:inline-block
3.在浮动元素下加<div class="clear"></div>
.clear{ height:0px;font-size:0;clear:both;}
4.在浮动元素下加<br clear="all"/>
5.给浮动元素的父级overflow:hidden 并且zoom:1;
*/
```
