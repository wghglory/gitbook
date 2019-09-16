# Something useful staff

## \*ngIf, [hidden]

- `*ngIf` removes DOM.
- `[hidden] = "condition"` hides DOM.

## Class

- `[class.green] = "condition"`
- `[ngClass] = "{ green: condition, alert: condition }"`
- `[ngClass] = "aFun()"`

```ts
aFun () {
  return { green: condition, alert: condition }
  // or
  return [ 'class1', 'class2' ]
  // or
  return 'class1 class2'
}
```

## Style

- `[style.color] = "a === a ? '#fff': '#000'"`
- `[ngStyle] = "{ color: a === a ? '#fff': '#000', background: b === b ? 'yellow': 'green' }"`
