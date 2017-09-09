# Declaretively Programming Demo

```javascript
const oneSecond = () => 1000;
const getCurrentTime = () => new Date();
const clear = () => console.clear();
const log = (message) => console.log(message);

const abstractClockTime = (date) => ({
  hours: date.getHours(),
  minutes: date.getMinutes(),
  seconds: date.getSeconds()
});

const civilianHours = (clockTime) => ({
  ...clockTime,
  hours: clockTime.hours > 12 ? clockTime.hours - 12 : clockTime.hours
});

const appendAMPM = (clockTime) => ({
  ...clockTime,
  ampm: clockTime.hours >= 12 ? 'PM' : 'AM'
});

const display = (target) => (time) => target(time);

const formatClock = (format) => (time) =>
  format.replace('hh', time.hours).replace('mm', time.minutes).replace('ss', time.seconds).replace('tt', time.ampm);

const prependZero = (key) => (clockTime) => ({
  ...clockTime,
  [key]: clockTime[key] < 10 ? '0' + clockTime[key] : clockTime[key]
});

// very important!!!
// reduce first para: callback
// second para: initial value
// cb first para is initial value(arg in this case)
// cb second para is a item(one item of fns in this case)
const compose = (...fns) => (arg) => fns.reduce((composed, f) => f(composed), arg);

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
      display(log)
    ),
    oneSecond()
  );

startTicking();
```

## 多久之前发布评论

```javascript
const second = 1000,
  minute = 60 * second,
  hour = 60 * minute,
  day = 24 * hour,
  timeframe = { second, minute, hour, day },
  breakpoints = {
    second: 60,
    minute: 60,
    hour: 24,
    day: 30
  };

const toDate = timeStampString => new Date(timeStampString);

const getDiff = (timestamp, now) => toDate(now) - toDate(timestamp);

const isUnderTime = (diff, timeframe, time) => diff / timeframe < time;

const diffOverTimeframe = (diff, timeframe) => Math.floor(diff / timeframe);

const printResult = (result, timeframeName) =>
  `${result} ${timeframeName + ((result > 1) ? "s" : "")}`;

const checkDate = (diff, timeframeName, underTime, timeframe) =>
  (isUnderTime(diff, timeframe[timeframeName], underTime)) ?
    printResult(diffOverTimeframe(diff, timeframe[timeframeName]), timeframeName) :
    null;

const printFullDate = dateTime =>
  `${dateTime.getMonth() + 1}/${dateTime.getDate()}/${dateTime.getFullYear()}`;

const lessThanAMinute = timeString =>
  (timeString.match(/seconds/)) ?
    "less than a minute" :
    timeString + ' ago';

const _checkNext = (result, callback) =>
  (result) ?
    lessThanAMinute(result) :
    callback();

const checkNext = ([tfName, ...rest], timeframe, timestamp, now) =>
  _checkNext(
    checkDate(getDiff(timestamp, now), tfName, breakpoints[tfName], timeframe),
    () => howLongAgo(rest, timeframe, timestamp, now)
  );

const howLongAgo = (remainingTimeframe, timeframe, timestamp, now) =>
  (!remainingTimeframe.length) ?
    printFullDate(toDate(timestamp)) :
    checkNext(remainingTimeframe, timeframe, timestamp, now);

export const ago = (timestamp, now = new Date().toString()) =>
  howLongAgo(Object.keys(timeframe), timeframe, timestamp, now);
```
