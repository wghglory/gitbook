/**
 * 获取某个 DOM 元素的某个属性
 * @param {*} obj
 * @param {*} attr
 */
export function getStyle(obj, attr) {
  if (attr == 'rotate') {
    return obj.rotate;
  }
  let i = parseFloat(
    obj.currentStyle ? obj.currentStyle[attr] : document.defaultView.getComputedStyle(obj, false)[attr]
  );
  let val = i ? i : 0;
  if (attr == 'opacity') {
    val *= 100;
  }
  return val;
}

/**
 * 编写一个函数实现form的序列化(即将一个表单中的键值序列化为可提交的字符串)
 * <form id="target">
    <select name="age">
        <option value="aaa">aaa</option>
        <option value="bbb" selected>bbb</option>
    </select>
    <select name="friends" multiple>
        <option value="qiu" selected>qiu</option>
        <option value="de">de</option>
        <option value="qing" selected>qing</option>
    </select>
    <input name="name" value="qiudeqing">
    <input type="password" name="password" value="11111">
    <input type="hidden" name="salery" value="3333">
    <textarea name="description">description</textarea>
    <input type="checkbox" name="hobby" checked value="football">Football
    <input type="checkbox" name="hobby" value="basketball">Basketball
    <input type="radio" name="sex" checked value="Female">Female
    <input type="radio" name="sex" value="Male">Male
  </form>

  var form = document.getElementById('target');
  console.log(serializeForm(form));
 * @param {FormElement} form 需要序列化的表单元素
 * @return {string} 表单序列化后的字符串
 */
function serializeForm(form) {
  if (!form || form.nodeName.toUpperCase() !== 'FORM') {
    return;
  }

  var result = [];

  var i, len;
  var field, fieldName, fieldType;

  for (i = 0, len = form.length; i < len; ++i) {
    field = form.elements[i];
    fieldName = field.name;
    fieldType = field.type;

    if (field.disabled || !fieldName) {
      continue;
    } // enf if

    switch (fieldType) {
      case 'text':
      case 'password':
      case 'hidden':
      case 'textarea':
        result.push(encodeURIComponent(fieldName) + '=' + encodeURIComponent(field.value));
        break;

      case 'radio':
      case 'checkbox':
        if (field.checked) {
          result.push(encodeURIComponent(fieldName) + '=' + encodeURIComponent(field.value));
        }
        break;

      case 'select-one':
      case 'select-multiple':
        for (var j = 0, jLen = field.options.length; j < jLen; ++j) {
          if (field.options[j].selected) {
            result.push(
              encodeURIComponent(fieldName) + '=' + encodeURIComponent(field.options[j].value || field.options[j].text)
            );
          }
        } // end for
        break;

      case 'file':
      case 'submit':
        break; // 是否处理？

      default:
        break;
    } // end switch
  } // end for

  return result.join('&');
}

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
