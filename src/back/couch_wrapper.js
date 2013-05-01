exports.initCouchWrapper = initCouchWrapper;
exports.userLogin = userLogin;
exports.docAdd = docAdd;

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

function docAdd(user, document, callback) {
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
						res.on("data", function(data) {
							console.log("+++ " + data);
						});
					});
				addReq.write(JSON.stringify(document));
				addReq.end();
			});
		});
	uuidReq.end();
}

function docUpdate(user, text) {
	
	return true;
}

function docDelete(user, id) {
	
	return true;
}

