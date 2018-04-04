# 前端数据 mock

## Json Server 创建本地 json 文件作为数据库

* <https://github.com/typicode/json-server>
* <https://coligo.io/create-mock-rest-api-with-json-server>

## Faker.js 产生数据

* [Faker](https://github.com/marak/Faker.js)
* [graphql-js](https://github.com/graphql/graphql-js)

## 具体步骤

### 1. Declare Schema

[Test schema at http://json-schema-faker.js.org](http://json-schema-faker.js.org)

install packages: `npm i json-schema-faker json-server --save-dev`

```javascript
// create buildScripts/mockDataSchema.js
var schema = {
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
        required: ['id', 'type', 'lastname', 'email'],
      },
    },
  },
  required: ['users'],
};

module.exports = schema;
```

### 2. Generate Random Data

```javascript
// create buildScripts/generateMockData.js

/* This script generates mock data for local development.
   This way you don't have to point to an actual API,
   but you can enjoy realistic, but randomized data,
   and rapid page loads due to local, static data.
 */

var jsf = require('json-schema-faker');
var mockDataSchema = require('./mockDataSchema');
var fs = require('fs');

var json = JSON.stringify(jsf(mockDataSchema));

fs.writeFile('./src/api/db.json', json, function(err) {
  if (err) {
    return console.log(err);
  } else {
    console.log('Mock data generated.');
  }
});
```

in package.json

```bash
"generate-mock-data": "node buildScripts/generateMockData"
```

### 3.  Serve Random Data

package.json: if `prestart-mockapi` is used, data will be regenerated everytime `npm run start-mockapi`.

```bash
"generate-mock-data": "node buildScripts/generateMockData",
"prestart-mockapi": "npm run generate-mock-data",
"start-mockapi": "json-server --watch src/api/db.json --port 3001"
```

run the mock server: `npm run start-mockapi`
