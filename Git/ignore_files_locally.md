# Git ignore files locally

known 2 ways: `.gitignore` or `.git/info/exclude` not to manage files with Git.

There are times when you want to ignore files that are already managed with Git locally.

```bash
# when some files you don't want to submit to git server, e.g. angular proxy.js since proxy url is shifting heavily during development
git update-index --skip-worktree path/to/file
git update-index --no-skip-worktree path/to/file

# assume never changed by developers, and to speed up git behavior by ignoring unnecessary files. e.g. node_modules. of course it's usually in .gitignore
git update-index --assume-unchanged path/to/file
git update-index --no-assume-unchanged path/to/file
```
