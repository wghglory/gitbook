# 参考 http://www.chengweiyang.cn/gitbook/github-pages/README.html
# 后续更新用 publish
git checkout gh-pages &&
git checkout master -- _book &&   # 把 master 中 _book 添加到 gh-pages
echo published on $(date +%Y-%m-%d_%H:%M:%S) | git commit -F -  &&  # https://unix.stackexchange.com/questions/366407/git-commit-using-stdout-from-bash
git push -u origin gh-pages
