# API

## General

### Parameters

Most of the parameters are specified as a segment in the path.

For those which aren't, they can be passed in the HTTP query string (eg &parameter=value) for GET requests, or encoded in JSON for POST requests.

#### Authentication

Same rule applies for authentication (if required), the access token is considered as a parameter.

### Responses

Responses are sended back encoded in JSON.

## Users

### Sign in

Sign in a user.

POST /users/signin

#### Input
 
 * user **string**
 * pass **string*

#### Response

 * token **string** : this token should be stored by the client for future use as it has to be passed in for requests needing a properly authenticated user

### Sign out

Invalidate the token.

POST /user/signout

### Sign up

Sign up a new user.

POST /users/signup

#### Input

 * login **string**
 * pass **string*
 * e-mail **string**

#### Response

 * token **string**

### Delete your account

Delete the authenicated user's account.

DELETE /user

## Document

### Create a single document

Created a new document of which the owner is the authenticated user.

POST /documents

#### Input

 * content **{}Document**

#### Response

 * id **integer** : the id of the new document

### Update a document

Update the document of which the id is given.

Note : Patching a document is not supported yet. Please replace the entire document.

PUT /documents/:id

#### Input

 * content **{}Document**

### Delete a document

DELETE /documents/:id

### List your documents

List documents for the authenticated users, or, if called anonymously, return all public documents.

GET /documents

#### Response

 * ids **[]integer**

### List user documents

List documents for the specified user.

GET /users/:user/documents 

#### Response

 * ids **[]integer**

### Get a single document

GET /documents/:id

### Response

 * **{}Document**

## Discussion

### Add a discussion

Add a discussion related to a document.

POST /documents/:id/discussions

### List document discussions

List discussions related to a document.

GET /documents/:id/discussions

#### Response

 * ids **[]integer**

#### Response

 * id **integer** : the id of the new discussion

### Update a discussion

Update the discussion of which the id is given.

Patching a discussion is not supported yet. Please replace the entire discussion.

PUT /discussions/:id

### Delete a discussion

DELETE /discussions/:id
