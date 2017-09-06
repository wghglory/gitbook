Using postman is a good option.

```bash
POST: $ curl -X POST -H "Content-Type: application/json" -d '{"firstName":"First", "lastName":"Last","email":"user@example.com","username":"username","password":"password"}' localhost:3000/users

PUT: $ curl -X PUT -H "Content-Type: application/json" -d '{"lastName": "Updated"}' localhost:3000/users/[id]

DELETE: $ curl -X DELETE localhost:3000/users/[id]
```