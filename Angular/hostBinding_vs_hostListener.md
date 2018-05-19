# What Are @HostBinding() and @HostListener() in Angular?

Let us start by creating a simple custom attribute directive. The directive below changes the background color of the host element:

```ts
import { Directive, ElementRef, Renderer } from '@angular/core';

@Directive({
  selector: '[app-changeBg]',
})
export class ChangeBgColorDirective {
  constructor(private el: ElementRef, private renderer: Renderer) {
    this.changeBgColor('red');
  }

  changeBgColor(color: string) {
    this.renderer.setElementStyle(this.el.nativeElement, 'color', color);
  }
}
```

You can use the above attribute directive on a component template as shown in the code block below:

```html
<div app-changeBg>
  <h3>{{title}}</h3>
</div>
```

Here, the component class holding the host element is created as below:

```ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Hey ng Developer ! ';
}
```

Right now, the `app-changeBg` directive will change the color of the host element.

## @HostListener() Decorator

`@HostListener()` function decorator allows you to **handle events of the host element** in the directive class.

Let's take the following requirement: when you hover you mouse over the host element, only the color of the host element should change. In addition, when the mouse is gone, the color of the host element should change to its default color. To do this, you need to handle events raised on the host element in the directive class. In Angular, you do this using **@HostListener()** .

To understand **@HostListener()** in a better way, consider another simple scenario: on the click of the host element, you want to show an alert window. To do this in the directive class, add @HostListener() and pass the event 'click' to it. Also, associate a function to raise an alert as shown in the listing below:

```ts
@HostListener('click') onClick() {
  window.alert('Host Element Clicked');
}
```

In Angular, the @HostListener() function decorator makes it super easy to handle events raised in the host element inside the directive class. Let's go back to our requirement that says you must change the color to red only when the mouse is hovering, and when it's gone, the color of the host element should change to black. To do this, you need to handle the **mouseenter** and **mouseexit** events of the host element in the directive class. To achieve this, modify the **app-changeBg** directive class as shown below:

```ts
import { Directive, ElementRef, Renderer, HostListener } from '@angular/core';

@Directive({
  selector: '[app-changeBg]',
})
export class ChangeBgColorDirective {
  constructor(private el: ElementRef, private renderer: Renderer) {
    // this.changeBgColor('red');
  }

  @HostListener('mouseover')
  onMouseOver() {
    this.changeBgColor('red');
  }

  @HostListener('click')
  onClick() {
    window.alert('Host Element Clicked');
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.changeBgColor('black');
  }

  changeBgColor(color: string) {
    this.renderer.setElementStyle(this.el.nativeElement, 'color', color);
  }
}
```

In the directive class, we are handling the **mouseenter** and **mouseexit** events. As you see, we are using @HostListener() to handle these host element events and assigning a function to it.

So, let's use **@HostListener()** function decorator to handle events of the host element in the directive class.

## @HostBinding() Decorator

`@HostBinding()` function decorator allows you to **set the properties of the host element** from the directive class.

Let's say you want to change the style properties such as height, width, color, margin, border, etc., or any other internal properties of the host element in the directive class. Here, you'd need to use the `@HostBinding()` decorator function to access these properties on the host element and assign a value to it in directive class.

The `@HostBinding()` decorator takes one parameter, the name of the host element property which value we want to assign in the directive.

In our example, our host element is an HTML div element. If you want to set border properties of the host element, you can do that using `@HostBinding()` decorator as shown below:

```ts
@HostBinding('style.border') border: string;

@HostListener('mouseover') onMouseOver() {
  this.border = '5px solid green';
}
```

Using this code, on a mouse hover, the host element border will be set to a green, solid 5-pixel width. Therefore, using the @HostBinding decorator, you can set the properties of the host element in the directive class.

## Reference

* <https://codecraft.tv/courses/angular/custom-directives/hostlistener-and-hostbinding/>
* <https://angular.io/guide/attribute-directives>