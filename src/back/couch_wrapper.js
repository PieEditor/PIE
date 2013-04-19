exports.initCouchWrapper = initCouchWrapper;
exports.userLogin = userLogin;

var http = require("http");
var port, host;

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
	req.end();
}

function docAdd(user, document) {
	
	return 42;
}

function docUpdate(user, text) {
	
	return true;
}

function docDelete(user, id) {
	
	return true;
}

