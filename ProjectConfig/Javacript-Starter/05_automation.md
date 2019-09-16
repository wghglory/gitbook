# Automation

- Grunt
  - The "original"
  - Configuration over code
  - Writes intermediary (中间的) files between steps
  - Large plugin ecosystem
- Gulp
  - In-memory streams
  - Fast
  - Code over configuration
  - Large plugin ecosystem
- npm Scripts
  - Declared in package.json
  - Leverage your OS command line
  - Directly use npm packages
  - Call separate Node scripts
  - Convention-based pre/post hooks
  - Leverage world's largest package manager

## Why npm Scripts

- Use tools directly
- No need for separate plugins
- Simpler debugging
- Better docs
- Easy to learn
- Simple

Previous project I used gulp, gulp-eslint. There is a strange bug when I stop watching files once I have a certain number of files. I have to figure out was the bug in gulp? Eslint? gulp-eslint? my gulp config? I have to wait the author to update their plugins.

### Usage

Run concurrently:

```json
"start": "npm-run-all --parallel security-check start:server",
"start2": "npm run security-check & npm run start:server",
```
