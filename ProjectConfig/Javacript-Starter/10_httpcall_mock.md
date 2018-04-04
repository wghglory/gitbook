# Http call

## Http call approaches

* Node
  * http
  * request (✅)
* Browser
  * XMLHttpRequest
  * jQuery
  * Framework-based (Angular http service)
  * Fetch (✅ polyfill for both regular version or isomorphic-fetch)
* Node & Browser (any below is good)
  * isomorphic-fetch
  * xhr
  * superAgent
  * axios (great)

### Fetch

You can find compatibility for fetch: <https://caniuse.com/#search=fetch>

Fetch cannot be cancelled at this time.

```javascript
const request = new Request('http://your-api.com/user', {
  method: 'GET',
  mode: 'cors',
  headers: new Headers({
    'Content-Type': 'text/html; charset=UTF-8',
  }),
});
fetch(request).then(onSuccess, onError);
```

### Axios

```javascript
axios({
  url: 'http://your-api.com/user',
  method: 'post',
  headers: {
    'Content-type': 'text/html; charset=UTF-8',
  },
  data: 'text',
}).then(onSuccess, onError);
```

## Why centralize API calls

* Configure all calls
* Handle preloader logic
* Handle errors
* Single seam(缝合；接合) for mocking

create src/api/userApi.js

```javascript
import 'whatwg-fetch'; // let browser that hasn't supported fetch work with fetch

const onSuccess = (response) => response.json();
const onError = (error) => console.log(error); //eslint-disable-line no-console
const get = (url) => fetch(url).then(onSuccess, onError);

export const getUsers = () => get('users');
```

So in index.js, I can call this api:

```javascript
import { getUsers } from './api/userApi';
getUsers().then((result) => {});
```

> Only send polyfill to those who need it: `<script src="https://cdn.polyfill.io/v2/polyfill.js?features=fetch"></script>`

## Mock

### Why Mock HTTP?

* Unit Testing
* Instant response
* Keep working when services are down
* Rapid prototyping
* Avoid inter-team bottlenecks
* Work offline

### How to Mock HTTP (also review interview/frontend/Mock.md)

* Nock (mock http calls in unit test)
* Static JSON
* Create development webserver
  * api-mock
  * JSON server
  * JSON Schema faker(random data)
  * Browsersync
  * Express, etc.

### Our Plan for Mocking HTTP

1.  Declare our schema:
    * JSON Schema Faker
1.  Generate Random Data:
    * faker.js
    * chance.js
    * randexp.js
1.  Serve Data via API
    * JSON Server

### Mocking Libraries

[Json Schema](http://json-schema.org) [Json Schema Faker](http://json-schema-faker.js.org/#gist/eb11f16c9edccf040c028dc8bd2b1756)

### Demo

#### 1. create Schema: buildScripts/mockDataSchema.js

```javascript
export const schema = {
  type: 'object',
  properties: {
    users: {
      type: 'array',
      minItems: 3,
      maxItems: 5,
      items: {
        type: 'object',
        properties: {
          id: {
            type: 'number',
            unique: true,
            minimum: 1,
          },
          firstName: {
            type: 'string',
            faker: 'name.firstName',
          },
          lastName: {
            type: 'string',
            faker: 'name.lastName',
          },
          email: {
            type: 'string',
            faker: 'internet.email',
          },
        },
        required: ['id', 'firstName', 'lastName', 'email'],
      },
    },
  },
  required: ['users'],
};
```

#### 2. generate Mock Data: buildScripts/generateMockData.js

```javascript
import jsf from 'json-schema-faker';
import { schema } from './mockDataSchema';
import fs from 'fs';
import chalk from 'chalk';

const json = JSON.stringify(jsf(schema));

fs.writeFile('./src/api/db.json', json, (err) => {
  if (err) {
    return console.log(chalk.red(err));
  } else {
    console.log(chalk.green('Mock data generated.'));
  }
});
```

npm scripts:

```json
"generate-mock-data": "babel-node buildScripts/generateMockData"
```

Run `npm run generate-mock-data` and you should see src/api/db.json.

#### 3. serving mock data via json server

npm scripts:

```json
"start-mockapi": "json-server --watch src/api/db.json --port 3001"
```

`npm run start-mockapi` and access <http://localhost:3001/users>, you should see the data

I prefer to change data every time when restarting the app.

Randomized data is helpful.

* empty lists
* long lists
* long value
* testing
* filtering
* sorting

To change data, follow below:

npm scripts:

```json
"start": "npm-run-all --parallel security-check start:server lint:watch test:watch start-mockapi",
"generate-mock-data": "babel-node buildScripts/generateMockData",
"prestart-mockapi": "npm run generate-mock-data",
"start-mockapi": "json-server --watch src/api/db.json --port 3001"
```

#### Targeting mock api or production api by environment

Assume srcServer.js's `app.get('/users')` is called only for production, while in dev mode, we should hit Json-server port 3001. So when requesting `localhost:3000/`, we know it's development environment and call getUsers api which hosting in port 3001 by Json-server. When request `http://production`, we call production api.

api/baseUrl.js

```javascript
export default function getBaseUrl() {
  const inDevelopment = window.location.hostname === 'localhost';
  return inDevelopment ? 'http://localhost:3001/' : '/'; // first is json-server address, second is production api address
}
```

api/userApi.js

```javascript
import getBaseUrl from './baseUrl';
const baseUrl = getBaseUrl();
const get = (url) => fetch(baseUrl + url).then(onSuccess, onError);
```

#### delete user for Json-server

index.js

```javascript
const deleteLinks = document.querySelectorAll('.deleteUser');
Array.from(deleteLinks, (link) => {
  link.onclick = (e) => {
    const ele = e.target;
    e.preventDefault();
    deleteUser(ele.dataset.id);
    const row = ele.parentNode.parentNode; // tr
    row.parentNode.removeChild(row);
  };
});
```

userApi.js

```javascript
const del = (url) => {
  const request = new Request(baseUrl + url, {
    method: 'delete',
  });
  return fetch(request).then(onSuccess, onError);
};
export const deleteUser = (id) => del(`users/${id}`);
```
