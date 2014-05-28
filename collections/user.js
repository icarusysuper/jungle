var Collections = require('./index'),
    User = Collections.User,
    ObjectID = Collections.ObjectID,
    _ = require('underscore');

exports.createUser = function (user, callback){
	var defaultUserInfo = {
		description: null,
		avatar: null,
		school: null,
		grade: null,
		createAt: Date.now(),
		teams: [],
		tags: []
	};
	user = _.extend(defaultUserInfo, user);
	User.insert(user, callback);
}

exports.getMainUserInfo = function(user){
	return {
		id: user._id,
		username: user.username,
		email: user.email,
		avatar: user.avatar
	};
}

exports.getUserById = function(id, callback){
	User.findOne({_id: ObjectID.createFromHexString(id)}, callback);
}

function getUserByName (username, callback){
	User.findOne({username: username}, callback);
}
exports.getUserByName = getUserByName;
exports.userLoginByName = getUserByName;

function getUserByMail (email, callback){
	User.findOne({email: email}, callback);
}
exports.getUserByMail = getUserByMail;
exports.userLoginByMail = getUserByMail;

exports.getUsersByQuery = function(query, callback){
	User.find(query, function(err, items){
		if (err) return callback(err);
		items.toArray(callback);
	});
}

exports.updateUser = function(query, update, callback){
	if (query._id) query._id = ObjectID.createFromHexString(query._id);
	delete update._id;
	User.update(query, update, function(err, num){
		if (err) return callback(err);
		if (num) return User.findOne(query, callback);
		return callback(1);
	});
}
