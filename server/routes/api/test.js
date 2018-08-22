
const express = require('express');
const router = express.Router();

router
  .post('/test', (req, res) => {
    console.log(req.body);
    console.log(req.headers);
    // const info = Object.keys(req.body).reduce((acc, key) => {
    //   const data = req.body[key].split(/=(.+)/);
    //   return {...acc, [data[0].trim()]: data[1]}
    // }, {});
    //
    // console.log(info)

    res.json({
      test: 'test'
    })
  });


module.exports = router;