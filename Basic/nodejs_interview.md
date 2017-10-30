# nodejs interview

- What is an error-first callback?
- How can you avoid callback hells?
- How can you listen on port 80 with Node?
- What's the event loop?
- What tools can be used to assure consistent style?
- What's the difference between operational and programmer errors?
- Why npm shrinkwrap is useful?
- What's a stub? Name a use case.
- What's a test pyramid? How can you implement it when talking about HTTP APIs?
- What's your favourite HTTP framework and why?
- What are Promises?
- When should you npm and when yarn?
- How can you secure your HTTP cookies against XSS attacks?
- How can you make sure your dependencies are safe?

### What is an error-first callback?

Error-first callbacks are used to pass errors and data. The first argument is always an error object that the programmer has to check if something went wrong. Additional arguments are used to pass data.

```javascript
fs.readFile(filePath, function(err, data) {
    if (err) {
      //handle the error
    }
    // use the data object
});
```

### How can you avoid callback hells?

- modularization: break callbacks into independent functions
- use *Promises*
- use yield with *Generators*
- use a **control flow library**, like [async](https://www.npmjs.com/package/async)
- use async/await (note that it is only available in the latest v7 release and not in the LTS version - [you can read our experimental async/await how-to here](https://blog.risingstack.com/async-await-node-js-7-nightly/))

### [Why Modular programming](http://leftstick.github.io/why-modularization)

- Avoid naming conflict in global
- Separation of dependency concerns
- File concatenation for production

```javascript
//AMD
define([module_id,] [dependencies], function (){
    'use strict';
    //Put the module definition here
});

define(['./UserModel', 'jquery'], function(User, $) {
    'use strict';
    var service = {};
    service.fetchUsers = function(){
        return $.ajax({
                url: '/users',
                method: 'method',
                dataType: 'json',
                converters: {
                    "text json": function(raw){
                        var data = JSON.parse(raw);
                        var users = data.map(function(d){
                            var user = new User();
                            user.set('name', d.name);
                            user.set('age', d.age);
                            return user;
                        });
                        return users;
                    }
                }
            });
    };
    return service;
});


//commonjs
var $ = require('jquery');
var service = {};
service.fetchUsers = function() {
    return $.ajax({
        url: '/mock/users.json',
        method: 'GET',
        dataType: 'json',
        converters: {
            'text json': function(raw) {
                var data = JSON.parse(raw);
                var users = data.map(function(d) {
                    var user = new User();
                    user.set('name', d.name);
                    user.set('age', d.age);
                    return user;
                });
                return users;
            }
        }
    });
};
module.exports = service;

//ES2015
import $ from 'jquery';
import User from './UserModel';
var service = {};

service.fetchUsers = function() {
    return $.ajax({
        url: '/mock/users.json',
        method: 'GET',
        dataType: 'json',
        converters: {
            'text json': function(raw) {
                var data = JSON.parse(raw);
                var users = data.map(function(d) {
                    var user = new User();
                    user.set('name', d.name);
                    user.set('age', d.age);
                    return user;
                });
                return users;
            }
        }
    });
};
export default service;
```

### How can you listen on port 80 with Node?

**Trick question!** You should not try to listen with Node on port 80 *(in Unix-like systems)* - to do so you would need superuser rights, but it is not a good idea to run your application with it.

Still, if you want to have your Node.js application listen on port 80, here is what you can do. Run the application on any port above 1024, then put a reverse proxy like [nginx](http://nginx.org/) in front of it.

### What's the event loop?

Node.js runs using a single thread. when you call sync functions, they will be pushed into call stack, and execute on javascript runtime. When calling async functions like setTimeout, it won't be execute on call stack immediately, browser webapi will execute it, and when it finishes, the result will be pushed to task queue. Event loop will check the status of call stack and task queue. When all sync functions on call stack are done, Event loop will send results on task queue to call stack and show results.

Every I/O requires a callback - once they are done they are pushed onto the event loop for execution.

Under the hood Node.js uses many threads through libuv.

### What tools can be used to assure consistent style?

[ESLint](http://eslint.org/), [Standard](http://standardjs.com), [JSLint](http://jslint.com/)

These tools are really helpful when developing code in teams, to enforce a given style guide and to catch common errors using static analysis.

### What's the difference between operational and programmer errors?

Operation errors are not bugs, but problems with the system, like *request timeout* or *hardware failure*. On the other hand programmer errors are actual bugs.

### [Why npm shrinkwrap is useful?](http://tech.meituan.com/npm-shrinkwrap.html)

> _This command locks down the versions of a package's dependencies so that you can control exactly which versions of each dependency will be used when your package is installed._ [*npmjs.com*](https://docs.npmjs.com/cli/shrinkwrap)

It is useful when you are deploying your Node.js applications - with it you can be sure which versions of your dependencies are going to be deployed.

### What's a stub? Name a use case.

Stubs are functions/programs that simulate the behaviours of components/modules. Stubs provide canned answers to function calls made during test cases. Also, you can assert on with what these stubs were called.

A use-case can be a file read, when you do not want to read an actual file:

```javascript
var fs = require('fs');

var readFileStub = sinon.stub(fs, 'readFile', function(path, cb) {
  return cb(null, 'filecontent');
});

expect(readFileStub).to.be.called;
readFileStub.restore();
```

### What's a test pyramid? How can you implement it when talking about HTTP APIs?

A test pyramid describes that when writings test cases there should be a lot more low-level unit tests than high level end-to-end tests.

When talking about HTTP APIs, it may come down to this:

- lots of low-level unit tests for models *(dependencies ***are stubbed***)*,
- fewer integration tests, where you check how your models interact with each other *(dependencies ***are not stubbed***)*,
- less end-to-end tests, where you call your actual endpoints *(dependencies ***are not stubbed***)*.

### What are Promises?

Promises are a concurrency primitive. Promises can help you better handle async operations instead of callback functions.

Also, note the catch, which can be used for error handling. Promises are chainable.

```javascript
new Promise((resolve, reject) => {
    setTimeout(() => {
      	resolve('result')
    }, 100)
}).then(console.log).catch(console.error)
```

### When are background/worker processes useful? How can you handle worker tasks?

Worker processes are extremely useful if you'd like to do data processing in the background, like sending out emails or processing images. Canvas draw pixels.

There are lots of options for this like [RabbitMQ](https://www.rabbitmq.com/) or [Kafka](https://kafka.apache.org/).

### When to use yarn and npm?

For now I would suggest keep using npm for open source libraries, so if a new update gets pushed, you will get that automatically as well, while for production application deployments yarn seems like a good fit. Ask interviewer How do you use them?

### How can you secure your HTTP cookies against XSS attacks?

XSS occurs when the attacker injects executable JavaScript code into the HTML response.

To mitigate these attacks, you have to set flags on the set-cookie HTTP header:

- **HttpOnly** - this attribute is used to help prevent attacks such as cross-site scripting since it does not allow the cookie to be accessed via JavaScript.
- **secure** - this attribute tells the browser to only send the cookie if the request is being sent over HTTPS.

So it would look something like this: Set-Cookie: `sid=<cookie-value>`; HttpOnly. If you are using Express, with [express-cookie session](https://github.com/expressjs/cookie-session#cookie-options), it is working by default.

### How can you make sure your dependencies are safe?

When writing Node.js applications, **ending up with hundreds or even thousands of dependencies can easily happen**. 

For example, if you depend on Express, you depend on [27 other modules](https://github.com/expressjs/express/blob/master/package.json#L29) directly, and of course on those dependencies' as well, so manually checking all of them is not an option!

The only option is to automate the update / security audit of your dependencies. For that there are free and paid options:

- npm outdated
- [Trace by RisingStack](https://trace.risingstack.com/)
- [NSP](https://nodesecurity.io/)
- [GreenKeeper](https://greenkeeper.io/)
- [Snyk](https://snyk.io/)

### What's wrong with the code snippet?

```javascript
new Promise((resolve, reject) => {
    throw new Error('error')
}).then(console.log)
```

As there is no catch after the then. This way the error will be a silent one, there will be no indication of an error thrown.

To fix it, you can do the following:

```Javascript
new Promise((resolve, reject) => {
    throw new Error('error')
}).then(console.log).catch(console.error)
```

If you have to debug a huge codebase, and you don't know which Promise can potentially hide an issue, you can use the unhandledRejection hook. It will print out all unhandled Promise rejections.

```javascript
process.on('unhandledRejection', (err) => {
    console.log(err)
})
```

### What's wrong with the following code snippet?

```javascript
function checkApiKey (apiKeyFromDb, apiKeyReceived) {
    if (apiKeyFromDb === apiKeyReceived) {
      return true
    }
    return false
}
```

When you compare security credentials it is crucial that you don't leak any information, so you have to make sure that you compare them in fixed time. If you fail to do so, your application will be vulnerable to [timing attacks](https://en.wikipedia.org/wiki/Timing_attack).

But why does it work like that?

**V8, the JavaScript engine used by Node.js, tries to optimize the code you run from a performance point of view.** It starts comparing the strings character by character, and once a mismatch is found, it stops the comparison operation. **So the longer the attacker has from the password, the more time it takes.**

To solve this issue, you can use the npm module called [cryptiles](https://www.npmjs.com/package/cryptiles).

```javascript
function checkApiKey (apiKeyFromDb, apiKeyReceived) {
    return cryptiles.fixedTimeComparison(apiKeyFromDb, apiKeyReceived)
}
```

### What's the output of following code snippet?

```javascript
Promise.resolve(1)
  .then((x) => x + 1)
  .then((x) => { throw new Error('My Error') })
  .catch(() => 1)
  .then((x) => x + 1)
  .then((x) => console.log(x))  //2
  .catch(console.error)
```

1. A new Promise is created, that will resolve to 1.
1. The resolved value is incremented with 1 (so it is 2 now), and returned instantly.
1. The resolved value is discarded, and an error is thrown.
1. The error is discarded, and a new value (1) is returned.
1. The execution did not stop after the catch, but before the exception was handled, it continued, and a new, incremented value (2) is returned.
1. The value 2 is printed to the standard output.
1. This line won't run, as there was no exception.
