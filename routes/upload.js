var ndir = require('ndir'),
    fs = require('fs'),
    util = require('util'),
    path = require('path'),
    config = require('../config.js'),
    filterInput = require('../helpers/filterInput.js'),
    EventProxy = require('eventproxy'),
    User = require('../collections/user.js');

ndir.mkdir(config.upload_img_dir, function(err){
  if (err) throw err;
  console.log('create images folder successfully');
});


exports.uploadImg = function(req, res, next){
	var file;
	if (req.files) file = req.files.imgFile;
	if(file.size === 0) return next("上传失败");

	var namesplit = file.name.split('.');
	var suffix = namesplit[namesplit.length - 1];
	var filename = Date.now()+"_"+Math.random()*100+"."+suffix
	  , savepath = path.join(config.upload_img_dir, filename);

	var readStream = fs.createReadStream(file.path);
	var writeStream = fs.createWriteStream(savepath);

	util.pump(readStream, writeStream, function(err){
		if (err) return next(err);

		var url = '/upload/images/' + encodeURIComponent(filename);
		console.log(url);
		res.send({error: '0', url: url});
	});
}

exports.uploadFile = function(req, res, next){
	var file = req.files['uploaded-file'],
	    namesplit = file.name.split('.'),
	    suffix = namesplit[namesplit.length - 1];
	var filename = "file_"+Date.now()+"_"+Math.random()*100+"."+suffix
	  , savepath = path.join(config.upload_file_dir, filename);

	var readStream = fs.createReadStream(file.path);
	var writeStream = fs.createWriteStream(savepath);

	util.pump(readStream, writeStream, function(err){
		if (err) return next(err);

		var circle = req.session.circle
		  , user = req.session.user;

		var newFile = {
			circle: {
				id: circle._id,
				name: circle.name,
				avatar: circle.avatar
			},
			author: {
				id: user._id,
				username: user.username,
				avatar: user.avatar
			},
			createAt: Date.now(),
			title: filterInput(req.body['file-title']),
			content: filterInput(req.body['file-description']),
			commentsNum: 0,
			comments: [],
			viewsNum: 0,
			url: '/upload/files/'+filename
		}

		var proxy = new EventProxy();
		proxy.on('created', function(file){
			proxy.assign('updateCircle', 'updateUser', function(circle, user){
				req.session.circle = circle;
				req.session.user = user;
				res.redirect('/circle/'+circle.name+'/files/'+file._id);
			}).fail(next);

			var circlequery = {_id: circle._id}
			  , circleupdate = {$push: {files: file._id.toString()}, $inc: {fileNum: 1}};
			Circle.updateCircle(circlequery, circleupdate, proxy.done('updateCircle'));

			var userquery = {_id: user._id}
			  , userupdate = {$push: {createActivities: file._id.toString()}};
			User.updateUser(userquery, userupdate, proxy.done('updateUser'));
		});

		Activity.createActivity(newFile, function(err, file){
			if (err) return proxy.fail(next);
			proxy.emit('created', file[0]);
		});

	});	
}

exports.uploadPhoto = function(req, res, next){
	var file = req.files['uploaded-photo'],
	    namesplit = file.name.split('.'),
	    suffix = namesplit[namesplit.length - 1];
	var filename = "photo_"+Date.now()+"_"+Math.random()*100+"."+suffix
	  , savepath = path.join(config.upload_photo_dir, filename);

	var readStream = fs.createReadStream(file.path);
	var writeStream = fs.createWriteStream(savepath);

	util.pump(readStream, writeStream, function(err){
		if (err) return next(err);

		var circle = req.session.circle
		  , user = req.session.user;

		var newPhoto = {
			author: {
				id: user._id,
				username: user.username,
				avatar: user.avatar
			},
			createAt: Date.now(),
			url: '/upload/photos/'+filename
		}

		var proxy = new EventProxy();
		proxy.assign('updateCircle', function(circle){
			req.session.circle = circle;
			res.redirect('/circle/'+circle.name+'/');
		}).fail(next);

		var circlequery = {_id: circle._id}
		  , circleupdate = {$push: {photos: newPhoto}};
		Circle.updateCircle(circlequery, circleupdate, proxy.done('updateCircle'));

	});	
}

exports.uploadAvatar = function(req, callback){
	var file, filename, savepath;
	if(req.files) file = req.files.avatar;
	if(file.size === 0){
		filename = 'avatar-default.jpg';
		savepath = path.join('/upload/images/', filename);
		callback(null, savepath);
	} else {
		var namesplit = file.name.split('.');
		var suffix = namesplit[namesplit.length - 1];
		filename = "user_"+filterInput(req.body.username)+"_"+Date.now()+"."+suffix;
		savepath = path.join(config.upload_img_dir, filename);

		var readStream = fs.createReadStream(file.path);
		var writeStream = fs.createWriteStream(savepath);

		util.pump(readStream, writeStream, function(err){
			if (err) return callback(err);
			var url = path.join('/upload/images/', filename);
			callback(null, url);
		});
	}
}

exports.uploadCircleAvatar = function(req, callback){
	var file, filename, savepath;
	if(req.files) file = req.files['circle-avatar'];
	if(file.size === 0){
		filename = 'circle-avatar-default.jpg';
		savepath = path.join('/upload/images/', filename);
		callback(null, savepath);
	} else {
		var namesplit = file.name.split('.');
		var suffix = namesplit[namesplit.length - 1];
		filename = "circle_"+filterInput(req.body['circle-name'])+"_"+Date.now()+"."+suffix;
		savepath = path.join(config.upload_img_dir, filename);

		var readStream = fs.createReadStream(file.path);
		var writeStream = fs.createWriteStream(savepath);

		util.pump(readStream, writeStream, function(err){
			if (err) return callback(err);
			var url = path.join('/upload/images/', filename);
			callback(null, url);
		});
	}
}