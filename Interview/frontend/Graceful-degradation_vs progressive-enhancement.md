# Graceful degradation versus Progressive enhancement (优雅降级和渐进增强)

## Graceful degradation

graceful degradation is the practice of building your web functionality so that it provides a certain level of user experience in more modern browsers, but it will also degrade gracefully to a lower level of user in experience in older browsers. This lower level is not as nice to use for your site visitors, but it does still provide them with the basic functionality that they came to your site to use; things do not break for them.

```html
<p id="printthis">
  <a href="javascript:window.print()">Print this page</a>
</p>
<noscript>
  <p class="scriptwarning">
    Print a copy of your confirmation.
    Select the "Print" icon in your browser,
    or select "Print" from the "File" menu.
  </p>
</noscript>
```

## Progressive enhancement

Starting with a baseline of usable functionality, then increasing the richness of the user experience step by step by testing for support for enhancements before applying them.

Progressive enhancement is similar, but it does things the other way round. You start by establishing a basic level of user experience that all browsers will be able to provide when rendering your web site, but you also build in more advanced functionality that will automatically be available to browsers that can use it.

example: gmail, better browser has better experience.

```html
<p id="printthis">Thank you for your order. Please print this page for your records.</p>
<script>
(function(){
  // true means javascript enabled
  if(document.getElementById){
    var pt = document.getElementById('printthis');
    if(pt && typeof window.print === 'function'){
      var but = document.createElement('input');
      but.setAttribute('type','button');
      but.setAttribute('value','Print this now');
      but.onclick = function(){
        window.print();
      };
      pt.appendChild(but);
    }
  }
})();
</script>
```

## Sum

graceful degradation starts from the status quo 现状 of complexity and tries to fix for the lesser experience whereas progressive enhancement starts from a very basic, working example and allows for constant extension for future environments. Degrading gracefully means looking back whereas enhancing progressively means looking forward whilst keeping your feet on firm ground.

It can be said that both progressive enhancement and graceful degradation try to do the same thing: **keep our products useful to every user**. Progressive enhancement is a more sophisticated and at the same time stable way of assuring that but it takes more time and effort. Graceful degradation can be used more easily as a patch for an already existing product; it means harder maintenance later on, but requires less initial work.

### When to use what

graceful degradation becomes viable in a few situations:

* You retrofit an old product and you don’t have the time, access or insight to change or replace it.
* You just don’t have time to finish a product with full progressive enhancement (often a sign of bad planning or running out of budget).
* The product you have is an edge case, for example very high traffic sites where every millisecond of performance means a difference of millions of dollars.
* Your product by definition is so dependent on scripting that it makes more sense to maintain a “basic” version rather than enhancing one (Maps, email clients, feed readers).

In all other cases, progressive enhancement will make both the end users and you happier:

* Regardless of environment and ability you deliver a product that works.
* When a new browser comes out or a browser extension becomes widely adopted you can enhance to yet another level without having to touch the original solution — graceful degradation would require you to alter the original solution.
* You allow technology to be what it is supposed to be — an aid to reach a goal faster than without it, not a “must” to be able to reach a goal in the first place.
* If you need to add new features, you can do so after checking if they are supported at a certain stage, or you can add it to the most basic level of functionality and make it better in more sophisticated environments. In any case, the maintenance happens at the same spot and not in two different places. Keeping a progressively enhanced product up-to-date is much less work than maintaining two versions.