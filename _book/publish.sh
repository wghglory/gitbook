# 参考 http://www.chengweiyang.cn/gitbook/github-pages/README.html
# 后续更新用 publish
git checkout gh-pages &&
git rm --cached -r . &&   # 删除不需要的文件
git clean -df &&
rm -rf *~ &&
cp -r _book/* . &&  # 复制 _book 下的内容到分支中
echo "*~" > .gitignore && # 添加 gitignore
echo "_book" >> .gitignore && # 添加 gitignore
echo "node_modules" >> .gitignore && # 添加 gitignore
echo ".DS_Store" >> .gitignore &&
echo ".editorconfig" >> .gitignore &&
echo "publish.sh" >> .gitignore &&
echo "package.json" >> .gitignore &&
echo "generateTOC.js" >> .gitignore &&
git add . &&
echo published on $(date +%Y-%m-%d_%H:%M:%S) | git commit -F -  &&  # https://unix.stackexchange.com/questions/366407/git-commit-using-stdout-from-bash
git push -u origin gh-pages
