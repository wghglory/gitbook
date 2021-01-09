# Mac useful commands

```shell
ls  # list files
ls -a # list files including .gitignore, _book, etc
```

## kill port

macOS:

```shell
ps aux | grep node
lsof -i:3000
kill -9 <previous processId>
```

windows:

```shell
netstat -a -o -n
taskkill /F /PID <previous processId>
```

## npm commands

```shell
npm init
npm install [-g] <packageName> [--save-dev]
npm start
npm t/test/tst
npm version major/minor/patch

yarn init
yarn add <packageName> [--dev]
```

### npm-check-updates

```shell
npm install -g npm-check-updates
ncu      # list
ncu -u   # update package version
```

### [yarn](https://github.com/yarnpkg/yarn)

```shell
yarn config set registry https://registry.npm.taobao.org

yarn add <packageName> [--dev]   # will automatically save package to devDependencies
yarn global add <packageName>
yarn eslint --init

# use yarn script instead npm run script
yarn dev

# upgrade all dependencies
yarn upgrade-interactive

yarn list --depth=0
```

### [nvm](https://github.com/creationix/nvm)

```shell
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.6/install.sh | bash    # install
nvm --version
nvm ls-remote  # 查看所有node版本
nvm use v6.10.2  # 切换node版本
nvm alias default v6.10.2  # 将此版本设为默认
```

### File operation

```shell
mkdir <folderName>
touch <newFile.js>
cat <newFile.js>  # review file content

find "/Users/guanghuiw/Documents/from qianhui icloud" -name '*mini*' -delete   # delete all files containing mini at folder xxx

# copy photo gallery content into another folder in a flatten way
find /Users/guanghuiw/Pictures/Photos\ Library.photoslibrary -type f -exec cp {} /Users/guanghuiw/Documents/dest \;

find $HOME -type f -iname '*.png' -exec cp --backup=numbered {} $PWD \;
```

### No access

```shell
sudo chown -R $USER /usr/lib/node_modules
```
