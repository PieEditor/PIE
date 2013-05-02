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
					if (params.action == 'signin') {
						var shasum = crypto.createHash('sha512');
						shasum.write(params.pwd);
						shasum.end();
						couchWrapper.userLogin(params.login, function(real_hash) {
							if (real_hash == shasum.read()) {
								response.writeHead(200, "OK");
								// TODO: replace real_hash by secret and params.login by user id
								var token = crypto.createHmac('sha256', real_hash).update(params.login).digest('hex');
								response.write(JSON.stringify({token: token}));
								users[token] = params.login; // should be its id
							}
							else {
								response.writeHead(401, "Unauthorized");
							}
						});
					}
					else if (params.action == 'signout') {
						delete users[params.token];
						response.writeHead(200, "OK")
					}
				});
			}
			break;
		case "/document":
			if (request.method == "POST") {
				request.on('data', function(chunk) {
					body += chunk;
				});

				request.on('end', function() {
					var params = JSON.parse(body);
					if (users[params.token]) {
						couchWrapper.docAdd(params.doc, function (docId) {
							if (docId) {
								response.writeHead(201, "Created");
								response.write(JSON.stringify({id: docId}));
							}
							else {
								response.writeHead(403, "Forbidden");
							}
						})
					}
					else {
						response.writeJead(401, "Unauthorized");
					}
				});
			}
			else if (request.method == "PUT") {
				request.on('data', function(chunk) {
					body += chunk;
				});

				request.on('end', function() {
					var params = JSON.parse(body);
					if (users[params.token]) {
						couchWrapper.docUpdate(params.doc, function (docId) {
							if (docId) {
								response.writeHead(200, "OK");
								response.write(JSON.stringify({id: docId}));
							}
							else {
								response.writeHead(403, "Forbidden");
							}
						})
					}
					else {
						response.writeJead(401, "Unauthorized");
					}
				});
			}
			else if (request.method == "DELETE") {
				request.on('data', function(chunk) {
					body += chunk;
				});

				request.on('end', function() {
					var params = JSON.parse(body);
					if (users[params.token]) {
						couchWrapper.docDelete(params.docId, function (docId) {
							if (docId) {
								response.writeHead(200, "OK");
								response.write(JSON.stringify({id: docId}));
							}
							else {
								response.writeHead(403, "Forbidden");
							}
						})
					}
					else {
						response.writeJead(401, "Unauthorized");
					}
				});
			}
			break;
		default:
			break;
	}
	response.end();
});
