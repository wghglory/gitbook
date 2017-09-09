export function getPosition(obj) {
  let top = 0;
  let left = 0;
  while (obj) {
    top += obj.offsetTop;
    left += obj.offsetLeft;
    obj = obj.offsetParent;
  }
  return { top, left };
}
