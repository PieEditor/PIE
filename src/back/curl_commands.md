# curl commands

## User

### Sign-in

	curl -X POST -v -d '{"login":"kikoo", "passwd":"kiki"}' http://127.0.0.1:8080/users/signin

### Sign-up

	curl -X POST -v -d '{"login":"kikoo", "passwd":"kiki", "email":"kikoo@kiki.fr", "imgUrl":"kikoo.kiki.fr"}' http://127.0.0.1:8080/users/signup

### Get single user

	curl -X GET 'http://127.0.0.1:8080/users/kikoo' -v -b "token=token"

### Get authenticated user

	curl -X GET 'http://127.0.0.1:8080/user' -v -b "token=token"

### Sign-out

	curl -X POST -v http://127.0.0.1:8080/user/signout -b "token=token"

### Delete

	curl -X DELETE -v http://127.0.0.1:8080/user -b "token=token"

### Get the login associated to the token

	curl -X GET 'http://127.0.0.1:8080/token' -v -b "token=token"

## Document

### Create a single document

	curl -X POST -v -d '{"owner":"foo", "content":"kikoo"}' http://127.0.0.1:8080/documents -b "token=token"

### Get a single document

	curl -X GET 'http://127.0.0.1:8080/documents/id' -v -b "token=token"

### Update a document

	curl -X PUT -v -d '{"_id":"id","_rev":"1-bb818c70d058e6dfeb9e3ffe84494307","owner":"foo","content":"kikooooooooooooooooooooooooooooooooo"}' 'http://127.0.0.1:8080/documents/13129a24355ecea3b349a05a6a000cfb' -b "token=token"

### Delete a document

	curl -X DELETE 'http://127.0.0.1:8080/documents/13129a24355ecea3b349a05a6a001ec3' -v -b "token=token"

### List your documents

	curl -X GET 'http://127.0.0.1:8080/documents' -v -b "token=token"

### List user documents

	curl -X GET 'http://127.0.0.1:8080/users/kikoo/documents' -v -b "token=token"

### Get a single document

	curl -X GET 'http://127.0.0.1:8080/documents/id' -v -b "token=token"
