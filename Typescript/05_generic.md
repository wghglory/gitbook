# Generic

```ts
let poetryBooks: Book[];
let fictionBooks: Array<Book> = [
  {
    id: 10,
    title: 'The C Programming Language',
    author: 'K & R',
    available: true,
    category: Category.Software,
  },
  {
    id: 11,
    title: 'Code Complete',
    author: 'Steve McConnell',
    available: true,
    category: Category.Software,
  },
];
let historyBooks = new Array<Book>(5);
```

generic functions:

```ts
function logAndReturn<T>(thing: T): T {
  console.log(thing);
  return thing;
}
let someString: string = logAndReturn<string>('log this');

let newMag: Magazine = { title: 'Web DevMonthly' };
let someMag: Magazine = logAndReturn<Magazine>(newMag);
```

generic interfaces:

```ts
interface Inventory<T> {
  getNewestItem: () => T;
  addItem: (newItem: T) => void;
  getAllItems: () => Array<T>;
}
let bookInventory: Inventory<Book> = something; // populate the inventory here...
let allBooks: Array<Book> = bookInventory.getAllItems();
```

generic class:

```ts
class Catalog<T> implements Inventory<T> {
  private catalogItems = new Array<T>();

  addItem(newItem: T) {
    this.catalogItems.push(newItem);
  }

  // implement other interface methods here
}
let bookCatalog = new Catalog<Book>();
```

generic constraint:

```ts
interface CatalogItem {
  catalogNumber: number;
}
class Catalog<T extends CatalogItem> implements Inventory<T> {
  // implement interface methods here
}
```

```ts
interface ShelfItem {
  title: string;
}

export default class Shelf<T extends ShelfItem> {
  private _items: Array<T> = new Array<T>();

  add(item: T): void {
    this._items.push(item);
  }

  getFirst(): T {
    return this._items[0];
  }

  find(title: string): T {
    return this._items.find((item) => item.title === title);
  }

  printTitles(): void {
    this._items.forEach((item) => console.log(item.title));
  }
}

let inventory: Array<Book> = [
  {
    id: 10,
    title: 'The C Programming Language',
    author: 'K & R',
    available: true,
    category: Category.Software,
  },
  {
    id: 11,
    title: 'Code Complete',
    author: 'Steve McConnell',
    available: true,
    category: Category.Software,
  },
];
let bookShelf: Shelf<Book> = new Shelf<Book>();
inventory.forEach((book) => bookShelf.add(book));
let firstBook: Book = bookShelf.getFirst();

let magazines: Array<Magazine> = [
  { title: 'Programming Language Monthly', publisher: 'Code Mags' },
  { title: 'Literary Fiction Quarterly', publisher: 'College Press' },
  { title: 'Five Points', publisher: 'GSU' },
];
let magazineShelf: Shelf<Magazine> = new Shelf<Magazine>();
magazines.forEach((mag) => magazineShelf.add(mag));
magazineShelf.printTitles();
let firstMagazine: Magazine = magazineShelf.getFirst();

let numberShelf: Shelf<number> = new Shelf<number>();
[5, 10, 15].forEach((num) => numberShelf.add(num));

let softwareBook = bookShelf.find('Code Complete');
console.log(`${softwareBook.title} (${softwareBook.author})`);
```

```ts
export function deleteFromIndex2<T>(inventory: Array<T>): Array<T> {
  return inventory.splice(2, inventory.length);
}

let purgedBooks: Array<Book> = deleteFromIndex2(inventory);
purgedBooks.forEach((book) => console.log(book.title));

let purgedNums: Array<number> = deleteFromIndex2<number>([1, 2, 3, 4]);
console.log(purgedNums);
```
