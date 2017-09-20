/**
 * usage: 
 *  query string: ?foo=lorem&bar=&baz
    var foo = getParameterByName('foo'); // "lorem"
    var bar = getParameterByName('bar'); // "" (present with empty value)
    var baz = getParameterByName('baz'); // "" (present with no value)
    var qux = getParameterByName('qux'); // null (absent)
  Note: If a parameter is present several times (?foo=lorem&foo=ipsum), 
  you will get the first value (lorem). 

  method 2: `URLSearchParams`
  var searchParams = new URLSearchParams(window.location.search); //?anything=123
  console.log(searchParams.get("anything")) //123

  method 3: 
  import queryString from 'query-string';
  queryString.parse('?playerOneName=wghglory&playerTwoName=ff');  // {playerOneName: "wghglory", playerTwoName: "ff"}
 * @param {string} name 
 * @param {string} url 
 */
function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
