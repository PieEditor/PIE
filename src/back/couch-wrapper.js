var http = require("http");
var port = 5984, host = "localhost";

exports.initCouchWrapper = function(port_, host_) {
	port = port_;
	host = host_;
}

exports.sayKikoo = function() {
	return "Kikoo !";
}

function getUUID(callback) {
	var req = http.request(
	{port: port, host: host, path: "/_uuids"},
	function(res) {
		if (res.statusCode == 200) {
			res.on("data", function(data) {
				uuid = JSON.parse(data).uuids[0];
				callback(uuid);
			});
		} else callback(null);
	});
	req.on("error", function(err) {callback(null);});
	req.end();
}

function getRev(path, callback) {
	var req = http.request(
	{port: port, host: host, path: path},
	function(res) {
		if (res.statusCode == 200) {
			res.on("data", function(data) {
				rev = JSON.parse(data)._rev;
				callback(rev);
			});
		} else callback(null);
	});
	req.on("error", function(err) {callback(null);});
	req.end();
}

// USER

exports.userCreate = function(login, hash, callback) {
	var req = http.request(
		{port: port, host: host, path: "/user/" + login, method: "PUT"},
		function(res) {
			if (res.statusCode == 201)
				callback(true);
			else callback(false);
		});
	req.write(JSON.stringify({hash: hash}));
	req.on("error", function(err) {callback(false);});
	req.end();
}

exports.userLogin = function(login, callback) {
	var req = http.request(
		{port: port, host: host, path: "/user/" + login},
		function(res) {
			if (res.statusCode == 200)
				res.on("data", function(data) {
					var hash = JSON.parse(data).hash;
					getUUID(function(uuid) {
						if (uuid == null)
							callback(null);
						else
							callback({"hash": hash, "uuid": uuid});
					});
				});
			else callback(null);
		}
	);
	req.on("error", function(err) {callback(null);});
	req.end();
}

exports.userDelete = function(login, callback) {
	var path = "/user/" + login;
	getRev(path, function(rev) {
		if (rev == null) {
			callback(false);
			return;
		}
		var req = http.request(
			{port: port, host: host, path: "/user/" + login, method: "PUT"},
			function(res) {
				if (res.statusCode == 200)
					callback(true);
				else callback(false);
			});
		req.write(JSON.stringify({_rev: rev, _deleted: true}));
		req.on("error", function(err) {callback(false);});
		req.end();
	});
}

// DOCUMENT

exports.docAdd = function(document, callback) {
	var docId;
	getUuid(function(uuid) {
		if (uuid == null) {
			callback(null);
			return;
		}
		var req = http.request(
			{port: port, host: host, path: "/document/" + uuid, method: "PUT"},
			function(res) {
				if (res.statusCode == 201)
					callback(uuid);
				else callback(null);
			});
		req.write(JSON.stringify(document));
		req.on("error", function(err) {callback(null)});
		req.end();
	});
}

exports.docUpdate = function(document, callback) {
	var updReq = http.request(
		{port: port, host: host, path: "/document/" + document.docId, method: "PUT"},
		function(res) {
			if (res.statusCode == 200)
				callback(document.docId);
			else callback(null);
		});
	updReq.write(JSON.stringify(document));
	updReq.on("error", callback);
	updReq.end();
}

exports.docDelete = function(id, callback) {
	var path = "/document/" + id;
	getRev(path, function(rev) {
		if (rev == null) {
			callback(false);
			return;
		}
		var req = http.request(
			{port: port, host: host, path: "/document/" + login, method: "PUT"},
			function(res) {
				if (res.statusCode == 200)
					callback(true);
				else callback(false);
			});
		req.write(JSON.stringify({_rev: rev, _deleted: true}));
		req.on("error", function(err) {callback(false);});
		req.end();
	});
}
}

