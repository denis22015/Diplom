



const pg = require('pg');

//better to hide it from git but it need for heroku
//
const config = require('./config/dbConf.json');


const dbQuery =  (req,res,_query,callback)=>{
	const pool = new pg.Pool(config);

	pool.connect((err, client, done) =>{
		if(err)
		{
			console.log(err);
			return callback(err.toString(),null);
		}
	    client.query(_query,  (err, result)=>{
			
			done(err);
			if(result){
				return callback(err,result.rows);				
			} else {
				return callback(err,"error");
			}
		})
	});
}

module.exports = dbQuery;