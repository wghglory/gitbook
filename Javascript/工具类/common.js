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
 * 忽略大小写后的安字符串名字排序。在 node 读取文件夹中文件时，排序忽略英文大小写
 * @param {array} arr
 */
export function sortByAlphaIgnoreCase(arr) {
  arr.sort((a, b) => {
    return a.localeCompare(b, undefined /* Ignore language */, {
      sensitivity: 'base'
    });
  });
}

/**
 * 深拷贝 deepClone，也可以用 lodash 里面的
 */
function deepClone(obj) {
  let temp = Array.isArray(obj) ? [] : {};
  for (let key in obj) {
    //是否有嵌套对象
    temp[key] = typeof obj[key] === 'object' ? deepClone(obj[key]) : obj[key];
  }
  return temp;
}
