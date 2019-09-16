# Performance

Runtime performance in Angular ties to its change detection process, which includes three steps:

- Run event handlers
- Update data bindings
- Propagate DOM updates and repaint

Angular must wait for the event handler's callback to finish before change detection can continue and the update rendered.

## 1. ChangeDetection OnPush

By default, Angular runs change detection on all components every time something changes in your app — from a click event to data received from an ajax call. ( user events, timers, xhr, promises, etc. )

What if we could help Angular and give her a better indication of when to check our component?

We can set the `ChangeDetectionStrategy` of our component to `ChangeDetectionStrategy.OnPush`. This tells Angular that the component only depends on his Inputs and needs to be checked in only the following cases:

- **The Input reference changes**.
- An event occurred from the component or one of his children.
- You run change detection explicitly by calling `detectChanges()/tick()/markForCheck()`.

## 2. `trackBy`

### Understanding `*ngFor` mechanisms:

By default, when you use `ngFor` without `trackBy`, `ngFor` tracks array of objects changing through **object identity** so if **new reference** of array of objects is passed to the directive even if the array is with the same values, angular will not be able to detect that they are already drawn and presented in the current DOM but instead, **old elements will be removed and new collection with the same values will be redrawn**.

### When to Use `trackBy`:

- Iterating over large array of objects collection
- In case your business logic might need to modify any of these elements through reordering, modifying specific item, deleting item, or adding a new one.

## 3. Avoid Computing Values in the Template

```ts
@Component({
  selector: 'skills',
  template: `
    <table>
      <tr *ngFor="let skill of skills">
        {{
          skill.calcSomething(skill)
        }}
      </tr>
    </table>
  `,
})
export class SkillsComponent {
  calcSomething(skill) {
    //...
  }
}
```

Reason: Angular needs to re-run your function in every change detection cycle, if the function performs expensive tasks, it can be costly.

Solution: If the value is not changed dynamically at runtime, a better solution would be to:

- Use pure pipes — Angular executes a pure pipe only when it detects a pure change to the input value. (Angular caches the results of previous executions)
- Creates a new property and set the value once, for example:

```ts
this.skills = this.skills.map(skill => ({ ...skill, percentage: calcSomething(skill) });
```

## 4. Disable Change Detection

Imagine that you have a component that depends on data that changes constantly, many times per second.

Updating the user interface whenever new data arrives can be expensive. A more efficient way would be to check and update the user interface every X seconds.

We can do that by detaching the component’s change detector and conducting a local check every x seconds.

```ts
@Component({
  selector: 'giant-list',
  template: `
    <li *ngFor="let d of dataProvider.data">Data {{ d }}</li>
  `,
})
class GiantList {
  constructor(private ref: ChangeDetectorRef, private dataProvider: DataProvider) {
    ref.detach();
    setInterval(() => {
      this.ref.detectChanges();
    }, 5000);
  }
}
```

Advanced example:

```ts
import {
  Component,
  Input,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';

@Component({
  selector: 'app-instructor-list',
  templateUrl: './instructor-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InstructorListComponent implements AfterViewInit {
  // Suppose this time the instructor list doesn't change after it arrives
  @Input() instructors = [];

  constructor(private cdr: ChangeDetectorRef) {}

  // Wait until the view inits before disconnecting
  ngAfterViewInit() {
    // Since we know the list is not going to change
    // let's request that this component not undergo change detection at all
    this.crd.detach();
  }

  // Angular provides additional controls such as the following
  // if the situation allows

  // Request a single pass of change detection for the application
  // this.cdr.markForCheck();

  // Request a single pass of change detection for just this component
  // this.cdr.detectChanges();

  // Connect this component back to the change detection process
  // this.cdr.reattach();
}
```

## 5. Using Lazy Loading

## 6. Executing event handlers quickly

```html
<!-- app.component.html -->
<input type="text" [(ngMode)]="searchTerm" />
<button (click)="update()">Search</button>
<ul>
  <li *ngFor="let instructor of instructors">
    {{ instructor }}
  </li>
</ul>
```

```ts
// app.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
})
export class AppComponent {
  public instructors = [];
  searchTerm = '';

  constructor(private ls: ListService) {
    this.instructors = ls.getList(this.searchTerm);
  }

  // Executes when user clicks the "Search" button.
  // Execution will flow into getList to perform the search.
  // The results arrive back into the update method and assigned
  // to the component.
  // All of this happens within the same change detection cycle.
  update() {
    this.instructors = this.ls.getList(this.searchTerm); // ajax can be slow
  }
}
```

