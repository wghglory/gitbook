# My Notebook

Make sure the repository folder name is `guanghui.notebook`.

## Gitbook Cli

```shell
cd folder
npm install -g gitbook-cli

gitbook init
gitbook build  # 生成在当前目录的默认文件夹 _book里面
gitbook build ./out  # 生成在当前目录的默认文件夹 指定的 out 里面
gitbook serve   # localhost:4000
```

配置文件，不必须

```javascript
{
  "title": "前端规范",
  "description": "前端规范 简介",
  "language": "zh-hans",
  "plugins": [
    "-lunr",
    "-search",
    "search-plus", //支持中文搜索  上面 search 是默认的   “-”  是去掉的意思
    "splitter", // 这个侧边可以拉伸
    "tbfed-pagefooter", //这个是底部加 信息  下面可以看到具体的配置
    "expandable-chapters-small" //使左侧的章节目录可以折叠
  ],
  "pluginsConfig": {
    "theme-default": {
      "showLevel": true
    },
    "tbfed-pagefooter": {
      "copyright": "Copyright &copy xxxxx",
      "modify_label": "该文件修订时间：",
      "modify_format": "YYYY-MM-DD HH:mm:ss"
    }
  },
  "links": {
    "gitbook": false,
    "sharing": {
      "google": false,
      "facebook": false,
      "twitter": false,
      "all": false
    }
  }
}
```

## Daily maintenance

```shell
npm run toc
npm run prettierReadme  # npm run prettier

git add .
git commit -m 'commit' --no-verify
git push
```

## Publish

**Need to build \_book directory before publish via `gitbook build`.**

Only 1st time publish:

1.  `git branch -D gh-pages` if any
1.  `yarn run initPublish`. Make sure master \_book contains `index.html, search_plus_index.json` and all html files. This script will create gh-pages branch and .gitignore

In future publish:

`yarn run publish`

Access result at <https://wghglory.github.io/gitbook>

参考资料：<http://gitbook.zhangjikai.com/plugins.html>
