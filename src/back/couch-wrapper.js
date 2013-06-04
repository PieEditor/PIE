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

exports.userUpdate = function(user, callback) {
	if (!callback)
		callback = function(a) {};
	getRev("/user/" + user.login, function(rev) {
		if (rev == null) {
			callback(false);
			return;
		}
		user._rev = rev;
		doPutRequest("/user/" + user.login, user, callback);
	});
}

// DOCUMENT

exports.docAdd = docAdd;

function docAdd(document, callback) {
	getUUID(function(uuid) {
		if (uuid == null) {
			callback(null);
			return;
		}
		if (document.docId === undefined) {
			document.docId = uuid;
			document.version = 0;
			doPutRequest("/document/" + uuid, document, function(res) {
				if (res == false)
					callback(null);
				else callback(uuid);
			});
		}
		else {
			getLastVersion(document.docId, function(version) {
				document.version = version + 1;
				doPutRequest("/document/" + uuid, document, function(res) {
					if (res == false)
						callback(null);
					else callback(uuid);
				});
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

exports.docDelete = function(docId, callback) {
	doGetRequest("/document/_design/application/_view/last?key=\"" + docId + "\"", function(res) {
		if ((!res) || (res.rows.length == 0)) {
			callback(false);
			return;
		}
		for (var i = 0 ; i < res.rows.length ; i++)
			doDelete("/document/" + res.rows[i].id, function(ret) {});
		callback(true);
	});
}


function docById(id, callback) {
	doGetRequest("/document/" + id, callback);
}

// FUCKING SQL !

exports.getLastVersion = getLastVersion;

function getLastVersion(docId, callback) {
	doGetRequest("/document/_design/application/_view/last?key=\"" + docId + "\"", function(res) {
		if (res == null) {
			callback(0);
			return;
		}
		version = 0;
		res.rows.forEach(function(elem) {
			if (elem.value > version)
				version = elem.value;
		});
		callback(version);
	});
}

exports.docGet = docGet;

function docGet(docId, version, callback) {
	if (version == -1) {
		getLastVersion(docId, function(ver) {
			docGet(docId, ver, callback);
		});
		return;
	}
	doGetRequest("/document/_design/application/_view/last?key=\"" + docId + "\"", function(res) {
		if (res == null) {
			callback(null);
			return;
		}
		for (var i = 0 ; i < res.rows.length ; i++) {
			if (res.rows[i].value == version) {
				docById(res.rows[i].id, callback);
				return;
			}
		}
		callback(null);
	});
}

exports.docByUser = function(login, callback) {
	out = {"owner": [], "collaborator": []};
	var helper = function(res, list) {
		if (res == null) {
			callback(null);
			return;
		}
		res.rows.forEach(function(elem) {
			var wasInList = false;
			for (var i = 0 ; i < list.length ; i++) {
				if ((list[i].docId == elem.value.docId) && (elem.value.version > list[i].version)) {
					list[i] = {id: elem.id, docId: elem.value.docId, version: elem.value.version, title: elem.value.title};
					wasInList = true;
					break;
				}
			}
			if (!wasInList)
				list.push({_id: elem.id, docId: elem.value.docId, version: elem.value.version, title: elem.value.title});
		});
	}
	doGetRequest("/document/_design/application/_view/get?key=\"" + login + "\"", function(res) {
		helper(res, out.owner);
		doGetRequest("/document/_design/application/_view/collab?key=\"" + login + "\"", function(res) {
			helper(res, out.collaborator);
			callback(out);
		});
	});
}

exports.userByPrefix = function(prefix, callback) {
	// Error: null
	// No value: []
	// Success: [{login, imgUrl}]
	doGetRequest("/user/_design/application/_view/images", function(res) {
		if (res == null) {
			callback(null);
			return;
		}
		list = [];
		res.rows.forEach(function(elem) {
			if (elem.key.toLowerCase().indexOf(prefix.toLowerCase()) === 0)
				list.push({login: elem.key, imgUrl: elem.value});
		});
		callback(list);
	});
};

