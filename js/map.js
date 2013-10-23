var p = new MapPane();
p.init();

function MapPane(){
	var that=this;

	that.mapObj;

	this.init = function(){
		that.mapObj = L.map('map', {
			measureControl: true
		}).setView([42.2, -75.2319], 8);

		L.control.scale({
			maxWidth: 300
		}).addTo(that.mapObj);

		L.tileLayer('http://a.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
		    maxZoom: 18
		}).addTo(that.mapObj);

		//that.mapObj=map;

		that.getData("MIData");
	};

	this.getData = function(filename){
		/*$.getJSON("data/"+filename+".json&callback=?", function(data){
			alert("here 2");
		});*/

		$.ajax({
			url: "data/"+filename+".json",
			processData: true,
			data: {},
			dataType: "json",
			success: function(data) {
				//alert(data[0]["X (I)"])
				_.each(data, function(entry){
				//	var bounds = [[entry["SouthwestLat"], entry["SouthwestLon"]], [entry["SoutheastLat"], entry["SoutheastLon"]], [entry["NortheastLat"], entry["NortheastLon"]], [entry["NorthwestLat"], entry["NorthwestLon"]]];

					L.polygon([
						[entry["SouthwestLat"], entry["SouthwestLon"]], 
						[entry["SoutheastLat"], entry["SoutheastLon"]], 
						[entry["NortheastLat"], entry["NortheastLon"]], 
						[entry["NorthwestLat"], entry["NorthwestLon"]]
					]).addTo(that.mapObj);
				})
				that.mapObj.panTo(new L.LatLng(data[0]["Latitude (I)"], data[0]["Longitude (I)"]));
			},
			error: function(x,y,z) {
				console.log("Error");
			}
		});
	}
}

