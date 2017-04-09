
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
	
	
	
	
	app.get('/testPg/',function(req,res){
		
		app.connectDB(req,res,function(err,req,res,client){
			var _query = "select  * FROM sessions"
			app.queryDB(req,res,client,_query,function(err,result){
				if(err)
					res.status(500).send(err)
				else
					res.json (result)
			})
		})
	})
	
	
	app.get('/', function(req,res){			
		app.fs.readFile(app.dir+'//html//index.html', 'utf8', function(err, contents) {	
			if(err)
				res.status(500).send(err);
			res.send(contents);
		});
	});
};