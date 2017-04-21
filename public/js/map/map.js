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
	function gsm (e) {
		map.panTo(e.latlng);
	}
	
	L.control.custom({
		position: 'topright',
		content : ' <div class="panel-body">A Basic Panel</div>',
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
		{
			click: function(data)
			{
				console.log('wrapper div element clicked');
				console.log(data);
			},
			dblclick: function(data)
			{
				console.log('wrapper div element dblclicked');
				console.log(data);
			},
			contextmenu: function(data)
			{
				console.log('wrapper div element contextmenu');
				console.log(data);
			},
		}
	})
	.addTo(map);




	$.get('/get/coords1',function(data){

		if(data){
			if(data[0]){
				var pointList = []
				//var pointA = new L.LatLng(data[0].lat, data[0].lng);
				data.forEach (function(elem){
					//var pointB = new L.LatLng(elem.lat, elem.lng);
					//var pointList = [pointA, pointB];
					pointList.push(new L.LatLng(elem.lat, elem.lng))

				})
				var firstpolyline = new L.Polyline(pointList, {
				    color: 'red',
				    weight: 3,
				    opacity: 0.5,
				    smoothFactor: 1
				});
				var lastPoint = data[data.length-1]
				map.setView(L.latLng(lastPoint.lat,lastPoint.lng),16)

				firstpolyline.addTo(map);

			}
		}
	})
})
