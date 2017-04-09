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
})