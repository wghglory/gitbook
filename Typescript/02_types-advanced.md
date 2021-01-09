# Advanced Type

## Polymorphic this types

```typescript
class Vehicle {
  drive(): this {
    // do something
    if (this instanceof Car) {
      console.log('car is driving');
    }
    return this;
  }
}

let v = new Vehicle();
v.drive(); // returns Vehicle

class Car extends Vehicle {
  carryPeople() {
    // do something

    return this;
  }
}

let c = new Car();
c.drive().carryPeople(); // a fluent API

class Bus extends Vehicle {
  pay() {
    console.log('pay 2 yuan');
    return this;
  }
}

let b = new Bus();
c.pay().drive();
```

## Declaration merging

The compiler merges two separate declarations declared with the same name into a single definition.

```typescript
interface Employee {
  name: string;
  doWork: () => void;
}

interface Employee {
  title: string;
  phone: string;
}

// TypeScript Compiler will merge them:
interface Employee {
  name: string;
  doWork: () => void;
  title: string;
  phone: string;
}
```

Allowed merges:

- Interfaces
- Enums
- Namespaces
- Namespaces with enums
- Namespaces with functions
- Namespaces with classes

Disallowed merges:

- Classes with classes

## Interface merging and module augmentation

```typescript
// universityLibrarian.ts: think this is an older version or third party lib. You cannot modify but extend it.
export class UniversityLibrarian implements Interfaces.Librarian, Employee, Researcher {
  name: string;
  email: string;
  department: string;

  [CLASS_INFO](): void {
    console.log('This class represents a UniversityLibrarian.');
  }

  static [Symbol.hasInstance](obj: Object) {
    return obj.hasOwnProperty('name') && obj.hasOwnProperty('assistCustomer');
  }

  assistCustomer(customerName: string) {
    console.log(this.name + ' is assisting ' + customerName);
  }

  assistFaculty() {
    console.log('Assisting faculty.');
  }

  // implementation of the following to be provided by the mixing function
  title: string;
  addToSchedule: () => void;
  logTitle: () => void;
  doResearch: (topic: string) => void;
}

// new extension file: universityLibExt.ts
import { UniversityLibrarian } from './classes';

declare module './classes' {
  export interface UniversityLibrarian {
    phone: string;
    hostSeminar(topic: string): void;
  }
}

UniversityLibrarian.prototype.hostSeminar = function(topic) {
  console.log('Hosting a seminar on ' + topic);
};

// app.ts
import { UniversityLibrarian } from './classes';
import 'universityLibExt'; // note: add ts suffix doesn't work
var u = new UniversityLibrarian();
u.hostSeminar('aya');
```

## Type guards

### typeof: type name only allow: "string, number, boolean, symbol"

```typescript
let x: string | number = 12;

if (typeof x === 'string') {
  // x is a string
} else {
  // x is a number
}
```

### instanceof: For class

```typescript
class Phone {
  callSomeone() {
    console.log('call someone');
  }
}

class Tablet {
  watchMovie() {
    console.log('watch movie');
  }
}

const device: Phone | Tablet = new Phone();

if (device instanceof Phone) {
  device.callSomeone();
}
```

### \* User-Defined Type Guard: For interface

```typescript
interface Vehicle {
  numberOfWheels: number;
}

function isVehicle(v: any): v is Vehicle {
  return (<Vehicle>v).numberOfWheels !== undefined;
}

let c = new Car();
if (isVehicle(c)) {
  // it's a vehicle
}
```

## Symbols

- ES2015 feature
- Primitive data type
- Unique
- Immutable

```typescript
let mySymbol = Symbol('first_symbol');
let anotherSymbol = Symbol('first_symbol');

// console.log(mySymbol === anotherSymbol);  // false
// console.log(typeof mySymbol);

let myObject = {
  [mySymbol]: 'value for my symbol key',
};
```

### Use cases

- Unique Constants
- Computed Property Declarations
- Customize Internal Language Behavior
