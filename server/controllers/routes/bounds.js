const dbQuery = require('../../db.js');

module.exports = {
		//get all biunds from db
		getBounds: (req, res) => {
		    var user = req.user.id
		    const _q = (`select id, st_asgeojson (st_setsrid(geom,4326)), st_asgeojson (st_centroid(st_setsrid(geom,4326)))
		     as centr from bounds where session=${user}`).replace(/\"/g, '"')
		    //res.json(_q)
		    dbQuery(req, res, _q, function(err, result) {
		        if (err) {
		            res.end(err.toString())
		        }
		        res.json(result)
		    })
		},

		//remove bound from db
		remBounds: (req, res) => {
		    var user = req.user.id
		    const _q = (`delete from bounds where id='${req.params.id.replace(/\'|\"|\<\>/g, "")}' and session=${user}`).replace(/\"/g, '"')
		    //console.log(_q)
		    dbQuery(req, res, _q, function(err, result) {
		        if (err) {
		            res.end(err.toString())
		        }
		        res.end("")
		    })
		},

		//add bound to user
		addBound: (req, res) =>{
		    var user = req.user.id
		    const geojson = JSON.stringify(req.body.geojson) || 0;
		   // res.json(geojson)
		    const _q = (`insert into bounds (geom,session) values  (ST_GeomFromGeoJSON('${geojson.replace(/\'|\"|\<\>/g, "")}'),${user}) `).replace(/\"/g, '"')
		    console.log(_q)
		    //res.json(_q)
		    dbQuery(req, res, _q, function(err, result) {
		        if (err) {
		            res.end(err.toString())
		        }
		        res.end("")
		    })
		}




}