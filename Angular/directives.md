# Directives

## NgIf structural directives, [hidden] attribute difference?

```html
<p *ngIf="true">
  Expression is true and ngIf is true. This paragraph is in the DOM.
</p>

<p [style.display]="'none'">
  Expression sets display to "none". This paragraph is hidden but still in the DOM. 脱离文档流
</p>

<p [hidden]="true">
  Expression sets display to "none". This paragraph is hidden but still in the DOM. 占用文档流
</p>
```

The difference between hiding and removing doesn't matter for a simple paragraph. It does matter when the host element is attached to a resource intensive component. Such a component's behavior continues even when hidden. The component stays attached to its DOM element. It keeps listening to events. Angular keeps checking for changes that could affect data bindings. Whatever the component was doing, it keeps doing.

Although invisible, the component—and all of its descendant components—tie up resources. The performance and memory burden can be substantial, responsiveness can degrade, and the user sees nothing.

On the positive side, showing the element again is quick. The component's previous state is preserved and ready to display. The component doesn't re-initialize—an operation that could be expensive. So hiding and showing is sometimes the right thing to do.

But in the absence of a compelling reason to keep them around, your preference should be to remove DOM elements that the user can't see and recover the unused resources with a structural directive like NgIf .

自定义结构化组件要注意一点：**These same considerations apply to every structural directive, whether built-in or custom.** Before applying a structural directive, you might want to pause for a moment to consider the consequences of adding and removing elements and of creating and destroying components.

> When using the shorthand syntax, Angular allows only one structural directive on an element. If you want to iterate conditionally, for example, put the *ngIf on a container element that wraps the *ngFor element.

## Structural Directives: asterisk (\*) prefix

responsible for HTML layout. They shape or reshape the DOM's structure, typically by adding, removing, or manipulating elements.

```html
<h4>NgIf:</h4>

<div *ngIf="hero" class="name">{{hero.name}}</div>

<ng-template [ngIf]="hero">
  <div class="name">{{hero.name}}</div>
</ng-template>

<h4>NgFor:</h4>

<div *ngFor="let hero of heroes; let i=index; let odd=odd; trackBy: trackById" [class.odd]="odd">
  ({{i}}) {{hero.name}}
</div>

<ng-template
  ngFor
  let-hero
  [ngForOf]="heroes"
  let-i="index"
  let-odd="odd"
  [ngForTrackBy]="trackById"
>
  <div [class.odd]="odd">({{i}}) {{hero.name}}</div>
</ng-template>

<h4>NgSwitch:</h4>

<div [ngSwitch]="hero?.emotion">
  <app-happy-hero *ngSwitchCase="'happy'" [hero]="hero"></app-happy-hero>
  <app-sad-hero *ngSwitchCase="'sad'" [hero]="hero"></app-sad-hero>
  <app-confused-hero *ngSwitchCase="'confused'" [hero]="hero"></app-confused-hero>
  <app-unknown-hero *ngSwitchDefault [hero]="hero"></app-unknown-hero>
</div>

<ng-template [ngSwitch]="hero?.emotion">
  <ng-template [ngSwitchCase]="'happy'">
    <app-happy-hero [hero]="hero"></app-happy-hero>
  </ng-template>
  <ng-template [ngSwitchCase]="'sad'">
    <app-sad-hero [hero]="hero"></app-sad-hero>
  </ng-template>
  <ng-template [ngSwitchCase]="'confused'">
    <app-confused-hero [hero]="hero"></app-confused-hero>
  </ng-template>
  <ng-template ngSwitchDefault>
    <app-unknown-hero [hero]="hero"></app-unknown-hero>
  </ng-template>
</ng-template>
```

## Write a custom structural directive!

```typescript
import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

/**
 * Add the template content to the DOM unless the condition is true.
 */
@Directive({ selector: '[appUnless]' })
export class UnlessDirective {
  private hasView = false;

  constructor(private templateRef: TemplateRef<any>, private viewContainer: ViewContainerRef) {}

  @Input() set appUnless(condition: boolean) {
    if (!condition && !this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (condition && this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }
}
```

usage:

```html
<p *appUnless="condition" class="unless a">
  (A) This paragraph is displayed because the condition is false.
</p>
```

## Reference

- <https://stackblitz.com/edit/angular-confvd?file=src%2Fapp%2Fapp.component.html>
