/**
 * compose
 * @param {functions} fns a list of functions
 * reduce first para: function
   second para: initial value
   cb first para is initial value(arg in this case)
   cb second para is a item(one item of fns in this case)
   目的是执行第一个函数，得到结果再交给第二个函数执行
   compose(f1, f2) 是构建传入 function，compose(f1, f2)(initialValue) 是返回最终结果
 */
const compose = (...fns) => (arg) => fns.reduce((accu, f) => f(accu), arg);

/** Clock Demo */
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
      display(log)
    ),
    oneSecond()
  );

startTicking();
