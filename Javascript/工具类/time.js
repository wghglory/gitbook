/**
 * 其他参考 Javascript/declaretively_timeHelper.md and moment.js
 */
export function formatDate(date) {
  let day = date.getDate();
  if (day < 10) {
    day = '0' + day;
  }
  let month = date.getMonth() + 1;
  if (month < 10) {
    month = '0' + month;
  }
  let year = date.getFullYear();
  return year + '-' + month + '-' + day + ' ' + [date.getHours(), date.getMinutes(), date.getSeconds()].join(':');
}
