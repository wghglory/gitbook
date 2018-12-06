# Difference between Subject and BehaviorSubject

A BehaviorSubject holds one value. When it is subscribed it emits the value immediately. A Subject doesn't hold a value.

Subject example (with RxJS 5 API):

```ts
const subject = new Rx.Subject();
subject.next(1);
subject.subscribe((x) => console.log(x));
```

Console output will be empty

BehaviorSubject example:

```ts
const subject = new Rx.BehaviorSubject();
subject.next(1);
subject.subscribe((x) => console.log(x));
```

## BehaviorSubject

**BehaviorSubject will return the initial value or the current value on Subscription**

```ts
var subject = new Rx.BehaviorSubject(0); // 0 is the initial value

subject.subscribe({
  next: (v) => console.log('observerA: ' + v), // output initial value, then new values on `next` triggers
});

subject.next(1); // output new value 1 for 'observer A'
subject.next(2); // output new value 2 for 'observer A', current value 2 for 'Observer B' on subscription

subject.subscribe({
  next: (v) => console.log('observerB: ' + v), // output current value 2, then new values on `next` triggers
});

subject.next(3);
```

With output:

```ts
observerA: 0;
observerA: 1;
observerA: 2;
observerB: 2;
observerA: 3;
observerB: 3;
```

## Subject

**Subject doesnot return the current value on Subscription. It triggers only on .next(value)call and return/output the value**

```ts
var subject = new Rx.Subject();

subject.next(1); //Subjects will not output this value

subject.subscribe({
  next: (v) => console.log('observerA: ' + v),
});
subject.subscribe({
  next: (v) => console.log('observerB: ' + v),
});

subject.next(2);
subject.next(3);
```

With the following output on the console:

```ts
observerA: 2;
observerB: 2;
observerA: 3;
observerB: 3;
```
