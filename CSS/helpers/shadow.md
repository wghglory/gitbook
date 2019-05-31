# scss shadow helper

```html
<h1>Material card Sass mixin</h1>
<div class="card-grid">
  <a class="card">amet consectetur adipisicing elit.</a>
  <a class="card">amet consectetur adipisicing elit.</a>
  <a class="card">amet consectetur adipisicing elit.</a>
</div>
```

```scss
:root {
  --spacing: 1rem;
  --imgWidth: 100px;
  --imgHeight: 100px;
}

@mixin shadow($level: 1, $background: black) {
  @if $level == 1 {
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba($background, 0.24);
  } @else if $level == 2 {
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba($background, 0.23);
  } @else if $level == 3 {
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba($background, 0.23);
  } @else if $level == 4 {
    box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba($background, 0.22);
  } @else if $level == 5 {
    box-shadow: 0 19px 38px rgba(0, 0, 0, 0.3), 0 15px 12px rgba($background, 0.22);
  }
}

.card {
  @include shadow(1);
  // focus isn't going to be visible unless it has an href or a tabindex
  &:hover,
  &:focus {
    @include shadow(3);
    transform: translateY(-5px);
  }
  &:active {
    @include shadow(2);
    transform: translateY(-2px);
  }
}

// Vanity styles
body {
  background: #f9f9f9;
  margin: 3rem 2rem;
  font-family: 'Roboto', sans-serif;
}

.card-grid {
  display: grid;
  grid-gap: calc(var(--spacing) * 3.75);
  grid-template-columns: repeat(3, 140px);
  grid-auto-rows: var(--imgHeight);
  grid-auto-flow: dense;
}

.card {
  display: block;
  width: 8rem;
  min-height: 8rem;
  background: white;
  padding: 1rem;
  transition: all 250ms;
  font-size: 0.9rem;

  .title {
    font-size: 1.1rem;
    font-weight: 500;
    margin: 0 0 0.5rem;
  }
}
```
