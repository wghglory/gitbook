# Rxjs helpful functions

```ts
// retry.ts
import { Observable } from "rxjs/Observable";
import { delay, retryWhen, scan } from "rxjs/operators";

export function retry<T>(
  count: number,
  wait: number
): (source: Observable<T>) => Observable<T> {

  return retryWhen(errors => errors.pipe(
    // Each time an error occurs, increment the accumulator.
    // When the maximum number of retries have been attempted, throw the error.
    scan((acc, error) => {
      if (acc >= count) { throw error; }
      return acc + 1;
    }, 0),
    // Wait the specified number of milliseconds between retries.
    delay(wait)
  ));
}
```

```ts
// demo
import { ajax } from "rxjs/observable/dom/ajax";
import { of } from "rxjs/observable/of";
import { catchError, map } from "rxjs/operators";
import { retry } from "./retry";

const name = ajax
  .getJSON<{ name: string }>("/api/employees/alice")
  .let(retry(3, 1000))
  .map(employee => employee.name)
  .catch(error => of(null));

// OR

const name = ajax
  .getJSON<{ name: string }>("/api/employees/alice")
  .pipe(
    retry(3, 1000),
    map(employee => employee.name),
    catchError(error => of(null))
  );
```

## The rule combination to use to enforce a lettable-operator-only policy would be:

<https://github.com/ReactiveX/rxjs-tslint>:

```json
// tslint.json
{
  "rulesDirectory": [
    "node_modules/rxjs-tslint"
  ],
  "rules": {
    "rxjs-collapse-imports": true,
    "rxjs-pipeable-operators-only": true,
    "rxjs-no-static-observable-methods": true,
    "rxjs-proper-imports": true
  }
}
```
