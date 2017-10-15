# 参考 http://www.chengweiyang.cn/gitbook/github-pages/README.html
git checkout gh-pages &&
git rm --cached -r . &&   # 删除不需要的文件
git clean -df &&
rm -rf *~ &&
cp -r _book/* . &&  # 复制 _book 下的内容到分支中
git add . &&
git commit -m "Publish book" &&
git push -u origin gh-pages
