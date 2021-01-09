# npm

1. Common commands

```shell
npm init  # 引导创建一个package.json文件
npm help(npm -h)   # 查看npm帮助信息
npm version (npm -v) # 查看npm版本
npm search  # 查找
npm install (npm i)  # 安装  默认在当前目录，如果没有node_modules 会创建文件夹
  npm install module_name -S # 或者 --save
  npm install module_name -D  # 或者 --save-dev
  npm install module_name -g # 全局安装(命令行使用)
  npm i module_name @1.0 通过  # "@"符号指定 指定版本安装模块
npm update(npm -up)  # 更新
npm remove 或者 npm uninstall  # 删除
npm root  查看当前包安装的路径  或者通过  npm root -g 来查看全局安装路径
npm view ng-zorro-antd versions
```

2. 注册账号：[https://www.npmjs.com/](https://www.npmjs.com/) (邮箱验证)

```shell
npm adduser 输入刚刚注册好的用户名和密码
```

```shell
npm config set registry https://registry.npmjs.org/ # 官方地址

https://registry.npm.taobao.org/ # (淘宝源地址)
```

3. list packages

```shell
# 查询源地址
npm config list
```

4. publish

```shell
npm version major | minor | patch 命令

npm config get registry # 检查仓库镜像库
npm config set registry=http://registry.npmjs.org
echo '请进行登录相关操作：'
npm login # 登陆 echo "-------publishing-------"
npm publish # 发布
npm config set registry=https://registry.npm.taobao.org # 设置为淘宝镜像
echo "发布完成"
exit
```

# yarn

```shell
npm install -g yarn
yarn
yarn global add packageName
yarn add xxx@x.x.x --dev
yarn remove xxx
yarn run xxx
```

# nvm

- 在安装 nvm 之前需要一个 c++编译器，在 mac 上可以安装 Xcode 命令工具(已经安装可以忽略)

```shell
xcode-select --install
```

- 使用 curl 安装

```shell
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.34.0/install.sh | bash
```

- 或者使用 wget 来安装

```shell
wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.34.0/install.sh | bash
```

## nvm 常用指令

```shell
nvm --version查看版本
nvm install stable # 安装最新稳定版nodejs
nvm install 8.11.1 # 安装指定版本
nvm install 8.11 # 安装 8.11.x系列最新版本
nvm ls-remote # 列出远程服务器上所有可用的版本
nvm use 8.11.1 # 切换到8.11.1版本
nvm use 8.11 # 切换到8.11.x最新版本
nvm use node # 切换到最新版本
nvm alias default node # 设置默认版本为最新版本
nvm ls # 列出所有已经安装的版本
```

