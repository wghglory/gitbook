# Git

## Easy Commands

```shell
git init
git status
# git status 显示乱码 git config --global core.quotepath false

git add 1.txt
# 添加多个文件
git add 2.txt 3.txt
# 添加整个目录
git add ./a
# 添加多个目录
git add ./b ./c
# 添加所有文件
git add .

git commit -m 'your message'
git commit --amend -m 'overwrite last message'
git commit -a -m 'your message' # 无需 git add .
git commit --no-verify --amend --no-edit

git log [--oneline]
git log --online --decorate --all --graph

git reflog
```

## Delete file

```shell
# 从 git 仓库与工作区中删除指定文件
git rm 文件

# 只删除 git 仓库中的文件
git rm --cached 文件

# rm 以后，需要 commit 这次操作，否则 rm 将保留在暂存区
git commit -m 修正
```

## 撤销重置

```shell
# 从暂存区中撤销一个指定文件
git reset HEAD 文件名称

# 从暂存区中撤销所有文件
git reset HEAD .

# 回退到指定的 commitID 版本
git reset --hard commitID
```

## 比较

```shell
# 比较 工作区和暂存区
git diff 文件
# 比较 暂存区和仓库
git diff --cached [commitId] 文件
# 比较 工作区和仓库
git diff commitId filename
# 比较 仓库不同版本
git diff commitId1 commitId2
```

## Branch

### See all branches

```shell
git branch
```

Which will show:

```
* approval_messages
  master
  master_clean
```

### Create a branch

```shell
git branch 分支名称
```

### Switch to branch

```shell
git checkout 分支名称
```

### Create the branch and switch in this branch

```shell
git checkout -b 分支名称
```

### Push the branch on github

```shell
git push origin 分支名称
```

> When you want to commit something in your branch, be sure to be in your branch. Add `-u` parameter to set upstream.

### Add a new remote for your branch

```shell
git remote add [origin]
```

### Push changes from your commit into your branch

```shell
git push origin [name_of_your_branch]
```

### Update your branch when the original branch from an official repository has been updated

```shell
git fetch [origin]
```

### Merge

```shell
# B 合并到 A，需要切换到 A 分支
git merge 被合并分支

# 查看已经合并的分支
git branch --merged
# 查看未合并的分支
git branch --no-merged
```

### Delete branch

```shell
git branch -d 分支名称
git branch -D 分支名称 # force the deletion
```

Delete the branch on github :

```shell
git push origin :分支名称
# OR
git push origin --delete 分支名称
```

## Config

```shell
brew install git

git config --get-regexp user  # user.name, user.email

git config [--global] user.name "Guanghui Wang"
git config [--global] user.email "guanghuiw@vmware.com"

git config --global color.ui true
git config --global fetch.prune true

# 打印所有config
git config --list
# 打印指定config
git config user.name
```

## 错误 commit 提交到了 remote 想要 force Push

```shell
git log # 查看想回到第几个
git rebase -i HEAD~3  #  pick 其中一个，其余删除或者加 # comment 掉, s to squash
ctrl + x  # exit
yes  # save
回车  # 退出模式
```

然后进行修改，最后 `git push origin master -f` 覆盖掉 remote 的提交。
