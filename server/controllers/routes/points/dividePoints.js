

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



module.exports = (data)=> {
    var allPoints = []
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
                elem.name = "<br> Speed :" + elem.speed + "<br> Time :" + elem.time + "sec <br> Distance :" + elem.dist + "m <br> Acceleration :" + elem.acc
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