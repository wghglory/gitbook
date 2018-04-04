# 分页

## pagination code

```javascript
// 求得页码总数，需要Math.ceil(totalCount/pageSize)

/* 使用方法：
window.onload = function() {
    pagination({
        id: 'pagination',
        pageIndex: 1, // 当前要显示页面，1开始
        pageSize: 4, // 每页显示条数
        totalCount: data.length, // 总数据个数，总页码pageCount = Math.ceil(totalCount/pageSize)
        callBack: function(currentPageIndex, pageSize, totalPageCount) {
            // 分页标签加载完毕后执行
            // alert('当前页:' + currentPageIndex + ',总共页:' + totalPageCount);
            loadData(currentPageIndex, pageSize);
        }，
        aClick: function(targetA) {   // 点击某个a执行
            targetA.style.opacity = 0.1;
        },
        delayTime: 500 // 点击某个a后延迟500ms，再重新call page()
    });
}; */

/*
<div id="div1">
    <a href="#1">首页</a>
    <a href="#3">上一页</a>
    <a href="#2">[2]</a>
    <a href="#3">[3]</a>
    <a href="#4">4</a>
    <a href="#5">[5]</a>
    <a href="#6">[6]</a>
    <a href="#5">下一页</a>
    <a href="#10">尾页</a>
</div>
*/

function pagination(pageInfo) {
  if (!pageInfo.id) {
    return false;
  }
  // -------------------------分页链接生成 开始-----------------------------------
  var paginationObj = document.getElementById(pageInfo.id);

  paginationObj.innerHTML = ''; // 清空

  var pageIndex = pageInfo.pageIndex || 1;
  var pageSize = pageInfo.pageSize || 5;
  var pageCount = Math.ceil(pageInfo.totalCount / pageSize);
  var callBack = pageInfo.callBack || function() {};
  var aClick = pageInfo.aClick || function() {};
  var delayTime = pageInfo.delayTime || 0;

  if (pageIndex >= 4 && pageCount >= 6) {
    var oA = document.createElement('a');
    oA.href = '#1';
    oA.innerHTML = '首页';
    paginationObj.appendChild(oA);
  }

  if (pageIndex >= 2) {
    var oA = document.createElement('a');
    oA.href = '#' + (pageIndex - 1);
    oA.innerHTML = '上一页';
    paginationObj.appendChild(oA);
  }

  if (pageCount <= 5) {
    for (var i = 1; i <= pageCount; i++) {
      var oA = document.createElement('a');
      oA.href = '#' + i;
      if (pageIndex == i) {
        oA.innerHTML = i; // oA.innerHTML = '[' + i + ']';
        oA.className = 'active';
      } else {
        oA.innerHTML = i;
      }
      paginationObj.appendChild(oA);
    }
  } else {
    for (var i = 1; i <= 5; i++) {
      var oA = document.createElement('a');

      if (pageIndex == 1 || pageIndex == 2) {
        oA.href = '#' + i;
        if (pageIndex == i) {
          oA.innerHTML = i; // oA.innerHTML = '[' + i + ']';
          oA.className = 'active';
        } else {
          oA.innerHTML = i;
        }
      } else if (pageCount - pageIndex == 0 || pageCount - pageIndex == 1) {
        oA.href = '#' + (pageCount - 5 + i);
        if (pageCount - pageIndex == 0 && i == 5) {
          oA.innerHTML = pageCount - 5 + i; // oA.innerHTML = '[' + (pageCount - 5 + i) + ']';
          oA.className = 'active';
        } else if (pageCount - pageIndex == 1 && i == 4) {
          oA.innerHTML = pageCount - 5 + i; // oA.innerHTML = '[' + (pageCount - 5 + i) + ']';
          oA.className = 'active';
        } else {
          oA.innerHTML = pageCount - 5 + i;
        }
      } else {
        oA.href = '#' + (pageIndex - 3 + i);
        if (i == 3) {
          oA.innerHTML = pageIndex - 3 + i; // oA.innerHTML = '[' + (pageIndex - 3 + i) + ']';
          oA.className = 'active';
        } else {
          oA.innerHTML = pageIndex - 3 + i;
        }
      }
      paginationObj.appendChild(oA);
    }
  }

  if (pageCount - pageIndex >= 1) {
    var oA = document.createElement('a');
    oA.href = '#' + (pageIndex + 1);
    oA.innerHTML = '下一页';
    paginationObj.appendChild(oA);
  }

  if (pageCount - pageIndex >= 3 && pageCount >= 6) {
    var oA = document.createElement('a');
    oA.href = '#' + pageCount;
    oA.innerHTML = '尾页';
    paginationObj.appendChild(oA);
  }

  // --------------------------------分页链接生成 结束------------------------------
  // 加载完分页表前后执行函数
  callBack(pageIndex, pageSize, pageCount, paginationObj);

  // /* // 添加点击事件（传统）
  // var aA = paginationObj.getElementsByTagName('a');

  // for (var i = 0; i < aA.length; i++) {
  //   aA[i].onclick = function() {
  //     var pageIndex = parseInt(this.getAttribute('href').substring(1)); // getAttribute才能返回相对路径
  //     paginationObj.innerHTML = '';

  //     page({
  //       id: pageInfo.id,
  //       pageIndex: pageIndex,
  //       pageCount: pageCount,
  //       callBack: callBack,
  //     });

  //     return false; // 阻止默认事件（a点击在浏览器显示#)
  //   };
  // } */

  // 添加点击事件(用事件代理委托)
  paginationObj.onclick = function(ev) {
    var ev = ev || window.event;
    var target = ev.target || ev.srcElement;

    if (target.nodeName.toLowerCase() == 'a') {
      aClick(target);

      if (pageInfo.delayTime == 0) {
        nextCall();
      } else {
        var timer = setTimeout(function() {
          nextCall();
          clearTimeout(timer);
        }, pageInfo.delayTime);
      }

      return false; // 阻止默认事件（a点击在浏览器显示#)
    }

    function nextCall() {
      var pageIndex = parseInt(target.getAttribute('href').substring(1)); // getAttribute才能返回相对路径
      paginationObj.innerHTML = '';

      pagination({
        id: pageInfo.id,
        pageIndex: pageIndex, // 当前要显示页面，1开始
        pageSize: pageSize, // 每页显示条数
        totalCount: pageInfo.totalCount, // 总数据个数，总页码pageCount = Math.ceil(totalCount/pageSize)
        callBack: callBack,
        aClick: aClick,
        delayTime: delayTime,
      });
    }
  };
}
```

