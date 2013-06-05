"use strict";

var couchWrapper = require("./couch-wrapper");
var socketIO = require('socket.io');

var io;
var users = {};

exports.initIO = function(server) {
	io = socketIO.listen(server);
	io.sockets.on('connection', function (socket) {
		socket.on('login', function (data) {
			users[data.login] = socket;
			for (var user in users)
				console.log(user);
		});
		socket.on('disconnect', function () {
			for (var login in users)
					if (users[login] === socket)
						delete users[login];
		});
	});
};

exports.sendNotification = function(login, notification) {
	console.log("Sending to " + login);
	if (users[login] !== undefined) {
		users[login].emit('notification', notification);
		return true;
	}
	console.log("Notification failed");
	return false;
}

exports.notify = function(login, notification) {
	console.log("notifying " + login);
	console.log("> " + JSON.stringify(notification));
	couchWrapper.userGet(login, function (user_object) {
		if (user_object) {
			if (!user_object.notifications) {
				user_object.notifications = [];
			}
			user_object.notifications.push(notification);
			couchWrapper.userUpdate(user_object);
		}
	});
	exports.sendNotification(login, notification);
};

exports.notificationsOfCreation = function(doc) {
	var notifications = [];
	notifications.push(
		{
			notifieds: exports.notifieds(doc.owner, exports.collaboratorsLogins(doc.collaborators), doc.owner),
			notification: {type: "document", text: doc.owner + " added you to the collaborators list of \"" + doc.title + "\".", docId: doc.docId}
		}
	);
	return notifications;
};

function collaboratorsChanged(a, b) {
	var new_coll = [];
    if (!a || !b) {
    	if (!a && !b) {
    		return [];
    	} else if (!a & b) {
    		return b;
    	} else {
    		return [];
    	}
    }

    for (var i = 0; i < b.length; i += 1) {
    	if (a.indexOf(b[i]) === -1) {
    		new_coll.push(b[i]);
    	}
    }
    return new_coll;
}

exports.notificationsOfChange = function(old_doc, new_doc, login) {
	var notifications = [], i, j;
	if (!old_doc || !new_doc || !login) {
		return [];
	}
	if (new_doc.content.length !== old_doc.content.length) {
		notifications.push(
			{
				notifieds: exports.notifieds(new_doc.owner, exports.collaboratorsLogins(new_doc.collaborators), login),
				notification: {type: "document", text: login + " changed the architecture of \"" + old_doc.title + "\".", docId: new_doc.docId}
			}
		);
	}
	if (collaboratorsChanged(exports.collaboratorsLogins(old_doc.collaborators), exports.collaboratorsLogins(new_doc.collaborators)).length > 0) {
		notifications.push(
			{
				notifieds: collaboratorsChanged(exports.collaboratorsLogins(old_doc.collaborators), exports.collaboratorsLogins(new_doc.collaborators)),
				notification: {type: "document", text: login + " added you to the collaborators list of \"" + new_doc.title + "\".", docId: new_doc.docId}
			}
		);
	}
	for (i = 0; i < old_doc.content.length; i += 1) {
		if (!old_doc.content[i].discussions && !new_doc.content[i].discussions) {
			continue;
		}
		if ((!old_doc.content[i].discussions && new_doc.content[i].discussions) || (old_doc.content[i].discussions.length < new_doc.content[i].discussions.length)) {
			notifications.push(
				{
					notifieds: exports.notifieds(new_doc.owner, exports.collaboratorsLogins(new_doc.collaborators), login),
					notification: {type: "discussion", text: login + " started a new discussion about section \"" + new_doc.content[i].title + "\" of \"" + old_doc.title + "\".", docId: new_doc.docId, sectionIndex: i, discussionIndex: new_doc.content[i].discussions.length - 1, discussion: new_doc.content[i].discussions[new_doc.content[i].discussions.length - 1]}
				}
			);
		}
		else if (old_doc.content[i].discussions.length === new_doc.content[i].discussions.length) {
			for (j = 0; j < old_doc.content[i].discussions.length; j += 1) {
				if (new_doc.content[i].discussions[j].resolved && !old_doc.content[i].discussions[j].resolved) {
					notifications.push(
						{
							notifieds: exports.notifieds(new_doc.owner, exports.collaboratorsLogins(new_doc.collaborators), login),
							notification: {type: "discussion", text: login + " resolved the discussion \"" + old_doc.content[i].discussions[j].title + "\" which was about \"" + old_doc.content[i].title + "\" of \"" + old_doc.title + "\".", docId: new_doc.docId, sectionIndex: i, discussionIndex: j}
						}
					);
				}
				if (new_doc.content[i].discussions[j].posts.length > old_doc.content[i].discussions[j].posts.length) {
					notifications.push(
						{
							notifieds: exports.notifieds(new_doc.owner, exports.collaboratorsLogins(new_doc.collaborators), login),
							notification: {type: "discussion", text: login + " answered the discussion \"" + old_doc.content[i].discussions[j].title + "\" which was about \"" + old_doc.content[i].title + "\" of \"" + old_doc.title + "\".", docId: new_doc.docId, sectionIndex: i, discussionIndex: j, discussion: new_doc.content[i].discussions[j]}
						}
					);
				}
			}
		}
	}
	return notifications;
};

exports.notifyAll = function(users, notification) {
	var i, j;
	for (i = 0; i < users.length; i += 1) {
		exports.notify(users[i], notification);	
	}
};

exports.notifieds = function(owner, collaborators, login) {
	var notifieds = [];
	if (collaborators.indexOf(owner) === -1) {
		collaborators.push(owner)
	}

	notifieds = collaborators.filter(function (element, index, array) {
		return element != login;
	});
	return notifieds;
};

exports.collaboratorsLogins = function(collaborators) {
	var logins = [], i;
	for (i = 0; i < collaborators.length; i += 1) {
		logins.push(collaborators[i].login);
	}
	return logins
};
