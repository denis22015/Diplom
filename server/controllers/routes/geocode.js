module.exports =  (req, res) => {
    const _q = `select * from   coords where address is null`
    //console.log(_q)
    dbQuery(req, res, _q, function(err, result) {
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
                    dbQuery(req, res, _q, function(err, result) {
                        res.end("OK")
                    })
                })
        })


    })
}