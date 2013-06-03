var socketIO = require('socket.io');

var io;
var users = {};

exports.initIO = function(server) {
	io = socketIO.listen(server);
	io.sockets.on('connection', function (socket) {
		socket.on('login', function(data) {
			users[data.login] = socket;
		});
		socket.on('disconnect', function() {
			for (var login in users)
					if (users[login] === socket)
						delete users[login];
		});
	});
};

exports.sendNotification = function(login, notification) {
	if (users[login] !== undefined) {
		users[login].emit('notification', notification);
		return true;
	}
	return false;
}

