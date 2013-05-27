var couchWrapper = require("./couch-wrapper")

var http = require("http");
var crypto = require("crypto");

var users = [];
users["token"] = "kikoo";
var server = http.createServer().listen(8080);

server.on("request", function(request, response) {
	var body = "";
	request.on("data", function(chunk) {
		body += chunk;
	});

	request.on("end", function() {
		// bad request helper
		function badRequest(body) {
			response.writeHead(400, "Bad Request");
			if (body)
				response.write(body);
			response.end();
		}

		// parse request
		parsedUrl = require("url").parse(request.url, true);

		// parse request's parameters		
		var params;
		try {
			if ((request.method == "POST" || request.method == "PUT" || request.method == "DELETE")) {
				if (body)
					params = JSON.parse(body);
				else
					params = {};
			}
			else if (request.method == "GET")
				params = parsedUrl.query;
			else
				params = {};
		}
		catch (error) {
			badRequest("Unable to parse parameters.");
		}

		// parse cookies in order to get the access token - thanks to Corey Hart & ianj : http://stackoverflow.com/questions/3393854/get-and-set-a-single-cookie-with-node-js-http-server
		var cookies = {};
		request.headers.cookie && request.headers.cookie.split(";").forEach(function(cookie) {
			var parts = cookie.split("=");
			cookies[parts[0].trim()] = (parts[1] || "").trim();
		});

		// check token validity
		var token = cookies["token"];
		var isAuthenticated = token && users[token];

		// handle CORS preflight requests
		if (request.method === "OPTIONS") {
			if (request.headers.origin) {
	            response.setHeader("Access-Control-Allow-Origin", request.headers.origin);
	            response.setHeader("Access-Control-Allow-Credentials", "true");
	            response.setHeader("Access-Control-Allow-Methods", "PUT, DELETE");
	            response.setHeader("Access-Control-Allow-Headers", "accept, access-control-allow-credentials, x-requested-with, origin, content-type");
				response.writeHead(200, "OK");
				response.end();
			}
			else {
				response.writeHead(400, "Bad Request");
				response.end();
			}
			
		}
		else {
			// add CORS headers
			if (request.headers.origin) {
                response.setHeader("Access-Control-Allow-Origin", request.headers.origin);
                response.setHeader("Access-Control-Allow-Credentials", "true");
            }

			/* USER */

			// Sign in
			if (parsedUrl.pathname == "/users/signin" && request.method == "POST") {
				if (!params.login || !params.passwd) {
					badRequest("Login or password is missing.");
				}

				else {
					var shasum = crypto.createHash("sha512").update(params.passwd, "utf8").digest("hex");
					couchWrapper.userLogin(params.login, function(user_data) {
						if (user_data && user_data.shasum && shasum == user_data.shasum) {
							users[user_data.uuid] = params.login;
							response.setHeader("Set-Cookie", "token="+user_data.uuid+"; path=/; expires=Wed, 14-Jan-2032 16:16:49 GMT");
							response.writeHead(204, "No Content");
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
				if (isAuthenticated) {
					delete users[token];
					response.setHeader("Set-Cookie", "token=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT");
					response.writeHead(204, "No Content");				
				}
				else {
					response.writeHead(401, "Unauthorized");
				}
				response.end();
			}

			// Sign up
			else if (parsedUrl.pathname == "/users/signup" && request.method == "POST") {
				if (!params.login || !params.passwd || !params.email || !params.imgUrl) {
					badRequest("Parameters are missing.");
				}
				else {
					// generate shasum...
					var shasum = crypto.createHash("sha512").update(params.passwd, "utf8").digest("hex");
					params.shasum = shasum;
					// ... then delete the password
					delete params.passwd;
					couchWrapper.userCreate(params, function(uuid) {
						if (uuid) {
							users[uuid] = params.login
							response.writeHead(201, "Created");
							response.write(JSON.stringify(uuid));
						}
						else {
							response.writeHead(403, "Forbidden");
						}
						response.end();
					});
				}
			}

			// Get a single user or get the authenticated user
			else if (((parsedUrl.pathname.indexOf("/users/") == 0 && parsedUrl.pathname.split("/").length == 3) || parsedUrl.pathname == "/user") && request.method == "GET") {
				// determine the user
				var login = request.url.indexOf("/users/") == 0 ? request.url.substr("/users/".length) : users[token];
				if (isAuthenticated) {
					couchWrapper.userGet(login, function(user_object) {
						if (user_object) {
							couchWrapper.docByUser(login, function(docs_list) {
								if (docs_list !== null) {
									delete user_object.shasum;
									user_object.documents = docs_list;
									response.writeHead(200, "OK");
									response.write(JSON.stringify(user_object));
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
				if (isAuthenticated) {
					couchWrapper.userDelete(users[token], function(success) {
						if (success) {
							response.writeHead(204, "No Content");
						}
						else {
							response.writeHead(403, "Forbidden");
						}
						response.end();
					});
					delete users[token];		
				}
				else {
					response.writeHead(401, "Unauthorized");
					response.end();
				}
			}

			// Get the login associated to a token
			else if (parsedUrl.pathname == "/token" && request.method == "GET") {
				if (isAuthenticated) {
					response.writeHead(200, "OK");
					response.write(JSON.stringify(users[token]));
				}
				else {
					response.writeHead(404, "Not Found");
				}
				response.end();
			}

			/* Document */

			// Create a single document
			else if (parsedUrl.pathname == "/documents" && request.method == "POST") {
				if (isAuthenticated) {
					couchWrapper.docAdd(params, function(id) {
						if (id) {
							response.writeHead(201, "Created");
							response.write(JSON.stringify(id));
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
			else if (parsedUrl.pathname.indexOf("/documents/") == 0 && request.method == "PUT") {
				if (isAuthenticated) {
					couchWrapper.docUpdate(params, function(success) {
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
			else if (parsedUrl.pathname.indexOf("/documents/") == 0 && request.method == "DELETE") {
				if (isAuthenticated) {
					couchWrapper.docDelete(parsedUrl.pathname.substr("/documents/".length), function(success) {
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
			else if ((parsedUrl.pathname == "/documents" || (parsedUrl.pathname.indexOf("/users/") == 0 && parsedUrl.pathname.indexOf("/documents") == parsedUrl.pathname.length - "/documents".length) && parsedUrl.pathname.split("/").length == 4) && request.method == "GET") {
				if (isAuthenticated) {
					var login = parsedUrl.pathname == "/documents" ? users[token] : parsedUrl.pathname.substring("/users/".length, parsedUrl.pathname.indexOf("/documents"));
					if (login) {
						couchWrapper.docByUser(login, function(docs_list) {
							if (docs_list !== null) {
								response.writeHead(200, "OK");
								response.write(JSON.stringify(docs_list));
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

			// Get a single document
			else if (parsedUrl.pathname.indexOf("/documents/") == 0 && request.method == "GET") {
				if (isAuthenticated) {
					var doc_id = parsedUrl.pathname.substring("/documents/".length, parsedUrl.pathname.lastIndexOf(".") >= 0 ? parsedUrl.pathname.lastIndexOf(".") : parsedUrl.pathname.length);
					couchWrapper.docGet(doc_id, function(doc) {
						if (doc) {
							if (parsedUrl.pathname.indexOf(".pdf") === parsedUrl.pathname.length - ".pdf".length) {
								doc_md = {};
								doc_md._id = doc._id;
								doc_md.settings = require("../md2pdf/default.json");
								var md = "";
								md += "#"+doc.title+"\n";
								for (var i = 0; i < doc.content.length; ++i) {
									md += (new Array(doc.content[i].level + 2)).join("#") + " " + doc.content[i].title;
									md += "\n";
									md += doc.content[i].content;
									md += "\n";
								}
								doc_md.content = md;
								var req = http.request({hostname: "localhost", port: 8081, path: "/pdf", method: "POST"}, function(res) {
									response.writeHead(200, "OK");
									res.on("data", function(buffer) {
										response.write(buffer);
									});
									res.on("end", function() {
										response.end();
									});
								});
								req.write(JSON.stringify(doc_md));
								req.end();

							}
							else {
								response.writeHead(200, "OK");
								response.write(JSON.stringify(doc));
								response.end();
							}							
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

			// Default
			else {
				badRequest("The request does not match with an API function.");
			}
		}
	});
});
