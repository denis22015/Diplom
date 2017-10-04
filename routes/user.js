
module.exports = function(app){
    const passport       = require('passport');
    const passportLocal = require('passport-local').Strategy;
    const cookieParser = require('cookie-parser');
    const bodyParser = require('body-parser');
    const expressSession = require('express-session');

    const crypt = require("apache-crypt");
    const md5 = require('md5');

    app.use(cookieParser());
    app.use(bodyParser.urlencoded({extended:true}));

    app.use(expressSession({
        secret: 'ыу',
        expires: new Date(Date.now() + 1000 * 60 * 6000),
        saveUninitialized: true,
        resave: true,
    collection: 'sessions',cookie : { secure : false, maxAge : (2*60 * 60 * 60 * 1000) }
    }));
    
     app.use(passport.initialize());
     app.use(passport.session());

    
    
    passport.serializeUser(function(user, done) {
        done(null, user);
    });
    
    
    passport.deserializeUser(function(obj, done) {
        done(null, obj);
    });

    passport.use(  new passportLocal({
                passReqToCallback: true,
                usernameField: 'username',
                passwordField: 'password'
            },
            function( req, username, password, done) {
                const _q = `select * from sessions where lower(login)= lower(${username})  `;

                app.dbQuery(req, null, _q, function(err, result) {
                    if(err){

                        console.log(err.toString());
                    }
                    req.session=req.session||{}

                    req.session.user=req.session.user||[];
                    if (!result[0]) {
                        console.log('wrong login and pass');
                        return done(null, null);
                    }

                    const salt = result[0].salt;
                    const pass = result[0].password;
                    const login = result[0].login;
                    let hash = '';
                    for (var i = 0; i < 10; i++) {
                        hash = md5(password + hash + salt);
                    }
                    hash = crypt(hash, salt);
                    if(pass==password){                       
                       req.logIn(result[0],function(){
                            req.session.user.push( result[0])
                            done(null, result[0]);
                       }) 
                    }
                }) 
            }
        ));

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/'); //пробуем
    });






    app.post('/login',      passport.authenticate('local', {  failureRedirect: '/fail' }),//)

        function(req, res) {
           
             console.log(req.user);

            if (!req.user) {
                console.log('failed redirect');
                return res.redirect('/map');
            }  else {
                req.logIn(req.user,function(err){
                    if(err){


                       return res.end(err);

                    }

                    req.session.save(function(){ 
                        res.redirect('/map');      
                    });
                   
                })
            }
        }
    );
}
