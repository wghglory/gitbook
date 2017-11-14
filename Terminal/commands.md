# Mac useful commands

```bash
ls  # list files
ls -a # list files including .gitignore, _book, etc
```

## kill port

macOS:

```bash
ps aux | grep node
lsof -i:3000
kill -9 <previous processId>
```

windows:

```bash
netstat -a -o -n
taskkill /F /PID <previous processId>
```

## npm commands

```bash
npm init
npm install [-g] <packageName> [--save-dev]
npm start
npm t/test/tst
npm version major/minor/patch

yarn init
yarn add <packageName> [--dev]
```

### npm-check-updates

```bash
npm install -g npm-check-updates
ncu      # list
ncu -u   # update package version
```

### [yarn](https://github.com/yarnpkg/yarn)

```bash
yarn add <packageName> [--dev]   # will automatically save package to devDependencies
yarn eslint --init

# use yarn script instead npm run script
yarn dev

# upgrade all dependencies
yarn upgrade-interactive
```

### [nvm](https://github.com/creationix/nvm)

```bash
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.6/install.sh | bash    # install
nvm --version
nvm ls-remote  # 查看所有node版本
nvm use v6.10.2  # 切换node版本
nvm alias default v6.10.2  # 将此版本设为默认
```

### File operation

```bash
mkdir <folderName>
touch <newFile.js>
cat <newFile.js>  # review file content
```

### No access

```bash
sudo chown -R $USER /usr/lib/node_modules
```
