let clearMap = function() {}
let getPoints = function() {}
$(document).ready(function() {
  point_rectangle = false;
  last_id = 0;
  let count_of_points = 0;
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
      contextmenu: function (data) {
        console.log('wrapper div element contextmenu');
        console.log(data);
      },
    }
  })
    .addTo(map);
  getPoints = function () {


    count_of_points = 0;
    $.get('points/get/', function (data) {
      console.log(data)
      addToMap(data)
      addToPanelMap(data)
      getBounds()


      var local = localStorage.getItem("route");

      $("#route_colapse" + local).click()

    })
  }
  init()

  function init() {
    getPoints()

  }


  function start() {
    console.log(localStorage.getItem("route"))
  }

  let lastPoint = [50.40851753069729, 30.569458007812504]

  function addToMap(data) {
    data.forEach(function (elem) {
      pointList = [];
      elem.forEach(function (e) {
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

  let routs_count = 0;

  function addToPanelMap(data) {
    let count = 0;
    let dist = 0;
    data.forEach(function (elem) {
      count++;
      dist = 0;
      if ($("#route_colapse" + count).html() == null)
        $("#coords").append('<div class="panel panel-default">\
    <div class="panel-heading">\
      <h4 class="panel-title">\
        <a data-toggle="collapse" data-parent="#coords" onclick="route_colapse(' + count + ') " class="route_colapse" id="route_colapse' + count + '" route="' + count + '" href="#collapse' + count + '" >' +
          count + ' route <span id="route' + count + '"  onclick="route_colapse(' + count + ')  class="route_colapse" id="route_colapse' + count + '" route="' + count + '" > </span> m </a>      </h4>    </div> <div id="collapse' + count + '"  class="panel-collapse collapse ">\
      <div class="panel-body" style="padding: 0px;">  <ul class="list-group" id="route_list' + count + '">\
                  </ul>  </div>\
    </div>\
  </div>')


      elem.forEach(function (e) {
        dist += (+(e.enable ? e.dist : '0')) || 0
        $("#route_list" + count).append(' <li class="list-group-item list-group-item-' + ((e.enable) ? 'info' : 'default') + ' " > ' +
          e.address + ' <br>' + (e.dist ? e.dist : 'start') + '<div class="btn-group pull-right"> '

          +
          (e.intersection ? (' <a class="btn btn-xs       btn-default point"  onclick=" markerFunction(' + e.lat_inter + ',' + e.lng_inter + ') ">\
                        <i class="fa fa-times point"  onclick=" markerFunction(' + e.lat_inter + ',' + e.lng_inter + ')" aria-hidden="true"></i></a>') : ('')) +


          ((e.enable) ? ' <a class="btn btn-xs    btn-default point"   onclick=" markerFunction(' + e.lat + ',' + e.lng + ')" >\
                        <i class="fa fa-map-marker point" onclick=" markerFunction(' + e.lat + ',' + e.lng + ')"  aria-hidden="true"></i></a>' : '')

          +


          '<a class="btn btn-xs       btn-default enable_button"  onclick="enable_button(' + e.id + ')" point_id="' + e.id + '"  >\
                    <i  point_id="' + e.id + '"  class=" enable_button fa ' + ((e.enable) ? 'fa-minus' : 'fa-plus') + '" aria-hidden="true"></i></a>' +
          '</div></li>')
      })
      dist = dist.toFixed(2)
      $("#route" + count).html(dist + '')
    })

    routs_count = count
  }

  clearMap = function () {
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

    clearMap()


    $("#coords").html('')
    $("#bounds_list1").html('')
    $.post("/bounds/set", {
      "geojson": geom
    }).done(function () {
      getPoints()
    })

  });
  map.pm.disableDraw('Circle');

  function getBounds() {
    $("#bounds_list1").html("")
    $.get("/bounds/get", function (data) {
      if (data[0])
        if ($("#bounds").html() == null)
          $("#bounds_list1").append('<div class="panel panel-default">\
    <div class="panel-heading">\
      <h4 class="panel-title">\
        <a data-toggle="collapse" data-parent="#coords"  class="route_colapse" id="route_colapse"  href="#bounds" >\
         bounds </a>      </h4>    </div> \
                <div id="bounds"  class="panel-collapse collapse ">\
      <div class="panel-body" style="padding: 0px;">  <ul class="list-group" id="bound_list">\
                  </ul>  </div>\
    </div>\
  </div>')
      data.forEach(function (elem) {
        var e = JSON.parse(elem.st_asgeojson);
        var c = JSON.parse(elem.centr);
        console.log(e)
        $("#bound_list").append(' <li class="list-group-item list-group-item-info' + ' " > ' + e.type +
          '<div class="btn-group pull-right"> '

          +


          ' <a class="btn btn-xs    btn-default point"  onclick=" markerFunction(' + c.coordinates[1] + ',' + c.coordinates[0] + ') "  \
                     ><i class="fa fa-map-marker point" onclick=" markerFunction(' + c.coordinates[1] + ',' + c.coordinates[0] + ') "  aria-hidden="true"></i></a>'

          +


          '<a class="btn btn-xs       btn-default erase_button" onclick = "erase_button(' + elem.id + ')" bound_id="' + elem.id + '"  >\
                    <i  bound_id="' + elem.id + '"   class=" erase_button fa fa-trash" aria-hidden="true"></i></a>' +
          '</div></li>')

        L.geoJSON(JSON.parse(elem.st_asgeojson)).addTo(map);

      })


    })

  }
});




//var shape = {"Line":}
function positionTo(lat, lng) {
  map.setView(L.latLng(lat, lng), 18)
}

function toLineGeoJson(data) {
  var temp_array = []
  data.forEach(function (elem) {
    temp_array.push([elem.lng, elem.lat])
  })
  //  return temp_array;
  return {
    "type": "LineString",
    "coordinates": temp_array
  }
}
erase_button = function(bound_id) {

  clearMap();

  $("#coords").html('')
  $("#bounds_list1").html('')
  $.get('/bounds/rem/' + bound_id, function (data) {

    getPoints();

  })
};

function toPolyGeoJson(data) {

  return {
    type: "Polygon",
    coordinates: data.map(elem => {
      const temp_array1 = elem.map(e =>
        ([e.lng, e.lat])
      );
      temp_array1.push([elem[0].lng, elem[0].lat]);
      return temp_array1
    })
  };
}

function enable_button(point_id) {

    const id = point_id
    clearMap();

    $("#coords").html('')
    $("#bounds_list1").html('')

    $.get('/points/enable/' + id,() => {
        getPoints()
    })
}

function route_colapse(route) {

    localStorage.setItem("route", route)
}

function markerFunction(lat, lng) {
    if (window.marker)
        window.marker.removeFrom(map)
    window.marker = L.marker([lat, lng]).addTo(map)
    positionTo(lat, lng)
}


// var firstpolyline = new L.Polyline(pointList, {
//     color: 'blue',
//     weight: 3,
//     opacity: 0.5,
//     smoothFactor: 1
// });
// var lastPoint = data[data.length-1]
// map.setView(L.latLng(lastPoint.lat,lastPoint.lng),16)