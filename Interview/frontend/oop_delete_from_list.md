# 面向对象删除选中 li(阿里面试)

```html
<!DOCTYPE html>
<html>

<head>
  <meta charset="utf-8">
  <title>阿里2017校招编程题</title>
</head>

<body>
  <style media="screen">
    .del {
      cursor: pointer;
    }
  </style>
  <ul class="list">
    <li>
      <h1>第一行</h1>
      <p>这是内容区，点击X删除当前行，<span class="del">X</span></p>
    </li>
    <li>
      <h1>第二行</h1>
      <p>这是内容区，点击X删除当前行，<span class="del">X</span></p>
    </li>
    <li>
      <h1>第三行</h1>
      <p>这是内容区，点击X删除当前行，<span class="del">X</span></p>
    </li>
    <li>
      <h1>第四行</h1>
      <p>这是内容区，点击X删除当前行，<span class="del">X</span></p>
    </li>
  </ul>
  <ul class="list">
    <li>
      <h1>这是另一个List第一行</h1>
      <p>这是内容区，点击X删除当前行，<span class="del">X</span></p>
    </li>
    <li>
      <h1>这是另一个List第二行</h1>
      <p>这是内容区，点击X删除当前行，<span class="del">X</span></p>
    </li>
    <li>
      <h1>这是另一个List第三行</h1>
      <p>这是内容区，点击X删除当前行，<span class="del">X</span></p>
    </li>
    <li>
      <h1>这是另一个List第四行</h1>
      <p>这是内容区，点击X删除当前行，<span class="del">X</span></p>
    </li>
  </ul>
  <script type="text/javascript">
    class List {
      constructor(sel) {
        this.ulElements = Array.from(document.querySelectorAll(sel));
        let self = this;
        this.ulElements.forEach(item => {
          item.addEventListener('click', function (e) {
            if (e.target.className.indexOf('del') > -1) {
              self.removeItem.call(self, e.target);
            }
          });
        });
      }
      removeItem(target) {
        let self = this;
        let findParent = function (node) {
          let parent = node.parentNode;
          let root = self.ulElements.find(item => item === parent);
          if (root) {  // 当能从 ul 中找到时，删除 ul 下结点 li
            root.removeChild(node);
          } else {
            findParent(parent);
          }
        };
        findParent(target);
      }
    }

    window.addEventListener('DOMContentLoaded', function () {
      new List('.list');
    });
  </script>
</body>

</html>
```