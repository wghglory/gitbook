# Imperative and Declarative

Functional programming is a part of a larger programming paradigm: _declarative programming_. Declarative programming is a style of programming where applications are structured in a way that prioritizes **describing what should happen over defining how it should happen.**

In order to understand declarative programming, we’ll contrast it with _imperative programming_, or a style of programming that is only concerned with how to achieve results with code.

Let’s consider a common task: making a string URL-friendly. Typically, this can be accomplished by replacing all of the spaces in a string with hyphens, since spaces are not URL-friendly. First, let’s examine an imperative approach to this task:

```javascript
// Imperative programming
// Just looking at the code alone does not tell us much. Imperative programs require lots of comments in order to understand what is going on.
var string = 'This is the midday show with Cheryl Waters';
var urlFriendly = '';

for (var i = 0; i < string.length; i++) {
  if (string[i] === ' ') {
    urlFriendly += '-';
  } else {
    urlFriendly += string[i];
  }
}

console.log(urlFriendly);
```

```javascript
// declarative
const string = 'This is the mid day show with Cheryl Waters';
const urlFriendly = string.replace(/ /g, '-');

console.log(urlFriendly);
```

Here we are using `string.replace` along with a regular expression to replace all instances of spaces with hyphens. Using `string.replace` is a way of describing what is supposed to happen: spaces in the string should be replaced. The details of how spaces are dealt with are abstracted away inside the `replace` function. In a declarative program, the syntax itself describes what should happen and the details of how things happen are abstracted away.

Declarative programs are easy to reason about because the **code itself describes what is happening**. For example, read the syntax in the following sample—it details what happens after members are loaded from an API:

```javascript
const loadAndMapMembers = compose(
  combineWith(sessionStorage, 'members'),
  save(sessionStorage, 'members'),
  scopeMembers(window),
  logMemberInfoToConsole,
  logFieldsToConsole('name.first'),
  countMembersBy('location.state'),
  prepStatesForMapping,
  save(sessionStorage, 'map'),
  renderUSMap,
);

getFakeMembers(100).then(loadAndMapMembers);
```

The declarative approach is more readable and, thus, easier to reason about. The details of how each of these functions is implemented are abstracted away. Those tiny functions are named well and combined in a way that describes how member data goes from being loaded to being saved and printed on a map, and this approach does not require many comments. Essentially, declarative programming produces applications that are easier to reason about, and when it is easier to reason about an application, that application is easier to scale.

