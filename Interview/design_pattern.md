# Design Pattern

## Singleton Pattern

Singleton pattern is one of the simplest design patterns. This pattern ensures that a class has only one instance and provides a global point of access to it.

```javascript
var Singleton = (function () {
    var instance;

    function createInstance() {
        var object = new Object("I am the instance");
        return object;
    }

    return {
        getInstance: function () {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        }
    };
})();

function run() {
    var instance1 = Singleton.getInstance();
    var instance2 = Singleton.getInstance();

    alert("Same instance? " + (instance1 === instance2));
}
```

## Factory Method Pattern

In Factory pattern, we create object without exposing the creation logic. In this pattern, an interface is used for creating an object, but let subclass decide which class to instantiate. The creation of object is done when it is required. The Factory method allows a class later instantiation to subclasses.

## facade Pattern

Facade pattern hides the complexities of the system and provides an interface to the client using which the client can access the system.
This pattern involves a single wrapper class which contains a set of members which are required by client. These members access the system on behalf of the facade client and hide the implementation details.
The facade design pattern is particularly used when a system is very complex or difficult to understand because system has a large number of interdependent classes or its source code is unavailable.

## Proxy Pattern

The proxy design pattern is used to provide a surrogate object, which references to other object.
Proxy pattern involves a class, called proxy class, which represents functionality of another class.

## Adapter Pattern

Adapter pattern acts as a bridge between two incompatible interfaces. This pattern involves a single class called adapter which is responsible for communication between two independent or incompatible interfaces.

## DI

Dependency Injection (DI) is a software design pattern that allow us to develop loosely coupled code. DI is a great way to reduce tight coupling between software components. DI also enables us to better manage future changes and other complexity in our software. The purpose of DI is to make code maintainable.
The Dependency Injection pattern uses a builder object to initialize objects and provide the required dependencies to the object means it allows you to "inject" a dependency from outside the class. 
For example, Suppose your Client class needs to use a Service class component, then the best you can do is to make your Client class aware of an IService interface rather than a Service class. In this way, you can change the implementation of the Service class at any time (and for how many times you want) without breaking the host code.