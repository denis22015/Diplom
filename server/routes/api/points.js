
const express = require('express');
const router = express.Router();


const authorize = require('../autorizeCheckFunc.js');


const controller = require('../../controllers/routes/points/points.js');

router
    .get('/add/:lat/:lng/:time/:log/:pass', controller.addPoint) //add coords from android\
    .get('/get/', authorize,controller.getPointsWeb)
    .get('/getAndr/:log/:pass', controller.getPointsAndroid)
    .get('/enable/:point', authorize, controller.enablePoint);
    

module.exports = router;