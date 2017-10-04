var express = require('express');
var http = require('http');
var path = require('path');
var app = express();
var api = {};
app.fs = require('fs');
app.pg = require('pg');
app.set('port', process.env.PORT||process.argv[2] || 3002);
//app.use(express.bodyParser());
  //  app.use(express.session({ secret: 'SECRET' }));
     
var pg = require('pg');
app.jquery = require('jquery');


 var config = {
  user: 'uqlyikmvgiyznd', //env var: PGUSER
  database: 'd3n948ttnop2ub', //env var: PGDATABASE
  host: 'ec2-54-247-99-159.eu-west-1.compute.amazonaws.com', // Server hosting the postgres database
  port: 5432, //env var: PGPORT
  max: 2,
  ssl: true,
  password:"a1119617d3dc99ae7153fe49c08c8fae7a24d7f1d52eefbec0ab86328a544693", // max number of clients in the pool
  idleTimeoutMillis: 1000, // how long a client is allowed to remain idle before being closed
};



process.on('UncaughtException', function(e){
	console.error(e);
})



app.queryDB = function(req,res,client,query,callback){
	client.query(query,  function(err, result) {

		//call `done(err)` to release the client back to the pool (or destroy it if there is an error)
		if(result){
			if(result.rows) {
				return callback(err,result.rows)
			} else {
				return callback(err,result.rows)
			}}
		else return callback(err,"efew")
		//output: 1
	})
}

app.dbQuery = function (req,res,_query,callback){
	const pool = new pg.Pool(config)
pool.connect(function(err, client, done) {
		if(err)
		{
			console.log(err)
			return callback(err.toString(),null)
		}
	   client.query(_query,  function(err, result) {
		//call `done(err)` to release the client back to the pool (or destroy it if there is an error)
			
			done(err)
			if(result){
				if(result.rows) {
					return callback(err,result.rows)
				} else {
					return callback(err,result.rows)
				}
			}
			else return callback(err,"efew")
		
			//output: 1
		})

	   
	  	
		
  });

}


 app.dir = __dirname;
//Îòïðàâêà get-çàïðîñà ïîëó÷àåì index.
app.use(express.static(path.join(__dirname, 'public')));
//Îòïðàâêà get-çàïðîñà /users ïîëó÷àåì þçåðîâ

require('./routes/user.js')(app);
require('./routes/routes.js')(app);
//Çàïóñêàåì ñåðâåð
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
  console.log()
  console.log()
});
