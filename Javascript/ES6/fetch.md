# Fetch API

- Modern networking api
- built on promises
- a Living standard
- **Available on window and worker**

## get request

```javascript
fetch(url)
  .then((res) => {
    if (res.ok) {
      return res;
    }

    throw new Error('error');
  })
  // .then(res => res.text())
  // .then(res => res.json())

  .then((res) => {
    console.log(res.type); // "cors"
    for (const [a, b] of res.headers.entries()) {
      console.log(`${a}: ${b}`);
    }
    return res;
  })
  .then((res) => console.dir(res) || res)
  .catch(console.error);
```

## post request

```javascript
const data = new FormData();
data.append('foo', 'bar');
data.append('name', 'derek');

fetch(url, {
  method: 'POST',
  body: data,
})
  .then((res) => {
    if (res.ok) {
      return res;
    }

    throw new Error('error');
  })
  .then((res) => res.json())
  .then((res) => console.dir(res) || res)
  .catch(console.error);
```

```javascript
var p = fetch(url, {
  method: 'POST',
  body: data,
}).then((res) => {
  if (res.ok) {
    return res;
  }

  throw new Error('error');
});

p.then((res) => res.clone())
  .then((res) => res.blob())
  .then((res) => console.log(res) || res);

p.then((res) => res.clone())
  .then((res) => res.json())
  .then((res) => console.log(res.form) || res);
```

## Main parts

Request:

- Url
- Method
- Headers
- Body
- Context
- Referrer
- ReferrerPolicy
- Mode
- Credentials
- Redirect
- Integrity
- Cache

Response:

- Url
- Headers
- Body
- Status
- StatusText
- Ok
- Type
- Redirected
- UseFinalUrl

Headers:

- append()
- set()
- delete()
- get()
- getAll()
- has()
- entries()
- keys()
- values()

Body:

- arrayBuffer()
- blob()
- text()
- Response.clone()
- Request.clone()
- json()
- formData()
- bodyUsed
