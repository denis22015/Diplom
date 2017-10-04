
const express = require('express');
const router = express.Router();


const authorize = require('../autorizeCheckFunc.js');


const controller = require('../../controllers/routes/bounds.js');

router
    .post('/set/', authorize,controller.addBound)
    .get('/get/',authorize, controller.getBounds)
    .get('/rem/:id', authorize, controller.remBounds)


module.exports = router;