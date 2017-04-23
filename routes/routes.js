
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
	
			app.dbQuery(req,res,"select * from sessions",function(err,result){
				if(err){
					res.end(err)
				}
            	res.json(result)
            })
		
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
	
	app.get('/add/coords/:lat/:lng/:speed',function(req,res){
    	var lat = req.params.lat;
    	var lng = req.params.lng;
    	var speed = req.params.speed;
		console.log(`HERE '${lat}','${lng}'` )
    	var _q = `Insert into coords (lat,lng,speed) values ('${lat}','${lng}','${speed}')`
		app.dbQuery(req,res,_q,function(err,result){
					if(err){
						res.status(500).end(err)
					}
			res.end("OK")
		})
	})

	


	app.get('/get/coords/',function(req,res){

		//if(!req.session.passport.user)
		//	res.send('User is undefined')
		//var user_id  =  req.session.passport.user.id
		//res.json(req.session)
		//app.connectDB(req,res,function(err,req,res,client){
			console.log("HERE")
        	var _q = `select  id ,to_char( to_timestamp ( date),'DD.MM.YYYY HH24:MI:SS') as date, \
        	lat, lng, session, round(speed::numeric,3) as speed  from coords order by date`
			console.log(_q)
			app.dbQuery(req,res,_q,function(err,result){
				if(err)
					res.status(500).send(err)
				res.json(dividePoints(result))
			})
		//})
	})


	function radians(degrees) {
	    return (degrees * (2 * Math.PI) )/ 360;
	}

	function distance (lat1,lon1,lat2,lon2){

		var φ1 = radians(lat1), φ2 = radians(lat2), Δλ = radians(lon2-lon1), R = 6371e3; // gives d in metres
		return Math.acos( Math.sin(φ1)*Math.sin(φ2) + Math.cos(φ1)*Math.cos(φ2) * Math.cos(Δλ) ) * R
	}

	app.get('/get/coords1/',function(req,res){
		//res.json(req.session)
		app.connectDB(req,res,function(err,req,res,client){
			console.log("HERE")
        	var _q = `select  id ,to_char( to_timestamp ( date),'DD.MM.YYYY HH24:MI:SS') as date, \
        	lat, lng, session, round(speed::numeric,3) as speed  from coords order by date `
			console.log(_q)
			app.queryDB(req,res,client,_q,function(err,result){
				if(err)
					res.status(500).send(err)
				res.send("ok")
			})
		})
	})
	app.get('/set/trash/*',function(req,res){
		//res.json(req.session)
		app.connectDB(req,res,function(err,req,res,client){
			console.log("HERE")
			var trash = req.params
        	var _q = `insert into trash (trash) values (${trash}) `
			app.queryDB(req,res,client,_q,function(err,result){

				res.json(result)
			})
		})
	})


	app.get('/', function(req,res){		
		app.fs.readFile(app.dir+'//html//map.html', 'utf8', function(err, contents) {	
			if(err)
				res.status(500).send(err);
			res.send(contents);
		});
	});




	function dividePoints(data){
	 	var allPoints = []
	 	// new Promise ((resolve,reject)=>{

		 	if(data && data[0]){
				var pointList = []
				var lastlan = 0,lastlon=0;

				data.forEach (function(elem){				
					if (elem.speed==0) {
						elem.color="#green"
						elem.fill="#00FF1E"
						elem.radius=2
						elem.name = "<br> start way"
						if( pointList.length>0){
							allPoints.push(pointList)
							pointList =[];
						}
						pointList.push(elem);						
						lastlan = elem.lat
						lastlon = elem.lng

					}  else
					if (elem.speed > null){
						var dist = distance(lastlan,lastlon,elem.lat,elem.lng)	
						elem.color="red"
						elem.dist = dist.toFixed(2)
						elem.name = "<br> speed :"+elem.speed
						elem.fill="#f03"
						elem.radius=1.5

						pointList.push(elem);
						lastlan = elem.lat
						lastlon = elem.lng
					}

				}) 
				if(pointList.length>0){		
					allPoints.push(pointList);
				}
			}
			return ( allPoints);

	 	//})
	 }
};
