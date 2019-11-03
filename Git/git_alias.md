# Git Alias

```bash
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.cane "commit --amend --no-edit"
git config --global alias.st status

alias gbr="git branch | grep -v "master" | xargs git branch -D"   # delete all local branches except master, but master-test won't be deleted
git branch | grep -ve " master$" | xargs git branch -D  # This will remove branches named (e.g.) test-master, master-test.
# more than 1 branch can be added to the grep expression like "master\|develop\|current_branch"

git branch | egrep -v "(master|\*)" | xargs git branch -D  # deletes everything except master and the branch I am currently in
```

```bash
git config --global alias.unstage 'reset HEAD --'
# `git unstage fileA` will perform like `git reset HEAD -- fileA`
```

```bash
git config --global alias.last 'log -1 HEAD'  # git last
```

As you can tell, Git simply replaces the new command with whatever you alias it for. However, maybe you want to run an external command, rather than a Git subcommand. In that case, you start the command with a ! character. This is **useful if you write your own tools that work with a Git repository**. We can demonstrate by aliasing `git visual` to run `gitk`:

`$ git config --global alias.visual '!gitk'`
