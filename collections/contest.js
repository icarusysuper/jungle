var Collections = require('./index'),
    Contest = Collections.Contest,
    ObjectID = Collections.ObjectID;

Contest.find({}, function(err, items){
	if (items) {
		items.toArray(function(err, items){
			if (items.length === 0) {
				Contest.insert({a: 1}, function(err, item){
					console.log(item[0]);
				});
			}
		});
	}
});

exports.createContest = function (docs, callback){
	Contest.insert(docs, callback);
}

exports.getContestById = function(id, callback){
	Contest.findOne({_id: ObjectID.createFromHexString(id)}, callback);
}

exports.getContestByName = function(name, callback){
	Contest.findOne({name: name}, callback);
}

exports.getContestByQuery = function(query, option, callback){
	if (arguments.length === 2){
		callback = option;
		Contest.find(query, function(err, items){
			if (err) return callback(err);
			items.toArray(callback);
		});
	} else if (arguments.length === 3){
		Contest.find(query, option, function(err, items){
			if (err) return callback(err);
			items.toArray(callback);
		});
	}
}

exports.updateContest = function(query, update, callback){
	if (query._id) query._id = ObjectID.createFromHexString(query._id);
	delete update._id;
	Contest.update(query, update, function(err, num){
		if (err) return callback(err);
		if (num) return Contest.findOne(query, callback);
		return callback(1);
	});
}