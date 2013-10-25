function MapPane(){
	var that=this;

	that.mapObj;

	that.loadedFilename = null;

	that.init = function(){
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

		L.featureGroup()

		//that.mapObj=map;

		//that.getData("MIData");

		//that.getData("NYData");
	};

	that.selectCity = function(loadedFilename, city){
		that.loadedFilename = loadedFilename;

//		that.mapObj.removeLayer();

		var features = L.featureGroup().addTo(that.mapObj);

		$.ajax({
			url: "data/"+that.loadedFilename+".json",
			processData: true,
			data: {},
			dataType: "json",
			success: function(data) {
			//	console.log(data.length);
				for(var i=0;i<data.length;i++){
				//	console.log("here in for 1");
		          	var obj = data[i];
		          	if(data[i][city]!=0){
						L.polygon([
							[obj["SouthwestLat"], obj["SouthwestLon"]], 
							[obj["SoutheastLat"], obj["SoutheastLon"]], 
							[obj["NortheastLat"], obj["NortheastLon"]], 
							[obj["NorthwestLat"], obj["NorthwestLon"]]
						]).addTo(features);
					}
				}	
				that.mapObj.fitBounds(features.getBounds());
			},
			error: function(x,y,z) {
				console.log("Error");
			}
		});
	}
}

