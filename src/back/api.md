# API

## General

### Parameters

Most of the parameters are specified as a segment in the path.

For those which aren't, they can be encoded in JSON.

#### Authentication

Same rule applies for authentication (if required), the access token is considered as a parameter.
A 401 "Unauthorized" response is sended back if the access token is not provided.

### Error Codes

Server sends back 2xx responses if request has been handled successfully.
Otherwise, it sends back 4xx in case of failure - 403 "Forbidden" most of the time.

### Responses

Responses are sended back encoded in JSON.

## User

### Sign in

Sign in a user.

	POST /users/signin

#### Input
 
 * user **string**
 * pass **string**

#### Response

200 "OK" if user and pass match.

 * token **string** : this token should be stored by the client for future use as it has to be passed in for requests needing a properly authenticated user

### Sign out

Invalidate the token.

	POST /user/signout

#### Response

204 "No Content" if the access token is valid.

### Sign up

Sign up a new user.

	POST /users/signup

#### Input

 * user **{}User**

#### Response

201 "Created" if user doesn't exist.

 * token **string**

### Get a single user

	GET /users/:user

#### Response

200 "OK" if user if a valid login is provided.

 * user **{}User**

### Get the authenticated user

	GET /user

#### Response

200 "OK" if the user is authenticated.

 * user **{}User**

### Delete your account

Delete the authenticated user's account.

	DELETE /user

#### Response

204 "No Content".

## Document

### Create a single document

Create a new document of which the owner is the authenticated user.

	POST /documents

#### Input

 * document **{}Document**

#### Response

201 "Created"

 * id **integer** : the id of the new document

### Update a document

Update the document of which the id is given.

Note : Patching a document is not supported yet. Please replace the entire document.

	PUT /documents/:id

#### Input

 * document **{}Document**

#### Response

204 "No Content".

### Delete a document

	DELETE /documents/:id

#### Response

204 "No Content".

### List your documents

List documents for the authenticated users, or, if called anonymously, return all public documents.

	GET /documents

#### Response

200 "OK"

 * ids **[]integer**

### List user documents

List documents for the specified user.

	GET /users/:user/documents 

#### Response

200 "OK"

 * ids **[]integer**

### Get a single document

	GET /documents/:id

### Response

200 "OK".

 * document **{}Document**