var http = require("http");
var map = require("./map");
var db = require("./couch-wrapper");

var host = "localhost", port = 5984;

var user = http.request({port: port, host: host, method: "PUT", path: "/user", console.log});
var document = http.request({port: port, host: host, method: "PUT", path: "/document", console.log});
user.on("end", process.exit);
document.on("end", function() {
	db.docUpdate(map, function(res) {
		console.log(res);
		user.end();
	});
});
document.end();

