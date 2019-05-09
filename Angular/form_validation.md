# Reactive form validation

```html
<div class="container">
  <div class="row">
    <div class="col-md-6 offset-md-3">
      <h3>Angular 6 Reactive Form Validation</h3>
      <form [formGroup]="registerForm"
        (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label>First Name</label>
          <input type="text"
            formControlName="firstName"
            class="form-control"
            [ngClass]="{ 'is-invalid': formControls.firstName.touched && formControls.firstName.errors }" />
          <div *ngIf="formControls.firstName.touched && formControls.firstName.errors"
            class="invalid-feedback">
            <div *ngIf="formControls.firstName.errors.required">First Name is required</div>
          </div>
        </div>
        <div class="form-group">
          <label>Last Name</label>
          <input type="text"
            formControlName="lastName"
            class="form-control"
            [ngClass]="{ 'is-invalid': formControls.lastName.touched && formControls.lastName.errors }" />
          <div *ngIf="formControls.lastName.touched && formControls.lastName.errors"
            class="invalid-feedback">
            <div *ngIf="formControls.lastName.hasError('required')">Last Name is required</div>
          </div>
        </div>
        <div class="form-group">
          <label>Email</label>
          <input type="text"
            formControlName="email"
            class="form-control"
            [ngClass]="{ 'is-invalid': formControls.email.touched && formControls.email.errors }" />
          <div *ngIf="formControls.email.touched && formControls.email.errors"
            class="invalid-feedback">
            <div *ngIf="formControls.email.errors.required">Email is required</div>
            <div *ngIf="formControls.get('email').hasError('email')">Email must be a valid email address</div>
          </div>
        </div>
        <div class="form-group">
          <label>Password</label>
          <input type="password"
            formControlName="password"
            class="form-control"
            [ngClass]="{ 'is-invalid': formControls.password.touched && formControls.password.errors }" />
          <div *ngIf="formControls.password.touched && formControls.password.errors"
            class="invalid-feedback">
            <div *ngIf="formControls.password.errors.required">Password is required</div>
            <div *ngIf="formControls.password.errors.minlength">Password must be at least 6 characters</div>
          </div>
        </div>
        <div class="form-group">
          <button class="btn btn-primary">Register</button>
        </div>
      </form>
    </div>
  </div>
</div>
```

```ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app',
  templateUrl: 'app.component.html',
})
export class AppComponent implements OnInit {
  registerForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  // convenience getter for easy access to form fields
  get formControls() {
    return this.registerForm.controls;
  }

  onSubmit() {
    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }

    alert(JSON.stringify(this.registerForm.value));
  }
}
```
