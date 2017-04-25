var express = require('express');
var user = require('./routes/user');
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

// create a config to configure both pooling behavior
// and client options
// note: all config is optional and the environment variables
// will be read if the config is not present


// var config = {
//   user: 'postgres', //env var: PGUSER
//   database: 'postgres', //env var: PGDATABASE
//   host: 'localhost', // Server hosting the postgres database
//   port: 5432, //env var: PGPORT
//   max: 10,
//   password:"1111", // max number of clients in the pool
//   idleTimeoutMillis: 15000, // how long a client is allowed to remain idle before being closed
// };
 var config = {
  user: 'uqlyikmvgiyznd', //env var: PGUSER
  database: 'd3n948ttnop2ub', //env var: PGDATABASE
  host: 'ec2-54-247-99-159.eu-west-1.compute.amazonaws.com', // Server hosting the postgres database
  port: 5432, //env var: PGPORT
  max: 10,ssl: true,
  password:"a1119617d3dc99ae7153fe49c08c8fae7a24d7f1d52eefbec0ab86328a544693", // max number of clients in the pool
  idleTimeoutMillis: 300000, // how long a client is allowed to remain idle before being closed
};

//this initializes a connection pool
//it will keep idle connections open for a 30 seconds
//and set a limit of maximum 10 idle clients

// to run a query we can acquire a client from the pool,
// run a query on the client, and then return the client to the pool

process.on('UncaughtException', function(e){
	   console.error(e);
	   })

app.connectDB = function (req,res,callback){	
	
	var pool = new pg.Pool(config);
	pool.connect(function(err, client, done) {
	  if(err) {
		return console.error('error fetching client from pool', err);
	  }
	   
	   callback (err,req,res,client)

	   pool.end(function (err) {
	      if (err) throw err;
	  });
	  	
		
  });



	pool.on('error', function (err, client) {
	  console.error('idle client error', err.message, err.stack)
	})
};



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
		if(err )
			return callback(err,"")
		pool.end(function (err) {
	    		if (err) throw err;
		});
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
