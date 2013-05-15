var couchWrapper = require('./couch-wrapper')

var http = require('http');
var crypto = require('crypto');

var users = [];
users["token"] = "kikoo";
var server = http.createServer().listen(8080, '127.0.0.1');

server.on('request', function(request, response) {
	var body = "";
	request.on('data', function(chunk) {
		body += chunk;
	});

	request.on('end', function() {
		function badRequest(body) {
			response.writeHead(400, "Bad Request");
			if (body)
				response.write(body);
			response.end();
		}

		/* we provide a public API */
		response.setHeader("Access-Control-Allow-Origin", "*");

		/* Parse request */

		parsedUrl = require('url').parse(request.url, true);

		/* Parse request's parameters */		
		var params;
		try {
			if ((request.method == "POST" || request.method == "PUT" || request.method == "DELETE"))
				if (body)
					params = JSON.parse(body);
				else
					params = {};
			else if (request.method == "GET")
				params = parsedUrl.query;
			else
				params = {};
		}
		catch (error) {
			badRequest("Unable to parse parameters.");
		}

		/* CORS handling
		 * Thanks to nilcolor.
		 * https://gist.github.com/nilcolor/816580 
		 */

		if (request.method === 'OPTIONS') {
			var headers = {};
			// IE8 does not allow domains to be specified, just the *
			// headers["Access-Control-Allow-Origin"] = req.headers.origin;
			// Already done
			// headers["Access-Control-Allow-Origin"] = "*";
			headers["Access-Control-Allow-Methods"] = "POST, GET, PUT, DELETE, OPTIONS";
			headers["Access-Control-Allow-Credentials"] = false;
			headers["Access-Control-Max-Age"] = '86400'; // 24 hours
			headers["Access-Control-Allow-Headers"] = "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept";
			response.writeHead(200, headers);
			response.end();
		}		

		/* USER */

		// Sign in
		else if (parsedUrl.pathname == "/users/signin" && request.method == "POST") {
			if (!params.login || !params.passwd) {
				badRequest("Login or password is missing.");
			}

			else {
				var shasum = crypto.createHash('sha512').update(params.passwd, 'utf8').digest('hex');
				couchWrapper.userLogin(params.login, function(user_data) {
					if (user_data && user_data.shasum && shasum == user_data.shasum) {
						users[user_data.uuid] = params.login;
						response.writeHead(200, "OK");
						response.write(JSON.stringify({token: user_data.uuid}));
					}
					else {
						response.writeHead(403, "Forbidden");
					}
					response.end();
				});
			}
		}

		// Sign out
		else if (parsedUrl.pathname == "/user/signout" && request.method == "POST") {
			if (params.token && users[params.token]) {
				delete users[params.token];
				response.writeHead(204, "No Content");				
			}
			else {
				response.writeHead(401, "Unauthorized");
			}
			response.end();
		}

		// Sign up
		else if (parsedUrl.pathname == "/users/signup" && request.method == "POST") {
			if (!params.user || (!params.user.login || !params.user.passwd || !params.user.email || !params.user.imgUrl)) {
				badRequest("Parameters are missing.");
			}
			else {
				// generate shasum...
				var shasum = crypto.createHash('sha512').update(params.user.passwd, 'utf8').digest('hex');
				params.user.shasum = shasum;
				// ... then delete the password
				delete params.user.passwd;
				couchWrapper.userCreate(params.user, function(uuid) {
					if (uuid) {
						users[uuid] = params.user.login
						response.writeHead(201, "Created");
						response.write(JSON.stringify({token: uuid}));
					}
					else {
						response.writeHead(403, "Forbidden");
					}
					response.end();
				});
			}
		}

		// Get a single user or get the authenticated user
		else if ((parsedUrl.pathname.indexOf('/users/') == 0 || parsedUrl.pathname == '/user') && request.method == 'GET') {
			// determine the user
			var login = request.url.indexOf('/users/') == 0 ? request.url.substr('/users/'.length) : users[params.token];
			if (params.token && users[params.token]) {
				couchWrapper.userGet(login, function(user_object) {
					if (user_object) {
						couchWrapper.docByUser(login, function(docs_list) {
							if (docs_list !== null) {
								user_object.documents = docs_list;
								response.writeHead(200, "OK");
								response.write(JSON.stringify({user: user_object}));
							}
							else {
								response.writeHead(403, "Forbidden");
							}
							response.end();
						});
					}
					else {
						response.writeHead(403, "Forbidden");
						response.end();
					}					
				});
			}
			else {
				response.writeHead(401, "Unauthorized");
				response.end();
			}
		}

		// Delete the authenticated user
		else if (parsedUrl.pathname == "/user" && request.method == "DELETE") {
			if (params.token && users[params.token]) {
				couchWrapper.userDelete(users[params.token], function(success) {
					if (success) {
						response.writeHead(204, "No Content");
					}
					else {
						response.writeHead(403, "Forbidden");
					}
					response.end();
				});
				delete users[params.token];		
			}
			else {
				response.writeHead(401, "Unauthorized");
				response.end();
			}
		}

		// Get the login associated to a token
		else if (parsedUrl.pathname.indexOf("/tokens/") == 0 && request.method == "GET") {
			if (parsedUrl.pathname == "/tokens/") {
				badRequest("Parameters are missing.");
			}
			else {
				if (users[parsedUrl.pathname.substr("/tokens/".length)]) {
					response.writeHead(200, "OK");
					response.write(JSON.stringify({login: users[parsedUrl.pathname.substr("/tokens/".length)]}));
				}
				else {
					response.writeHead(404, "Not Found");
				}
				response.end();
			}
		}

		/* Document */

		// Create a single document
		else if (parsedUrl.pathname == "/documents" && request.method == "POST") {
			if (params.token && users[params.token]) {
				couchWrapper.docAdd(params.document, function(id) {
					if (id) {
						response.writeHead(201, "Created");
						response.write(JSON.stringify({id: id}));
					}
					else {
						response.writeHead(403, "Forbidden");
					}
					response.end();
				});
			}
			else {
				response.writeHead(401, "Unauthorized");
				response.end();
			}
		}

		// Update a document
		else if (request.url.indexOf("/documents/") == 0 && request.method == "PUT") {
			if (params.token && users[params.token]) {
				couchWrapper.docUpdate(params.document, function(success) {
					if (success) {
						response.writeHead(204, "No Content");
					}
					else {
						response.writeHead(403, "Forbidden");
					}
					response.end();
				});
			}
			else {
				response.writeHead(401, "Unauthorized");
				response.end();
			}

		}

		// Delete a document
		else if (request.url.indexOf("/documents/") == 0 && request.method == "DELETE") {
			var doc_id = parseInt(request.url.substr('/documents/'.length));
			if (params.token && users[params.token]) {
				couchWrapper.docDelete(doc_id, function(success) {
					if (success) {
						response.writeHead(204, "No Content");
					}
					else {
						response.writeHead(403, "Forbidden");
					}
					response.end();
				});
			}
			else {
				response.writeHead(401, "Unauthorized");
				response.end();
			}
		}

		// List your documents or user documents
		else if ((request.url == "/documents" || request.url.indexOf("/users/") == 0 && request.url.indexOf("/documents") == request.url.length - "/documents".length) && request.method == "GET") {
			if (params.token && users[params.token]) {
				var user = request.url == "/documents" ? users[params.token] : request.url.substr('/users'.length, request.url.indexOf('/documents') - 1);
				if (user) {
					couchWrapper.docByUser(users[params.token], function(doc_ids) {
						if (doc_ids) {
							response.writeHead(200, "OK");
							response.write(JSON.stringify({ids: doc_ids}));
						}
						else {
							response.writeHead(403, "Forbidden");
						}
						response.end();
					});
				}
				else {
					badRequest("Parameters are missing.");
				}
			}
			else {
				response.writeHead(401, "Unauthorized");
				response.end();
			}
		}

		//Get a single document
		else if (parsedUrl.pathname.indexOf("/documents/") == 0 && request.method == "GET") {
			if (params.token && users[params.token]) {
				couchWrapper.docGet(parsedUrl.pathname.substr('/documents/'.length), function(doc) {
					if (doc) {
						response.writeHead(200, "OK");
						response.write(JSON.stringify({document: doc}));
					}
					else {
						response.writeHead(403, "Forbidden");
					}
					response.end();
				});
			}
			else {
				response.writeHead(401, "Unauthorized");
				response.end();
			}
		}

		// Default
		else {
			badRequest("The request does not match with an API function.");
		}
	});
});
