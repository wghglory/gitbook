# 后悔药

## 最倒霉 -- 错误 commit 提交到了 remote

```bash
git log # 查看想回到第几个
git rebase -i HEAD~3  #  pick 其中一个，其余删除或者加 # comment 掉
ctrl + x  # exit
yes  # save
回车  # 退出模式
```

然后进行修改，最后 `git push origin +master` 覆盖掉 remote 的提交。
