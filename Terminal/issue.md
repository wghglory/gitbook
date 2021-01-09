# Terminal issues

## mac 解决 ls 等命令失效问题

原因：环境变量设置出错

1，在命令行中输入

```shell
export PATH=/usr/bin:/usr/sbin:/bin:/sbin:/usr/X11R6/bin
```

这样可以保证命令行命令暂时可以使用。命令执行完之后先不要关闭终端。

2. 如果先前修改 bash_profile, 打开它进行恢复，改正确很有可能是你的 PATH 环境变量设置错误，比如 \$PATH 漏了 `PATH=$PATH:$PATH1`, 可以写成这样的格式：`export PATH=/usr/local/msyql/bin:\$PATH`

或者 `export` 写在了上一行。

4. 改号文件保存立即生效，`source ~/.bash_profile`
