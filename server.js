var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var app = express();
var api = {};
app.fs = require('fs');
app.pg = require('pg');
app.set('port', process.env.PORT||process.argv[2] || 3002);



var pg = require('pg');

// create a config to configure both pooling behavior
// and client options
// note: all config is optional and the environment variables
// will be read if the config is not present
var config = {
  user: 'postgres', //env var: PGUSER
  database: 'android', //env var: PGDATABASE
  host: 'localhost', // Server hosting the postgres database
  port: 5432, //env var: PGPORT
  max: 10, // max number of clients in the pool
  idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
};


//this initializes a connection pool
//it will keep idle connections open for a 30 seconds
//and set a limit of maximum 10 idle clients

// to run a query we can acquire a client from the pool,
// run a query on the client, and then return the client to the pool

app.connectDB = function (req,res,callback){	
	
	var pool = new pg.Pool(config);
	pool.connect(function(err, client, done) {
	  if(err) {
		return console.error('error fetching client from pool', err);
	  }
	  
	  
	  
		return callback (err,req,res,client)
	  
		
		
		
		
  });
	pool.on('error', function (err, client) {
	  console.error('idle client error', err.message, err.stack)
	})
};



app.queryDB = function(req,res,client,query,callback){
	client.query(query,  function(err, result) {
		//call `done(err)` to release the client back to the pool (or destroy it if there is an error)
			
			return callback(err,result.rows)
		//output: 1
	})
}






 app.dir = __dirname;
//Отправка get-запроса получаем index.
app.use(express.static(path.join(__dirname, 'public')));
//Отправка get-запроса /users получаем юзеров

require('./routes/index.js')(app);
//Запускаем сервер
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
  console.log()
  console.log()
});
