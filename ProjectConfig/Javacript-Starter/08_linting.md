# Linting

- Enforce Consistency
  - Curly brace position
  - confirm / alert
  - Trailing commas
  - Globals
  - eval
- Avoid Mistakes
  - Extra parenthesis
  - Overwriting function
  - Assignment in conditional
  - Missing default case in switch
  - debugger / console.log

## ESLint

### Warnings vs Errors

- Warning
  - Can continue development
  - Can be ignored
  - Team must agree: Fix warnings
- Error
  - Breaks the build
  - Cannot be ignored
  - Team is forced to comply

### Plugins

eslint-plugin-react, eslint-plugin-angular, eslint-plugin-node

### preset

from scratch recommended presets: airbnb

### Issue

#### ESLint doesn't watch files

- `eslint-loader` if using webpack
  - Re-lints all files upon save.
- `eslint-watch` is a npm package (better solution)
  - ESLint wrapper that adds file watch
  - Not tied to webpack
  - Better warning/error formatting
  - Displays clean message
  - Easily lint tests and build scripts too

#### ESLint doesn't support many experimental JavaScript features

- Run ESLint directly
  - Supports ES6 and ES7 natively
  - Also supports object spread
- use `Babel-eslint`
  - Also lints stage 0 - 4 features

## Why Lint via an Automated Build Process

1.  One place to check
1.  Universal configuration
1.  Part of continuous integration

### Usage

npm scripts:

```javascripton
"lint": "esw webpack.config.* src buildScripts --color",  // tell which files or folders to lint
"lint:watch": "npm run lint -- --watch"
```

dependencies:

```javascripton
"eslint": "4.6.1",
"eslint-watch": "3.1.2",
```

.eslintrc.json

```javascripton
{
  "root": true,
  "extends": [
    "eslint:recommended"
    // "plugin:react/recommended"
  ],
  "parserOptions": {
    "ecmaVersion": 7,
    "sourceType": "module"
  },
  "env": {
    "browser": true,
    "node": true,
    "mocha": true
  },
  "rules": {
    "no-console": 1
  }
}
```

disable linting for individual file:

```javascript
/* eslint-disable no-console */
console.log('111');
```

disable linting for a specific line

```javascript
console.log('111'); // eslint-disable-line no-console
```
