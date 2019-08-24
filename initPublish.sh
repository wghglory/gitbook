# 参考 http://www.chengweiyang.cn/gitbook/github-pages/README.html
# 首次 publish
git checkout --orphan gh-pages &&
git rm --cached -r . &&   # 删除不需要的文件
git clean -df &&
rm -rf *~ &&
# 添加 gitignore
echo "*~" > .gitignore &&
echo "_book" >> .gitignore &&
echo "node_modules" >> .gitignore &&
echo ".DS_Store" >> .gitignore &&
echo ".editorconfig" >> .gitignore &&
echo "initPublish.sh" >> .gitignore &&
echo "publish.sh" >> .gitignore &&
echo "package.json" >> .gitignore &&
echo "generateTOC.js" >> .gitignore &&
echo "toc.js" >> .gitignore &&
echo "yarn.lock" >> .gitignore &&
git add .gitignore
git commit -m "Ignore some files" --no-verify

cp -r _book/* . &&  # 复制 _book 下的内容到分支中
git add . &&
echo initial publish on $(date +%Y-%m-%d_%H:%M:%S) | git commit --no-verify -F -  &&  # https://unix.stackexchange.com/questions/366407/git-commit-using-stdout-from-bash
git push -u origin gh-pages -f &&
git checkout master && yarn
