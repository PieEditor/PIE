exports.sayKikoo = sayKikoo;
exports.initCouchWrapper = initCouchWrapper;
exports.userLogin = userLogin;
exports.docAdd = docAdd;
exports.docUpdate = docUpdate;
exports.docDelete = docDelete;

var http = require("http");
var port = 5984, host = "localhost";

function initCouchWrapper(port_, host_) {
	port = port_;
	host = host_;
}

function sayKikoo() {
	return "Kikoo !";
}

function userLogin(login, callback) {
	var req = http.request(
		{port: port, host: host, path: "/user/" + login},
		function(res) {
			if (res.statusCode == 200)
				res.on("data", function(data) {
					callback(JSON.parse(data).hash);
				});
			else callback(null);
		}
	);
	req.on("error", callback);
	req.end();
}

function docAdd(document, callback) {
	var docId;
	var uuidReq = http.request(
		{port: port, host: host, path: "/_uuids"},
		function(res) {
			res.on("data", function(data) {
				docId = JSON.parse(data).uuids[0];
				var addReq = http.request(
					{port: port, host: host, path: "/document/" + docId, method: "PUT"},
					function(res) {
						if (res.statusCode == 201)
							callback(docId);
						else callback(null);
					});
				addReq.write(JSON.stringify(document));
				addReq.on("error", callback);
				addReq.end();
			});
		});
	uuidReq.on("error", callback);
	uuidReq.end();
}

function docUpdate(document, callback) {
	var updReq = http.request(
		{port: port, host: host, path: "/document/" + document.docId, method: "PUT"},
		function(res) {
			if (res.statusCode == 200)
				callback(document.docId);
			else callback(null);
		});
	updReq.write(JSON.stringify(document));
	updReq.on("error", callback);
	updReq.end();
}

function docDelete(id, callback) {
	var delReq = http.request(
		{port: port, host: host, path: "/document/" + id, methode: "DELETE"},
		function(res) {
			if (res.statusCode == 200)
				callback(document.docId);
			else callback(null);
		});
	delReq.on("error", callback);
	delReq.end();
}

