var Site = require('./site.js'),
    User = require('./user.js'),
    Contest = require('./contest.js'),
    Team = require('./team.js');
    // Upload = require('./upload.js');

module.exports = function(app){
	app.get('/', User.checkLogin, Site.index);
	app.get('/index', User.checkLogin, Site.index);

	app.get('/register', User.checkNotLogin, User.register);
	app.post('/register', User.postNewUser);
	app.get('/user/:id', User.getInformation);
	app.post('/checkUserMail', User.checkUserMail);
	app.get('/login', User.checkNotLogin, User.loginPage);
	app.post('/login', User.login);

	app.get('/logout', User.logout);	
	
	app.post('/postUserTags', User.postUserTags);
	app.post('/postUserInfo', User.postUserInfo);
	app.post('/postNotification', User.postNotification);

	//------for pre-------------//
	app.get('/team', User.checkLogin, Team.index);
	app.post('/postNewTeam', Team.postNewTeam);
	app.get('/contest', User.checkLogin, function(req, res) {
		res.render('contest/contest',{
			c: {
				"首页": "third-item",
				"赛事": "first-item",
				"队伍": "second-item"
			}
		});
	});
	app.get('/users_information', function(req, res) {
		res.render('users_information/users_information');
	});
	app.get('/msgs', function(req, res) {
		res.render('msgs/msgs');
	});
	app.all('*', function(req, res){
		res.end("");
	});
}