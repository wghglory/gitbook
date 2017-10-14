# Mac useful commands

```bash
ls  # list files
ls -a # list files including .gitignore, _book, etc
```

## kill port

```bash
lsof -i:3000
kill -9 <previous processId>
```

## npm commands

```bash
npm install -g packagename --save-dev
npm start
npm t/test/tst
npm version major/minor/patch
```

### npm-check-updates

```bash
npm install -g npm-check-updates
ncu      # list
ncu -u   # update package version
```
