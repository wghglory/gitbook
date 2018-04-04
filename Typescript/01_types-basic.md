# Basic types

## Enums

```ts
enum Category {
  Biography = 1,
  Poetry,
  Fiction,
} // 1, 2, 3

let favoriteCategory: Category = Category.Biography;

console.log(favoriteCategory); // 1
let categoryString = Category[favoriteCategory]; // Biography
```

## Destructuring assignments

```ts
let medals: string[] = ['gold', 'silver', 'bronze'];
let [first, second, third] = medals;

let person = { name: 'Audrey', address: '123 Main Street', phone: '555-1212' };
let { name, address, phone } = person;

let { title: bookTitle, author: bookAuthor } = book1;
console.log(bookTitle);
console.log(bookAuthor);

function PrintBookInfo({ title: bookTitle, author: bookAuthor }: Book): void {
  console.log(`${bookTitle} was authored by ${bookAuthor}`);
}
```

## Spread operator

```ts
let newBookIDs = [10, 20];
let allBookIDs = [1, 2, 3, ...newBookIDs];

function LogFavoriteBooks([book1, book2, ...others]: Book[]) {
  PrintBookInfo(book1);
  PrintBookInfo(book2);
  console.log(others);
}

let arr = [1, 2, 4];
let arr2 = [1, 3, 3, 4];
arr.push(...arr2);
```

## Tuple types

```ts
let myTuple: [number, string] = [10, 'Macbeth'];
myTuple[0] = 'Hamlet'; // ERROR
myTuple[1] = 20; // ERROR
myTuple[2] = 'Hamlet';
myTuple[2] = 20;

interface KeyValuePair<K, V> extends Array<K | V> {
  0: K;
  1: V;
}

let catalogLocation: KeyValuePair<string, Book> = ['A 123.456', book1];
catalogLocation[2] = 'some string';
```

## Union types: any one of them

```ts
function PrintIdentifier(id: string | number) {}
```

## Intersection types: Specify a value that will contain all members of several types

```ts
function CreateCoolNewDevice(): Phone & Tablet {}
```

## String literal types

```ts
let empCategory: 'Manager' = 'Manager';
let empCategory: 'Manager' = 'Non-Manager'; // ERROR
let empCategory: 'Manager' | 'Non-Manager' = 'Manager';
```

## Type aliases

```ts
let empCategory: 'Manager' | 'Non-Manager' = 'Manager';

type EmployeeCategory = 'Manager' | 'Non-Manager';
let empCategory: EmployeeCategory = 'Manager';
```

## \* Mixins, I feel like composition rather than inheritance

```ts
function applyMixins(derivedCtor: any, baseCtors: any[]) {
  baseCtors.forEach((baseCtor) => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
      derivedCtor.prototype[name] = baseCtor.prototype[name];
    });
  });
}

applyMixins(UniversityLibrarian, [Employee, Researcher]);
// UniversityLibrarian has both employee and researcher members

let newLibrarian = new UniversityLibrarian();
// newLibrarian.doResearch('Economics');  // researcher method
```

## Optional and default parameter

Optional parameters denoted with `?` after parameter name and must appear at last.

Default parameters may be set to a literal value or an expression

```ts
function createCustomer(name: string = 'The C Programming Language', age?: number) {}
```

## Function Overloading

```ts
function GetTitles(author: string): string[];
function GetTitles(available: boolean): string[];
function GetTitles(bookProperty: any): string[] {
  if (typeof bookProperty == 'string') {
    // get books by author, add to foundTitles
  } else if (typeof bookProperty == 'boolean') {
    // get books by availability, add to foundTitles
  }
  return foundTitles;
}
```

## Interface

```ts
interface Book {
  id: number;
  title: string;
  author: string;
  pages?: number; // optional
  markDamaged: (reason: string) => void;
}
```

**interface for function type**:

```ts
function createCustomerID(name: string, id: number): string {
  return name + id;
}

interface stringGenerator {
  (chars: string, nums: number): string;
}

// let idGenerator: (chars: string, nums: number) => string;
let idGenerator: stringGenerator;
idGenerator = createCustomerID;
```

### Extending Interfaces

```ts
interface LibraryResource {
  catalogNumber: number;
}

interface Book {
  title: string;
}

interface Encyclopedia extends LibraryResource, Book {
  volume: number;
}

let book: Encyclopedia = { catalogNumber: 1234, title: 'The Book of Everything', volume: 1 };
```

## Class Types

```ts
interface Librarian {
  doWork: () => void;
}
class ElementarySchoolLibrarian implements Librarian {
  doWork() {
    console.log('Reading to and teaching children...');
  }
}
let kidsLibrarian: Librarian = newElementarySchoolLibrarian();
kidsLibrarian.doWork();
```

```ts
abstract class ReferenceItem {
  private _publisher: string;
  static department: string = 'Research';

  constructor(public title: string, protected year: number) {
    console.log('Creating a new ReferenceItem...');
  }

  get publisher(): string {
    return this._publisher.toUpperCase();
  }

  set publisher(newPublisher: string) {
    this._publisher = newPublisher;
  }

  printItem(): void {
    console.log(`${this.title} was published in ${this.year}.`);
    console.log(`Department: ${ReferenceItem.department}`);
  }

  abstract printCitation(): void;
}

class Encyclopedia extends ReferenceItem {
  constructor(newTitle: string, newYear: number, public edition: number) {
    super(newTitle, newYear);
  }

  printItem(): void {
    super.printItem();
    console.log(`Edition: ${this.edition} (${this.year})`);
  }

  printCitation(): void {
    console.log(`${this.title} - ${this.year}`);
  }
}

// other way to define inherited class
let Newspaper = class extends ReferenceItem {
  printCitation(): void {
    console.log(`Newspaper: ${this.title}`);
  }
};

let myPaper = new Newspaper('The Gazette', 2016);
myPaper.printCitation();

// extends an anonymous class
class Novel extends class {
  title: string;
} {
  mainCharacter: string;
}

let favoriteNovel = new Novel();
```

## Class, interface, enum demo

```ts
// enums.ts
export enum Category {
  Biography,
  Poetry,
  Fiction,
  History,
  Children,
}

// interfaces.ts
interface Book {
  id: number;
  title: string;
  author: string;
  available: boolean;
  category: Category;
  pages?: number;
  markDamaged?: DamageLogger;
}

interface DamageLogger {
  (reason: string): void;
}

interface Person {
  name: string;
  email: string;
}

interface Author extends Person {
  numBooksPublished: number;
}

interface Librarian extends Person {
  department: string;
  assistCustomer: (customerName: string) => void;
}

export { Book, DamageLogger, Author, Librarian };

// classes.ts
import { Book, DamageLogger, Author, Librarian } from './interfaces';

class UniversityLibrarian implements Librarian {
  name: string;
  email: string;
  department: string;

  assistCustomer(customerName: string) {
    console.log(this.name + ' is assisting ' + customerName);
  }
}

export { UniversityLibrarian };
```
