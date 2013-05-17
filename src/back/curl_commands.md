# curl commands

## User

### Sign-in

	curl -X POST -v -d '{"login":"kikoo", "passwd":"kiki"}' http://127.0.0.1:8080/users/signin

### Sign-up

	curl -X POST -v -d '{"login":"kikoo", "passwd":"kiki", "email":"kikoo@kiki.fr", "imgUrl":"kikoo.kiki.fr"}' http://127.0.0.1:8080/users/signup

### Get single user

	curl -X GET 'http://127.0.0.1:8080/users/kikoo?token=token' -v

### Get authenticated user

	curl -X GET 'http://127.0.0.1:8080/user?token=token' -v

### Sign-out

	curl -X POST -v http://127.0.0.1:8080/user/signout?token=token

### Delete

	curl -X DELETE -v http://127.0.0.1:8080/user?token=token

### Get the login associated to a token

	curl -X GET 'http://127.0.0.1:8080/tokens/token' -v

## Document

### Create a single document

	curl -X POST -v -d '{"owner":"foo", "content":"kikoo"}' http://127.0.0.1:8080/documents?token=token

### Get a single document

	curl -X GET 'http://127.0.0.1:8080/documents/13129a24355ecea3b349a05a6a000cfb?token=token' -v

### Update a document

	curl -X PUT -v -d '{"_id":"13129a24355ecea3b349a05a6a000cfb","_rev":"1-bb818c70d058e6dfeb9e3ffe84494307","owner":"foo","content":"kikooooooooooooooooooooooooooooooooo"}' 'http://127.0.0.1:8080/documents/13129a24355ecea3b349a05a6a000cfb?token=token'

### Delete a document

	curl -X DELETE 'http://127.0.0.1:8080/documents/13129a24355ecea3b349a05a6a001ec3?token=token' -v

### List your documents

	curl -X GET 'http://127.0.0.1:8080/documents?token=token' -v

### List user documents

	curl -X GET 'http://127.0.0.1:8080/users/kikoo/documents?token=token' -v

### Get a single document

	curl -X GET 'http://127.0.0.1:8080/documents/13129a24355ecea3b349a05a6a00295c?token=token' -v
