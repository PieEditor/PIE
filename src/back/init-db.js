var http = require("http");
var db = require("./couch-wrapper");

var host = "localhost", port = 5984;

var user = http.request({port: port, host: host, method: "PUT", path: "/user"},
	function(res) {
		console.log("User database creation : " + res.statusCode);
		process.exit();
	});
var document = http.request({port: port, host: host, method: "PUT", path: "/document"},
	function(res) {
		console.log("Document database creation : " + res.statusCode);
		user.end();
	});
document.end();
