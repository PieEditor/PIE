# API

## General

### Parameters

Most of the parameters are specified as a segment in the path.

For those which aren't, they can be encoded in JSON in the body of the request.

#### Authentication

The access token should be passed using cookie mechanism. 

	Cookie: Cookie:token={token}

A 401 "Unauthorized" response is sended back if the access token is not provided or does not correspond to an authenticated user.

### Error Codes

Server sends back 2xx responses if request has been handled successfully.
Otherwise, it sends back 4xx in case of failure - 403 "Forbidden" most of the time.

### Responses

Responses are sended back encoded in JSON.

### Structures

#### User

	struct User {
		* login **string**
		* passwd **string**
		* email **string**
		* imgUrl **string**
		* documents **[]{id, title}**
	}

## User

### Sign in

Sign in a user.

	POST /users/signin

#### Input
 
 * login **string**
 * passwd **string**

#### Response

200 "OK" if user and pass match.

 * **string** : token - this token should be stored by the client for future use as it has to be passed in for requests needing a properly authenticated user

### Sign out

Invalidate the token.

	POST /user/signout

#### Response

204 "No Content" if the access token is valid.

### Sign up

Sign up a new user. Perform the login in the same time in providing the access token in the response.

	POST /users/signup

#### Input

 * **{}User** : the new user

#### Response

201 "Created" if user doesn't exist.

 * **string** : token - this token should be stored by the client for future use as it has to be passed in for requests needing a properly authenticated user

### Get a single user

	GET /users/{login}

#### Response

200 "OK" if a valid login is provided.

 * **{}User** : user data

### Get the authenticated user

	GET /user

#### Response

200 "OK" if the user is authenticated.

 * **{}User** : user data

### Delete your account

Delete the authenticated user's account.

	DELETE /user

#### Response

204 "No Content".

### Get the login associated to a token

Should help you to check if a given token is valid.

	GET /token

#### Response

200 "OK" if the token is valid.
 * **string** : login

404 "Not Found" otherwise.

## Document

### Create a single document

Create a new document of which the owner is the authenticated user.

	POST /documents

#### Input

 * **{}Document** : the new document

#### Response

201 "Created"

 * **string** : uuid - the uuid of the new document

### Update a document

Update the document of which the id is given.

Note : Patching a document is not supported yet. Please replace the entire document.

	PUT /documents/{id}

#### Input

 * **{}Document** : the updated document

#### Response

200 OK.

### Delete a document

	DELETE /documents/{id}

#### Response

204 "No Content".

### List your documents

List documents for the authenticated users.

	GET /documents

#### Response

200 "OK"

 * **[]{id: **string**, title: **string}**

### List user documents

List documents for the specified user.

	GET /users/{user}/documents 

#### Response

200 "OK"
 * **[]{id: **string**, title: **string}**

### Get a single document

	GET /documents/{id}

### Response

200 "OK".

If the "Accept" header is set to "application/pdf", returns a binary-encoded PDF file.
Returns a JSON object otherwise :

 * **{}Document** : document
