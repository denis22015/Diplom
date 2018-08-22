const dbQuery = require('../../db.js');

module.exports = {
  //get all biunds from db
  getBounds: (req, res) => {
    const user = req.user.id
    const query = (`select id, st_asgeojson (st_setsrid(geom,4326)), st_asgeojson (st_centroid(st_setsrid(geom,4326)))
		     as centr from bounds where session=${user}`).replace(/\"/g, '"')
    //res.json(_q)
    dbQuery(query)
      .then(data => res.json(data))
      .catch(err => res.status(500).end(err.toString()))
  },

  //remove bound from db
  remBounds: (req, res) => {
    const user = req.user.id
    const query = (`delete from bounds where id='${req.params.id.replace(/\'|\"|\<\>/g, "")}' and session=${user}`).replace(/\"/g, '"')
    //console.log(_q)
    dbQuery(query)
      .then(() => res.end("Success"))
      .catch(err => res.status(500).end(err.toString()))
  },

  //add bound to user
  addBound: (req, res) => {
    const user = req.user.id
    const geojson = JSON.stringify(req.body.geojson) || 0;
    // res.json(geojson)
    const query = (`insert into bounds (geom,session) values  (ST_GeomFromGeoJSON('${geojson.replace(/\'|\"|\<\>/g, "")}'),${user}) `).replace(/\"/g, '"')
    // console.log(_q)
    //res.json(_q)
    dbQuery(query)
      .then(() => res.end("Success"))
      .catch(err =>res.status(500).end(err.toString()))
  }
}