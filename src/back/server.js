"use strict";

var api = require("./api-utils");
var couchWrapper = require("./couch-wrapper");
var crypto = require("crypto");
var http = require("http");

/* register API calls */

api.register({
	method: "POST",
	path: "/users/signin",
	needAuth: false
}, function (params, response) {
	var shasum = crypto.createHash("sha512").update(params.passwd, "utf8").digest("hex");
	couchWrapper.userLogin(params.login, function (user_data) {
		if (user_data && user_data.shasum && shasum === user_data.shasum) {
			api.registerUser(user_data.uuid, params.login);
			response.setHeader("Set-Cookie", "token=" + user_data.uuid + "; path=/; expires=Wed, 14-Jan-2032 16:16:49 GMT");
			response.writeHead(204, "No Content");
		} else {
			response.writeHead(403, "Forbidden");
		}
		response.end();
	});
});

api.register({
	method: "POST",
	path: "/user/signout",
	needAuth: true
}, function (params, response) {
	api.unregisterUser(params.token);
	response.setHeader("Set-Cookie", "token=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT");
	response.writeHead(204, "No Content");
	response.end();
});

api.register({
	method: "POST",
	path: "/users/signup",
	needAuth: false
}, function (params, response) {
	var shasum = crypto.createHash("sha512").update(params.passwd, "utf8").digest("hex");
	params.shasum = shasum;
	// ... then delete the password
	delete params.passwd;
	couchWrapper.userCreate(params, function (uuid) {
		if (uuid) {
			api.registerUser(uuid, params.login);
			response.setHeader("Set-Cookie", "token=" + uuid + "; path=/; expires=Wed, 14-Jan-2032 16:16:49 GMT");
			response.writeHead(201, "Created");
		} else {
			response.writeHead(403, "Forbidden");
		}
		response.end();
	});
});

api.register({
	method: "GET",
	path: "/user",
	needAuth: true
}, function (params, response) {
	couchWrapper.userGet(api.getLogin(params.token), function (user_object) {
		if (user_object) {
			couchWrapper.docByUser(api.getLogin(params.token), function (docs_list) {
				if (docs_list !== null) {
					delete user_object.shasum;
					user_object.documents = docs_list;
					response.writeHead(200, "OK");
					response.write(JSON.stringify(user_object));
				} else {
					response.writeHead(403, "Forbidden");
				}
				response.end();
			});
		} else {
			response.writeHead(403, "Forbidden");
			response.end();
		}
	});
});

api.register({
	method: "GET",
	path: "/users/{login}",
	needAuth: true
}, function (params, response) {
	couchWrapper.userGet(params.path.login, function (user_object) {
		if (user_object) {
			couchWrapper.docByUser(params.path.login, function (docs_list) {
				if (docs_list !== null) {
					delete user_object.shasum;
					user_object.documents = docs_list;
					response.writeHead(200, "OK");
					response.write(JSON.stringify(user_object));
				} else {
					response.writeHead(403, "Forbidden");
				}
				response.end();
			});
		} else {
			response.writeHead(403, "Forbidden");
			response.end();
		}
	});
});

api.register({
	method: "PUT",
	path: "/user",
	needAuth: true
}, function (params, response) {
	couchWrapper.userUpdate(params, function (success) {
		if (success) {
			response.writeHead(200, "OK");
		} else {
			response.writeHead(403, "Forbidden");
		}
		response.end();
	});
});

api.register({
	method: "DELETE",
	path: "/user",
	needAuth: true
}, function (params, response) {
	couchWrapper.userDelete(api.getLogin(params.token), function (success) {
		if (success) {
			response.writeHead(204, "No Content");
		} else {
			response.writeHead(403, "Forbidden");
		}
		response.end();
	});
	api.unregisterUser(params.token);
});

api.register({
	method: "GET",
	path: "/users",
	needAuth: true
}, function (params, response) {
	var prefix = params.prefix || "";
	couchWrapper.userByPrefix(prefix, function (users) {
		if (users !== null) {
			if (users.length === 0) {
				response.writeHead(204, "No Content");
			} else {
				response.writeHead(200, "OK");
				response.write(JSON.stringify(users));
			}
		} else {
			response.writeHead(403, "Forbidden");
		}
		response.end();
	});
});

function notify(login, type, text, id) {
	console.log("getting user " + login);
	couchWrapper.userGet(login, function (user_object) {
		if (user_object) {
			console.log("updating user " + login);
			if (!user_object.notifications) {
				user_object.notifications = [];
			}
			user_object.notifications.push({text: text, type: type, id: id});
			couchWrapper.userUpdate(user_object);
		}
	});
}

api.register({
	method: "POST",
	path: "/documents",
	needAuth: true
}, function (params, response) {
	couchWrapper.docAdd(params, function (id) {
		if (id) {
			response.writeHead(201, "Created");
			response.write(JSON.stringify(id));
			var i;
			/* notify all collaborators that a document has been created. */
			for (i = 0; i < params.collaborators.length; i += 1) {
				console.log("notifying " + params.collaborators[i].login);
				notify(params.collaborators[i].login, "document", params.owner + " added you to the collaborators list of \"" + params.title + "\".", id);
			}
		} else {
			response.writeHead(403, "Forbidden");
		}
		response.end();
	});
});

