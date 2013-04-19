var couchWrapper = require('./couch_wrapper')

var http = require('http');

var users = [];

var server = http.createServer().listen(8080, '127.0.0.1');

server.on('request', function(request, response) {
	var body;
	switch (request.url) {
		case "user":
			if (request.method == "POST") {
				request.on('data', function(chunk) {
					body += chunk;
				});

				request.on('end', function() {
					var params = JSON.parse(data);
					couchWrapper.userLogin(params.login, function(real_hash) {
						if (real_hash == params.hash) {
							response.writeHead(200, "OK");
							users.push({username: params.username, uuid: 42});
						}
						else {
							response.writeHead(401, "Unauthorized");
						}
						response.end();
					});

				});
			}
			break;
		case "document":
			if (request.method == "POST") {

			}
			else if (request.method == "PUT") {

			}
			else if (request.method == "DELETE") {

			}
			break;
		default:
			break;
	}
});
