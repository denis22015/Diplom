



const pg = require('pg');

//better to hide it from git but it need for heroku
//
const config = require('./config/dbConf.json');


const dbQuery = query =>
	new Promise((res, rej) => {

    const pool = new pg.Pool(config);
    pool.connect((err, client, done) => {
      if (err) {
        console.log(err);
        return rej(err.toString());
      }
      client.query(query, (err, result) => {
        done(err);
        if (result) {
          return res(result.rows);
        } else {
          return rej(err);
        }
      })
    });
  });;

module.exports = dbQuery;