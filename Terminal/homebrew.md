# [Homebrew](https://brew.sh/)

Install: `/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"`

## Commands

| **Homebrew**                       |                                              |
| ---------------------------------- | -------------------------------------------- |
| brew doctor                        | Check brew for potential problems            |
| brew install [formula]             | Install a formula                            |
| brew uninstall [formula]           | Uninstall a formula                          |
| brew list                          | List all the installed formulas              |
| brew search                        | Display available formulas for brewing       |
| **brew upgrade**                   | Upgrade all outdated and unpinned brews      |
| **brew update**                    | Fetch latest version of homebrew and formula |
| **brew cleanup**                   | Remove older version of installed formula    |
| brew info wget                     | 查看软件包信息                               |
| brew deps wget                     | 查看软件包信息                               |
| brew tap homebrew/cask             | Tap the cask repository from GitHub          |
| brew cask list                     | List all installed casks                     |
| brew cask install [cask]           | Install the given cask                       |
| brew cask uninstall [cask] --force | Uninstall the given cask                     |

出错以后的处理:

```shell
brew update
brew doctor
```

## Homebrew in China

```shell
# 替换brew.git:
cd "$(brew --repo)"
# 中国科大:
git remote set-url origin https://mirrors.ustc.edu.cn/brew.git
# 清华大学:
git remote set-url origin https://mirrors.tuna.tsinghua.edu.cn/git/homebrew/brew.git

# 替换homebrew-core.git:
cd "$(brew --repo)/Library/Taps/homebrew/homebrew-core"
# 中国科大:
git remote set-url origin https://mirrors.ustc.edu.cn/homebrew-core.git
# 清华大学:
git remote set-url origin https://mirrors.tuna.tsinghua.edu.cn/git/homebrew/homebrew-core.git

# 替换homebrew-bottles:
# 中国科大:
echo '\n #homebrew \n export HOMEBREW_BOTTLE_DOMAIN=https://mirrors.ustc.edu.cn/homebrew-bottles' >> ~/.bash_profile
source ~/.bash_profile
# 清华大学:
echo '\n #homebrew \n export HOMEBREW_BOTTLE_DOMAIN=https://mirrors.tuna.tsinghua.edu.cn/homebrew-bottles' >> ~/.bash_profile
source ~/.bash_profile

# 应用生效:
brew update
```

如果你之前折腾过不少导致你的 Homebrew 有点问题，那么可以尝试使用如下方案：

```shell
# 诊断Homebrew的问题:
brew doctor

# 重置brew.git设置:
cd "$(brew --repo)"
git fetch
git reset --hard origin/master

# homebrew-core.git同理:
cd "$(brew --repo)/Library/Taps/homebrew/homebrew-core"
git fetch
git reset --hard origin/master

# 应用生效:
brew update
```

重置更新源 某些时候也有换回官方源的需求:

```shell
# 重置brew.git:
cd "$(brew --repo)"
git remote set-url origin https://github.com/Homebrew/brew.git

# 重置homebrew-core.git:
cd "$(brew --repo)/Library/Taps/homebrew/homebrew-core"
git remote set-url origin https://github.com/Homebrew/homebrew-core.git
```

完成更新源的更换后，我们可以使用 `brew upgrade` 将现有的软件进行更新至最新版本，这样便能很直接的看出速度上的变化了。最后不要忘记 `brew cleanup` 将旧有的软件安装包进行清理

## Homebrew 安装后的文件位置

```
/usr/local/opt
```

以 nginx 为例，双击目录快捷方式找到 `/usr/local/Cellar/nginx/1.17.3_1/bin`
