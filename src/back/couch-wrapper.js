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
		if (res.statusCode < 400) {
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

function doDelete(path, callback) {
	getRev(path, function(rev) {
		if (rev == null) {
			callback(false);
			return;
		}
		doPutRequest(path, {_rev: rev, _deleted: true}, callback);
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
	doDelete("/user/" + login, callback);
}

// DOCUMENT

exports.docAdd = function(document, callback) {
	getUUID(function(uuid) {
		if (uuid == null) {
			callback(null);
			return;
		}
		doPutRequest("/document/" + uuid, document, function(res) {
			if (res == false)
				callback(null);
			else callback(uuid);
		});
	});
}

exports.docUpdate = function(document, callback) {
	getRev("/document/" + document._id, function(rev) {
		if (rev == null) {
			callback(false);
			return;
		}
		document._rev = rev;
		doPutRequest("/document/" + document._id, document, callback);
	});
}

exports.docDelete = function(id, callback) {
	doDeleteRequest("/document/" + id, callback);
}

exports.docGet = function(id, callback) {
	doGetRequest("/document/" + id, callback);
}

