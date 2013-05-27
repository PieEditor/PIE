var http = require("http");
var fs = require("fs");
var exec = require("child_process").exec;

http.createServer(function(req, res) {
	var send500 = function(err) {
		if (err) {
			res.writeHead(500);
			res.end();
		}
	};
	if (req.method != "POST") {
		res.writeHead(400);
		res.end();
		return;
	}
	var fmt = req.url.replace("/", "");
	if ((fmt !== "odt") && (fmt !== "pdf")) {
		res.writeHead(501);
		res.end();
		return;
	}
	var body = "";
	req.on("data", function(data) {
		body += data;
	});
	req.on("end", function() {
		var doc = JSON.parse(body);
		var md = doc.content;
		var settings = JSON.stringify(doc.settings);
		var path = "/tmp/" + doc._id + "/";
		fs.mkdir(path, send500);
		fs.writeFile(path + "d.md", md, send500);
		fs.writeFile(path + "s.json", settings, send500);
		exec("python convert.py " + path + " " + req.url.replace("/", ""),
			function(error, stdout, stderr) {
				console.log(stdout);
				if (error !== null) {
					send500(error);
					return;
				}
				if (fmt === "odt") {
					fs.readFile(path + "d.odt", function(error, data) {
						if (error !== null) {
							send500(error);
							return;
						}
						res.setHeader("Content-Type", "application/vnd.oasis.opendocument.text");
						res.writeHead(200);
						res.write(data);
						res.end();
						fs.unlink(path + "d.odt", function(err) {});
						fs.rmdir(path, function(err) {});
					});
				}
				else {
					fs.readFile(path + "d.pdf", function(error, data) {
						if (error !== null) {
							send500(error);
							return;
						}
						res.setHeader("Content-Type", "application/pdf");
						res.writeHead(200);
						res.write(data);
						res.end();
						fs.unlink(path + "d.pdf", function(err) {});
						fs.rmdir(path, function(err) {});
					});
				}
			});
	});
}).listen(8081, "localhost");
