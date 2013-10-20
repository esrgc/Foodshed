var map = L.map('map', {
	measureControl: true
}).setView([42.2, -75.2319], 8);

L.control.scale({
	maxWidth: 300
}).addTo(map);

L.tileLayer('http://a.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 18
}).addTo(map);