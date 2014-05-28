var Collections = require('./index'),
    Notification = Collections.Notification,
    ObjectID = Collections.ObjectID,
    _ = require('underscore');

exports.createNotificationToUsers = function (notification, users, callback){
	var defaultNotification = {
		readers: users,
		unseen: users
	};
	notification = _.extend(defaultNotification, notification);
	Notification.insert(notification, callback);
}

exports.getNotificationById = function(id, callback){
	Notification.findOne({_id: ObjectID.createFromHexString(id)}, callback);
}

exports.getAllNotifications = function(userId, cb) {
	Notification.find({readers: userId}, function(err, items){
		if (err) return cb(err);
		items.toArray(cb);
	});
};

exports.getAllUnseenNotifications = function(userId, cb){
	Notification.find({unseen: userId}, function(err, items){
		if (err) return cb(err);
		items.toArray(cb);
	});
};

exports.seeNotification = function(id, userId, cb){
	Notification.update({_id: ObjectID.createFromHexString(id)}, {
		$pull: {unseen: userId}
	}, cb);
};
