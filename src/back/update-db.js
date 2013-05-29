var http = require("http");
var mapDoc = require("./map-doc");
var mapUsr = require("./map-usr");

var port = 5984, host = "localhost";

function doGetRequest(path, callback) {
	var req = http.request(
	{port: port, host: host, path: path, agent: false},
	function(res) {
		if (res.statusCode < 400) {
			var data = "";
			res.on("data", function(chunk) {
				data += chunk;
			});
			res.on("end", function() {
				callback(JSON.parse(data));
			});
		}
		else callback(null);
	});
	req.on("error", function(e) {callback(null);});
	req.end();
}

function doPutRequest(path, data, callback) {
	var req = http.request(
	{port: port, host: host, path: path, method: "PUT", agent: false},
	function(res) {
		if (res.statusCode < 400)
			callback(true);
		else callback(false);
	});
	req.on("error", function(e) {
		callback(false);
	});
	req.write(JSON.stringify(data));
	req.end();
}

doGetRequest("/document/_design/application", function(res) {
	if (res !== null) {
		mapDoc._rev = res._rev;
	}
	doPutRequest("/document/_design/application", mapDoc, function(res) {
		doGetRequest("/user/_design/application", function(res) {
			if (res !== null) {
				mapUsr._rev = res._rev;
			}
			doPutRequest("/user/_design/application", mapUsr, function(res) {
				console.log(res);
				process.exit();
			});
		});
		console.log(res);
	});
});

