var Collections = require('./index'),
    Team = Collections.Team,
    ObjectID = Collections.ObjectID,
    _ = require('underscore');

exports.createTeam = function (team, callback){
	var defaultTeamInfo = {
		createAt: Date.now(),
		state: "in",
		details: "什么都没"
	};
	team = _.extend(defaultTeamInfo, team);
	console.log(team);
	Team.insert(team, callback);
}

exports.getTeamById = function(id, option, callback){
	if (arguments.length === 2){
		callback = option;
		Team.findOne({_id: ObjectID.createFromHexString(id)}, callback);
	} else {
		Team.findOne({_id: ObjectID.createFromHexString(id)}, option, callback);
	}
}

exports.getTeamByQuery = function(query, option, callback){
	if (arguments.length === 2){
		callback = option;
		Team.find(query, function(err, items){
			if (err) return callback(err);
			items.toArray(callback);
		});
	} else if (arguments.length === 3){
		Team.find(query, option, function(err, items){
			if (err) return callback(err);
			items.toArray(callback);
		});
	}
}

exports.updateTeam = function(query, update, callback){
	if (query._id) query._id = ObjectID.createFromHexString(query._id);
	delete update._id;
	Team.update(query, update, function(err, num){
		if (err) return callback(err);
		if (num) return Team.findOne(query, callback);
		return callback(1);
	});
}