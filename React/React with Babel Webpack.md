### Use [boilerplate](https://github.com/wghglory/react-boilerplate) to initialize a react project

```bash
npm install --save react react-dom

npm install --save-dev babel-core babel-loader babel-preset-env babel-preset-react css-loader style-loader html-webpack-plugin webpack webpack-dev-server
```

### babel loader

- `babel-preset-env`: Transpile ES2015, ES2016, ES2017 new syntax to old code that older browser can understand
- `babel-preset-react`: Transpile jsx to react.createElement()

package.json:

```json
"babel": {
  "presets": ["react", "env"]
}
```

### css-loader

any css file that contains `import`, `url(..img)` => `require()`

