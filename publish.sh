# 参考 http://www.chengweiyang.cn/gitbook/github-pages/README.html
# 后续更新用 publish
yes | cp -rf _book ../bookTemp &&   # 强制把 _book folder copies to ../bookTemp
git checkout gh-pages &&
# git checkout master -- _book &&   # 把 master 中 _book 添加到 gh-pages，可能因为 _book 在 master ignore 中，这个方法不行了
ls | egrep -v ".gitignore|.git|node_modules" | xargs rm -rf && # rm -rf -- ^(.gitignore|node_modules)   # delete all gh-pages files, folders except the .gitignore and node_modules
mkdir _book &&
cd .. &&
yes | cp -r bookTemp/* ./guanghui.notebook && # copy folder back
yes | cp -r bookTemp/* ./guanghui.notebook/_book && # copy folder back into _book folder, convenient to keep folder when switching back to master
rm -rf bookTemp &&
cd guanghui.notebook &&
git add . &&
echo published on $(date +%Y-%m-%d_%H:%M:%S) | git commit --no-verify -F -  &&  # https://unix.stackexchange.com/questions/366407/git-commit-using-stdout-from-bash
git push -u origin gh-pages &&
git checkout master
