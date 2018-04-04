const fs = require('fs');
const path = require('path');
const sep = require('path').sep;
const root_path = process.argv[2] || __dirname; // /Users/derek/guanghui.notebook
const w_file = 'README.md';
const projectName = 'guanghui.notebook';

// 为了省事，这里采用了字符串拼接的方式，最优的方式应该用buffer来做字符拼接。
let symbol = function(fpath) {
  let s = '';
  for (let i = 2; i < fpath.length; i++) {
    s += '  ';
  }
  return s;
};

let symbol2 = function(fpath) {
  let s = '';
  for (let i = 4; i < fpath.length; i++) {
    s += '  ';
  }
  return s;
};

function getFilesAndFolders(root) {
  let res = [];
  let fileAndFolders = fs.readdirSync(root).sort((a, b) => {
    return a.localeCompare(b, undefined /* Ignore language */, { sensitivity: 'base' });
  });

  // 根据时间来排序
  // fileAndFolders.sort(function(a, b) {
  //   return fs.statSync(dir + a).mtime.getTime() - fs.statSync(dir + b).mtime.getTime();
  // });

  fileAndFolders.forEach(function(f) {
    let pathname = root + '/' + f; // /Users/derek/Library/guanghui.notebook/移动端/viewport.md
    let pathname2 = pathname.replace(/.+\/(guanghui.notebook.+)/, '$1'); // guanghui.notebook/移动端/viewport.md

    // 不为 README.md 的 markdown 文件；排除 node_modules folder gitbook；
    if (
      (path.extname(f) === '.md' && f !== 'README.md' && f !== 'SUMMARY.md') ||
      (path.extname(f) === '' &&
        !f.startsWith('.') &&
        !f.startsWith('_') &&
        f !== 'node_modules' &&
        f !== 'assets' &&
        f !== 'gitbook')
    ) {
      let stat = fs.lstatSync(pathname);

      // var temp = [];

      if (stat.isDirectory()) {
        let fpath = pathname2.split(sep);
        // console.info(symbol(fpath) + fpath[fpath.length - 1]);
        let folderName = pathname.replace(/.+guanghui.notebook\/(.+)/, '$1');
        res.push(symbol(fpath) + `* [${folderName}](/${folderName}/README.md)`);
        res = res.concat(getFilesAndFolders(pathname));

        // temp = temp.concat(getFilesAndFolders(pathname));
        // createReadMe4Folders(pathname, '# TOC\r\n\r\n' + temp.join('\n'));
      } else {
        let fpath = pathname2.split(sep);
        // console.info(symbol(fpath) + fpath[fpath.length - 1]);
        let bracketName = pathname.replace(/.+\/(.+)\.md/, '$1'); // viewport
        let parenthesisName = pathname.replace(root_path, '').slice(1); // 移动端/viewport.md
        res.push(symbol(fpath) + `- [${bracketName}](${parenthesisName})`); // - [viewport](移动端/viewport.md)
      }
    }
  });
  return res;
}
const toc = '# SUMMARY\r\n\r\n' + getFilesAndFolders(root_path).join('\n');

// write TOC for summary.md
fs.open('SUMMARY.md', 'w', function(err, fd) {
  fs.write(fd, toc, 0, 'utf8', function(e) {
    if (e) throw e;
    fs.closeSync(fd);
  });
});

function init(root) {
  let res = [];
  let fileAndFolders = fs.readdirSync(root).sort((a, b) => {
    return a.localeCompare(b, undefined /* Ignore language */, { sensitivity: 'base' });
  });

  // 根据时间来排序
  // fileAndFolders.sort(function(a, b) {
  //   return fs.statSync(dir + a).mtime.getTime() - fs.statSync(dir + b).mtime.getTime();
  // });

  fileAndFolders.forEach(function(f) {
    let pathname = root + '/' + f; // /Users/derek/Library/guanghui.notebook/移动端/viewport.md
    let pathname2 = pathname.replace(/.+\/(guanghui.notebook.+)/, '$1'); // guanghui.notebook/移动端/viewport.md

    // 不为 README.md 的 markdown 文件；排除 node_modules folder；
    if (
      (path.extname(f) === '.md' && f !== 'README.md' && f !== 'SUMMARY.md') ||
      (path.extname(f) === '' &&
        !f.startsWith('.') &&
        !f.startsWith('_') &&
        f !== 'node_modules' &&
        f !== 'assets')
    ) {
      let stat = fs.lstatSync(pathname);

      var temp = [];

      if (stat.isDirectory()) {
        temp = temp.concat(init(pathname));
        createReadMe4Folders(pathname, '# TOC\r\n\r\n' + temp.join('\n'));
      } else {
        let bracketName = pathname.replace(/.+\/(.+)\.md/, '$1'); // viewport
        let parenthesisName = pathname.replace(/.+\/(.+\.md)/, '$1'); // viewport.md
        res.push(`* [${bracketName}](${parenthesisName})`); // - [viewport](移动端/viewport.md)
      }
    }
  });
  return res;
}

// write TOC for every folder
function createReadMe4Folders(path, toc) {
  fs.open(path + '/README.md', 'w', function(err, fd) {
    fs.write(fd, toc, 0, 'utf8', function(e) {
      if (e) throw e;
      fs.closeSync(fd);
    });
  });
}

init(root_path);
