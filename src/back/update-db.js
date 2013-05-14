var db = require("./couch-wrapper");
var map = require("./map");
db.docUpdate(map, function(res) {
	console.log(res);
	process.exit();
});
