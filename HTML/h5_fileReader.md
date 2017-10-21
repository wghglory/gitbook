# HTML5 新增的文件操作对象

* `File`: 代表一个文件对象
* `FileList`: 代表一个文件列表对象，类数组
* `FileReader`: 用于从文件中读取数据
* `FileWriter`: 用于向文件中写出数据

从电脑托一张图片到网页目标区域，显示该图片。类似于上传头像的一种方式。

```html
<!DOCTYPE html>
<html>
<head lang="en">
  <meta charset="UTF-8">
  <title></title>
  <style>
    #container {
      border: 1px solid #aaa;
      border-radius: 3px;
      padding: 10px;
      margin: 10px;
      min-height: 400px;
    }
  </style>
</head>
<body>

  <h1>拖放API的扩展知识</h1>
  <h3>请拖动您的照片到下方方框区域</h3>
  <div id="container"></div>

  <script>
    //监听 document 的 drop 事件——取消其默认行为：在新窗口中打开图片
    document.ondragover = function(e){
      e.preventDefault(); //使得drop事件可以触发
    }
    document.ondrop = function(e){
      e.preventDefault(); //阻止在新窗口中打开图片，否则仍然会执行下载操作！！！
    }

    //监听 div#container 的 drop 事件，设法读取到释放的图片数据，显示出来
    container.ondragover = function(e){
      e.preventDefault();
    }
    container.ondrop = function(e){
      console.log('客户端拖动着一张图片释放了...')
      //当前的目标对象读取拖放源对象存储的数据
      //console.log(e.dataTransfer); //显示有问题
      //console.log(e.dataTransfer.files.length); //拖进来的图片的数量
      var f0 = e.dataTransfer.files[0];  //文件对象 File

      //从文件对象中读取数据
      var fr = new FileReader();
      //fr.readAsText(f0); //从文件中读取文本字符串
      fr.readAsDataURL(f0); //从文件中读取URL数据
      fr.onload = function(){
        console.log('读取文件完成')
        console.log(fr.result);
        var img = new Image();
        img.src = fr.result; //URL数据
        container.appendChild(img);
      }
    }

  </script>
</body>
</html>
```

![image](http://img.blog.csdn.net/20161118143901695?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQv/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/Center)