Pasted from <https://bitbucket.org/snippets/wghglory/7j6px/js_pagination>

## pagination css

```css
#pagination {
  line-height: 36px;
  display: flex;
  height: 36px;
  border-radius: 4px;
  background-color: #fff;
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.1);
  justify-content: center;
  align-items: center;
}

#pagination a {
  line-height: 24px;
  height: 24px;
  margin: 0 4px;
  padding: 0 10px;
  border-radius: 2px;
  background: linear-gradient(to bottom, #f0ece6, #e5ddda) no-repeat #d5ccc8;
  box-shadow: 0 1px 0 rgba(111, 89, 79, 0.4);
  color: #5a5a5a;
  text-decoration: none;
}

#pagination a.active {
  color: #fff;
  background-image: none;
  /* remove gradient and use #d5ccc8*/
  box-shadow: inset 0 1px 3px rgba(111, 89, 79, 0.4), 0 1px 0 rgba(111, 89, 79, 0.4);
}
```

Pasted from <https://bitbucket.org/snippets/wghglory/7j6px/js_pagination>

## pagination usage

```javascript
function loadData(pageIndex, pageSize) {
  // click first page, pageIndex = 1, not 0 based
  var messageListHtml = '';
  var pageSize = pageSize || 5;
  var startIndex = (pageIndex - 1) * pageSize; //starting data
  var endIndex = startIndex + pageSize; //ending data
  endIndex = endIndex > data.length ? data.length : endIndex;

  for (var i = startIndex; i < endIndex; i++) {
    messageListHtml +=
      '<li><div><div class="pic"></div><div class="dot"></div><div class="chat"><div class="post" data-id="' +
      data[i].post.id +
      '"><h4><span></span>' +
      data[i].post.username +
      '<time>[' +
      formatDate(data[i].post.time) +
      ']</time></h4><p>' +
      data[i].post.content +
      '</p></div>';

    for (var r in data[i].replies) {
      messageListHtml +=
        '<div class="reply" data-id="' +
        data[i].replies[r].id +
        '"><h4><span></span>' +
        data[i].replies[r].username +
        '<time>[' +
        formatDate(data[i].replies[r].time) +
        ']</time></h4><p>' +
        data[i].replies[r].content +
        '</p></div>';
    }

    messageListHtml += '</div><div></li>';
  }
  messageUl.innerHTML = messageListHtml;
}
```

Pasted from <https://bitbucket.org/snippets/wghglory/7j6px/js_pagination>

## pagination html

