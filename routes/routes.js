module.exports = function(app) {
    var request = require(app.dir + "/node_modules/request")

    function init_pages() {
        app.fs.readdir('html', (err, files) => {
            files.forEach(file => {
                app.get('/' + file.split('.')[0], function(req, res) {
                    app.fs.readFile(app.dir + '//html//' + file, 'utf8', function(err, contents) {
                        if (err)
                            res.status(500).send(err);
                        if (req.user == undefined)
                            contents = contents.replace('<li class=""><a href="/logout"><i class="fa fa-times"></i></a></li>', '')
                        else
                            contents = contents.replace('<li class=""><a data-toggle="modal" data-target="#myModal"><i class="fa fa-user"></i></a></li>', '')

                        res.send(contents);

                    });
                });
            });
        })
    }


    init_pages();


    console.log('----------------------------')

    app.get('/test/:count', function(req, res) {
        if (req.user == undefined)
            res.status(500).end("Unauthorised")
        //console.log(req.user)
        const count = req.params.count || 0;
        var user = (req.user ? req.user.id : 0)
        app.dbQuery(req, res, `select count(*)<= ${count} as test from coords where session=${user}`, function(err, result) {
            if (err) {
                res.end(err.toString())
            }
            if (result)
                res.end(result[0].test.toString())
            else
                res.end("15")
        })
    })

    app.post('/set/bounds/', function(req, res) {
        if (req.user == undefined)
            res.status(500).end("Unauthorised")
        var user = req.user.id
        const geojson = JSON.stringify(req.body.geojson) || 0;
       // res.json(geojson)
        const _q = (`insert into bounds (geom,session) values  (ST_GeomFromGeoJSON('${geojson}'),${user}) `).replace(/\"/g, '"')
        console.log(_q)
        //res.json(_q)
        app.dbQuery(req, res, _q, function(err, result) {
            if (err) {
                res.end(err.toString())
            }
            res.end("ok")
        })
    })
    app.get('/get/bounds/', function(req, res) {
        if (req.user == undefined)
            res.status(500).end("Unauthorised")
        var user = req.user.id
        const _q = (`select id, st_asgeojson (st_setsrid(geom,4326)), st_asgeojson (st_centroid(st_setsrid(geom,4326)))
		 as centr from bounds where session=${user}`).replace(/\"/g, '"')
        //res.json(_q)
        app.dbQuery(req, res, _q, function(err, result) {
            if (err) {
                res.end(err.toString())
            }
            res.json(result)
        })
    })

	 app.get('/rem/bounds/:id', function(req, res) {
        if (req.user == undefined)
            res.status(500).end("Unauthorised")
        var user = req.user.id
        const _q = (`delete from bounds where id=${req.params.id} and session=${user}`).replace(/\"/g, '"')
        //console.log(_q)
        app.dbQuery(req, res, _q, function(err, result) {
            if (err) {
                res.end(err.toString())
            }
            res.end("1")
        })
    })

    app.get('/set/session/:username/:password', function(req, res) {
        var username = req.params.username;
        var password = req.params.password;
        var _q = `Insert into sessions (login,password) values ('${username}','${password}')`
        app.dbQuery(req, res, _q, function(err, result) {

            res.json({
                "ok": "gergreg"
            })
        })
    })
    app.get('/testauth/', function(req, res) {
        res.json(req.user)
    })
    app.get('/add/coords/:lat/:lng/:time/:log/:pass', function(req, res) {
        var lat = req.params.lat;
        var lng = req.params.lng;
        var time = req.params.time;
        // app.dbQuery(req,res,_q,function(err,result){
        // 			if(err){
        // 				res.status(500).end(err.toString())
        // 			}
        // 	res.end("OK")
        // })
        if (req.user == undefined)
            request("https://maps.googleapis.com/maps/api/geocode/json?latlng=" + lat + "," + lng + /*language=uk*/
                "&key=AIzaSyBzMpfnfVh5RyH-tb-xw5w4YoqDFcViC08",
                function(err, data, body) {
                    if (err)
                        res.status(500).end(err)
                    var address = (JSON.parse(body)).results[0].formatted_address

                    var _q = `Insert into coords (lat,lng,time,address,session) values ('${lat}','${lng}','${time}','${address}',(select id from sessions 
  where lower(login)= lower('${req.params.log}') and password='${req.params.pass}') )`
                    //console.log(_q)
                    app.dbQuery(req, res, _q, function(err, result) {
                        if (err)
                            res.status(500).end(err.toString())
                        res.end("OK")
                    })
                })
    })




    app.get('/get/coords/', function(req, res) {
        //console.log("HERE")
        if (req.user == undefined)
            res.status(500).end("Unauthorised")
        var user = req.user.id
        var _q = `SELECT lat, lng, c.id, st_astext(last_geom),st_asgeojson(st_centroid(st_intersection(geom,last_geom))) 
        	as intersection, c.session, speed, to_char( to_timestamp ( c.date),'DD.MM.YYYY HH24:MI:SS') as date, enable, address, 
       "time"
  FROM public.coords_view c left join bounds b on st_intersects(geom,last_geom) and c.session = b.session  where c.session=${user} order by c.date `

        //console.log(_q)
        app.dbQuery(req, res, _q, function(err, result) {
            if (err)
                res.status(500).end(err.toString())
            res.json(dividePoints(result))
        })


        //})
    })



    app.get('/get/coords/:count/:last_id', function(req, res) {
        if (req.user == undefined)
            res.status(500).end("Unauthorised")
        var user = req.user.id
        var _q = `SELECT c.lat, c.lng, c.id, st_astext(last_geom),st_asgeojson(st_centroid(st_intersection(geom,last_geom))) 
        	as intersection, c.session, c.speed ,to_char( to_timestamp ( c.date),'DD.MM.YYYY HH24:MI:SS') as date, c.enable, c.address, 
       c."time",c2.lat as lastlat,c2.lng as lastlng
  FROM public.coords_view c left join bounds b on st_intersects(geom,last_geom) and c.session = b.session 
  left join coords c2  on  c2.id = ${req.params.last_id} and c2.session=${user} where c.session=${user} order by c.date  
  offset ${req.params.count}`
        console.log(_q)
        app.dbQuery(req, res, _q, function(err, result) {
            if (err)
                res.status(500).end(err.toString())
            res.json(dividePoints(result))
        })


        //})
    })


    function radians(degrees) {
        return (degrees * (2 * Math.PI)) / 360;
    }

    function distance(lat1, lon1, lat2, lon2) {

        var φ1 = radians(lat1),
            φ2 = radians(lat2),
            Δλ = radians(lon2 - lon1),
            R = 6371e3; // gives d in metres
        return Math.acos(Math.sin(φ1) * Math.sin(φ2) + Math.cos(φ1) * Math.cos(φ2) * Math.cos(Δλ)) * R
    }

    app.get('/get/coords1/:log/:pass', function(req, res) {
        //res.json(req.session)

        var _q = `SELECT lat, lng, c.id, st_astext(last_geom),st_asgeojson(st_centroid(st_intersection(geom,last_geom))) 
        	as intersection, c.session, speed, to_char( to_timestamp ( c.date),'DD.MM.YYYY HH24:MI:SS') as date, enable, address, 
       		"time"
		  FROM public.coords_view c left join bounds b on st_intersects(geom,last_geom) and 
		  c.session = b.session  where c.session=(select id from sessions 
		  where lower(login)= lower('${req.params.log}') and password='${req.params.pass}') order by c.date `
        console.log(_q)
        app.dbQuery(req, res, _q, function(err, result) {
            if (err)
                res.status(500).end(err.toString())
            res.send(dividePoints(result))
        })
    })
    // app.get('/get/coords/',function(req,res){
    // 	//res.json(req.session)
    // 	app.connectDB(req,res,function(err,req,res,client){
    // 		console.log("HERE")
    //        	var _q = `select  id ,to_char( to_timestamp ( date),'DD.MM.YYYY HH24:MI:SS') as date, \
    //        	lat, lng, session, round(speed::numeric,3) as speed  from coords order by date `
    // 		console.log(_q)
    // 		app.queryDB(req,res,client,_q,function(err,result){
    // 			if(err)
    // 				res.status(500).send(err)
    // 			res.send("ok")
    // 		})
    // 	})
    // })
    app.get('/set/trash/*', function(req, res) {
        //res.json(req.session)
        //console.log("HERE")
        var trash = req.params
        var _q = `insert into trash (trash) values (${trash}) `
        app.dbQuery(req, res, _q, function(err, result) {
            if (err)
                res.status(500).end(err)

            res.json(result)
        })
    })

    app.get('/geocode', function(req, res) {

        // $.get("https://maps.googleapis.com/maps/api/geocode/json?latlng=40.714224,-73.961452&key=AIzaSyBzMpfnfVh5RyH-tb-xw5w4YoqDFcViC08",function(data){
        // 	res.json(data)
        // })
        const _q = `select * from   coords where address is null`
        //console.log(_q)
        app.dbQuery(req, res, _q, function(err, result) {
            if (err)
                res.status(500).end(err.toString())
            result.forEach(function(elem) {
                //res.json(result[0])
                const lat = elem.lat
                const lng = elem.lng
                const id = elem.id
                request("https://maps.googleapis.com/maps/api/geocode/json?latlng=" + lat + "," + lng + /*language=uk*/
                    "&key=AIzaSyBzMpfnfVh5RyH-tb-xw5w4YoqDFcViC08",
                    function(err, data, body) {
                        if (err)
                            res.status(500).end(err)
                        var result = (JSON.parse(body)).results[0].formatted_address

                        const _q = `update   coords set address='${result}' where id = ${id}`
                        //console.log(_q)
                        app.dbQuery(req, res, _q, function(err, result) {
                            res.end("OK")
                        })
                    })
            })


        })
    });

    app.get('/', function(req, res) {
        app.fs.readFile(app.dir + '//html//map.html', 'utf8', function(err, contents) {
            if (err)
                res.status(500).end(err);
            if (req.user == undefined)
                contents = contents.replace('<li class=""><a href="/logout"><i class="fa fa-times"></i></a></li>', '')
            else
                contents = contents.replace('<li class=""><a data-toggle="modal" data-target="#myModal"><i class="fa fa-user"></i></a></li>', '')
            res.send(contents);
        });
    });


    app.get('/enable/point/:point', function(req, res) {
        //res.send(req.params.point)
        const point = req.params.point
        const _q = `update coords set enable = not enable  where id =${point}`
        //console.log(_q)
        app.dbQuery(req, res, _q, function(err, result) {
            if (err)
                res.end(err)
            res.end("ok")
        })
    })

    function dividePoints(data) {
        var allPoints = []
        // new Promise ((resolve,reject)=>{

        if (data && data[0]) {
            var pointList = []
            var lastlan = 0,
                lastlon = 0;
            var last_speed = 0;
            data.forEach(function(elem) {
                if (elem.time > 1000000)
                    elem.time = 0
                if (elem.time < 0.01) {
                    elem.color = "#green"
                    elem.fill = "#00FF1E"
                    elem.radius = 2
                    elem.name = "<br> start way"
                    elem.speed = 0;
                    if (pointList.length > 0) {
                        allPoints.push(pointList)
                        pointList = [];
                    }
                    pointList.push(elem);
                    if (elem.enable) {
                        lastlan = elem.lat
                        lastlon = elem.lng
                        last_speed = elem.speed;
                    }


                } else
                if (elem.time > null) {
                    if (lastlan == 0)
                        lastlan = elem.lastlat
                    if (lastlon == 0)
                        lastlon = elem.lastlon
                    if (elem.intersection) {
                        const inter = JSON.parse(elem.intersection).coordinates
                        elem.lat_inter = inter[1]
                        elem.lng_inter = inter[0]
                    }
                    var dist = distance(lastlan, lastlon, elem.lat, elem.lng)
                    elem.color = "red"
                    elem.dist = dist.toFixed(2)
                    elem.fill = "#f03"
                    elem.radius = 1.5
                    elem.speed = (dist / (+elem.time)).toFixed(2);
                    elem.acc = ((elem.speed - last_speed) / +elem.time).toFixed(2);
                    elem.name = "<br> Speed :" + elem.speed + "<br> Time :" + elem.time + "<br> Distance :" + elem.dist + "<br> Acceleration :" + elem.acc
                    pointList.push(elem);
                    if (elem.enable) {
                        lastlan = elem.lat
                        lastlon = elem.lng
                        last_speed = elem.speed;
                    }

                }

            })
            if (pointList.length > 0) {
                allPoints.push(pointList);
            }
        }
        return (allPoints);

        //})
    }
};
