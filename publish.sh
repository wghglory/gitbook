git checkout --orphan gh-pages &&
git rm --cached -r . &&
git clean -df &&
rm -rf *~ &&
cp -r _book/* . &&
git add . &&
git commit -m "Publish book" &&
git push -u origin gh-pages &&
git checkout master
