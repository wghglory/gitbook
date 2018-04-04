# Namespace and modules

official: <http://www.typescriptlang.org/docs/handbook/namespaces-and-modules.html>

## Namespace

```ts
// membership.ts
namespace Membership {
  export function AddMember(name: string) {
    // add a new member
  }
  export namespace Cards {
    export function IssueCard(memberNumber: number) {
      // issue new card
    }
  }
}

// in other file
/// <reference path="membership.ts" />

let memberName: string = 'Elaine';
let memberNumber: number = 789;
Membership.AddMember(memberName);
Membership.Cards.IssueCard(memberNumber);
```

Typescript official demo:

```ts
// Validation.ts
namespace Validation {
  export interface StringValidator {
    isAcceptable(s: string): boolean;
  }
}

// LettersOnlyValidator.ts
/// <reference path="Validation.ts" />
namespace Validation {
  const lettersRegexp = /^[A-Za-z]+$/;
  export class LettersOnlyValidator implements StringValidator {
    isAcceptable(s: string) {
      return lettersRegexp.test(s);
    }
  }
}

// ZipCodeValidator.ts
/// <reference path="Validation.ts" />
namespace Validation {
  const numberRegexp = /^[0-9]+$/;
  export class ZipCodeValidator implements StringValidator {
    isAcceptable(s: string) {
      return s.length === 5 && numberRegexp.test(s);
    }
  }
}

// Test.ts
/// <reference path="Validation.ts" />
/// <reference path="LettersOnlyValidator.ts" />
/// <reference path="ZipCodeValidator.ts" />

// Some samples to try
let strings = ['Hello', '98052', '101'];

// Validators to use
let validators: { [s: string]: Validation.StringValidator } = {};
validators['ZIP code'] = new Validation.ZipCodeValidator();
validators['Letters only'] = new Validation.LettersOnlyValidator();

// Show whether each string passed each validator
for (let s of strings) {
  for (let name in validators) {
    console.log(
      `"${s}" - ${validators[name].isAcceptable(s) ? 'matches' : 'does not match'} ${name}`,
    );
  }
}
```

## Modules

periodicals.ts:

```ts
export interface Periodical {
  issueNumber: number;
}
export class Magazine implements Periodical {
  issueNumber: number;
}
export function getMagazineByIssueNumber(issue: number): Magazine {
  // retrieve and return a magazine
}

// OR

interface Periodical {
  issueNumber: number;
}
class Magazine implements Periodical {
  issueNumber: number;
}
function getMagazineByIssueNumber(issue: number): Magazine {
  // retrieve and return a magazine
}
export { Periodical, Magazine, getMagazineByTitle as GetMag };
```

In another file:

```ts
import { Magazine, Magazine, getMag } from './periodicals';

// OR

import * as mag from './periodicals';
let kidMag: mag.Magazine = mag.getMag('Games and Stuff!');
```

default export:

```ts
// movie.ts
export default class {
  title: string;
  director: string;
}

// other file
import anyName from './movie’;
```
