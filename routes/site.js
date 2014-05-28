var Contest = require('../collections/contest.js'),
    EventProxy = require('eventproxy'),
    check = require('validator').check,
    filterInput = require('../helpers/filterInput.js'),
    dateTranslate = require('../helpers/dateTranslate.js');

exports.index = function(req, res, next){
	var user = req.session.user;

	res.render('index');
	// res.render('regist_login/regist');
	// res.render('msgs/msgs');
	// res.render('users_information/users_information')
	// res.render('contest/contest');
	// res.render('user_info_list/user_info_list');

	// Contest.getContestByQuery({}, function(err, contests){
	// 	res.render('index', {
	// 		contests: contests
	// 	});
	// });
	
};