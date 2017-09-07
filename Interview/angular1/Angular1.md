# Most comes from dotnetTricks

### Service, Factory, Provider

**Factory** allows you to add some logic before creating the object. It returns the created object.

```javascript
app.factory('myFactory',function(){
    var obj = {};
    obj.name = '';
    obj.setName = function(name){
        obj.name = name;
    };

    return obj;
});

//usage:
myFactory.setName('wang');
$scope.Name = myFactory.name;
```

when to use: use it with constructor

**Service**: Doesn't return anything

```javascript
app.service('myService', function(){
    this.name = '';
    this.setName = function(newname){
        this.name = newname;
        return this.name;
    };
})

//usage:
$scope.Name = myService.setName('wang');
```

when to use: a singleton object. when needing to share a single object across the application. Authenticated user details

**Provider**: create a configurable service object. 

```javascript
app.provider('configurable', function(){
    var privateName = '';
    this.setName = function(newName){
        privateName = newName;
    };
    this.$get = function(){
        return {name:privateName};
    };
});

//usage:
app.config(function(configurableProvider){
    configurableProvider.setName('wang');
});
$scope.Name = configurable.name;
```

## Routing

To build a SPA. divide app into multiple views and bind different views. **$routeProvider**, **ngRoute** module

```javascript
let app = angular.module('myApp', ['ngRoute']);

app.config(['$routeProvider'], function($routeProvider) {
    $routeProvider.
        when('/products', {
            templateUrl: 'Views/products.html',
            controller: 'productController'
        }).when('/products/:productId', {
            templateUrl: 'Views/product.html',
            controller: 'productController'
        }).otherwise({
            redirectTo: '/index'
        });
});
```

### How angular is compiled

The compiler allows you attaching new behaviors or attributes to any Html element. Angular uses $compiler service to compile page after DOM is fully loaded. 2 phases:

1. **Compile**: It traverse the DOM and collect directives. Foreach directive, it adds it to a list of directives. It will sort that list by priority. Then each directive's compile function is executed, and each compile function returns a linking function, which is then composed into a combined linking function.
1. **Link**: link function gets called. This in turn calls linking function of individual directives, registering listeners on the elements and setting up $watch with the scope. after combining directives with a scope, it produces the view.

prelink: executed before elements are linked. Not safe to do DOM transformation
postlink: executed after elements are linked. Safe to do DOM transformation

The concept of compile and link comes from C language, where you first compile the code and then link it to execute it

### How Data binding happens (apply, digest, watch)

**$watch**: observe scope variable change.

```javascript
$scope.$watch('name', function(newVal, oldVal){  });
```

**$digest**: iterates thru all watchers and check if value has changed. If changing, calls the listener with new value and old value.

**$apply**: angular auto updates only model changes within angular context. if any model change happens outside of context, like DOM events, setTimeout, XHR ajax, third party libraries, we need inform angular of the changes by calling $apply manually. When $apply finishes, angular calls $digest internally so all bindings are updated.

```javascript
document.getElementById('hello').addEventListener('click', function(){
    $scope.$apply(function(){
        $scope.time = new Date();
    });
}, false);
```

digest is faster than apply, since apply triggers watchers on the entire scope chain (parents, children) while digest only current scope and its children.

### Digest life cycle

responsible for updating DOM elements with model changes, executing watcher functions

digest loop is fired when browser receives an event that can be managed by angular context. It includes 2 smaller loops

1. digest loop keeps iterating until the **$evalAsnc queue** is empty and **$watch list** doesn't detect any model change
1. $evalAsync queue contains all tasks which are scheduled by $evalAsync function from a directive or controller
1. $watch list contains all watches correspondence to each DOM element which is bound to the $scope object. These watches are resolved in the $digest loop through a process called **dirty checking**. If a values changes, $scope is dirty, another digest loop is triggered.

### How to handles exception automatically?

when error occurs in one of watchers, digest cannot handle errors via $exceptionHandler service. In this case you have to handle manually.

while apply uses try catch block to handle errors then pass them to exceptionHandler service.

```javascript
function $apply(exp){
    try return $eval(exp)
    catch(e) $exceptionHandler(e);
    finally $root.digest();
}
```

### $watch, $watchGroup, $watchCollection

**$watch**: watch a variable
**$watchGroup**: watch variables in array

```javascript
$scope.a = 1;
$scope.b = 2;
$scope.$watchGroup(['a','b'], function(newval,oldval){} );
```

**$watchCollection**: watch if any property changes in an object

```javascript
$scope.names = ['a','b','c'];  //{'a':1,'b':2}
$scope.$watchCollection('names', function(newval,oldval){});
```

### Difference between $observe and $watch

$observe is a method on the *attr* object which is only used to observe attribute change
$watch is a method on the $scope object which is to watch expression(string, function)

### $parse and $eval

$parse is a service that converts an expression into a function. Then function can be invoked and passed a context(usually scope) in order to retrieve the expression's value

$eval executes an expression on the current scope and returns the result

```javascript
$scope.a=1;
$scope.b=2;
$scope.$eval('b+a');
```

### Isolate scope

by default, a custom directive has access to parent scope. If we don't have access to parent scope, only access to current directive's scope. 

```javascript
angular.module('myapp').directive('hi',function(){
    return {
        scope: {},   // create an isolate scope
        template: 'Name: {{emp.name}}'
    }
});
```

> Below is not from dotnetTricks

### How Angular service return a promise?

To add promise functionality to a service, we inject the `$q` dependency in the service

```javascript
angular.factory('testService', function($q) {
    return {
        getName: function() {
            var deferred = $q.defer();
            //API call here that returns data
            testAPI.getName().then(function(name) {
                deferred.resolve(name);
            });
            return deferred.promise;
        }
    };
});
```

The $q library is a helper provider that implements promises and deferred objects to enable asynchronous functionality. Pasted from <https://www.codementor.io/angularjs/tutorial/angularjs-interview-questions-sample-answers>

### Interceptor? What are common uses of it?

An interceptor is a middleware code where all the `$http` requests go through.
The interceptor is a factory that are registered in `$httpProvider`. You have 2 types of requests and response that go through the interceptor. This piece of code is very useful for error handling, authentication or middleware in all the requests/responses.

Pasted from <https://www.codementor.io/angularjs/tutorial/angularjs-interview-questions-sample-answers>