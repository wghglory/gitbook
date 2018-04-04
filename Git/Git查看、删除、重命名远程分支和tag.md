# [Git 查看、删除、重命名远程分支和 tag](https://blog.zengrong.net/post/1746.html)

## 1. 查看远程分支

加上-a 参数可以查看远程分支，远程分支会用红色表示出来（如果你开了颜色支持的话）：

```bash
git branch -a
  master
  remote
  tungway
  v1.52
* zrong
  remotes/origin/master
  remotes/origin/tungway
  remotes/origin/v1.52
  remotes/origin/zrong
```

## 2. 删除远程分支和 tag

`git branch -D gh-pages` 删除本地分支

在 Git v1.7.0 之后，可以使用这种语法删除远程分支：

```bash
git push origin --delete <branchName>
```

删除 tag 这么用：

```bash
git push origin --delete tag <tagname>
```

否则，可以使用这种语法，推送一个空分支到远程分支，其实就相当于删除远程分支：

```bash
git push origin :<branchName>
```

这是删除 tag 的方法，推送一个空 tag 到远程 tag：

```bash
git tag -d <tagname>
git push origin :refs/tags/<tagname>
```

两种语法作用完全相同。

## 3. 删除不存在对应远程分支的本地分支

假设这样一种情况：

1.  我创建了本地分支 b1 并 pull 到远程分支 `origin/b1`；
1.  其他人在本地使用 fetch 或 pull 创建了本地的 b1 分支；
1.  我删除了 `origin/b1` 远程分支；
1.  其他人再次执行 fetch 或者 pull 并不会删除这个他们本地的 `b1` 分支，运行 `git branch -a` 也不能看出这个 branch 被删除了，如何处理？

使用下面的代码查看 b1 的状态：

```bash
git remote show origin
* remote origin
  Fetch URL: git@github.com:xxx/xxx.git
  Push  URL: git@github.com:xxx/xxx.git
  HEAD branch: master
  Remote branches:
    master                 tracked
    refs/remotes/origin/b1 stale (use 'git remote prune' to remove)
  Local branch configured for 'git pull':
    master merges with remote master
  Local ref configured for 'git push':
    master pushes to master (up to date)
```

这时候能够看到 b1 是 stale 的，使用 `git remote prune origin` 可以将其从本地版本库中去除。

更简单的方法是使用这个命令，它在 fetch 之后删除掉没有与远程分支对应的本地分支：

```bash
git fetch -p
```

## 4. 重命名远程分支

在 git 中重命名远程分支，其实就是先删除远程分支，然后重命名本地分支，再重新提交一个远程分支。

例如下面的例子中，我需要把 devel 分支重命名为 develop 分支：

```bash
$ git branch -av
* devel                             752bb84 Merge pull request #158 from Gwill/devel
  master                            53b27b8 Merge pull request #138 from tdlrobin/master
  zrong                             2ae98d8 modify CCFileUtils, export getFileData
  remotes/origin/HEAD               -> origin/master
  remotes/origin/add_build_script   d4a8c4f Merge branch 'master' into add_build_script
  remotes/origin/devel              752bb84 Merge pull request #158 from Gwill/devel
  remotes/origin/devel_qt51         62208f1 update .gitignore
  remotes/origin/master             53b27b8 Merge pull request #138 from tdlrobin/master
  remotes/origin/zrong              2ae98d8 modify CCFileUtils, export getFileData
```

删除远程分支：

```bash
git push --delete origin devel
To git@github.com:zrong/quick-cocos2d-x.git
 - [deleted]         devel
```

重命名本地分支：

```bash
git branch -m devel develop
```

推送本地分支：

```bash
git push origin develop
```

然而，在 github 上操作的时候，我在删除远程分支时碰到这个错误：

```bash
git push --delete origin devel

remote: error: refusing to delete the current branch: refs/heads/devel
To git@github.com:zrong/quick-cocos2d-x.git
 ! [remote rejected] devel (deletion of the current branch prohibited)
error: failed to push some refs to 'git@github.com:zrong/quick-cocos2d-x.git'
```

这是由于在 github 中，devel 是项目的默认分支。要解决此问题，这样操作：

1.  进入 github 中该项目的 Settings 页面；
1.  设置 Default Branch 为其他的分支（例如 master）；
1.  重新执行删除远程分支命令。

## 5. 把本地 tag 推送到远程

```bash
git push --tags
```

## 6. 获取远程 tag

```bash
git fetch origin tag <tagname>
```

## git tag — 标签相关操作

常见操作：

```bash
git log # 查看最新 commit
git tag -a v1.1.0 9fbc3d0 -m 'some comment'
git push origin master --tags

git tag  # Show local tags
git tag -d v1.1.0   # delete local tag
git push origin --delete tag v1.1.0  # delete remote
```

### 列出标签

```bash
git tag     # 在控制台打印出当前仓库的所有标签
git tag -l 'v0.1.*'     # 搜索符合模式的标签
```

### 打标签

git 标签分为两种类型：轻量标签和附注标签。轻量标签是指向提交对象的引用，附注标签则是仓库中的一个独立对象。建议使用附注标签。

```bash
git tag v0.1.2-light  # 创建轻量标签
git tag -a v0.1.2 -m '0.1.2版本'   # 创建附注标签
```

创建轻量标签不需要传递参数，直接指定标签名称即可。创建附注标签时，参数 a 即 annotated 的缩写，指定标签类型，后附标签名。参数 m 指定标签说明，说明信息会保存在标签对象中。

### 切换到标签

与切换分支命令相同，用`git checkout [tagname]` 查看标签信息，用`git show`命令可以查看标签的版本信息：

```bash
git show v0.1.2
```

### 删除标签

误打或需要修改标签时，需要先将标签删除，再打新标签。

```bash
git tag -d v0.1.2    # 删除标签
```

参数 d 即 delete 的缩写，意为删除其后指定的标签。

### 给指定的 commit 打标签

打标签不必要在 head 之上，也可在之前的版本上打，这需要你知道某个提交对象的校验和（通过`git log`获取）。

```bash
git log
git tag -a v0.1.1 9fbc3d0 -m 'some comment'
```

### 标签发布

通常的`git push`不会将标签对象提交到 git 服务器，我们需要进行显式的操作：

```bash
git push origin v0.1.2 # 将v0.1.2标签提交到git服务器
git push origin master --tags # 将本地所有标签一次性提交到git服务器
```

> 注意：如果想看之前某个标签状态下的文件，可以这样操作

```bash
git tag   # 查看当前分支下的标签

git checkout v0.21   # 此时会指向打v0.21标签时的代码状态，（但现在处于一个空的分支上）

cat  test.txt    # 查看某个文件
```
