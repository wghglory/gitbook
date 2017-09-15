## Higher-Order Functions -- Functions that can manipulate other functions.

They can take functions in as arguments, or return functions, or both.

The first category of higher-order functions are functions that expect other functions as arguments. `Array.map`, `Array.filter`, and `Array.reduce` all take functions as arguments. They are higher-order functions.

In the following example, we create an `invokeIf` callback function that will test a condition and invoke on callback function when it is true and another callback function when that condition is false:

```javascript
const invokeIf = (condition, fnTrue, fnFalse) => 
    (condition) ? fnTrue() : fnFalse()

const showWelcome = () => 
    console.log("Welcome!!!")

const showUnauthorized = () => 
    console.log("Unauthorized!!!")

invokeIf(true, showWelcome, showUnauthorized)    // "Welcome"
invokeIf(false, showWelcome, showUnauthorized)   // "Unauthorized"
```

`invokeIf` expects two functions: one for true, and one for false. This is demonstrated by sending both `showWelcome` and `showUnauthorized` to `invokeIf`. When the condition is true, `showWelcome` is invoked. When it is false, `showUnauthorized` is invoked.

---

Higher-order functions that return other functions can help us handle the complexities associated with asynchronicity in JavaScript. They can help us create functions that can be used or reused at our convenience.

`Currying` is a functional technique that involves the use of higher-order functions. Currying is the practice of holding on to some of the values needed to complete an operation until the rest can be supplied at a later point in time. This is achieved through the use of a function that returns another function, the curried function.

The following is an example of currying. The `userLogs` function hangs on to some information (the username) and returns a function that can be used and reused when the rest of the information (the message) is made available. In this example, log messages will all be prepended with the associated username. Notice that we’re using the `getFakeMembers` function that returns a promise.

```javascript
const userLogs = userName => message => 
    console.log(`${userName} -> ${message}`)

const log = userLogs("grandpa23")
log("attempted to load 20 fake members")

getFakeMembers(20).then(
    members => log(`successfully loaded ${members.length} members`),
    error => log("encountered an error loading members")
)

// grandpa23 -> attempted to load 20 fake members
// grandpa23 -> successfully loaded 20 members

// grandpa23 -> attempted to load 20 fake members
// grandpa23 -> encountered an error loading members
```

`userLogs` is the higher-order function. The `log` function is produced from `userLogs`, and every time the `log` function is used, “grandpa23” is prepended to the message.



