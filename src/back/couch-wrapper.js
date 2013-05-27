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

function getLastVersion(docId, callback) {
	doGetRequest("/document/_design/application/_view/last?key=\"" + docId + "\"", callback);
}

// USER

exports.userCreate = function(user, callback) {
	doPutRequest("/user/" + user.login, user, function(res) {
		if (res == false) {
			callback(null);
			return;
		}
		getUUID(function(uuid) {
			if (uuid == null)
				callback(null);
			else callback(uuid);
		});
	});
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
			else callback({shasum: res.shasum, uuid: uuid});
		});
	});
}

exports.userDelete = function(login, callback) {
	doDelete("/user/" + login, callback);
}

// DOCUMENT

exports.docAdd = docAdd;

function docAdd(document, callback) {
	getUUID(function(uuid) {
		if (uuid == null) {
			callback(null);
			return;
		}
		if (document.version == undefined) {
			getLastVersion(document.docId, function(version) {
				document.version = version + 1;
				docAdd(document, callback);
			});
		}
		else {
			doPutRequest("/document/" + uuid, document, function(res) {
				if (res == false)
					callback(null);
				else callback(uuid);
			});
		}
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
	doDelete("/document/" + id, callback);
}

exports.docGet = function(id, callback) {
	doGetRequest("/document/" + id, callback);
}

exports.docByUser = function(login, callback) {
	doGetRequest("/document/_design/application/_view/get?key=\"" + login + "\"", function(res) {
		if (res == null) {
			callback(null);
			return;
		}
		list = [];
		res.rows.forEach(function(elem) {
			list.push({id: elem.id, title: elem.value});
		});
		callback(list);
	});
}

