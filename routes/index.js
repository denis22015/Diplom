
module.exports = function(app){
	
	
	
	function init_pages(){
		app.fs.readdir('html', (err, files) => {
			files.forEach(file => {
				app.get('/'+file.split('.')[0], function(req,res){			
					app.fs.readFile(app.dir+'//html//'+file, 'utf8', function(err, contents) {	
						if(err)
							res.status(500).send(err);
						res.send(contents);
					});
				});
			});
		})
	}
	
	
	init_pages();
	
	
	console.log('----------------------------')
	
	app.get('/test/',function(req,res){
	console.log('tnryntr')
            res.json('fmudmtd')
		
	})
	app.get('/set/session/:username/:password',function(req,res){

        app.connectDB(req,res,function(err,req,res,client){
        	var username = req.params.username;
        	var password = req.params.password;
        	var _q = `Insert into sessions (login,password) values ('${username}','${password}')`
			app.queryDB(req,res,client,_q,function(err,result){

				res.json({"ok":"gergreg"})
			})
		})
	})
	
	app.get('/add/coords/:lat/:lng',function(req,res){
		app.connectDB(req,res,function(err,req,res,client){
        	var lat = req.params.lat;
        	var lng = req.params.lng;
			console.log(`HERE '${lat}','${lng}'` )
        	var _q = `Insert into coords (lat,lng) values ('${lat}','${lng}')`
			app.queryDB(req,res,client,_q,function(err,result){

				res.send("OK")
			})
		})
	})


	app.get('/get/coords/',function(req,res){

		if(!req.session.passport.user)
			res.send('User is undefined')
		var user_id  =  req.session.passport.user.id
		//res.json(req.session)
		app.connectDB(req,res,function(err,req,res,client){
			console.log("HERE")
        	var _q = `select * from coords where session in ( ${user_id}) order by date desc`
			console.log(_q)
			app.queryDB(req,res,client,_q,function(err,result){

				res.json(result)
			})
		})
	})

	app.get('/get/coords1/',function(req,res){
		//res.json(req.session)
		app.connectDB(req,res,function(err,req,res,client){
			console.log("HERE")
        	var _q = `select * from coords order by date desc`
			console.log(_q)
			app.queryDB(req,res,client,_q,function(err,result){

				res.json(result)
			})
		})
	})


	app.get('/', function(req,res){			
		console.log(req.isAuthenticated())
		console.log(req.session)
		console.log(req.user)
		app.fs.readFile(app.dir+'//html//index.html', 'utf8', function(err, contents) {	
			if(err)
				res.status(500).send(err);
			res.send(contents);
		});
	});
};