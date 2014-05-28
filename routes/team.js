var Team = require('../collections/team.js'),
    User = require('../collections/user.js'),
    Notification = require('../collections/notification'),
    Contest = require('../collections/contest.js'),
    EventProxy = require('eventproxy'),
    check = require('validator').check,
    filterInput = require('../helpers/filterInput.js'),
    dateTranslate = require('../helpers/dateTranslate.js');

exports.index = function(req, res, next){
	Team.getTeamByQuery({}, function(err, teams){
		if (err) return next(err);
		res.render('team/team', {
			c: {
				"首页": "third-item",
				"赛事": "second-item",
				"队伍": "first-item"
			},
			teams: teams
		});
	});
}

exports.postNewTeam = function(req, res, next){
	var user = req.session.user,
	    contest = filterInput(req.body.contest),
	    url = filterInput(req.body.url),
	    deadLine = filterInput(req.body.deadLine),
	    cla = filterInput(req.body.class),
	    tags = req.body.tags,
	    details = filterInput(req.body.details);

	var newTeam = {
		url: url,
		creator: User.getMainUserInfo(user),
		deadLine: deadLine,
		class: cla,
		tags: tags,
		contest: {
			name: contest
		},
		details: details,
	};

	var proxy = new EventProxy();

	proxy.on('createdTeam', function(team){
		var proxy2 = new EventProxy();

		proxy2.assign('updateContest', 'updateUser', function(contest, user){
			req.session.user = user;
			res.redirect("/team");
		}).fail(next);

		if (team.contest.id){
			var query = {_id: team.contest.id},
			    update = {
			    	$inc: {findingTeams: 1},
			    	$push: {
			    		id: team._id.toString(),
			    		creator: team.creator
			    	}
			    };
			Contest.updateContest(contestquery, contestupdate, proxy2.done('updateContest'));
		} else {
			proxy2.emit('updateContest');
		}

		var userquery = {_id: user._id},
		    userupdate = {$push: {teams: team._id.toString()}};
		User.updateUser(userquery, userupdate, proxy2.done('updateUser'));
	});

	Team.createTeam(newTeam, function(err, team){
		if (err) return proxy.fail(next);
		proxy.emit('createdTeam', team[0]);
	});
};

exports.finishFinding = function(req, res, next){
	var teamId = req.body.id;

	var proxy = new EventProxy();

	proxy.assign('updatedContest', 'updatedTeam', function(){
		res.send(1);
	});

	var query  = {_id: teamId},
	    update = { $set: { state: "finish" } };
	Team.updateTeam(query, update, function(err){
		if (err) return proxy.fail(next);
		proxy.emit('updatedTeam');
	});

	Team.getTeamById(teamId, function(err, team){
		if (team.contest.id) {
			Contest.getContestById(team.contest.id, function(err, contest){
				var contestquery = {_id: contest._id}, 
				    contestupdate = { $inc: {findingTeams: -1} };

				Contest.updateContest(contestquery, contestupdate, proxy.done('updatedContest'));
			});
		} else {
			proxy.emit('updatedContest');
		}
	});
};

exports.sendMessageTocreator = function(req, res, next){
	var teamId = req.body.teamId,
	    msg = filterInput(req.body.msg);

	Team.getTeamById(teamId, function(err, team){
		if (err) return next(err);

		var creator = team.creator;
		Notification.createNotificationToUsers({
			msg: msg
		}, [creator.id], function(err, notification){
			if (err) return next(err);
			res.send(1);
		});
	});
};