var http = require("http");
var port = 5984, host = "localhost";

exports.initCouchWrapper = function(port_, host_) {
	port = port_;
	host = host_;
}

exports.sayKikoo = function() {
	return "Kikoo !";
}

function doGetRequest(path, callback) {
	var req = http.request(
	{port: port, host: host, path: path},
	function(res) {
		if (res.statusCode == 200) {
			res.on("data", function(chunk) {
				callback(JSON.parse(chunk));
			});
		}
		else callback(null);
	});
	req.on("error", function(e) {callback(null);});
	req.end();
}

function doPutRequest(path, data, callback) {
	var req = http.request(
	{port: port, host: host, path: path, method: "PUT"},
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

function getUUID(callback) {
	doGetRequest("/_uuids", function(res) {
		if (res == null)
			callback(null);
		else callback(res.uuids[0]);
	});
}

function getRev(path, callback) {
	doGetRequest(path, function(res) {
		if (res == null)
			callback(null);
		else callback(res._rev);
	});
}

// USER

exports.userCreate = function(login, hash, callback) {
	doPutRequest("/user/" + login, {hash: hash}, callback);
}

exports.userGet = function(login, callback) {
	doGetRequest("/user/" + login, callback);
}

exports.userLogin = function(login, callback) {
	doGetRequest("/user/" + login, function(res) {
		if (res == null) {
			callback(null);
			return;
		}
		getUUID(function(uuid) {
			if (uuid == null)
				callback(null);
			else callback({hash: res.hash, uuid: uuid});
		});
	});
}

exports.userDelete = function(login, callback) {
	var path = "/user/" + login;
	getRev(path, function(rev) {
		if (rev == null) {
			callback(false);
			return;
		}
		doPutRequest(path, {_rev: rev, _deleted: true}, callback);
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

