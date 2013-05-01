var couchWrapper = require('./couch_wrapper')

var http = require('http');
var crypto = require('crypto');

var users = [];
var server = http.createServer().listen(8080, '127.0.0.1');

server.on('request', function(request, response) {
	var body = "";
	switch (request.url) {
		case "/user":
			if (request.method == "POST") {
				request.on('data', function(chunk) {
					body += chunk;
				});

				request.on('end', function() {
					var params = JSON.parse(body);
					var shasum = crypto.createHash('sha512');
					shasum.write(params.pwd);
					shasum.end();
					couchWrapper.userLogin(params.login, function(real_hash) {
						if (real_hash == shasum.read()) {
							response.writeHead(200, "OK");
							users.push({username: params.login, uuid: 42});
						}
						else {
							response.writeHead(401, "Unauthorized");
						}
						response.end();
					});

				});
			}
			break;
		case "/document":
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
