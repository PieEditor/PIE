var http = require("http");
var fs = require("fs");
var exec = require("child_process").exec;

http.createServer(function(req, res) {
	if (req.method != "GET") {
		res.writeHead(501);
		res.end();
		return;
	}
	var fmt = req.url.replace("/", "");
	if ((fmt !== "odt") && (fmt !== "pdf")) {
		res.writeHead(404);
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
		var id = doc._id;
		fs.writeFileSync(id + ".md", md);
		fs.writeFileSync(id + ".json", settings);
		exec("python convert.py " + id + ".md " + id + ".json " + req.url.replace("/", ""),
			function(error, stdout, stderr) {
				if (error !== null) {
					res.writeHead(500);
					res.end();
					return;
				}
				if (fmt === "odt") {
					fs.readFile(id + ".odt", function(error, data) {
						if (error !== null) {
							res.writeHead(500);
							res.end();
							return;
						}
						res.setHeader("Content-Type", "application/vnd.oasis.opendocument.text");
						res.writeHead(200);
						res.write(data);
						res.end();
					});
				}
				else {
					fs.readFile(id + ".pdf", function(error, data) {
						if (error !== null) {
							res.writeHead(500);
							res.end();
							return;
						}
						res.setHeader("Content-Type", "application/pdf");
						res.writeHead(200);
						res.write(data);
						res.end();
					});
				}
			});
	});
}).listen(8081, "localhost");
