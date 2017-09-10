# Npm scripts instead of gulp or grunt

## npm tricks

```text
"&": run concurrently (windows: START /B)
"-- ": pass thru args (npm test -- -w, -w is passed to npm test)
"&&": chaining commands
"|": piping output, take the result of left command, pass result to terminal or next task in pipeline
">": redirection operator, write output to file
```

package.json

```json
{
  "scripts":{
    "either": "echo 'hello'; echo 'world'",  // ; second will execute even if first command has error
    "start": "node index.js",
    "start:dev": "node index.js 4000",
    "pretest": "npm run compile && npm run lint",
    "posttest" : "echo 'after tests are run'",
    "test": "mocha test -u bdd -R spec",
    "lint": "jshint --exclude ./lib/*.js *.js **/*.js",
    "compile:coffee": "coffee --compile --output ./lib ./src/coffeescripts",
    "compile:ts": "tsc --outDir ./lib --module commonjs ./src/typescripts/tsCode.ts",
    "compile": "npm run compile:coffee && npm run compile:ts",  // && first must pass, then run second
    "precompile": "npm run clean",
    "clean": "rimraf lib/*",  // mac "rm -rf lib/*.*"
    "build:less": "lessc client/less/demo.less public/css/site.css",
    "build:bundle": "browserify ./client/js/app.js | uglifyjs -mc > ./public/js/bundle.js",
    "build:clean": "rimraf public/css/*, public/js/*",
    "prebuild": "npm run build:clean",
    "build": "npm run build:less && npm run build:bundle",
    "watch:test": "npm run test -- -w -R min",
    "watch:lint": "watch 'npm run lint' .",
    "watch:server": "nodemon --ignore client --ignore public index.js",
    "watch:coffee": "coffee --compile -w --output ./lib ./src/coffeescripts",
    "watch:ts": "tsc -w --outDir ./lib --module commonjs ./src/typescripts/tsCode.ts",
    "watch:bundle": "watchify ./client/js/app.js -o ./public/js/bundle.js -dv",
    "watch:bundleWatcher": "watch 'npm run build:bundle' client",
    "watch:browser" : "live-reload --port 9091 public/",
    "watch" : "npm run watch:test & npm run watch:bundle & npm run watch:server & npm run watch:browser"
  },
  "devDependencies": {
    "browserify": "^11.2.0",
    "coffee-script": "^1.10.0",
    "jshint": "^2.8.0",
    "less": "^2.5.3",
    "live-reload": "^1.1.0",
    "mocha": "^2.3.2",
    "nodemon": "^1.7.1",
    "rimraf": "^2.4.3",
    "should": "^7.1.0",
    "supertest": "^1.1.0",
    "typescript": "^1.6.2",
    "uglifyjs": "^2.4.10",
    "watch": "^0.16.0",
    "watchify": "^3.4.0"
  }
}
```

## Running commands

```bash
npm run # show all commands in package.json
npm run test
npm test -s  # 简略结果 short, small output
npm tst
npm t
npm start
```

```bash
npm install mocha should --save-dev
```

### reference

<https://github.com/coryhouse/react-slingshot/blob/master/package.json>
<https://libraries.io/>
<https://docs.npmjs.com/misc/scripts>

<https://www.pluralsight.com/courses/npm-build-tool-introduction>