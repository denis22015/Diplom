$(document).ready(function() {
    point_rectangle = false;
    last_id = 0;
    var count_of_points = 0;
    var first_rect_point;
    var second_rect_point;
    window.map = L.map('mapid', {
        contextmenu: true,
        contextmenuWidth: 140,
        contextmenuItems: [{
            text: 'Show coordinates',
            callback: showCoordinates
        }, {
            text: 'Center map here',
            callback: centerMap
        }, '-', {
            text: 'Zoom in',
            icon: '',
            callback: zoomIn
        }, {
            text: 'Zoom out',
            icon: '',
            callback: zoomOut
        }, {
            text: 'Clear',
            icon: '',
            callback: clear
        }, {
            text: 'GSM',
            icon: '',
            callback: gsm
        }]

    }).setView([50.40851753069729, 30.569458007812504], 13);
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    function showCoordinates(e) {
        alert(e.latlng);
        console.log(e.latlng)
    }

    function centerMap(e) {
        map.panTo(e.latlng);
    }

    function zoomIn(e) {
        map.zoomIn();
    }

    function zoomOut(e) {
        map.zoomOut();
    }

    function clear(e) {
        if (window.marker)
            window.marker.removeFrom(map)
    }

    function gsm(e) {


        window.open("http://maps.google.com/maps?q=&layer=c&cbll=" + e.latlng.lat + "," + e.latlng.lng + "&cbp=", '_blank')
        map.panTo(e.latlng);
    }

    /*<ul class="list-group">
  <li class="list-group-item list-group-item-success">First item</li>
  <li class="list-group-item list-group-item-info">Second item</li>
</ul>*/
    L.control.custom({
            position: 'topright',
            content: ' <div  style="   max-height: 500px;    overflow: auto;"  class="panel-body"  ><div id="bounds_list1"></div><div id="coords"></div>',
            classes: 'panel panel-default',
            style: {
                margin: '10px',
                padding: '0px 0 0 0',
                cursor: 'pointer',
                width: '300px',
            },
            datas: {
                'foo': 'bar',
            },
            events: {
                /*
                                click: function(data) {
                                    if (first_rect_point) {

                                    }
                                },
                                dblclick: function(data) {

                                    console.log('wrapper div element dblclicked');
                                    console.log(data);
                                },
                                */
                contextmenu: function(data) {
                    console.log('wrapper div element contextmenu');
                    console.log(data);
                },
            }
        })
        .addTo(map);
    init()

    function init() {
        getPoints()
        interval =

            setInterval(function() {

                $.get('/test/' + count_of_points, function(data) {


                    if (!data) {
                        //pointList.push(lastPoint)
                        var pointList;
                        pointList.push(lastPoint)
                        $.get('get/coords/' + count_of_points, function(data) {
                            addToMap(data)
                            addToPanelMap(data)

                        })
                    }
                })

            }, 2000)
    }

    function getPoints() {
        $("#coords").html('')
        $("#bounds_list1").html('')


        count_of_points = 0;
        $.get('/get/coords', function(data) {

            getBounds()
            addToMap(data)
            addToPanelMap(data)


            

        }).done(function(){
            $(".point").on('click', function(e) {
                const lat = $(e.target).attr("lat")
                const lng = $(e.target).attr("lng")
                if (window.marker)
                    window.marker.removeFrom(map)
                window.marker = L.marker([lat, lng]).addTo(map)
                positionTo(lat, lng)
            })


            $(".enable_button").on('click', function(e) {
                const id = $(e.target).attr("point_id")
                clearMap();

                $.get('/enable/point/' + id, function(data) {
                    getPoints()
                })
            })
            $(".route_colapse").on('click', function(e) {
                console.log($(e.target).attr("route"))
                localStorage.setItem("route", $(e.target).attr("route"))
            })
            var local = localStorage.getItem("route");

            $("#route_colapse" + local).click()}
            )
    }

    function start() {
        console.log(localStorage.getItem("route"))
    }
    var lastPoint = [50.40851753069729, 30.569458007812504]

    function addToMap(data) {
        var pointList;
        data.forEach(function(elem) {
            pointList = [];
            elem.forEach(function(e) {
                count_of_points++;
                if (e.enable) {
                    L.circle([e.lat, e.lng], {
                            color: e.color,
                            zIndexOffset: 3,
                            fillColor: e.fill,
                            fillOpacity: 0.5,
                            radius: e.radius
                        })
                        .bindPopup(e.date + "<br>" + e.address + e.name)
                        .addTo(map).bringToFront()

                    pointList.push(new L.LatLng(e.lat, e.lng))
                    //map.setView(L.latLng(e.lat, e.lng),18)
                    lastPoint = L.latLng(e.lat, e.lng);
                    last_id = e.id;
                }
            })
            new L.Polyline(pointList, {
                color: 'red',
                weight: 3,
                opacity: 0.5,
                smoothFactor: 1
            }).addTo(map);
        })

    }
    var routs_count = 0;

    function addToPanelMap(data) {
        var count = 0;
        var dist = 0;
        data.forEach(function(elem) {
            count++;
            dist = 0;
            if ($("#route_colapse" + count).html() == null)
                $("#coords").append('<div class="panel panel-default">\
    <div class="panel-heading">\
      <h4 class="panel-title">\
        <a data-toggle="collapse" data-parent="#coords" class="route_colapse" id="route_colapse' + count + '" route="' + count + '" href="#collapse' + count + '" >' +
                    count + ' route <span id="route' + count + '"   class="route_colapse" id="route_colapse' + count + '" route="' + count + '" > </span> m </a>      </h4>    </div> <div id="collapse' + count + '"  class="panel-collapse collapse ">\
      <div class="panel-body" style="padding: 0px;">  <ul class="list-group" id="route_list' + count + '">\
                  </ul>  </div>\
    </div>\
  </div>')


            elem.forEach(function(e) {
                dist += (+(e.enable ? e.dist : '0')) || 0
                $("#route_list" + count).append(' <li class="list-group-item list-group-item-' + ((e.enable) ? 'info' : 'default') + ' " > ' +
                    e.address + ' <br>' + (e.dist ? e.dist : 'start') + '<div class="btn-group pull-right"> '

                    +
                    (e.intersection ? (' <a class="btn btn-xs       btn-default point"  lat="' + e.lat_inter + '" lng="' + e.lng_inter + '">\
                        <i class="fa fa-times point" lat="' +
                        e.lat_inter + '" lng="' + e.lng_inter + '" aria-hidden="true"></i></a>') : ('')) +


                    ((e.enable) ? ' <a class="btn btn-xs    btn-default point"  lat="' + e.lat + '" lng="' + e.lng + '"><i class="fa fa-map-marker point" lat="' +
                        e.lat + '" lng="' + e.lng + '" aria-hidden="true"></i></a>' : '')

                    +


                    '<a class="btn btn-xs       btn-default enable_button" point_id="' + e.id + '"  ><i  point_id="' + e.id + '"  class=" enable_button fa ' + ((e.enable) ? 'fa-minus' : 'fa-plus') + '" aria-hidden="true"></i></a>' +
                    '</div></li>')
            })
            dist = dist.toFixed(2)
            $("#route" + count).html(dist + '')
        })

        routs_count = count
    }

    function clearMap() {
        for (i in map._layers) {
            if (map._layers[i]._path != undefined) {
                try {
                    map.removeLayer(map._layers[i]);
                } catch (e) {
                    console.log("problem with " + e + map._layers[i]);
                }
            }
        }
        if (window.marker)
            window.marker.removeFrom(map)
    }
    if (!map.restoreView()) {
        map.setView(lastPoint, 16);
    }


    //PM



    var options = {
        position: 'topleft', // toolbar position, options are 'topleft', 'topright', 'bottomleft', 'bottomright'
        drawMarker: false, // adds button to draw markers
        drawPolygon: true, // adds button to draw a polygon
        drawPolyline: true, // adds button to draw a polygon
        drawCircle: false, // adds button to draw a polyline
        editPolygon: false, // adds button to toggle global edit mode
        deleteLayer: false // adds a button to delete layers
    };

    // add leaflet.pm controls to the map
    map.pm.addControls(options);


    map.on('pm:create', (e) => {
        var geom;
        console.log(e)
        if (e.shape == "Line")
            geom = (toLineGeoJson(e.layer._latlngs))
        if (e.shape == "Poly")

            geom = (toPolyGeoJson(e.layer._latlngs))
        $.post("/set/bounds", {
            "geojson": geom
        }).done(function(){  getPoints()})
       
    });
    map.pm.disableDraw('Circle');

    function getBounds() {
       $("#bounds_list").html("")
        $.get("/get/bounds", function(data) {
            console.log(data[0])
            if (data[0])
                if($("#bounds").html()==null)
                $("#bounds_list1").append('<div class="panel panel-default">\
    <div class="panel-heading">\
      <h4 class="panel-title">\
        <a data-toggle="collapse" data-parent="#coords" class="route_colapse" id="route_colapse"  href="#bounds" >\
         bounds </a>      </h4>    </div> \
                <div id="bounds"  class="panel-collapse collapse ">\
      <div class="panel-body" style="padding: 0px;">  <ul class="list-group" id="bound_list">\
                  </ul>  </div>\
    </div>\
  </div>')
            data.forEach(function(elem) {
                var e = JSON.parse(elem.st_asgeojson);
                var c = JSON.parse(elem.centr);
                console.log(e)
                $("#bound_list").append(' <li class="list-group-item list-group-item-info' + ' " > ' + e.type +
                    '<div class="btn-group pull-right"> '

                    +


                    ' <a class="btn btn-xs    btn-default point"  lat="' + c.coordinates[1] + '" lng="' + c.coordinates[0] + '"><i class="fa fa-map-marker point" lat="' +
                    c.coordinates[1] + '" lng="' + c.coordinates[0] + '" aria-hidden="true"></i></a>'

                    +


                    '<a class="btn btn-xs       btn-default erase_button"  bound_id="' + elem.id + '"  >\
                    <i  bound_id="' + elem.id + '"   class=" erase_button fa fa-trash" aria-hidden="true"></i></a>' +
                    '</div></li>')

                L.geoJSON(JSON.parse(elem.st_asgeojson)).addTo(map);

            })
            
            
        })
        $(".erase_button").on('click', function(e) {
                const bound_id = $(e.target).attr("bound_id")
                console.log(bound_id)
                $.get('/rem/bounds/' + bound_id, function(data) {

                    clearMap();
                    getPoints();

                })
            })
    }
})




//var shape = {"Line":}
function positionTo(lat, lng) {

    map.setView(L.latLng(lat, lng), 18)
}

function toLineGeoJson(data) {
    var temp_array = []
    data.forEach(function(elem) {
        temp_array.push([elem.lng, elem.lat])
    })
    //  return temp_array;
    return {
        "type": "LineString",
        "coordinates": temp_array
    }
}

function toPolyGeoJson(data) {
    var temp_array = []
    data.forEach(function(elem) {
        var temp_array1 = []
        elem.forEach(function(e) {

            temp_array1.push([e.lng, e.lat])
        })
        temp_array1.push([elem[0].lng, elem[0].lat])
        temp_array.push(temp_array1)
    })
    console.log(JSON.stringify({
        "type": "Polygon",
        "coordinates": temp_array
    }))
    //  return temp_array;

    return {
        "type": "Polygon",
        "coordinates": temp_array
    }
}

// var firstpolyline = new L.Polyline(pointList, {
//     color: 'blue',
//     weight: 3,
//     opacity: 0.5,
//     smoothFactor: 1
// });
// var lastPoint = data[data.length-1]
// map.setView(L.latLng(lastPoint.lat,lastPoint.lng),16)