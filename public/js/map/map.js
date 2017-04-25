

$(document).ready(function(){

	var count_of_points = 0;
	window.map = L.map('mapid',{
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
		},{
			text: 'GSM',
			icon: '',
			callback: gsm
		}]

	}).setView([50.40851753069729, 30.569458007812504], 13);
	L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(map);
	
	function showCoordinates (e) {
		alert(e.latlng);
		console.log(e.latlng)
	}

	function centerMap (e) {
		map.panTo(e.latlng);
	}

	function zoomIn (e) {
		map.zoomIn();
	}

	function zoomOut (e) {
		map.zoomOut();
	}
	function clear (e) {
				if(window.marker)
				window.marker.removeFrom(map)
	}
	function gsm (e) {
		

		window.open ("http://maps.google.com/maps?q=&layer=c&cbll="+e.latlng.lat+","+e.latlng.lng+"&cbp=",'_blank')
				map.panTo(e.latlng);
	}
	/*<ul class="list-group">
  <li class="list-group-item list-group-item-success">First item</li>
  <li class="list-group-item list-group-item-info">Second item</li>
</ul>*/
	L.control.custom({
		position: 'topright',
		content : ' <div  style="   max-height: 500px;    overflow: auto;"  class="panel-body" id="coords" ></div>',
		classes : 'panel panel-default',
		style   :
		{
			margin: '10px',
			padding: '0px 0 0 0',
			cursor: 'pointer',
			width: '300px',
		},
		datas   :
		{
			'foo': 'bar',
		},
		events:
		{/*
			
			click: function(data)
			{
				console.log('wrapper div element clicked');
				console.log(data);	
			},
			dblclick: function(data)
			{
			
				console.log('wrapper div element dblclicked');
				console.log(data);
			},*/
			contextmenu: function(data)
			{
				console.log('wrapper div element contextmenu');
				console.log(data);
			},
		}
	})
	.addTo(map);
	getPoints()

	function getPoints(){

		$.get('/get/coords',function(data){
			addToMap(data)
			addToPanelMap(data) 

			$(".point").on('click',function(e){
				const lat = $(e.target).attr("lat")
				const lng = $(e.target).attr("lng")
				if(window.marker)
				window.marker.removeFrom(map)
				window.marker = L.marker([lat,lng]).addTo(map)
				positionTo(lat,lng)
			})


			$(".enable_button").on('click',function(e){
				const id = $(e.target).attr("point_id")
				clearMap();
				$("#coords").html('')

				$.get('/enable/point/'+id,function(data){
					getPoints()
				})
			})
			$(".route_colapse").on('click',function(e){
				console.log($(e.target).attr("route"))
				localStorage.setItem("route",$(e.target).attr("route"))
			})
			var local =localStorage.getItem("route"); 

			$("#route_colapse"+local).click()
				
		})
	}
	function start(){
		console.log(localStorage.getItem("route"))
	}
	var lastPoint = [50.40851753069729, 30.569458007812504]
	function addToMap(data){
		var pointList ;
		data.forEach (function(elem){	
			pointList=[]
			elem.forEach (function(e){	
				count_of_points++;
				if(e.enable){
					L.circle([e.lat, e.lng], {color: e.color ,zIndexOffset:3,fillColor: e.fill,fillOpacity: 0.5,radius: e.radius}) 
						    .bindPopup(e.date+"<br>"+e.address+e.name)
						    .addTo(map).bringToFront()

					pointList.push(new L.LatLng(e.lat, e.lng))
					//map.setView(L.latLng(e.lat, e.lng),18)
					lastPoint = L.latLng(e.lat, e.lng);
				}
			})
			new L.Polyline(pointList, {
							    color: 'blue',
							    weight: 3,
							    opacity: 0.5,
							    smoothFactor: 1
							}).addTo(map);
		})
		
	}

	function addToPanelMap(data){
		var count = 0;
		var dist = 0;
		data.forEach(function(elem){
			count ++;
				dist = 0;
				$("#coords").append('<div class="panel panel-default">\
    <div class="panel-heading">\
      <h4 class="panel-title">\
        <a data-toggle="collapse" data-parent="#coords" class="route_colapse" id="route_colapse'+count+'" route="'+count+'" href="#collapse'+count+'" >'
               +count+' route <span id="route'+count+'"   class="route_colapse" id="route_colapse'+count+'" route="'+count+'" > </span> m </a>      </h4>    </div> <div id="collapse'+count+'"  class="panel-collapse collapse ">\
      <div class="panel-body" style="padding: 0px;">  <ul class="list-group" id="route_list'+count+'">\
		          </ul>  </div>\
    </div>\
  </div>')


			elem.forEach(function(e){

				dist += (+(e.enable?e.dist:'0'))||0
				$("#route_list"+count).append(' <li class="list-group-item list-group-item-'+((e.enable)?'info':'default')+ ' " > '
						+e.address+' <br>'+(e.dist?e.dist:'start') +'<div class="btn-group pull-right"> '

						+((e.enable)?' <a class="btn btn-xs   	btn-default point"  lat="'+e.lat+'" lng="'+e.lng+'"><i class="fa fa-map-marker point" lat="'
							+e.lat+'" lng="'+e.lng+'" aria-hidden="true"></i></a>':'')

						+'<a class="btn btn-xs   	btn-default enable_button" point_id="'+e.id+'"  ><i  point_id="'+e.id+'"  class=" enable_button fa '+((e.enable)?'fa-minus':'fa-plus')+'" aria-hidden="true"></i></a>'
						+ '</div></li>')
			})
			dist=dist.toFixed(2)
			$("#route"+count).html(dist+'')
		})


	}
	function clearMap() {
	    for(i in map._layers) {
	        if(map._layers[i]._path != undefined) {
	            try {
	                map.removeLayer(map._layers[i]);
	            }
	            catch(e) {
	                console.log("problem with " + e + map._layers[i]);
	            }
	        }
	    }
	}
	if (!map.restoreView()) {
          map.setView(lastPoint, 16);
    }
})
function positionTo (lat,lng){

				map.setView(L.latLng(lat,lng),18)
	}


					// var firstpolyline = new L.Polyline(pointList, {
					//     color: 'blue',
					//     weight: 3,
					//     opacity: 0.5,
					//     smoothFactor: 1
					// });
					// var lastPoint = data[data.length-1]
					// map.setView(L.latLng(lastPoint.lat,lastPoint.lng),16)