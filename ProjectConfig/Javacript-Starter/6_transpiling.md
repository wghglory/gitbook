# Transpiling

* Babel
  * Standardized JS
  * Leverage full JS Ecosystem
  * experimental features earlier
  * No type defs, annotations required
  * Test, lint, great libs
* Typescript
  * Superset of Javascript
  * Enhanced AutoCompletion
  * Safer refactoring
  * Clearer intent
  * Additional non-standard features like interface
* Elm
  * Compiles down to JS
  * Clean Syntax
  * Immutable data structures
  * Friendly errors
  * All errors are compile-time errors
  * Interops with JS

## Babel for nodejs

.babelrc:

```json
{
  "presets": [
    // "env",
    // "react"
    "latest"
  ]
}
```

Use `babel-node buildScripts/startMessage` instead of `node buildScripts/startMessage`
