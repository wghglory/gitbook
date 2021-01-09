# Error handling -- retry

## Immediate retry

```typescript
const http$ = this.http.get<Course[]>('/api/courses');

http$
  .pipe(
    tap(() => console.log('HTTP request executed')),
    map((res) => Object.values(res['payload'])),
    shareReplay(),
    retryWhen((errors) => {
      return errors.pipe(tap(() => console.log('retrying...')));
    }),
  )
  .subscribe(
    (res) => console.log('HTTP response', res),
    (err) => console.log('HTTP Error', err),
    () => console.log('HTTP request completed.'),
  );
```

1st failed, 2nd succeeded:

![image](https://s3-us-west-1.amazonaws.com/angular-university/blog-images/rxjs-error-handling/rxjs-error-handling-6.png)

## Delay retry

```typescript
const http$ = this.http.get<Course[]>('/api/courses');

http$
  .pipe(
    tap(() => console.log('HTTP request executed')),
    map((res) => Object.values(res['payload'])),
    shareReplay(),
    retryWhen((errors) => {
      return errors.pipe(
        delayWhen(() => timer(2000)), // delay 2 seconds if error
        tap(() => console.log('retrying...')),
        take(10), // Only retry 10 times
      );
    }),
  )
  .subscribe(
    (res) => console.log('HTTP response', res),
    (err) => console.log('HTTP Error', err),
    () => console.log('HTTP request completed.'),
  );
```

- let's remember that the function passed to `retryWhen` is only going to be called once
- we are returning in that function an Observable that will emit values whenever a retry is needed
- each time that there is an error, the `delayWhen` operator is going to create a duration selector Observable, by calling the timer function
- this duration selector Observable is going to emit the value 0 after 2 seconds, and then complete
- once that happens, the `delayWhen` Observable knows that the delay of a given input error has elapsed
- only once that delay elapses (2 seconds after the error occurred), the error shows up in the output of the notification Observable
- once a value gets emitted in the notification Observable, the `retryWhen` operator will then and only then execute a retry attempt

Here is an example of an HTTP request that was retried 5 times, as the first 4 times were in error:

![img](https://s3-us-west-1.amazonaws.com/angular-university/blog-images/rxjs-error-handling/rxjs-error-handling-10.png)

And here is the network log for the same retry sequence:

![img](https://s3-us-west-1.amazonaws.com/angular-university/blog-images/rxjs-error-handling/rxjs-error-handling-11.png)

## references

- <https://blog.angular-university.io/rxjs-error-handling/>
