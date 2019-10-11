# curl request

Using postman is a good option.

```bash
# POST:
curl -X POST -H "Content-Type: application/json" -d '{"firstName":"First", "lastName":"Last","email":"user@example.com","username":"username","password":"password"}' localhost:3000/users

# PUT:
curl -X PUT -H "Content-Type: application/json" -d '{"lastName": "Updated"}' localhost:3000/users/[id]

# DELETE:
curl -X DELETE localhost:3000/users/[id]
```

```bash
curl -X GET http://localhost:3000/api/users -H "name=derek"

curl -d "name=derek&password=coolMan&mobile=123123123" -X POST http://localhost:3000/api/users

curl -d "name=derek_new&mobile=234342324" -X PUT http://localhost:3000/api/users/5d91b051a09cf57f3878e2fb

curl -X DELETE http://localhost:3000/api/users/5d91afbe1db60475f5324231
```
