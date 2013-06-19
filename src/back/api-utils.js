"use strict";

var http = require("http");

var users = [];
users.token = "kikoo";

exports.registerUser = function (token, login) {
	users[token] = login;
};

exports.unregisterUser = function (token) {
	delete users[token];
};

exports.getLogin = function (token) {
	return users[token];
};

function parseParams(request, body) {
	var params = {};
	if ((request.method === "POST" || request.method === "PUT" || request.method == "PATCH" || request.method === "DELETE") && body) {
		params = JSON.parse(body);
	} else if (request.method === "GET") {
		params = require("url").parse(request.url, true).query;
	}
	return params;
}

function getToken(headers) {
	var cookies = {};
	if (headers.cookie) {
		headers.cookie.split(";").forEach(function (cookie) {
			var parts = cookie.split("=");
			cookies[parts[0].trim()] = (parts[1] || "").trim();
		});
	}
	return cookies.token;
}

var calls = [];
exports.register = function (options, func) {
	options.func = func;
	calls.push(options);
};

function parsePathParams(pattern, path) {
	var a1 = pattern.split("/"), a2 = path.split("/"), params = {}, i;
	if (a1.length !== a2.length) {
		return {};
	}
	if (a2[a2.length - 1].indexOf(".") !== -1) {
		params.output = a2[a2.length - 1].substring(a2[a2.length - 1].indexOf(".") + 1);
		a2[a2.length - 1] = a2[a2.length - 1].substring(0, a2[a2.length - 1].indexOf("."));
	}
	for (i = 0; i < a1.length; i += 1) {
		if (a1[i].charAt(0) === "{" && a1[i].charAt(a1[i].length - 1) === "}") {
			params[a1[i].substring(1, a1[i].length - 1)] = a2[i];
		}
	}
	return params;
}

function pathMatch(pattern, path) {
	var a1 = pattern.split("/"), a2 = path.split("/"), i;
	if (a1.length !== a2.length) {
		return false;
	}
	for (i = 0; i < a1.length; i += 1) {
		if (a1[i].charAt(0) !== "{" && a1[i].charAt(a1[i].length - 1) !== "}" && a1[i] !== a2[i]) {
			return false;
		}
	}
	return true;
}

function badRequest(response, body) {
	response.writeHead(400, "Bad Request");
	if (body) {
		response.write(body);
	}
	response.end();
}

function unauthorized(response, body) {
	response.writeHead(401, "Unauthorized");
	if (body) {
		response.write(body);
	}
	response.end();
}

function send_cors_headers(request, response) {
	if (request.method === "OPTIONS") {
		if (request.headers.origin) {
            response.setHeader("Access-Control-Allow-Origin", request.headers.origin);
            response.setHeader("Access-Control-Allow-Credentials", "true");
            response.setHeader("Access-Control-Allow-Methods", "PUT, DELETE");
            response.setHeader("Access-Control-Allow-Headers", "accept, access-control-allow-credentials, x-requested-with, origin, content-type");
			response.writeHead(200, "OK");
		} else {
			response.writeHead(400, "Bad Request");
		}

	} else {
		// add CORS headers
		if (request.headers.origin) {
            response.setHeader("Access-Control-Allow-Origin", request.headers.origin);
            response.setHeader("Access-Control-Allow-Credentials", "true");
        }
    }
}

exports.run =  function (port, hostname) {
	var server = http.createServer().listen(port, hostname);
	server.on("request", function (request, response) {
		var body = "";
		request.on("data", function (chunk) {
			body += chunk;
		});
		request.on("end", function () {
			var path = require("url").parse(request.url, true).pathname, i, call, token, params;
			for (i = 0; i < calls.length; i += 1) {
				call = calls[i];
				if ((call.method === request.method || request.method === "OPTIONS") && pathMatch(call.path, path)) {
					send_cors_headers(request, response);
					if (request.method !== "OPTIONS") {
						token = getToken(request.headers);
						if (call.needAuth && !users[token]) {
							unauthorized(response);
						} else {
							params = parseParams(request, body);
							params.path = parsePathParams(call.path, path);
							params.token = token;
							call.func(params, response);
						}
					} else {
						response.end();
					}
					return;
				}
			}
			badRequest(response);
		});
	});
	return server;
};
