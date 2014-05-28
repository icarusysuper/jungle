var config = require('../config'),
    _ = require('underscore'),
    camel = require('../helpers/string').camel;

var db_path = "http://" + config.username + ":" + config.password + "@" + config.db_host + ":" + config.db_port + "/" + config.db_name + '?auto_reconnect=true',
    // db = require('mongoskin').db(db_path, {safe: true});
    db = require('mongoskin').db('localhost:27017/jungle', {safe: true});

exports.db = db;
exports.ObjectID = db.ObjectID;

var collections = ["user", "contest", "team", "tag", "notification"];
_.each(collections, function(name) {
	var camelName = camel(name);
	exports[camelName] = db.collection(name);
});