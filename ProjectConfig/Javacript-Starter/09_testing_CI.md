# Testing 测试 for Javascript

## JavaScript testing styles

| Style       | Focus                         |
| ----------- | ----------------------------- |
| Unit        | Single function or module     |
| Integration | Interactions between modules  |
| UI          | Automate interactions with UI |

### Unit Tests vs Integration Tests

| Unit Tests            | Integration Tests                                                                          |
| --------------------- | ------------------------------------------------------------------------------------------ |
| Test a small unit     | Test multiple units                                                                        |
| Often single function | Often involves clicking and making calls to a webApi using automation tool like `Selenium` |
| Fast                  | Slow                                                                                       |
| Run upon save         | Often run on demand, or in QA                                                              |

## 6 key testing decisions

1.  Framework
1.  Assertion Library
1.  Helper Libraries
1.  Where to run tests
1.  Where to place tests
1.  When to run tests

### Frameworks

* Mocha: highly configurable, large ecosystem, No Assertion
* Jasmine: large ecosystem, built-in assertion library
* Jest: wrapper for jasmine by facebook, popular among react developers
* Tape: simple
* QUnit: jquery creator writes
* AVA: run test parallel

Choose any of these just like choosing a gym.

### Assertion Library

Declare what you expect.

```javascript
expect(2 + 2).to.equal(4);
assert(2 + 2).equals(4);
```

* Chai
* Should.js
* expect

### Helper library

#### JSDOM

* Simulate the browser's DOM
* Run DOM-related tests without a browser

#### Cheerio

* jQuery for the server
* Query virtual DOM using jQuery selectors

### Where to run tests

* Browser(slower, not good)
  * Karma, Testem
* Headless Browser
  * PhantomJS (great)
* In-memory DOM
  * JSDOM (great): <https://github.com/tmpvar/jsdom>

### Where do test files belong

* Centralized (✘)

  * Less "noise" in src folder (they are important source, asset. not liability)
  * Deployment confusion (deploy won't be an issue for alongside way)
  * Inertia 惯性 (backend test prefers Centralized test, not frontend)
  * `import file from '../../src/long/path' // file.test.js`

* **Alongside** (✔️ more suitable for javascript test)
  * Easy imports
  * Clear visibility
  * Convenient to open
  * No recreating folder structure
  * Easy file moves
  * Path to file under test is always `./filename`: `import file from './file' // file.test.js`

### Naming Convention

* fileName.spec.js
* fileName.test.js

### When should unit tests run

* Rapid feedback: run every time you hit save
* Facilitates TDD
* Automatic = Low friction 摩擦
* Increases test visibility

For integration test, admittedly slow, you should run separately.

## Configure testing and write test

I'm using below skills for unit tests

1.  Framework: Mocha
1.  Assertion Library: Chai
1.  Helper Libraries: JSDOM
1.  Where to run tests: Node
1.  Where to place tests: Alongside
1.  When to run tests: Upon save

### Test setup

npm scripts: using "progress reporter" because of clean output

```json
"test": "mocha --reporter progress buildScripts/testSetup.js src/**/*.test.js"
```

create buildScripts/testSetup.js

```javascript
// This file isn't transpilied, so must use CommonJS and ES5

// register babel to transpile before our tests run
require('babel-register');

// disable webpack features that Mocha doesn't understand
// import 'index.css', webpack understands, but not mocha
require.extensions['.css'] = function() {}; // mocha, treat it as a empty function
```

create src/index.test.js

```javascript
import { expect } from 'chai';

describe('our first test', () => {
  it('should pass', () => {
    expect(true).to.equal(true);
  });
});
```

#### DOM testing by [JSDOM v11](https://github.com/tmpvar/jsdom)

```javascript
import { expect } from 'chai';
import { JSDOM } from 'jsdom';
import fs from 'fs';

describe('index.html', () => {
  it('should say hello', () => {
    const index = fs.readFileSync('./src/index.html', 'utf-8');

    const dom = new JSDOM(index);
    const h1 = dom.window.document.querySelector('h1');
    expect(h1.textContent).to.equal('hello world');
  });
});
```

### watch tests

```json
"scripts": {
  "start": "npm-run-all --parallel security-check start:server lint:watch test:watch",
  "test": "mocha --reporter progress buildScripts/testSetup.js src/**/*.test.js",
  "test:watch": "npm run test -- -w" // or "npm run test -- --watch"
}
```

## Continuous integration

The code is working on my machine, but it breaks on the CI server.

### Why CI?

* Forgot to commit new file
* Forgot to update package.json
* commit doesn't run cross-platform
* node version conflicts
* bad merge
* didn't run tests

### What does a CI server do?

* Run automated build
* Run your tests
* Check code coverage
* automate deployment

### CI server

* Travis CI(linux)
* Jenkins
* Appveyor (windows)
* CircleCI
* Semaphore
* SnapCI

#### [Travis CI for unix](https://travis-ci.org)

1.  Sign in by github and you should see all repositories. Turn on "wghglory/javascript-starter-kit".

1.  Create .travis.yml

    ```
    language: node_js
    node_js:
      - "7"
    ```

1.  If I intently change index.html h1 from 'hello world' to 'hello' and then commit to github. Note our test watching task only watches js now, so html changes won't be reflected in terminal unless restarting.

1.  After commit and push to github. Travis will build and give us the build result.

#### [Appveyor for windows](https://ci.appveyor.com/)

appveyor.yml:

```
# test against this version of node.s
environment:
  matrix:
  # node.js
  - nodejs_version: "7"

# install scripts. (runs after repo cloning)
install:
  # get the latest stable version of node.js or io.js
  - ps: Install-Product node $env:nodejs_version
  # install modules
  - npm install

# post-install test scripts
test_script:
  # output useful info for debugging
  - node --version
  - npm --version
  # run tests
  - npm test

# don't actually build
build: off
```

Usage is same with Travis. Sign in by github, add the project. When push commits to github, appveyor will build.
