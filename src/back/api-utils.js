var http = require("http");

var users = [];
users["token"] = "kikoo";

exports.registerUser = function(token, login) {
	users[token] = login;
}

exports.unregisterUser = function(token) {
	delete users[token];
}

exports.getLogin = function(token) {
	return users[token];
}

function parseParams(request, body) {				
	var params = {};
	if ((request.method === "POST" || request.method === "PUT" || request.method === "DELETE") && body)
		params = JSON.parse(body);
	else if (request.method === "GET")
		params = require("url").parse(request.url, true).query;
	return params;
}

function getToken(headers) {
	// parse cookies in order to get the access token - thanks to Corey Hart & ianj : http://stackoverflow.com/questions/3393854/get-and-set-a-single-cookie-with-node-js-http-server
	var cookies = {};
	headers.cookie && headers.cookie.split(";").forEach(function(cookie) {
		var parts = cookie.split("=");
		cookies[parts[0].trim()] = (parts[1] || "").trim();
	});
	return cookies["token"];
}

var calls = [];
exports.register = function(options, func) {
	options.func = func;
	calls.push(options);
}

function parsePathParams(pattern, path) {
	var a1 = pattern.split("/"), a2 = path.split("/");
	var params = {}
	if (a1.length != a2.length)
		return {};
	if (a2[a2.length - 1].indexOf(".") !== -1) {
		params.output = a2[a2.length - 1].substring(a2[a2.length - 1].indexOf(".") + 1);
		a2[a2.length - 1] = a2[a2.length - 1].substring(0, a2[a2.length - 1].indexOf("."));
	}
	for (var i = 0; i < a1.length; ++i) {

		if (a1[i].charAt(0) == "{" && a1[i].charAt(a1[i].length - 1) == "}") {
			params[a1[i].substring(1, a1[i].length - 1)] = a2[i];
		}
	}
	return params;
}

function pathMatch(pattern, path) {
	var a1 = pattern.split("/"), a2 = path.split("/");
	if (a1.length != a2.length)
		return false;
	for (var i = 0; i < a1.length; ++i) {
		if (a1[i].charAt(0) != "{" && a1[i].charAt(a1[i].length - 1) != "}" && a1[i] != a2[i]) {
			return false;			
		}
	}
	return true;
}

function badRequest(response, body) {
	response.writeHead(400, "Bad Request");
	if (body)
		response.write(body);
	response.end();
}

function unauthorized(response, body) {
	response.writeHead(401, "Unauthorized");
	if (body)
		response.write(body);
	response.end();
}

exports.run =  function(port, hostname) {
	var server = http.createServer().listen(port, hostname);
	server.on("request", function(request, response) {
		var body = "";
		request.on("data", function(chunk) {
			body += chunk;
		});
		request.on("end", function() {
			var path = require("url").parse(request.url, true).pathname;
			for (var i = 0; i < calls.length; ++i) {
				var call = calls[i];
				if (call.method === request.method && pathMatch(call.path, path)) {
					var token = getToken(request.headers);
					if (call.needAuth && !users[token])
						unauthorized(response);
					else {
						var params = parseParams(request, body);
						params.path = parsePathParams(call.path, path);
						params.token = token;
						call.func(params, response);
					}				
					return;
				}
			}
			badRequest(response);
		});
	});
}