Now, let’s consider the task of building a document object model, or [DOM](https://www.w3.org/DOM/). An imperative approach would be concerned with how the DOM is constructed:

```javascript
var target = document.getElementById('target');
var wrapper = document.createElement('div');
var headline = document.createElement('h1');

wrapper.id = 'welcome';
headline.innerText = 'Hello World';

wrapper.appendChild(headline);
target.appendChild(wrapper);
```

This code is concerned with creating elements, setting elements, and adding them to the document. It would be very hard to make changes, add features, or scale 10,000 lines of code where the DOM is constructed imperatively.

Now let’s take a look at how we can construct a DOM declaratively using a React component:

```jsx
const Welcome = () => (
  <div id="welcome">
    <h1>Hello World</h1>
  </div>
);

ReactDOM.render(<Welcome />, document.getElementById('target'));
```

React is declarative. Here, the `Welcome` component describes the DOM that should be rendered. The `render` function uses the instructions declared in the component to build the DOM, abstracting away the details of how the DOM is to be rendered. We can clearly see that we want to render our `Welcome` component into the element with the ID of `'target'`.

## Building a clock declaratively

Our challenge is to build a ticking clock. The clock needs to display hours, minutes, seconds and time of day in civilian time. Each field must always have double digits, meaning leading zeros need to be applied to single digit values like 1 or 2. The clock must also tick and change the display every second.

First, let’s review an imperative solution for the clock.

```javascript
// Log Clock Time every Second
setInterval(logClockTime, 1000);

function logClockTime() {
  // Get Time string as civilian time
  var time = getClockTime();

  // Clear the Console and log the time
  console.clear();
  console.log(time);
}

function getClockTime() {
  // Get the Current Time
  var date = new Date();

  // Serialize clock time
  var time = {
    hours: date.getHours(),
    minutes: date.getMinutes(),
    seconds: date.getSeconds(),
    ampm: 'AM',
  };

  // Convert to civilian time
  if (time.hours == 12) {
    time.ampm = 'PM';
  } else if (time.hours > 12) {
    time.ampm = 'PM';
    time.hours -= 12;
  }

  // Prepend a 0 on the hours to make double digits
  if (time.hours < 10) {
    time.hours = '0' + time.hours;
  }

  // prepend a 0 on the minutes to make double digits
  if (time.minutes < 10) {
    time.minutes = '0' + time.minutes;
  }

  // prepend a 0 on the seconds to make double digits
  if (time.seconds < 10) {
    time.seconds = '0' + time.seconds;
  }

  // Format the clock time as a string "hh:mm:ss tt"
  return time.hours + ':' + time.minutes + ':' + time.seconds + ' ' + time.ampm;
}
```

It works, and the comments help us understand what is happening. However, these functions are large and complicated. Each function does a lot. They are hard to comprehend, they require comments and they are tough to maintain. Let’s see how a functional approach can produce a more scalable application.

Our goal will be to break the application logic up into smaller parts, functions. Each function will be focused on a single task, and we will compose them into larger functions that we can use to create the clock.

---

First, let’s create some functions that give us values and manage the console. We’ll need a function that gives us one second, a function that gives us the current time, and a couple of functions that will log messages on a console and clear the console. In functional programs, we should use functions over values wherever possible. We will invoke the function to obtain the value when needed.

```javascript
const oneSecond = () => 1000;
const getCurrentTime = () => new Date();
const clear = () => console.clear();
const log = (message) => console.log(message);
```

---

Next we will need some functions for transforming data. These three functions will be used to mutate the `Date` object into an object that can be used for our clock:

* serializeClockTime

  Takes a date object and returns a object for clock time that contains hours minutes and seconds.

* civilianHours

  Takes the clock time object and returns an object where hours are converted to civilian time. For example: 1300 becomes 1 o’clock

* appendAMPM

  Takes the clock time object and appends time of day, AM or PM, to that object.

```javascript
const serializeClockTime = (date) => ({
  hours: date.getHours(),
  minutes: date.getMinutes(),
  seconds: date.getSeconds(),
});

// clockTime { hours, minutes, seconds }
const civilianHours = (clockTime) => ({
  ...clockTime,
  hours: clockTime.hours > 12 ? clockTime.hours - 12 : clockTime.hours,
});

const appendAMPM = (clockTime) => ({
  ...clockTime,
  ampm: clockTime.hours >= 12 ? 'PM' : 'AM',
});
```

These three functions are used to transform data without changing the original. They treat their arguments as immutable objects.

---

Next we’ll need a few higher order functions:

* display

  Takes a target function and returns a function that will send a time to the target. In this example the target will be console.log.

* formatClock

  Takes a template string and uses it to return clock time formatted based upon the criteria from the string. In this example, the template is “hh:mm:ss tt”. FormatClock will replaces the placeholders with hours, minutes, seconds, and time of day.

* prependZero

  Takes an object’s key as an argument and prepends a zero to the value stored under that objects key. It takes in a key to a specific field and prepends values with a zero if the value is less than 10.

```javascript
// target is console.log in this case, target maybe alert etc
const display = (target) => (time) => target(time);

// 决定一种 format 格式，比如 const usFormat = formatClock('hh:mm:ss tt');
const formatClock = (format) => (time) =>
  format
    .replace('hh', time.hours)
    .replace('mm', time.minutes)
    .replace('ss', time.seconds)
    .replace('tt', time.ampm);

// key is hours, minutes, seconds, 决定了哪个属性需要 prepend 0
const prependZero = (key) => (clockTime) => ({
  ...clockTime,
  [key]: clockTime[key] < 10 ? '0' + clockTime[key] : clockTime[key],
});
```

These higher order functions will be invoked to create the functions that will be reused to format the clock time for every tick. Both format clock and `prependZero` will be invoked once, initially setting up the required template or key. The inner functions that they return will be invoked once every second to format the time for display.

---

Now that we have all of the functions required to build a ticking clock, we will need to compose them. We will use the compose function that we defined in the last section to handle composition:

* convertToCivilianTime

  A single function that will take clock time as an argument and transforms it into civilian time by using both civilian hours.

* doubleDigits

  A single function that will take civilian clock time and make sure the hours, minutes, and seconds display double digits by prepending zeros where needed.

* startTicking

  Starts the clock by setting an interval that will invoke a callback every second. The callback is composed using all of our functions. Every second the console is cleared, currentTime obtained, converted, civilianized, formatted, and displayed.

```javascript
// compose 从右向左执行！
const convertToCivilianTime = (clockTime) => compose(appendAMPM, civilianHours)(clockTime);

const doubleDigits = (civilianTime) =>
  compose(prependZero('hours'), prependZero('minutes'), prependZero('seconds'))(civilianTime);

const startTicking = () =>
  setInterval(
    compose(
      clear,
      getCurrentTime,
      serializeClockTime,
      convertToCivilianTime,
      doubleDigits,
      formatClock('hh:mm:ss tt'),
      display(log),
    ),
    oneSecond(),
  );

startTicking();
```

This declarative version of the clock achieves the same results as the imperative version. However, there quite a few benefits to this approach.

1.  all of these functions are easily testable and reusable. They can be used in future clocks or other digital displays.
1.  this program is easily scalable. There are no side effects. There are no global variables outside of functions themselves. There could still be bugs, but they will be easier to find.

Full code:

```javascript
const oneSecond = () => 1000;
const getCurrentTime = () => new Date();
const clear = () => console.clear();
const log = (message) => console.log(message);

const abstractClockTime = (date) => ({
  hours: date.getHours(),
  minutes: date.getMinutes(),
  seconds: date.getSeconds(),
});

const civilianHours = (clockTime) => ({
  ...clockTime,
  hours: clockTime.hours > 12 ? clockTime.hours - 12 : clockTime.hours,
});

const appendAMPM = (clockTime) => ({
  ...clockTime,
  ampm: clockTime.hours >= 12 ? 'PM' : 'AM',
});

const display = (target) => (time) => target(time);

const formatClock = (format) => (time) =>
  format
    .replace('hh', time.hours)
    .replace('mm', time.minutes)
    .replace('ss', time.seconds)
    .replace('tt', time.ampm);

const prependZero = (key) => (clockTime) => ({
  ...clockTime,
  [key]: clockTime[key] < 10 ? '0' + clockTime[key] : clockTime[key],
});

// very important!!!
// reduce first para: function
// second para: initial value
// cb first para is initial value(arg in this case)
// cb second para is a item(one item of fns in this case)
// 目的是执行第一个函数，得到结果再交给第二个函数执行
// compose(f1, f2) 是构建传入 function，compose(f1, f2)(initialValue) 是返回最终结果
const compose = (...fns) => (arg) => fns.reduce((accu, f) => f(accu), arg);

// clockTime 作为 arg，初始值。先 appendAMPM(clockTime)，返回的对象作为 civilianHours 的参数，执行 civilianHours
const convertToCivilianTime = (clockTime) => compose(appendAMPM, civilianHours)(clockTime);

const doubleDigits = (civilianTime) =>
  compose(prependZero('hours'), prependZero('minutes'), prependZero('seconds'))(civilianTime);

const startTicking = () =>
  setInterval(
    compose(
      clear,
      getCurrentTime,
      abstractClockTime,
      convertToCivilianTime,
      doubleDigits,
      formatClock('hh:mm:ss tt'),
      display(log),
    ),
    oneSecond(),
  );

startTicking();
```
