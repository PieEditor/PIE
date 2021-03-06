"use strict";

var api = require("./api-utils");
var couchWrapper = require("./couch-wrapper");
var notifyio = require("./notifications");
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
	/* sanitize object */
	delete params.token;
	delete params.path;
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

api.register({
	method: "POST",
	path: "/documents",
	needAuth: true
}, function (params, response) {
	couchWrapper.docAdd(params, function (id) {
		if (id) {
			if (!params.version) {
				params.version = 0;
				params.docId = id;
				var notifications, i;
				notifications = notifyio.notificationsOfCreation(params);
				console.log(JSON.stringify(notifications));
				for (i = 0; i < notifications.length; i += 1) {
					notifyio.notifyAll(notifications[i].notifieds, notifications[i].notification);
				}
			} else {
				couchWrapper.docGet(params.docId, -1, function (old_doc) {
					var notifications, i;
					params.version += 1;
					notifications = notifyio.notificationsOfChange(old_doc, params, api.getLogin(params.token));
					for (i = 0; i < notifications.length; i += 1) {
						notifyio.notifyAll(notifications[i].notifieds, notifications[i].notification);
					}
					console.log(JSON.stringify(notifications));
				});
			}
			response.writeHead(201, "Created");
			response.write(JSON.stringify(id));
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
	couchWrapper.docGet(params.docId, -1, function (old_doc) {
		var notifications, i;
		notifications = notifyio.notificationsOfChange(old_doc, params, api.getLogin(params.token));
		for (i = 0; i < notifications.length; i += 1) {
			notifyio.notifyAll(notifications[i].notifieds, notifications[i].notification);
		}
		console.log(JSON.stringify(notifications));

		/* sanitize doc */
		delete params.path;
		delete params.token;
		couchWrapper.docUpdate(params, function (success) {
			if (success) {
				response.writeHead(204, "No Content");
			} else {
				response.writeHead(403, "Forbidden");
			}
			response.end();
		});
	});
});

api.register({
	method: "PATCH",
	path: "/documents/{id}",
	needAuth: true
}, function (params, response) {
	couchWrapper.docGet(params.path.id, -1, function (old_doc) {
		if (old_doc) {
			var fields = params.replace.split("/");
			if (fields[1] == "content" && fields[3] == "content" && old_doc[fields[1]][fields[2]]) {
				old_doc[fields[1]][fields[2]][fields[3]] = params.value;

				var notifications, i;
				notifications = notifyio.notificationsOfPatch(old_doc, fields[2], api.getLogin(params.token));
				for (i = 0; i < notifications.length; i += 1) {
					notifyio.notifyAll(notifications[i].notifieds, notifications[i].notification);
				}
				console.log(JSON.stringify(notifications));
				/* sanitize doc */
				delete params.path;
				delete params.token;
				couchWrapper.docUpdate(old_doc, function (success) {
					if (success) {
						response.writeHead(204);
					} else {
						response.writeHead(403);
					}
					response.end();
				});
			} else {
				response.writeHead(404);
				response.end();
			}			
		} else {
			response.writeHead(404);
			response.end();
		}
	});
});

api.register({
	method: "DELETE",
	path: "/documents/{id}",
	needAuth: true
}, function (params, response) {
	/* this is a docId */
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

function make_sharps(n) {
	var sharps = "", i;
	for (i = 0; i < n; i += 1) {
		sharps += "#";
	}
	return sharps;
}

function format_doc(doc) {
	var doc_md = {}, md = "", i, title;
	doc_md._id = doc._id;
	doc_md.settings = require("../md2pdf/default.json");
	md += "# " + doc.title + "\n";
	for (i = 0; i < doc.content.length; i += 1) {
		md += make_sharps(doc.content[i].level + 1);
		if (doc.content[i].title) {
			md += " " + doc.content[i].title;
		}
		md += "\n";
		if (doc.content[i].content) {
			md += doc.content[i].content;
			md += "\n";
		}
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
notifyio.initIO(api.run(8080));
