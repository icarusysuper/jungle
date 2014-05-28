var User = require('../collections/user.js'),
    Tag = require('../collections/tag.js'),
    Notification = require('../collections/notification'),
    EventProxy = require('eventproxy'),
    md5 = require('../helpers/md5.js'),
    _ = require('underscore'),
    // upload = require('./upload.js'),
    check = require('validator').check,
    filterInput = require('../helpers/filterInput.js');

exports.register = function(req, res, next){
	res.render('regist_login/regist');
};

exports.loginPage = function(req, res, next){
	res.render('regist_login/login');
};

exports.login = function(req, res, next){
	var email = filterInput(req.body.email),
	    password = filterInput(req.body.password);
	User.getUserByMail(email, function(err, user){
		if (err) return next(err);
		if (user && user.password === md5(password)){
			req.session.user = user;
			return res.redirect('/index');
		}
	});
};

exports.postNewUser = function(req, res, next){
	var email = filterInput(req.body['e-mail']),
	    username = filterInput(req.body.username),
	    password = filterInput(req.body.password);

	    console.log(email+username+password);

	var proxy = new EventProxy();
	proxy.on('checkUserMail', function(user) {
		if (user) {
			return next('该邮箱已被注册');
		} else {
			User.createUser({
				email: email,
				username: username,
				password: md5(password)				
			}, function(err, user){
				if (err) return next(err);
				req.session.user = user[0];
				return res.redirect('/index');
			});
		}
	});
	User.getUserByMail(email, function(err, user) {
		if (err) return next(err);
		proxy.emit('checkUserMail', user);
	});
};

exports.postUserTags = function(req, res, next){
	var user = req.session.user;
	user.tags = user.tags || [];
	var postTags = req.body.tags,
	    userTagsName = _.map(user.tags, getTagName),
	    postTagsName = _.map(postTags, getTagName);
	    deleteTagsName = _.difference(userTagsName, postTagsName);

	var proxy = new EventProxy();

	proxy.assign('afterAdded', 'afterDeleted', function(){
		res.send(0);
	});

	proxy.after('tagsAddUser', postTags.length, function(tags){
		user.tags = tags;
		User.updateUser({_id: user._id.toString()}, user, function(err, user){
			if (err) return proxy.fail(next);
			req.session.user = user;
			proxy.emit('afterAdded');
		});
	});

	proxy.after('tagsDeleteUser', deleteTagsName.length, function(){
		proxy.emit('afterDeleted');
	});

	_.each(postTags, function(postTag){
		(function(postTag){
			Tag.createTagByName(postTag.name, function(err, tag){
				if (err) return proxy.fail(next);

				tag.members = tag.members || [];
				tag.members = _.union(tag.members, [user._id]);
				Tag.updateTag({_id: tag._id.toString()}, tag, function(err, tag){
					if (err) return proxy.fail(next);
					proxy.emit('tagsAddUser', {
						id: tag._id,
						name: tag.name,
						description: postTag.description
					});
				});
			});
		}(postTag));
	});

	_.each(deleteTagsName, function(tagName){
		updateOption = { $pull: { members: user._id } };
		Tag.updateTag({name: tagName}, updateOption, function(err, tag){
			if (err) return proxy.fail(next);
			proxy.emit('tagsDeleteUser');
		});
	});

	function getTagName(tag) {
		return tag.name;
	};
};

exports.postUserInfo = function(req, res, next){
	var user = req.session.user,
	    info = req.body.info;

	User.updateUser({_id: user._id}, {$set: info}, function(err, user){
		if (err) return next(err);
		req.session.user = user;
		res.send(0);
	});
};

exports.getInformation = function(req, res, next){
	var id = req.params.id;
	User.getUserById(id, function(err, user){
		res.render('users_information/users_information', {
			user: user
		});
	});
}

exports.postNotification = function(req, res, next){
	var user = req.session.user,
	    userId = req.body.userId,
	    msg = filterInput(req.body.msg),
	    notification = {
	    	from: User.getMainUserInfo(user),
	    	msg: msg
	    };
	    console.log(userId);

	Notification.createNotificationToUsers(notification, [userId], function(err, notification){
		if (err) return next(err);
		res.send(0);
	});

}

exports.seeNotification = function(req, res, next){
	var ids = req.body.ids,
	    user = req.session.user,
	    proxy = new EventProxy();

	proxy.after('handleSee', ids.length, function(){
		res.send(1);
	});

	_.each(ids, function(notid){
		Notification.seeNotification(notid, user._id, function(err){
			if (err) return proxy.fail(next);
			proxy.emit('handleSee');
		});
	});
}

exports.checkUserMail = function(req, res, next){
	var email = req.body.email;
	console.log(email);
	try{
		check(email, "不合法邮箱").isEmail();
	} catch (e){
		return res.send('invalid');
	}
	User.getUserByMail(email, function(err, user){
		if (err) return next(err);
		if (user){
			res.send("used");
		} else {
			res.send("valid");
		}
	});
};

exports.logout = function(req, res, next){
	console.log ('logout');
	req.session.user = null;
	// res.render('/login');
	res.redirect('/login');
};

exports.checkLogin = function(req, res, next){
	if (!req.session.user){
		return res.redirect('/login');
	} else {
		Notification.getAllUnseenNotifications(req.session.user._id, function(err, notifications){
			req.session.user.notifications = notifications;
			res.locals.user = req.session.user;
			next();
		});
	}
};

exports.checkNotLogin = function(req, res, next){
	if (req.session.user){
		return res.redirect('/');
	}
	next();

};