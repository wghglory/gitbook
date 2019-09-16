# Form

## Categories

- Template-drive
  - Generated form model
  - HTML validation
  - 2-way data binding
  - automatically tracks form and input element state
- Reactive
  - Manually created form model
  - Validation in the class
  - No two-way data binding
  - flexible for complex scenarios
    - Dynamically add input elements
    - Watch what the user types
    - Wait validation until typing stops
    - Different validation for different situations
    - Immutable data structures
  - immutable data model
  - easier to perform an action on a value change
  - Reactive transformations --> debounceTime or distinctUntilChanged
  - Easily add input elements dynamically

### Template-drive

- Template

  - Form element
  - Input element(s)
  - Data binding
  - Validation rules (attributes)
  - Validation error messages
  - Form model automatically generated

- Component Class
  - Properties for data binding (data model)
  - Methods for form operations, such as submit

```html
<form #myForm="ngForm" (ngSubmit)="save(myForm)">
  <div [ngClass]="{'has-error': firstNameVar.touched && firstNameVar.invalid }">
    <label for="firstNameId">First Name</label>
    <input
      id="firstNameId"
      type="text"
      placeholder="First Name (required)"
      required
      maxlength="30"
      [(ngModel)]="customer.firstName"
      name="firstName"
      #firstNameVar="ngModel"
    />
    <span *ngIf="firstNameVar.touched && firstNameVar.invalid">
      Please enter your first name.
    </span>
  </div>
  <button type="submit">Save</button>
</form>
```

```html
<input type="text" onchange="onChange($event)" />
```

```ts
onChange(event: Event){
  this.someVar = (<HTMLInputElement>event.target).value;
}
```

### Reactive Forms

- Template

  - Form element
  - Input element(s)
  - Binding to form model

- Component Class
  - Form model
    - Root FormGroup
    - FormControl for each input element
    - Nested FormGroups as desired
    - FormArrays
  - Validation rules
  - Validation error messages
  - Properties for managing data (data model)
  - Methods for form operations, such as submit

```html
<form (ngSubmit)="save()" [formGroup]="signupForm">
  <div [ngClass]="{'has-error': formError.firstName }">
    <label for="firstNameId">First Name</label>
    <input
      id="firstNameId"
      type="text"
      placeholder="First Name (required)"
      formControlName="firstName"
    />
    <span *ngIf="formError.firstName">
      {{formError.firstName}}
    </span>
  </div>
  <button type="submit">Save</button>
</form>
```
