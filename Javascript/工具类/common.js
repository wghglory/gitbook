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