api.register({
	method: "PUT",
	path: "/documents/{id}",
	needAuth: true
}, function (params, response) {
	var notifications = [];
	/* handle notifications */
	couchWrapper.docGet(params.path.id, -1, function (doc) {
		if (doc) {
			var i, j, k;
			if (doc.content.length !== params.content.length) {
				for (i = 0; i < params.collaborators.length; i += 1) {
					notify(params.collaborators[i].login, "document", api.getLogin(params.token) + " changed the architecture of \"" + params.title + "\".", params.path.id);
				}
			}

			for (i = 0; i < doc.content.length; i += 1) {
				if (doc.content[i].discussions.length < params.content[i].discussions.length) {
					for (k = 0; k < params.collaborators.length; k += 1) {
						notify(params.collaborators[k].login, "discussion", api.getLogin(params.token) + " started a new discussion about section \"" + params.content[i].title + "\" of \"" + params.title + "\".", params.path.id);
					}
				}
				for (j = 0; j < doc.content[i].discussions.length; j += 1) {
					if (doc.content[i].discussions[j].resolved && !params.content[i].discussions[j].length) {
						for (k = 0; k < params.collaborators.length; k += 1) {
							notify(params.collaborators[k].login, "discussion", api.getLogin(params.token) + " resolved the discussion \"" + doc.content[i].discussions[j].title + "\" which was about \"" + params.content[i].title + "\" of \"" + params.title + "\".", params.path.id);
						}
					}				
				}
			}
		}

		/* sanitize doc */
		delete params.path;
		delete params.token;

		couchWrapper.docUpdate(params, function (success) {
			if (success) {
				response.writeHead(204, "No Content");
				/* looking for new discussions */
			} else {
				response.writeHead(403, "Forbidden");
			}
			response.end();
		});
	});
});

api.register({
	method: "DELETE",
	path: "/documents/{id}",
	needAuth: true
}, function (params, response) {
	couchWrapper.docDelete(params.path.id, function (success) {
		if (success) {
			response.writeHead(204, "No Content");
		} else {
			response.writeHead(403, "Forbidden");
		}
		response.end();
	});
});

api.register({
	method: "GET",
	path: "/documents/{id}/versions",
	needAuth: true
}, function (params, response) {
	couchWrapper.getLastVersion(params.path.id, function (lastVersion) {
		response.writeHead(200, "OK");
		response.write(JSON.stringify({lastVersion: lastVersion}));
		response.end();
	});
});

function format_doc(doc) {
	var doc_md = {}, md = "", i;
	doc_md._id = doc._id;
	doc_md.settings = require("../md2pdf/default.json");
	md += "#" + doc.title + "\n";
	for (i = 0; i < doc.content.length; i += 16) {
		md += [doc.content[i].level + 2].join("#") + " " + doc.content[i].title;
		md += "\n";
		md += doc.content[i].content;
		md += "\n";
	}
	doc_md.content = md;
	return doc_md;
}

api.register({
	method: "GET",
	path: "/documents/{id}",
	needAuth: true
}, function (params, response) {
	couchWrapper.docGet(params.path.id, -1, function (doc) {
		if (doc !== null) {
			if (params.path.output) {
				var doc_md = format_doc(doc), req;
				req = http.request({hostname: "localhost", port: 8081, path: "/" + params.path.output, method: "POST"}, function (res) {
					response.writeHead(200, "OK");
					res.on("data", function (buffer) {
						response.write(buffer);
					});
					res.on("end", function () {
						response.end();
					});
				});
				req.write(JSON.stringify(doc_md));
				req.end();
			} else {
				response.writeHead(200, "OK");
				response.write(JSON.stringify(doc));
				response.end();
			}
		} else {
			response.writeHead(403, "Forbidden");
			response.end();
		}
	});
});

api.register({
	method: "GET",
	path: "/documents/{id}/versions/{version}",
	needAuth: true
}, function (params, response) {
	couchWrapper.docGet(params.path.id, params.path.version, function (doc) {
		if (doc !== null) {
			if (params.path.output) {
				var doc_md = format_doc(doc), req;
				req = http.request({hostname: "localhost", port: 8081, path: "/" + params.path.output, method: "POST"}, function (res) {
					response.writeHead(200, "OK");
					res.on("data", function (buffer) {
						response.write(buffer);
					});
					res.on("end", function () {
						response.end();
					});
				});
				req.write(JSON.stringify(doc_md));
				req.end();
			} else {
				response.writeHead(200, "OK");
				response.write(JSON.stringify(doc));
				response.end();
			}
		} else {
			response.writeHead(403, "Forbidden");
			response.end();
		}
	});
});

/* start the server */
api.run(8080);
