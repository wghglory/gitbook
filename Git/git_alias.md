# Git Alias

```bash
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.st status
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
