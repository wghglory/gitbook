# Decorator

## What are decorators?

* Proposed feature for JavaScript
* Declarative programming
* Implemented as function
* Can attached to: Properties, Parameters, Accessors, Methods, Classes

## Decorator syntax

### Simple function decorator

```ts
function uiElement(target: Function) {
  // do ui stuff
}

function deprecated(t: any, p: string, d: PropertyDescriptor) {
  console.log('This method will go away soon.');
}

@uiElement
class ContactForm {
  @deprecated
  someOldMethod() {}
}
```

### decorator factory

```ts
function uiElement(element: string) {
  return function(target: Function) {
    console.log(`Creating new element: ${element}`);
  };
}

@uiElement('SimpleContactForm')
class ContactForm {
  @deprecated
  someOldMethod() {}
}
```

### Class Decorator

* Class constructor will be passed as parameter to decorator
* Constructor is replaced if there is a return value (`TFunction`)
* Return void if constructor is not to be replaced

```ts
<TFunction extends Function>(target: TFunction) => TFunction | void;
```

#### Creating class decorators that replace constructor functions

**Property Decorators**:

* First parameter `target` is either constructor function or class prototype
* Second parameter `propertyKey` is the name of the decorated member

```ts
function MyPropertyDecorator(target: Object, propertyKey: string) {
  // do decorator stuff
}
```

**Parameter Decorators**:

* First parameter is either constructor function or class prototype
* Second parameter is the name of the decorated member
* Third parameter is the ordinal index of the decorated parameter

```ts
function MyParameterDecorator(target: Object, propertyKey: string, parameterIndex: number) {
  // do decorator stuff
}
```

**Property Descriptors**:

* Object that describes a property and how it can be manipulated

```ts
interface PropertyDescriptor {
  configurable?: boolean;
  enumerable?: boolean;
  value?: any; // “value” property contains the function definition for class methods
  writable?: boolean; // “writable” property specifies if “value” is rea
  get?(): any;
  set?(v: any): void;
}
```

**Method and Accessor Decorators**:

* First parameter is either constructor function or class prototype
* Second parameter is the name of the decorated member
* Third parameter is the property descriptor of the decorated member

```ts
function MyMethodDecorator(target: Object, propertyKey: string, descriptor: PropertyDescriptor) {
  // do decorator stuff
}
```

---

demo:

```ts
// decorators:

export function sealed(name: string) {
  return function(target: Function): void {
    console.log(`Sealing the constructor: ${name}`);
    Object.seal(target);
    Object.seal(target.prototype);
  };
}

export function logger<TFunction extends Function>(target: TFunction): TFunction {
  let newConstructor: Function = function() {
    console.log(`Creating new instance.`);
    console.log(target);
  };
  newConstructor.prototype = Object.create(target.prototype);
  newConstructor.prototype.constructor = target;
  return <TFunction>newConstructor;
}

export function writable(isWritable: boolean) {
  return function(target: Object, propertyKey: string, descriptor: PropertyDescriptor) {
    console.log(`Setting ${propertyKey}.`);
    descriptor.writable = isWritable;
  };
}

// usage:

@logger
@sealed('UniversityLibrarian')
export class UniversityLibrarian implements Interfaces.Librarian, Employee, Researcher {
  name: string;
  email: string;
  department: string;

  assistCustomer(customerName: string) {
    console.log(this.name + ' is assisting ' + customerName);
  }

  @writable(true)
  assistFaculty() {
    console.log('Assisting faculty.');
  }

  // implementation of the following to be provided by the mixing function
  title: string;
  addToSchedule: () => void;
  logTitle: () => void;
  doResearch: (topic: string) => void;
}

@logger
export class PublicLibrarian implements Interfaces.Librarian {
  name: string;
  email: string;
  department: string;

  assistCustomer(customerName: string) {
    console.log('Assisting customer.');
  }

  @writable(false)
  teachCommunity() {
    console.log('Teaching community.');
  }
}

// test decorator:

let lib1 = new UniversityLibrarian();
let lib2 = new PublicLibrarian();

try {
  lib1.assistFaculty = () => console.log('assistFaculty replacement method');
  lib2.teachCommunity = () => console.log('teachCommunity replacement method');
} catch (error) {
  console.log(error.message);
}

lib1.assistFaculty();
lib2.teachCommunity();
```
