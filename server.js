const express = require('express');
const http = require('http');
const path = require('path');
const app = new  (express)();
const fs = require('fs');




const user  = require('./server/routes/user/user.js');
const routes  = require('./server/routes/routes.js');
const indexFile = 'map.ejs'

//init Sessions
require('./server/initSessions.js')(app);


app.set('port', process.env.PORT||process.argv[2] || 3000);

// app.engine('.html', require('ejs').__express);
// app.set('view engine', 'html');

app.set('view engine', 'ejs');
app.use('/user/',user);
app.use(express.static(path.join(__dirname, 'public')));



app.get('/', function(req, res) {
	const contents = (req.user)?'<li class=""><a href="/user/logout"><i class="fa fa-times"></i></a></li>' 
								:'<li class=""><a data-toggle="modal" data-target="#myModal"><i class="fa fa-user"></i></a></li>'
	res.render('map.ejs',{
		contents:contents
	})
   
});


//autoadd apis rest service
fs.readdir('server/routes/api/', (err, files) => {
	if (err){
		console.log(err);
		return ;
	}

	files.forEach(fileName => {
		fileName = fileName.substring(0, fileName.lastIndexOf('.'));
		let file  = require(`./server/routes/api/${fileName}.js`); 
		//console.log(file)
		app.use(`/${fileName}/`,file);
	});
})



app.use('/',routes);

process.on('UncaughtException', (e)=>{
	console.error(e);
});


http.createServer(app).listen(app.get('port'), ()=>{
	console.log(`Express server listening on port ${app.get('port')}`);
});
