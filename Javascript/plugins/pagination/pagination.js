// 求得页码总数，需要Math.ceil(totalCount/pageSize)

/*使用方法：
window.onload = function() {
    pagination({
        id: 'pagination',
        pageIndex: 1, // 当前要显示页面，1开始
        pageSize: 4, // 每页显示条数
        totalCount: data.length, // 总数据个数， 总页码pageCount = Math.ceil(totalCount/pageSize)
        callBack: function(currentPageIndex, pageSize, totalPageCount) {  //分页标签加载完毕后执行
            // alert('当前页:' + currentPageIndex + ',总共页:' + totalPageCount);
            loadData(currentPageIndex, pageSize);
        }，
        aClick: function(targetA) {   //点击某个a执行
            targetA.style.opacity = 0.1;
        },
        delayTime: 500 //点击某个a后延迟500ms，再重新call page()
    });
};
*/

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
        oA.innerHTML = i; //oA.innerHTML = '[' + i + ']';
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
          oA.innerHTML = i; //oA.innerHTML = '[' + i + ']';
          oA.className = 'active';
        } else {
          oA.innerHTML = i;
        }
      } else if (pageCount - pageIndex == 0 || pageCount - pageIndex == 1) {
        oA.href = '#' + (pageCount - 5 + i);
        if (pageCount - pageIndex == 0 && i == 5) {
          oA.innerHTML = pageCount - 5 + i; //oA.innerHTML = '[' + (pageCount - 5 + i) + ']';
          oA.className = 'active';
        } else if (pageCount - pageIndex == 1 && i == 4) {
          oA.innerHTML = pageCount - 5 + i; //oA.innerHTML = '[' + (pageCount - 5 + i) + ']';
          oA.className = 'active';
        } else {
          oA.innerHTML = pageCount - 5 + i;
        }
      } else {
        oA.href = '#' + (pageIndex - 3 + i);
        if (i == 3) {
          oA.innerHTML = pageIndex - 3 + i; //oA.innerHTML = '[' + (pageIndex - 3 + i) + ']';
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

  /* 添加点击事件（传统）
    var aA = paginationObj.getElementsByTagName('a');

    for (var i = 0; i < aA.length; i++) {
        aA[i].onclick = function() {

            var pageIndex = parseInt(this.getAttribute('href').substring(1)); //getAttribute才能返回相对路径
            paginationObj.innerHTML = '';

            page({
                id: pageInfo.id,
                pageIndex: pageIndex,
                pageCount: pageCount,
                callBack: callBack
            });

            return false; //阻止默认事件（a点击在浏览器显示#)
        };
    }
    */

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

      return false; //阻止默认事件（a点击在浏览器显示#)
    }

    function nextCall() {
      var pageIndex = parseInt(target.getAttribute('href').substring(1)); //getAttribute才能返回相对路径
      paginationObj.innerHTML = '';

      pagination({
        id: pageInfo.id,
        pageIndex: pageIndex, // 当前要显示页面，1开始
        pageSize: pageSize, // 每页显示条数
        totalCount: pageInfo.totalCount, // 总数据个数， 总页码pageCount = Math.ceil(totalCount/pageSize)
        callBack: callBack,
        aClick: aClick,
        delayTime: delayTime,
      });
    }
  };
}
