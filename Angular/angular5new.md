# Angular 5 new features

## Form Validation

Validation on blur and submit:

```html
<form [ngFormOptions]="{updateOn: 'submit'}">

<input name="firstName" ngModel [ngModelOptions]="{updateOn: 'blur'}">
```

## New Router Lifecycle events

1.  allow to track the routing cycle
1.  used to do things like show spinners, measure performance of guards

```
GuardsCheckStart
ChildActivationStart
ActivationStart
GuardsCheckEnd
ResolveStart
ResolveEnd
ActivationEnd
ChildActivationEnd
```

## RxJS 5.5 imports

```ts
import { Observable } from 'rxjs/Observable';
import { map, filter } from 'rxjs/operators';

const names = allUserData.pipe(
  map(user => user.name)
  filter(name => name),
);
```

## Universal Transfer API

* Easily share app state between server and client version
* ServerTransferStateModule has been added
* Optimizes fetching data over HTTP
* More DOM manipulations/support

## Other changes and Optimization

* bug fixes
* preserveWhitespace Option
* exportAs
* Zone speed improvements

```ts
platformBrowserDynamic()
  .bootstrapModule(AppModule, { ngZone: 'noop' })
  .then((ref) => {});
```
