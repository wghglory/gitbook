function msgAfterTimeout(msg, who, timeout) {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(`${msg} Hello ${who}!`), timeout);
  });
}
msgAfterTimeout('', 'Foo', 100).then((msg) => msgAfterTimeout(msg, 'Bar', 200)).then((msg) => {
  console.log(`done after 300ms:${msg}`);
});

// done after 300ms: Hello Foo! Hello Bar!

// ---Promise.all---

function fetchAsync(url, timeout, onData, onError) {
  // ...
}

let fetchPromised = (url, timeout) => {
  return new Promise((resolve, reject) => {
    fetchAsync(url, timeout, resolve, reject);
  });
};
Promise.all([
  fetchPromised('http://backend/foo.txt', 500),
  fetchPromised('http://backend/bar.txt', 500),
  fetchPromised('http://backend/baz.txt', 500)
]).then(
  (data) => {
    let [ foo, bar, baz ] = data;
    console.log(`success: foo=${foo} bar=${bar} baz=${baz}`);
  },
  (err) => {
    console.log(`error: ${err}`);
  }
);
