



const pg = require('pg');

//better to hide it from git but it need for heroku
//
const config = require('./dbConf.json');


const dbQuery = function (req,res,_query,callback){
	const pool = new pg.Pool(config);

	pool.connect(function(err, client, done) {
		if(err)
		{
			console.log(err);
			return callback(err.toString(),null);
		}
	    client.query(_query,  function(err, result) {
			
			done(err);
			if(result){
				if(result.rows) {
					return callback(err,result.rows);
				} else {
					return callback(err,result.rows);
				}
			} else {
				return callback(err,"error");
			}
		})

	   
	  	
		
	});

}

module.exports = dbQuery;