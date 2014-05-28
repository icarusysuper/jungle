var Collections = require('../collections'),
    Tag = Collections.Tag,
    ObjectID = Collections.ObjectID;

exports.createTagByName = function (name, callback){
	Tag.findOne({name: name}, function(err, tag){
		if (err) return callback(err);
		if (tag) {
			callback(null, tag);
		} else {
			Tag.insert({name: name}, function(err, tag){
				if (err) return callback(err);
				callback(null, tag[0]);
			});
		}
	});
}

exports.getTagById = function(id, callback){
	Tag.findOne({_id: ObjectID.createFromHexString(id)}, callback);
}

exports.getTagByName = function(name, cb){
	Tag.findOne({name: name}, cb);
}

exports.getTagByQuery = function(query, option, callback){
	if (arguments.length === 2){
		callback = option;
		Tag.find(query, function(err, items){
			if (err) return callback(err);
			items.toArray(callback);
		});
	} else if (arguments.length === 3){
		Tag.find(query, option, function(err, items){
			if (err) return callback(err);
			items.toArray(callback);
		});
	}
}

exports.updateTag = function(query, update, callback){
	if (query._id) query._id = ObjectID.createFromHexString(query._id);
	delete update._id;
	Tag.update(query, update, function(err, num){
		if (err) return callback(err);
		if (num) return Tag.findOne(query, callback);
		return callback(1);
	});
}
