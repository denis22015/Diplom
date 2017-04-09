
module.exports = function(app){
    var passport       = require('passport');
    var LocalStrategy  = require('passport-local').Strategy;
var flash=require("connect-flash");
app.use(flash());
   
app.use(passport.initialize());
var session = require('express-session');
app.use(session({secret: '{secret}', name: 'session_id', saveUninitialized: true, resave: true}));

    // Passport:
    app.use(passport.initialize());
    app.use(passport.session());

    passport.use(new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password'
    },
          function(username, password, done) {
            console.log(2)
            return done(null, user)
            // User.findOne({ username: username }, function(err, user) {


            // console.log(3)
            //   if (err) { return done(err); }
            //   if (!user) {
            //     return done(null, false, { message: 'Incorrect username.' });
            //   }
            //   if (!user.validPassword(password)) {
            //     return done(null, false, { message: 'Incorrect password.' });
            //   }
            //   return done(null, user);



            // });
          }
        )); 




    passport.serializeUser(function(user, done) {
      done(null, user.id);
    });


    passport.deserializeUser(function(id, done) {
      User.findById(id, function(err,user){
        err 
          ? done(err)
          : done(null,user);
      });
    });




    // Здесь все просто =)
    funcLogout = function(req, res) {
      req.logout();
      res.redirect('/');
    };
    

    app.post('/login',      passport.authenticate('local', { successRedirect: '/',
                                       failureRedirect: '/map' })
    );
}