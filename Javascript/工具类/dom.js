/**
 * get index of obj node in the same level. e.g. section>div*4. 2nd div index should be 1
 * @method getIndex
 * @param  {[type]} obj [description]
 * @return {[type]}     [description]
 */
function getIndex(obj) {
  // var siblingsAndSelf = getChildren(obj.parentNode);
  var siblingsAndSelf = obj.parentNode.children;
  for (var i = 0; i < siblingsAndSelf.length; i++) {
    if (obj == siblingsAndSelf[i]) {
      return i;
    }
  }
}

function getPrevAll(obj, isIncludeSelf) {
  var children = getChildren(obj.parentNode);
  for (var i = 0; i < children.length; i++) {
    if (obj == children[i]) {
      var removed = isIncludeSelf ? children.splice(i + 1) : children.splice(i);
    }
  }
  return children;
}

function getNextAll(obj, isIncludeSelf) {
  var children = getChildren(obj.parentNode);
  for (var i = 0; i < children.length; i++) {
    if (obj == children[i]) {
      var removed = isIncludeSelf ? children.splice(0, i) : children.splice(0, i + 1);
    }
  }
  return children;
}

function getSiblings(obj) {
  var children = getChildren(obj.parentNode);
  for (var i = 0; i < children.length; i++) {
    if (obj == children[i]) {
      var self = children.splice(i, 1);
    }
  }
  return children;
}

function getChildren(currentNode) {
  // var childrenElem = currentNode.childNodes;
  // var children = [];
  // for (var i = 0; i < childrenElem.length; i++) {
  //     if (childrenElem[i].nodeName == "#text" && !/\s/.test(childrenElem.nodeValue)) {
  //         currentNode.removeChild(childrenElem[i]);
  //     } else {
  //         child.push(childrenElem[i]);
  //     }
  // }
  // return children;
  return currentNode.children;
}

function removeNode(obj) {
  obj.parentNode.removeChild(obj);
}

function indexInArray(arr, element) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] == element) {
      return i;
    }
  }
  return -1;
}

/**
* insert obj after refObj
* @method insertAfter
* @param  {[type]}    obj    [description]
* @param  {[type]}    refObj [description]
* @return {[type]}           [description]
*/
function insertAfter(obj, refObj) {
  var parent = refObj.parentNode;
  var nextElement = refObj.nextElementSibling;
  if (nextElement) {
    return parent.insertBefore(obj, nextElement);
  } else {
    return parent.appendChild(obj);
  }
}

/*
*old functions, now browser has better methods
function addClass(obj, classname) { //添加class样式
  obj.classList.add(classname);

  // var aClass = obj.className.split(' ');
  // if (!obj.className) {
  //     obj.className = classname;
  //     return;
  // }
  // for (var i = 0; i < aClass.length; i++) {
  //     if (aClass[i] === classname) return;
  // }
  // obj.className += ' ' + classname;

  // if (obj.className == '') {
  //     obj.className = classname;
  // } else {
  //     var arrClassName = obj.className.split(' ');
  //     var index = indexInArray(arrClassName, classname);
  //     if (index == -1) { // 要添加的class不存在时才添加
  //         obj.className += ' ' + classname;
  //     }
  // }
}


function removeClass(obj, classname) { //移除class样式
  obj.classList.remove(classname);

  // var aClass = obj.className.split(' ');
  // if (!obj.className) return;
  // for (var i = 0; i < aClass.length; i++) {
  //     if (aClass[i] === classname) {
  //         aClass.splice(i, 1);
  //         obj.className = aClass.join(' ');
  //         break;
  //     }
  // }

  // if (obj.className != '') {
  //     var arrClassName = obj.className.split(' ');
  //     var index = indexInArray(arrClassName, classname);
  //     if (index != -1) { // 存在时才删除
  //         arrClassName.splice(index, 1);
  //         obj.className = arrClassName.join(' ');
  //     }
  // }
}

function hasClass(obj, classname) { //添加class样式
  obj.classList.contains(classname);
  // var aClass = obj.className.split(' ');
  // if (!obj.className) {
  //     return false;
  // }
  // for (var i = 0; i < aClass.length; i++) {
  //     if (aClass[i] === classname) return true;
  // }
  // return false;
}

function getByClass(parent, tagname, classname) { //通过Class名字获取元素
  var aEls = parent.getElementsByTagName(tagname);
  return aEls.querySelectorAll(classname);
  // var arr = [];
  // var re = new RegExp('(^|\\s)' + classname + '(\\s|$)');
  // for (var i = 0; i < aEls.length; i++) {
  //     if (re.test(aEls[i].className)) {
  //         arr.push(aEls[i]);
  //     }
  // }
  // return arr;
}
function getByClass(parent, classname) {
  var eles = parent.getElementsByTagName('*');
  var result = [];

  var reg = new RegExp('\\b' + classname + '\\b');

  for (var i = eles.length - 1; i >= 0; i--) {
      //if (eles[i].className == classname) {
      //if (eles[i].className.search(classname) != -1) {    //也不行，比如有个class叫largebox。
      if (reg.test(eles[i].className)) { //单词边界\b
          result.push(eles[i]);
      }
  }
  return result;
}


//not useful
function getByParent(obj, tagname, classname) { // 通过父级的className以及tagName获取元素
  var re = new RegExp('(^|\\s)' + classname + '(\\s|$)');
  while (obj.parentNode) {
      if (obj.parentNode.tagName != tagname) {
          obj = obj.parentNode;
      } else {
          if (re.test(obj.parentNode.className)) {
              return obj.parentNode;
          } else {
              obj = obj.parentNode;
          }
      }

  }
}
*/
