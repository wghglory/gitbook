# Media Query

- Css reset/normalize (not in MQ)
- small screen (not in MQ due to mobile first, default rules)
- medium screen: @media screen and (min-width: 500px) { }
- large screen: @media screen and (min-width: 1140px) { }

So most styles are in small.scss, a little in both medium.scss and large.scss

---

Basic:

```scss
p {
  font-size: 16px;
}

@media (min-width: 768px) and (max-width: 1023px) {
  p {
    font-size: 18px;
  }
}

@media (min-width: 1024px) {
  p {
    font-size: 20px;
  }
}
```

Second:

```scss
$tablet: '(min-width: 768px) and (max-width: 1023px)';
$desktop: '(min-width: 1024px)';

p {
  font-size: 16px;
}

@media #{$tablet} {
  p {
    font-size: 18px;
  }
}

@media #{$desktop} {
  p {
    font-size: 20px;
  }
}
```

Write query for a specific element:

```scss
$tablet: '(min-width: 768px) and (max-width: 1023px)';
$desktop: '(min-width: 1024px)';

p {
  font-size: 16px;

  @media #{$tablet} {
    font-size: 18px;
  }

  @media #{$desktop} {
    font-size: 20px;
  }
}
```

Mixin:

```scss
$tablet-width: 768px;
$desktop-width: 1024px;

@mixin tablet {
  @media (min-width: #{$tablet-width}) and (max-width: #{$desktop-width - 1px}) {
    @content;
  }
}

@mixin desktop {
  @media (min-width: #{$desktop-width}) {
    @content;
  }
}

@mixin retina {
  @media only screen and (-webkit-min-device-pixel-ratio: 2),
    only screen and (min--moz-device-pixel-ratio: 2),
    only screen and (-o-min-device-pixel-ratio: 2/1),
    only screen and (min-device-pixel-ratio: 2),
    only screen and (min-resolution: 192dpi),
    only screen and (min-resolution: 2dppx) {
    @content;
  }
}

@mixin print {
  @media print {
    @content;
  }
}

p {
  font-size: 16px;

  @include tablet {
    font-size: 18px;
  }

  @include desktop {
    font-size: 20px;
  }
}
```

---

```scss
@import 'compass/css3';

/**
* Conditional Media Query Mixin
* by @sheiko (http://dsheiko.com)
*
* The problem this mixin solves is explained there
* https://css-tricks.com/conditional-media-query-mixins/
*
* https://github.com/dsheiko
* MIT license: https://www.opensource.org/licenses/mit-license.php
*/

// Predefined Break-points
$mediaMaxWidth: 1260px;
$mediaBp1Width: 960px;
$mediaMinWidth: 480px;

@function translate-media-condition($c) {
  $condMap: (
    'screen': 'only screen',
    'print': 'only print',
    'retina':
      '(-webkit-min-device-pixel-ratio: 1.5), (min--moz-device-pixel-ratio: 1.5), (-o-min-device-pixel-ratio: 3/2), (min-device-pixel-ratio: 1.5), (min-resolution: 120dpi)',
    '>maxWidth': '(min-width: #{$mediaMaxWidth + 1})',
    '<maxWidth': '(max-width: #{$mediaMaxWidth})',
    '>bp1Width': '(min-width: #{$mediaBp1Width + 1})',
    '<bp1Width': '(max-width: #{$mediaBp1Width})',
    '>minWidth': '(min-width: #{$mediaMinWidth + 1})',
    '<minWidth': '(max-width: #{$mediaMinWidth})',
  );
  @return map-get($condMap, $c);
}

// The media mixin
@mixin media($args...) {
  $query: '';
  @each $arg in $args {
    $op: '';
    @if ($query != '') {
      $op: ' and ';
    }
    $query: $query + $op + translate-media-condition($arg);
  }
  @media #{$query} {
    @content;
  }
}

/**
 * Usage examples
 */
.section {
  border: 2px solid #777;
  padding: 40px;
  background: silver;
  @include media('retina') {
    border: 2px dotted #000;
  }
  @include media('screen', '>bp1Width', '<maxWidth') {
    background: red;
    color: white;
  }
  @include media('screen', '>minWidth', '<bp1Width') {
    background: green;
    color: white;
  }
  @include media('screen', '<minWidth') {
    background: blue;
    color: white;
  }
}
```
