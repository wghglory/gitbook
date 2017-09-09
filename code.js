// var fs = require('fs'),
//   stdin = process.stdin,
//   stdout = process.stdout;
// var stats = [];

// fs.readdir(process.cwd(), function(err, files) {
//   console.log(' ');

//   if (!files.length) {
//     return console.log(' \033[31m No files to show!\033[39m\n');
//   }

//   function file(i) {
//     var filename = files[i];

//     fs.stat(__dirname + '/' + filename, function(err, stat) {
//       stats[i] = stat;
//       if (stat.isDirectory()) {
//         console.log(' ' + i + ' \033[36m' + filename + '/\033[39m');
//       } else {
//         console.log(' ' + i + ' \033[90m' + filename + '\033[39m');
//       }

//       i++;

//       if (i == files.length) {
//         read();
//       } else {
//         file(i);
//       }
//     });
//   }

//   function read() {
//     console.log(' ');
//     stdout.write(' \033[33mEnter your choice : \033[39m');
//     stdin.resume();
//     stdin.setEncoding('utf8');
//     stdin.on('data', option);
//   }

//   function option(data) {
//     var filename = files[Number(data)];
//     if (!files[Number(data)]) {
//       stdout.write(' \033[mEnter your choice : \033[39m');
//     } else if (stats[Number(data)].isDirectory()) {
//       fs.readdir(__dirname + '/' + filename, function(err, files) {
//         console.log(' ');
//         console.log(' (' + files.length + 'files)');
//         files.forEach(function(file) {
//           console.log(' - ' + file);
//         });
//         console.log(' ');
//       });
//     } else {
//       stdin.pause();
//       fs.readFile(__dirname + '/' + filename, 'utf8', function(err, data) {
//         console.log(' ');
//         console.log('\033[90m' + data.replace(/(.*) /g, ' $1') + '\033[39m');
//       });
//     }
//   }

//   file(0);
// });

var fs = require('fs');
var path = require('path');
var root_path = process.argv[2] || __dirname;
var w_file = 'README.md';

function getAllFiles(root) {
  var res = [];
  var files = fs.readdirSync(root).sort((a, b) => {
    return a.localeCompare(b, undefined /* Ignore language */, { sensitivity: 'base' });
  });

  console.log(files);
  // files.sort(function(a, b) {
  //   return fs.statSync(dir + a).mtime.getTime() - fs.statSync(dir + b).mtime.getTime();
  // });

  files.forEach(function(file) {
    var pathname = root + '/' + file;
    if ((path.extname(file) === '.md' && file !== 'README.md') || (path.extname(file) === '' && file !== '.DS_Store')) {
      var stat = fs.lstatSync(pathname);
      var one = `${pathname.replace(`${root_path}/`, '- [')}](${pathname.replace(`${root_path}/`, '')})`;
      if (!stat.isDirectory()) {
        res.push(one);
      } else {
        res = res.concat(getAllFiles(pathname));
      }
    }
  });
  return res;
}
var w_content = getAllFiles(root_path).join('\n');

fs.open('README.md', 'w', function(err, fd) {
  fs.write(fd, w_content, 0, 'utf8', function(e) {
    if (e) throw e;
    fs.closeSync(fd);
  });
});

// fs.readFile(root_path + w_file, function(err, data) {
//   if (err && err.errno == 33) {
//     fs.open(w_file, 'w', 0666, function(e, fd) {
//       if (e) throw e;
//       fs.write(fd, w_content, 0, 'utf8', function(e) {
//         if (e) throw e;
//         fs.closeSync(fd);
//       });
//     });
//   } else {
//     fs.writeFile(root_path + w_file, w_content, function(e) {
//       if (e) throw e;
//     });
//   }
// });
