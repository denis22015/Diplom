var express = require('express');
var http = require('http');
var path = require('path');
var app = express();
var api = {};
const dbQuery = require('./server/db/db.js')
app.fs = require('fs');
app.set('port', process.env.PORT||process.argv[2] || 3002);

process.on('UncaughtException', (e)=>{
	console.error(e);
});

app.dbQuery = dbQuery;
app.dir = __dirname;

app.use(express.static(path.join(__dirname, 'public')));

require('./server/routes/user/user.js')(app);
require('./server/routes/routes.js')(app);


http.createServer(app).listen(app.get('port'), ()=>{
	console.log(`Express server listening on port ${app.get('port')}`);
});
