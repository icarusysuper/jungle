var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , config = require('./config.js');

var app = express();

app.configure(function(){
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({
    secret: config.session_secret
  }));
  
  app.use(express.static(path.join(__dirname, 'public')));
  app.use('/upload/', express.static(config.upload_dir));
  app.use(function(req, res, next){
    res.locals.user = req.session.user;
    res.locals.c = {
      "首页": "first-item",
      "赛事": "second-item",
      "队伍": "third-item"
    }
    next();
  });
  app.use(app.router);
  routes(app);
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

http.createServer(app).listen(config.port, function(){
  console.log("Express server listening on port " + config.port);
});

module.exports = app;