```html
<!doctype html>
<html>

<head>
    <meta charset="utf-8">
    <title>pagination demo</title>
    <link rel="stylesheet" href="pagination.css">
    <link rel="stylesheet" href="site.css">
</head>

<body>
    <p>用封装的分页控件</p>
    <p>分页先入场，然后li入场。点击分页，分页先隐藏，li消失，分页入场，li入场</p>
    <section id="message">
        <header>留言回复<span></span></header>
        <ul id="messageList">
            <!-- <li>
                <div>
                    <div class="pic"></div>
                    <div class="dot"></div>
                    <div class="chat">
                        <div class="post">
                            <h4><span></span>You're very busying!<time>[2016-07-18 20:48:22]</time></h4>
                            <p>学习课程</p>
                        </div>
                        <div class="reply">
                            <h4><span></span>管理员回复<time>[2016-07-14 17:57:49]</time></h4>
                            <p>我不受si~~</p>
                        </div>
                        <div class="reply">
                            <h4><span></span>管理员回复2<time>[2016-07-16 18:16:43]</time></h4>
                            <p>this is good</p>
                        </div>
                    </div>
                </div>
            </li> -->
        </ul>
        <footer id="pagination">
            <!-- <a href="javascript:;">首页</a>
            <a href="javascript:;">上一页</a>
            <a href="javascript:;" class="active">1</a>
            <a href="javascript:;">2</a>
            <a href="javascript:;">3</a>
            <a href="javascript:;">4</a>
            <a href="javascript:;">5</a>
            <a href="javascript:;">6</a>
            <a href="javascript:;">下一页</a>
            <a href="javascript:;">末页</a> -->
        </footer>
    </section>
    <script src="data.js"></script>
    <script src="pagination.js"></script>
    <script src="app.js"></script>
    <script>
        pagination({
            id: 'pagination',
            pageIndex: 1, // 当前要显示页面，1开始
            pageSize: 6, // 每页显示条数
            totalCount: data.length, // 总数据个数，总页码pageCount = Math.ceil(totalCount/pageSize)
            callBack: function(currentPageIndex, pageSize, totalPageCount, paginationObj) {
                // alert('当前页:' + currentPageIndex + ',总共页:' + totalPageCount);
                // for (var i = 0; i < paginationObj.children.length; i++) {
                //     paginationObj.children[i].style.opacity = 1;
                // }
                loadData(currentPageIndex, pageSize);
            },
            aClick: function(clickedA) {
                var allA = clickedA.parentNode.children;

                // var siblings = [].slice.call(allA) // convert to array
                //     .filter(function(v) {
                //         return v !== clickedA
                //     }); // remove element itself


                // 点击分页，分页先隐藏，li消失，分页入场，li入场
                var messageUl = document.getElementById('messageList');

                // lis hide
                var lis = messageUl.children;
                for (var i = 0; i < lis.length; i++) {
                    lis[i].style.transition = '.5s';
                    lis[i].style.opacity = 0;
                    lis[i].addEventListener('transitionend', end, false);
                }

                function end() {
                    this.removeEventListener('transitionend', end, false);
                    this.style.display = 'none';
                }

                // ul height back to 0 and css transition of messageUl is .6s
                messageUl.style.height = '0';

                // pagination a hide
                for (var i = 0; i < allA.length; i++) {
                    allA[i].style.transition = '1s';
                    allA[i].style.opacity = 0;
                }
            },
            delayTime: 1000 //click any link, next call page function wait for x ms
        });
    </script>
</body>

</html>
```

Pasted from <https://bitbucket.org/snippets/wghglory/7j6px/js_pagination>

## pagination test data

```javascript
var data = [
  {
    post: {
      id: 5,
      username: 'different user name',
      title: 'this will be title',
      time: new Date('July 17, 2016 14:10:05'),
      content: 'First DATA...',
    },
    replies: [],
  },
  {
    post: {
      id: 1,
      username: 'different user name',
      title: 'this will be title',
      time: new Date('July 17, 2016 14:10:05'),
      content: '学习课程，学习js',
    },
    replies: [
      {
        id: 2,
        username: 'different user name',
        title: 'this will be title',
        time: new Date('July 17, 2016 14:10:05'),
        content: '好好学习，天天做出好东西',
      },
      {
        id: 1,
        username: 'different user name',
        title: 'this will be title',
        time: new Date('July 17, 2016 14:10:05'),
        content: '又回复',
      },
    ],
  },
];
```

Pasted from <https://bitbucket.org/snippets/wghglory/7j6px/js_pagination>
