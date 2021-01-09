# Components Communication

## 1. Communicating with Child Components Using @Input (Parent pass data to child)

I want to create a address component as a child component. The parent component, events-list, will pass the event object to the child. To get this done:

- child component needs import `Input` from angular/core
- parent template uses the child selector, and [input parameter name] = "parent"

1.  child component: `events-address.component.ts`

    ```typescript
    //child component, talk with parent events-list.component.ts
    import { Component, Input } from '@angular/core';

    @Component({
      selector: 'events-address',
      template: '<span>{{address.address}},{{address.city}},{{address.country}}</span>',
    })
    export class EventsAddressComponent {
      @Input() address: any; //define address object
    }
    ```

1.  modify parent component template, [address] is child object name, "event.location" is parent data

    ```html
    <div>
      <h1>Upcoming Angular 2 Events</h1>
      <div class="well hoverwell thumbnail">
        <h2>Event: {{event.name}}</h2>
        <div>Price: ${{event.price}}</div>
        <div>Date: {{event.date}}</div>
        <div>Time: {{event.time}}</div>
        <!-- <div>Address: {{event.location.address}}, {{event.location.city}}, {{event.location.country}}</div> -->
        <events-address [address]="event.location"></events-address>
      </div>
    </div>
    ```

1.  import child component to app.module

    ```typescript
    import { EventsAddressComponent } from './events/events-address.component'

    @NgModule({
        declarations: [AppComponent, EventsListComponent, EventsAddressComponent],
    })
    ```

## 2. Communicating with Parent Components Using @Output and EventEmitter (child pass data to parent)

1.  child component `events-address.component.ts`:

    - import Output, EventEmitter
    - define a variable accepting EventEmitter
    - define buttonClick
    - the EventEmitter variable emit any data from child component

    ```typescript
    //child component, talk with parent events-list.component.ts
    import { Component, Output, EventEmitter } from '@angular/core';

    @Component({
      selector: 'events-address',
      template: '<button (click)="buttonClick()">Click me!</button>',
    })
    export class EventsAddressComponent {
      @Output() myClick = new EventEmitter();

      buttonClick() {
        this.myClick.emit('I am from child component, should pass data to parent component');
      }
    }
    ```

1.  parent Component `events-list.component.ts`:

    - update template: `(the EventEmitter variable name defined in child component) = "randomFuncInParent($event)"`

    ```html
    <events-address (myClick)="clickWithAnyName($event)"></events-address>
    ```

    - define random function in parent component class

    ```typescript
    export class EventsListComponent {
      clickWithAnyName(dataFromChild) {
        alert(dataFromChild);
      }
    }
    ```

## 3. Using Template Variables To Interact with Child Components (parent access to child data, easier than method 2)

1.  child component `events-address.component.ts` define public property and method

    ```typescript
    //child component, talk with parent events-list.component.ts
    @Component({
      selector: 'events-address',
      template: '',
    })
    export class EventsAddressComponent {
      //use template variable to interact with child public method/property: parent accesses child data
      author: string = 'Guanghui Wang'; //child public property
      getAuthor() {
        alert(this.author);
      }
    }
    ```

1.  access child component data from parent component template's childPointer variable

    ```html
    <events-address
      [address]="event.location"
      (myClick)="clickWithAnyName($event)"
      #childPointer
    ></events-address>
    <button (click)="childPointer.getAuthor()" class="btn-primary btn">
      Test template variable
    </button>
    <h3>{{childPointer.author}}</h3>
    ```
