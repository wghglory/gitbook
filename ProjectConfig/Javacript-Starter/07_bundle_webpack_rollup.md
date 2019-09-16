# Why bundling

- CommonJS doesn't work in web browsers
- Package project into file(s)
- Improve Node performance

## Module Format

- IIFE
- Asynchronous Module Definition (AMD)
- CommonJS (CJS)
- Universal Module Definition (UMD)
- ES6 Modules

## Why Use ES6 Modules

- Standardized
- Statically analyzable
  - Improved autocomplete
  - Intelligent refactoring
  - Fails fast
  - Tree shaking
- Easy to read
  - Named imports
  - Default exports

## Bundler

- require.js (old)
- Browserify
- Webpack
- Rollup
- JSPM

### Browserify

- The first bundler to reach mass adoption
- Bundle npm packages for the web
- Large plugin ecosystem

### Webpack

- loaders, plugins
- Bundles more than just JS
- Import CSS, images, etc like JS
- Bundle splitting
- Built in hot-reloading web server
- **Webpack 2 offers tree shaking**: using ES6 import so tree shaking will be ready for you

### Rollup

- **Tree shaking**
- **Faster** loading production code
- Quite new
- Great for library authors
- No hot reloading and code splitting yet

### JSPM

- Uses SystemJS, a universal module loader
- Can load modules at runtime
- Has its own package manager
- Can install from npm, git
- Uses Rollup

## Sourcemaps

- To debug. Map code back to original source
- Part of our build
- downloaded only if you open developer tools

write `debugger` in code
