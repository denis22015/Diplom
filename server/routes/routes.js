


const express = require('express');
const router = express.Router();


const path = require('path');


const setSession = require('../controllers/routes/setSession.js');
const geocode = require('../controllers/routes/geocode.js');

router
    .get('/set/session/:username/:password',setSession) //used for registration user from Android
    .get('/geocode',geocode)



module.exports = router;