```ts
// list-service.ts
import { Injectable } from '@angular/core';

@Injectable()
export class ListService {
  private instructorList = [
    'Paul Spears',
    'Andrew Wiens',
    'John Baur',
    'Rachel Noccioli',
    'Lance Finney',
  ];

  getList(searchTerm: string) {
    // Though this is a simple search or a small data set,
    // As the data grows in length and complexity the performance of this method
    // will likely degrade.
    return this.instructorList.filter((instructor) => {
      return instructor === searchTerm || searchTerm === '';
    });
  }
}
```

Change detection process cannot complete until all callbacks and their subsequent method calls have finished executing:

![img](https://blog.oasisdigital.com/files/2017/09/stack-trace-edited.png)

## 7. Input setters and `OnChanges`

```ts
export class ChildComponent implements OnChanges {
  @Input()
  set incomingValue(val) {
    // this method is executed every time the value is updated by parent component
  }

  @Input() otherValues;

  ngOnChanges(changes: SimpleChanges) {
    // This method is executed every time
    // ANY input is updated by parent component
  }
}
```

Generally, problematic situations are created in the callbacks of the input setters and ngOnChanges relatively infrequently. It is often easier to spot problems when they do occur as issues are usually isolated to a single component. However, there are still a couple hazardous scenarios to point out.

It is usually recommended to compute any state or UI changes needed as part of the event propagation phase of the change detection cycle. However, some situations may still occur that encourage the use of OnChanges to compute additional state needed locally within a component. Consider the filtered list example: For the sake of argument, assume that the current filter criteria and the unfiltered list are only available as inputs, and the filtered results must be computed immediately prior to display.

```ts
export class ChildComponent implements OnChanges {
  @Input() instructorList = [];
  @Input() searchTerm = '';

  filteredList = [];

  ngOnChanges(changes: SimpleChanges) {
    // This method is executed every time
    // ANY input is updated by parent component
    this.filteredList = this.instructorList.filter((d) => {
      return d === this.searchTerm || this.searchTerm === '';
    });
  }
}
```

This could be achieved by utilizing `OnChanges`. However, doing so would cause every input change to trigger a recalculation of the filtered list. If another input were added to the component, there would be a wasted calculation every time the new input value is changed.

```ts
export class ChildComponent implements OnChanges {
  @Input() instructorList = [];
  @Input() searchTerm = '';

  @Input() selectedInstructor;

  filteredList = [];

  // avoid using it if you can
  ngOnChanges(changes: SimpleChanges) {
    // this guard will reduce some waste but still not ideal
    if (changes['instructorList'] || changes['searchTerm']) {
      this.filteredList = this.instructorList.filter((d) => {
        return d === this.searchTerm || this.searchTerm === '';
      });
    }
  }
}
```

`Input setters` serve a similar purpose as `OnChanges`, however they only fire in response to updates to a corresponding input. Generally speaking, **the use of input setters will lead to more performant change handlers** as there is no need for identifying which input changed, nor will it be called more often than is necessary. Although the granularity of input setters make for a better default choice, it is still possible to populate the callbacks with expensive operations, and they should be treated with the same level of care as OnChanges.

```ts
export class ChildComponent implements OnChanges {
  @Input()
  set instructorList(val) {
    this.filteredList = val.filter((d) => {
      return d === this.searchTerm || this.searchTerm === '';
    });
  }

  @Input()
  set searchTerm(val) {
    this.filteredList = this.instructorList.filter((d) => {
      return d === val || val === '';
    });
  }

  @Input() selectedInstructor;

  filteredList = [];
}
```

## 8. AOT

The goal of change detection is to translate data changes into a newly-rendered view by updating DOM attributes. Angular runs in just-in-time (JIT) mode by default where its interpretation of component templates is executed as part of the digest cycle. This mode of operation is great when building and debugging an application, but it adds significant overhead in the browser at run time. Compiling Angular using the command line interface (CLI) with both prod mode and ahead-of-time (AOT) compiling reduces this overhead by precompiling the application’s component templates and removing the need for JIT processing.

## Reference

- <https://netbasal.com/optimizing-the-performance-of-your-angular-application-f222f1c16354>
- <https://blog.oasisdigital.com/2017/angular-runtime-performance-guide/>
