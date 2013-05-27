var http = require("http");
var mapDoc = require("./map-doc");
var mapUsr = require("./map-usr");
var db = require("./couch-wrapper");

var host = "localhost", port = 5984;

var user = http.request({port: port, host: host, method: "PUT", path: "/user"},
	function(res) {
		console.log("User database creation : " + res.statusCode);
		mapfuncDoc.end();
	});
var document = http.request({port: port, host: host, method: "PUT", path: "/document"},
	function(res) {
		console.log("Document database creation : " + res.statusCode);
		user.end();
	});
var mapfuncDoc = http.request({port: port, host: host, method: "PUT", path: "/document/_design/application"},
	function(res) {
		console.log("Document map functions insertion : " + res.statusCode)
		mapfuncUsr.end();
	});
var mapfuncUsr = http.request({port: port, host: host, method: "PUT", path: "/user/_design/application"},
	function(res) {
		console.log("User map function insertion : " + res.statusCode)
		process.exit();
	});
mapfuncDoc.write(JSON.stringify(mapDoc));
mapfuncUsr.write(JSON.stringify(mapUsr));
document.end();

