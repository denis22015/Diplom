
module.exports = function(app){
    var passport       = require('passport');
    //var LocalStrategy  = require('passport-local').Strategy;

var passportLocal = require('passport-local').Strategy;
//app.use(cookieParser('SECRET' ))
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressSession = require('express-session');

var crypt = require("apache-crypt");
var md5 = require('md5');

app.use(cookieParser());
app.use(bodyParser.urlencoded({extended:true}));

    app.use(expressSession({
        secret: 'ыу',
        expires: new Date(Date.now() + 1000 * 60 * 6000),
        saveUninitialized: true,
        resave: true,
    collection: 'sessions',cookie : { secure : false, maxAge : (2*60 * 60 * 60 * 1000) }
    }));


//app.use(expressSession({ secret: 'appsecret', saveUninitialized: true, cookie: { secure: true, maxAge: new Date(Date.now() + 3600000) }, key:'connect.sid' }));

    
     app.use(passport.initialize());
     app.use(passport.session());



// app.configure(function() {
//   app.use(express.static('public'));
//   app.use(express.cookieParser());
//   app.use(express.bodyParser());
//   app.use(express.session({ secret: 'keyboard cat' }));
//   app.use(passport.initialize());
//   app.use(passport.session());
//   app.use(app.router);
// });




     /*  app.use(cookieParser());
  app.use(bodyParser());
  app.use(expressSession({ secret: 'keyboard cat' }));
  app.use(passport.initialize());
  
  app.use(passport.session());
  app.use(app.router);*/
    passport.serializeUser(function(user, done) {
     //  console.log('+++++++++++++++++++++')
      //  console.log(user)
    //    console.log('+++++++++++++++++++++')
        done(null, user);
    });
    // passport.deserializeUser(function(user, done) {
    //        User.findById(user, function (err, user) {
    //          done(done, user);
    //         });
    // });
    passport.deserializeUser(function(obj, done) {

       // console.log('-----------------')
     //   console.log(obj)
      //  console.log('-----------------')
        done(null, obj);
    });

/*
     var middleware = passport.authenticate('local-signin', { session: true}, function(err, user, info){
      console.log("Test:"+user);
      if(err) {
        console.log("Error1");
        return next(err)}
      if(!user){
        console.log("Error2");
        return res.json(401, {error: 'Auth Error!'});
      }
      console.log("Error3");
      var token = jwt.encode({ username: user.email }, "hanswurst");
      res.json({token: token});
    })

     /*

    app.post('/auth', middleware);

*/
    passport.use(  new passportLocal({
                passReqToCallback: true,
                usernameField: 'username',
                passwordField: 'password'
            },
            function( req, username, password, done) {
            app.connectDB(req,null,function(err,req,res,client){

                 var _q = "select * from sessions where lower(login)= lower('"+ username+ "')  "
               // console.log(_q)

                app.queryDB(req,res,client,_q,function(err,result){
                    if(err){

                        console.log(err.toString())
                    }
                    req.session=req.session||{}

                    req.session.user=req.session.user||[];
                    //console.log(result)
                    if (!result[0]) {
                            console.log('wrong login and pass');
                            return done(null, null);
                        }

                    var salt = result[0].salt;
                    var pass = result[0].password;
                    var login = result[0].login;
                    var hash = '';
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
        })

 
        }));

    app.get('/logout', function(req, res) {
        //console.log('logout');
       // res.cacheControl({ 'no-cache': true });
        //console.log('logout');
        req.logout();
        // res.send('ok')
        res.redirect('/'); //пробуем
    });


    // passport.authenticate('local', function (err, user) {
    //     req.logIn(user, function (err) { // <-- Log user in
    //        return res.redirect('/'); 
    //     });
    // })(req, res);





    app.post('/login',      passport.authenticate('local', {  failureRedirect: '/fail' }),//)

    //    '/login',
    //     passport.authenticate('local', { successRedirect: '/',  failureRedirect: '/map' }),
        function(req, res) {
           
            //res.cacheControl({ 'no-cache': true });
            // If this function gets called, authentication was successful.
            // `req.user` contains the authenticated user.
            // console.log('--------');
            // console.log('--------');
             console.log(req.user);
            // console.log('--------');

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

    /*
    app.route('/login').post( 
      passport.authenticate('local-signin'),
      function(req, res) {
        // This will only get called when authentication succeeded.
        res.json({ "user" : req.user });
      }
    );*/
}