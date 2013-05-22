# curl commands

## User

### Sign-in

	curl -v -X POST -d '{"login":"kikoo", "passwd":"kiki"}' 'http://127.0.0.1:8080/users/signin'

### Sign-up

	curl -v -X POST -d '{"login":"kikoo", "passwd":"kiki", "email":"kikoo@kiki.fr", "imgUrl":"kikoo.kiki.fr"}' 'http://127.0.0.1:8080/users/signup'

### Get single user

	curl -v -X GET -b 'token=token' 'http://127.0.0.1:8080/users/kikoo' -v -b

### Get authenticated user

	curl -v -X GET -b 'token=token' 'http://127.0.0.1:8080/user'

### Sign-out

	curl -v -X POST -b 'token=token' 'http://127.0.0.1:8080/user/signout'

### Delete

	curl -v -X DELETE -b 'token=token' 'http://127.0.0.1:8080/user'

### Get the login associated to the token

	curl -v -X GET -b 'token=token' 'http://127.0.0.1:8080/token'

## Document

### Create a single document

	curl -v -X POST -b 'token=token' -d '{"owner":"foo", "content":"kikoo"}' 'http://127.0.0.1:8080/documents'

### Get a single document

	curl -v -X GET -b 'token=token' 'http://127.0.0.1:8080/documents/id'

### Update a document

	curl -v -X PUT -b 'token=token' -d '{"_id":"id","_rev":"rev","owner":"foo","content":"kikooooooooooooooooooooooooooooooooo"}' 'http://127.0.0.1:8080/documents/id'

### Delete a document

	curl -v -X DELETE -b 'token=token' 'http://127.0.0.1:8080/documents/id'

### List your documents

	curl -v -X GET -b 'token=token' 'http://127.0.0.1:8080/documents'

### List user documents

	curl -v -X GET -b 'token=token' 'http://127.0.0.1:8080/users/kikoo/documents'

### Get a single document

	curl -v -X GET -b 'token=token' 'http://127.0.0.1:8080/documents/id'
