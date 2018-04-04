# Npm scripts instead of gulp or grunt

## npm tricks

```text
"&": run concurrently (windows: START /B)
"&&": chaining commands. First must pass, then run second
";": second will execute even if first command has error
"|": piping output, take the result of left command, pass result to terminal or next task in pipeline
"-- ": pass arguments into the underlying commands (npm test -- -w, -w is passed to npm test)
">": redirection operator, write output to file
```

### package.json

```json
{
  "name": "basic-config",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "noeffect2second": "echo 'hello'; echo 'world'", // ; second will execute even if first command has error
    // "start": "./node_modules/.bin/webpack-dev-server --open",
    "start": "node index.js",
    "start:dev": "node index.js 4000",
    "pretest": "npm run compile && npm run lint",
    "posttest": "echo 'after tests are run'",
    "pretest": "npm run compile && npm run lint",
    "test": "mocha test -u bdd -R spec",
    "compile:coffee": "coffee --compile --output ./lib ./src/coffeescripts",
    "compile:ts": "tsc --outDir ./lib --module commonjs ./src/typescripts/tsCode.ts",
    "compile": "npm run compile:coffee && npm run compile:ts",
    "precompile": "npm run clean",
    "clean": "rimraf lib/*", // 兼容 unix 和 windows. For mac: "rm -rf lib/*.*"
    "build:less": "lessc client/less/demo.less public/css/site.css",
    "build:bundle": "browserify ./client/js/app.js | uglifyjs -mc > ./public/js/bundle.js",
    "build:clean": "rimraf public/css/*, public/js/*",
    "prebuild": "npm run build:clean",
    "build": "npm run build:less && npm run build:bundle",
    // "build": "NODE_ENV='production' webpack --config ./webpack.production.config.js -p",
    "watch:test": "npm run test -- -w -R min",
    "watch:lint": "watch 'npm run lint' .",
    "watch:server": "nodemon --ignore client --ignore public index.js",
    "watch:coffee": "coffee --compile -w --output ./lib ./src/coffeescripts",
    "watch:ts": "tsc -w --outDir ./lib --module commonjs ./src/typescripts/tsCode.ts",
    "watch:bundle": "watchify ./client/js/app.js -o ./public/js/bundle.js -dv", // no minification
    "watch:bundleWatcher": "watch 'npm run build:bundle' client", // will minify
    "watch:browser": "live-reload --port 9091 public/",
    "watch":
      "npm run watch:test & npm run watch:bundle & npm run watch:server & npm run watch:browser",
    "version:major": "npm version major",
    "version:minor": "npm version minor",
    "version:patch": "npm version patch",
    "prepush:origin": "echo 'Pushing code to GitHub'",
    "push:origin": "git push --tags origin HEAD:master",
    "prepush:heroku": "echo 'Pushing code to Heroku'",
    "push:heroku": "git push heroku master",
    "push:s3": "s3-cli sync ./dist/ s3://example-com/prod-site/",
    "push:azure": "git push azure master",
    "launch:prod": "heroku open",
    "launch:prod:windows": "start https://stupidlittlewebsite.herokuapp.com/",
    "push": "npm run push:origin && npm run push:heroku",
    // "deploy": "npm run build && firebase deploy",
    "deploy:prod":
      "npm run test:deploy -s && npm run build -s && npm run version:patch && npm run push && npm run launch:prod",
    "deploy:prod:time": "time(npm run deploy:prod)",
    "deploy:prod:script": "bash ./deployProd.sh", // windows: bash ./deployProd.bat
    "test:deploy": "npm t -- -R dot",
    "test:configoptions": "mocha test --reporter $npm_package_config_reporter",
    "fix": "./node_modules/.bin/eslint . --ext .js --fix",
    "lint": "./node_modules/.bin/eslint . --ext .js",
    "firebase-init": "firebase login && firebase init"
  },
  "config": {
    "reporter": "landing"
  },
  // heroku needs it I guess
  "engines": {
    "node": "~7.8.0",
    "npm": "~4.2.0"
  },
  "repository": {
    "type": "git",
    "url": "https://wghglory@bitbucket.org/wghglory/guanghui.notebook.git"
  },
  "devDependencies": {
    "browserify": "^14.4.0",
    // "coffee-script": "^1.10.0",
    // "jshint": "^2.8.0",
    "less": "^2.7.2",
    "live-reload": "^1.1.0",
    "mocha": "^3.5.3",
    "nodemon": "^1.12.0",
    "rimraf": "^2.6.2",
    "should": "^13.0.1",
    "supertest": "^3.0.0",
    "typescript": "^2.5.2",
    "uglifyjs": "^2.4.11",
    "watch": "^1.0.2",
    "watchify": "^3.9.0"
  }
}
```

### Useful Commands

```bash
npm run # show a log of the available commands in package.json
npm run test
npm test -s  # 简略结果 short, small output
npm tst
npm t
npm start
```

```bash
npm install mocha should --save-dev
```

在运行 `npm version` 之前，最好把 git repository 远程连接配置好。这样 `npm version patch` 时，package.json version 和 `git tag` 会同步都更新。再通过下面命令把 tag 推送到远端。

```bash
npm version major/minor/patch  # increments both package.json and sets a tag in git repository if package.json indicates repository
git push --tags origin HEAD:master
```

**See installed tools**:

```bash
ls node_modules/.bin
```

### reference

<https://github.com/coryhouse/react-slingshot/blob/master/package.json> <https://libraries.io/> <https://docs.npmjs.com/misc/scripts>

<https://www.pluralsight.com/courses/npm-build-tool-introduction>
