# React 推荐 composition

> Inheritance is unnecessary in React, and both containment and specialization can be achieved with composition

Because mostly everything that can be accomplished with Mixins (or inheritance) can also be accomplished through composition, but with less side effects.

Inheritance: You have to predict the members you want to inherit carefully. `IRobot(CleaningRobot, CookingRobot), IAnimal(Dog, Cat)`. What if in future we need a CleaningCatRobot? You have to re-struct the interface, maybe have a common IAnimalRobot. When projects get larger, it's painful to do so. Inheritance is difficult to get rid of.

Composition: `CleaningCatAnimal = cleaningRobot + cat`, super clean.

I feel, composition is better than inheritance. Inheritance is not needed.

## Composition

Functional programs break up their logic into small pure functions that are focused on specific tasks. Eventually, you will need to put these smaller functions together. Specifically, you may need to combine them, call them in series or parallel, or compose them into larger functions until you eventually have an application.

When it comes to composition, there are a number of different implementations, patterns, and techniques. One that you may be familiar with is chaining. In JavaScript, functions can be chained together using dot notation to act on the return value of the previous function.

Strings have a replace method. The replace method returns a template string which also will have a replace method. Therefore, we can chain together replace methods with dot notation to transform a string.

```javascript
const template = 'hh:mm:ss tt';
const clockTime = template
  .replace('hh', '03')
  .replace('mm', '33')
  .replace('ss', '33')
  .replace('tt', 'PM');

console.log(clockTime); // "03:33:33 PM"
```

In this example, the template is a string. By chaining replace methods to the end of the template string, we can replace hours, minutes, seconds, and time of day in the string with new values. The template itself remain intact and can be reused to create more clock time displays.

Chaining is one composition technique, but there are others. The goal of composition is to “generate a higher order function by combining simpler functions.”

```javascript
const both = (date) => appendAMPM(civilianHours(date));
```

The both function is one function that pipes a value through two separate functions. The output of civilian hours becomes the input for `appendAMPM`, and we can change a date using both of these functions combined into one. However, this syntax is hard to comprehend and therefore tough to maintain or scale. What happens when we need to send a value through 20 different functions?

A more elegant approach is to create a higher order function we can use to compose functions into larger functions.

```javascript
// new Date() 作为 arg，初始值。先 appendAMPM(clockTime)，返回的对象作为 civilianHours 的参数，执行 civilianHours

const both = compose(
  appendAMPM,
  civilianHours,
);

both(new Date());
```

This approach looks much better. It is easy to scale because we can add more functions at any point. This approach also makes it easy to change the order of the composed functions.

The compose function is a higher order function. It takes functions as arguments and returns a single value.

```javascript
// very important!!!
// reduce first para: function
// second para: initial value
// cb first para is initial value(arg in this case)
// cb second para is a item(one item of fns in this case)
// 目的是执行第一个函数，得到结果再交给第二个函数执行
// compose(f1, f2) 是构建传入 function，compose(f1, f2)(initialValue) 是返回最终结果
const compose = (...fns) => (arg) => fns.reduce((composed, f) => f(composed), arg);
```

Compose takes in functions as arguments and returns a single function. In this implementation, the spread operator is used to turn those function arguments into an array called fns. A function is then returned that expects one argument, arg. When this function is invoked, the fns array is piped starting with the argument we want to send through the function. The argument becomes the initial value for composed and then each iteration of the reduced callback returns. Notice that the callback takes two arguments: composed and a function f. Each function is invoked with compose which is the result of the previous functions output. Eventually, the last function will be invoked and the last result returned.

Other implementations of compose may use `reduceRight` which would compose the functions in reverse order.

```javascript
const composeRight = (...fns) => (arg) => fns.reverse().reduce((composed, f) => f(composed), arg);
```
