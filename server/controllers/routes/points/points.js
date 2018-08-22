const dbQuery = require('../../../db.js');

const request = require('request');




const dividePoints = require('./dividePoints.js');

module.exports = {

  //add points to db  :lat/:lng/:time/:log/:pass
  addPoint: (req, res) => {
    const lat = req.body.lat;
    const lng = req.body.lng;
    const time = req.body.time;
    // var time = req.body.info;
    request("https://maps.googleapis.com/maps/api/geocode/json?latlng=" + lat + "," + lng +
      "&key=AIzaSyBzMpfnfVh5RyH-tb-xw5w4YoqDFcViC08",
      (err, data, body) => {
        if (err)
          res.status(500).end(err)
        const address = (JSON.parse(body)).results[0].formatted_address;

        const query = `Insert into coords (lat,lng,time,address,session) values ('${lat.replace(/\'|\"|\<\>/g, "")}',
				                                                                                '${lng.replace(/\'|\"|\<\>/g, "")}',
				                                                                                '${time.replace(/\'|\"|\<\>/g, "")}',
				                                                                                '${address.replace(/\'|\"|\<\>/g, "")}',
				                                                                                (select id from sessions where lower(login)= lower('${req.params.log.replace(/\'|\"|\<\>/g, "")}') 
				                                                                                    and password='${req.params.pass.replace(/\'|\"|\<\>/g, "")}') )`
        //console.log(_q)
        dbQuery(query)
          .then(() => res.end("Success"))
          .catch(err =>res.status(500).end(err.toString()));
      })
  },
  //get all points for web client
  getPointsWeb: (req, res) => {
    //console.log("HERE")
    // const user = req.user.id;i
    const query = `SELECT lat, lng, c.id, st_astext(last_geom),st_asgeojson(st_centroid(st_intersection(geom,last_geom))) 
													as intersection, c.session, speed, to_char( to_timestamp ( c.date),'DD.MM.YYYY HH24:MI:SS') as date, enable, address, 
											 "time" FROM public.coords_view c left join bounds b on st_intersects(geom,last_geom) and c.session = b.session order by c.date `;

    //console.log(_q)
    dbQuery(query)
      .then(data => res.json(dividePoints(data)))
      .catch(err =>res.status(500).end(err.toString()));
  },

  //get all points for Android client
  // getPointsAndroid: (req, res) => {
  //   const _q = `SELECT lat, lng, c.id, st_astext(last_geom),st_asgeojson(st_centroid(st_intersection(geom,last_geom)))
  //                           as intersection, c.session, speed, to_char( to_timestamp ( c.date),'DD.MM.YYYY HH24:MI:SS') as date, enable, address,
  //                           "time"
  //                         FROM public.coords_view c left join bounds b on st_intersects(geom,last_geom) and
  //                         c.session = b.session  where c.session=(select id from sessions
  //                         where lower(login)= lower('${req.params.log.replace(/\'|\"|\<\>/g, "")}') and password='${req.params.pass.replace(/\'|\"|\<\>/g, "")}') order by c.date `;
  //   dbQuery(req, res, _q, function (err, result) {
  //     if (err)
  //       res.status(500).end(err.toString());
  //     res.send(dividePoints(result));
  //   })
  // },

  //enavle or dicable points
  enablePoint: (req, res) => {
    //res.send(req.params.point)
    const point = req.params.point
    const query = `update coords set enable = not enable  where id ='${point.replace(/\'|\"|\<\>/g, "")}' and session=${req.user.id}`
    //console.log(_q)
    dbQuery(query)
      .then(() => res.end("Success"))
      .catch(err =>res.status(500).end(err.toString()));
  }
};
