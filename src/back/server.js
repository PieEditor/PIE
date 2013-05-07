var couchWrapper = require('./couch_wrapper')

var http = require('http');
var crypto = require('crypto');

var users = [];
var server = http.createServer().listen(8080, '127.0.0.1');

server.on('request', function(request, response) {
	var body = "";
	request.on('data', function(chunk) {
		body += chunk;
	});

	request.on('end', function() {
		var params = JSON.parse(body);

		/* USER */

		// Sign in
		if (request.url == "/users/signin" && request.method == "POST") {
			var shasum = crypto.createHash('sha512').update(params.pass, 'utf8').digest('hex');
			couchWrapper.userLogin(params.user, function(user_data) {
				if (shasum == user_data.shasum) {
					users[user_data.uuid] = params.user;
					response.writeHead(200, "OK");
					response.write(JSON.stringify({token: user_data.uuid}));
				}
				else {
					response.writeHead(403, "Forbidden");
				}
				response.end();
			})
		}

		// Sign out
		else if (request.url == "/user/signout" && request.method == "POST") {
			if (users[params.token]) {
				delete users[params.token];
				response.writeHead(205, "Reset Content");				
			}
			else {
				response.writeHead(401, "Unauthorized");
			}
			response.end();
		}

		// Sign up
		else if (request.url == "/users/signup" && request.method == "POST") {
			// generate shasum...
			var shasum = crypto.createHash('sha512').update(params.user.pass, 'utf8').digest('hex');
			params.user.shasum = shasum;
			// ... then delete the password
			delete params.user.pass;
			/*couchWrapper.userAdd(params.user, function(uuid) {
				if (uuid) {
					users[uuid] = params.user.username
					response.writeHead(201, "Created");
					response.write(JSON.stringify({token: uuid}));
				}
				else {
					response.writeHead(403, "Forbidden");
				}
				response.end();
			});*/
		}

		// Get a signle user or get the authenticated user
		else if ((request.url.indexOf('/users'/) == 0 || request.url == "/user") && request.method == "GET") {
			// determine the user
			var user = request.url == "/user" ? users[params.token] : request.url.substr('/users/'.length - 1);
			if (users[params.token]) {
				/*couchWrapper.userGet(user, function(user_object) {
					if (user_object) {
						response.writeHead(200, "OK");
						response.write(JSON.stringify(user_object));
					}
					else {
						response.writeHead(403, "Forbidden");
					}
					response.end();
				});*/
			}
			else {
				response.writeHead(401, "Unauthorized");
				response.end();
			}
		}

		// Delete the authenticated user
		else if (request.url == "/user" && request.method == "DELETE") {
			if (users[params.token]) {
				/*couchWrapper.userDelete(users[params.token], function(success) {
					if (success) {
						response.writeHead(205, "Reset Content");
					}
					else {
						response.writeHead(403, "Forbidden");
					}
					response.end();
				});*/
				delete users[params.token];		
			}
			else {
				response.writeHead(401, "Unauthorized");
				response.end();
			}
		}

		/* Document */

		// Create a single document
		else if (request.url == "/documents" && request.method == "POST") {
			// TODO
		}

		// Update a document
		else if (request.url.indexOf("/documents/") == 0 && request.method == "PUT") {
			// TODO
		}

		// Delete a document
		else if (request.url.indexOf("/documents/") == 0 && request.method == "DELETE") {
			// TODO
		}

		// List your documents
		else if (request.url == "/documents" && request.method == "GET") {
			// TODO
		}

		// List user documents
		else if (request.url.indexOf("/users/") == 0 && request.url.indexOf("/documents") == request.url.length - "/documents".length && request.method == "GET") {
			// TODO
		}

		//Get a single document
		else if (request.url.indexOf("/documents/") == 0 && request.method == "GET") {
			// TODO
		}

		/* Discussion */

		// Add a discussion
		else if (request.url.indexOf("/documents/") == 0 && request.url.indexOf("/discussions") == request.url.length - "/discussions".length && request.method == "POST") {
			// TODO
		}

		// List document discussions
		else if (request.url.indexOf("/documents/") == 0 && request.url.indexOf("/discussions") == request.url.length - "/discussions".length && request.method == "POST") {
			// TODO
		}

		// Get a single discussion
		else if (request.url.indexOf("/discussions") == 0 && request.method == "GET") {
			// TODO
		}

		// Update a discussion
		else if (request.url.indexOf("/discussions") && request.method == "PUT") {
			// TODO
		}

		// Delete a discussion
		else if (request.url.indexOf("/discussions") && request.method == "DELETE") {
			// TODO
		}
	});
});
