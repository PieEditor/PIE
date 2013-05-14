var http = require("http");
var map = require("./map");
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
		mapfunc.end();
	});
var mapfunc = http.request({port: port, host: host, method: "PUT", path: "/document/_design/application"},
	function(res) {
		console.log("Map function insertion : " + res.statusCode)
		user.end();
	});
mapfunc.write(JSON.stringify(map));
document.end();
