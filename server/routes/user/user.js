
const express       = require('express');
const passport      = require('passport');
const passportLocal = require('passport-local').Strategy;
const router        = express.Router();


const strategy = require('../../controllers/user/userStrategy.js');
const logout = require('../../controllers/user/logout.js');
const serialize = require('../../controllers/user/serialize.js');
const deserialize = require('../../controllers/user/deserialize.js');
const authorize = require('../autorizeCheckFunc.js');

passport.serializeUser(serialize);
passport.deserializeUser(deserialize);

passport.use(  new passportLocal({
        passReqToCallback: true,
        usernameField: 'username',
        passwordField: 'password'
    },strategy
));


router.get('/logout',authorize, logout);


router.post('/login',passport.authenticate('local', { successRedirect: '/', failureRedirect: '/' }));



module.exports = router;