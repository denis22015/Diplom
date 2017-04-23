
			filelds_list=[];

$(document).ready(function(){
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
		content : ' <div  style="   max-height: 600px;    overflow: auto;"  class="panel-body" id="coords" ></div>',
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



	$.get('/get/coords1',function(data){
		addToMap(data)
		addToPanelMap(data)

		$(".point").on('click',function(e){
			const lat = $(e.target).attr("lat")
			const lng = $(e.target).attr("lng")
			if(window.marker)
			window.marker.removeFrom(map)
			window.marker = 
		L.marker([lat,lng]).addTo(map)
			positionTo(lat,lng)
		})
			
	})
	function addToMap(data){
		var pointList ;
		data.forEach (function(elem){	
			pointList=[]
			elem.forEach (function(e){	
				L.circle([e.lat, e.lng], {color: e.color ,fillColor: e.fill,fillOpacity: 0.5,radius: e.radius}) 
					    .bindPopup(e.date+e.name)
					    .addTo(map);
				pointList.push(new L.LatLng(e.lat, e.lng))
				map.setView(L.latLng(e.lat, e.lng),18)
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
				$("#coords").append(' <div class="panel-group">\
  <div class="panel panel-default">\
    <div class="panel-heading">\
      <h4 class="panel-title">\
        <a data-toggle="collapse" href="#collapse'+count+'" onclick="positionTo('+elem[0].lat+','+elem[0].lng+')">'+count+' route <span id="route'+count+'" > </span> m group</a>\
      </h4>    </div>    <div id="collapse'+count+'" class="panel-collapse collapse">      <ul class="list-group" id="route_list'+count+'">\
          </ul>    </div>  </div></div>')

					//<li class="list-group-item list-group-item-success">'+count+' route <span id="route'+count+'" > </span> m</li>')


				/*

<div class="panel-group">
  <div class="panel panel-default">
    <div class="panel-heading">
      <h4 class="panel-title">
        <a data-toggle="collapse" href="#collapse1">'+count+' route <span id="route'+count+'" > </span> m group</a>
      </h4>
    </div>
    <div id="collapse1" class="panel-collapse collapse">
      <ul class="list-group" id="route_list'+count+'">

          </ul>
    </div>
  </div>
</div>
				*/
			elem.forEach(function(e){

				dist +=  (+e.dist)||0
				$("#route_list"+count).append(' <li class="list-group-item list-group-item-info point" \
					 lat="'+e.lat+'" lng="'+e.lng+'">'+e.lat+','+e.lng+' '+(e.dist?e.dist:'')+'</li>')
			})
			$("#route"+count).html(dist+'')
		})

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