// Meta-Programming
// Hooking into runtime-level object meta-operations.

let target = {
  foo: 'Welcome, foo'
};
let proxy = new Proxy(target, {
  get(receiver, name) {
    return name in receiver ? receiver[name] : `Hello, ${name}`;
  }
});
proxy.foo === 'Welcome, foo';
proxy.world === 'Hello, world';
