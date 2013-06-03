var http = require("http");
var fs = require("fs");
var exec = require("child_process").exec;

http.createServer(function(req, res) {
	var send500 = function(err) {
		if (err) {
			console.log("Error: " + err);
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
		try {
			fs.mkdirSync(path);
			fs.writeFileSync(path + "d.md", md);
			fs.writeFileSync(path + "s.json", settings);
		} catch(e) {}
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
						try {
							fs.unlinkSync(path + "d.odt");
							fs.rmdirSync(path);
						} catch(e) {}
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
						try {
							fs.unlinkSync(path + "d.pdf");
							fs.rmdirSync(path);
						} catch(e) {}
					});
				}
			});
	});
}).listen(8081, "localhost");

