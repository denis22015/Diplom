	const passport       = require('passport');
	const cookieParser = require('cookie-parser');
	const bodyParser = require('body-parser');
	const expressSession = require('express-session');
	const configSession = require('./config/userSessionConf.js');
module.exports=(app)=>{
	app.use(cookieParser());
	app.use(bodyParser.urlencoded({extended:true}));
	app.use(expressSession(configSession()));  

	app.use(passport.initialize());
	app.use(passport.session());
}