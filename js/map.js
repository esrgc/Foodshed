function MapPane(){
	var that=this;

	that.mapObj;

	that.loadedFilename = null;

	that.features;

	that.polygonColor="0xff5555";

	that.legend;

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
	};

	that.selectCity = function(loadedFilename, city){
		that.loadedFilename = loadedFilename;

		if(typeof(that.features)=="undefined"){
			that.features = L.featureGroup().addTo(that.mapObj);
		}
		else{
			that.features.clearLayers();
		}

		$.ajax({
			url: "data/"+that.loadedFilename+".json",
			processData: true,
			data: {},
			dataType: "json",
			success: function(data) {
				var arr = new Array();
				for(var i=0;i<data.length;i++){
		          	var obj = data[i];
		          	if(data[i][city]!=0){
		          		arr.push(data[i]);
		          	}
		        }
				var numDivisions;
				var divisionLength=1;
				var remainder=0;
				if(arr.length<5){
					numDivisions=arr.length;
				}
				else{
					numDivisions=5;
					divisionLength=parseInt(arr.length/5);
					remainder=arr.length%5;
				}
				var divisionNum=1;
				var divisionCount=0;
				arr.sort(function(a,b){return a[city]-b[city]});

				var toColor = function ( d ) {
		     		  var c = Number(d).toString(16);
		       		return "#" + ( "000000".substr( 0, 6 - c.length ) + c.toUpperCase() );
		    	}

		    	if(typeof(that.legend)!="undefined"){
		    		that.mapObj.removeControl(that.legend);
		    	}

				that.legend = L.control({position: 'bottomleft'});

				var col=that.polygonColor;

				that.legend.onAdd = function (map) {

				    var div = L.DomUtil.create('div', 'info legend'),
			        labels = [];

				    // loop through our density intervals and generate a label with a colored square for each interval
				    for (var i = 0; i < numDivisions; i++) {
				    	col=(col-0x111111);
				        div.innerHTML += '<i style="background:' + toColor(col) + '"></i> ' + i + '<br><br>';
				    }

				    return div;
				};

				that.legend.addTo(that.mapObj);
				col=that.polygonColor;

				for(var i=0;i<arr.length;i++){
					divisionCount++;		
					if(divisionCount<divisionLength){
						console.log(divisionCount+"   "+divisionLength);
					}
					else{
						if(divisionNum!=numDivisions){
							divisionCount=0;
							col=(col-0x111111);
							divisionNum++;
						}
					}
					L.polygon([
						[arr[i]["SouthwestLat"], arr[i]["SouthwestLon"]], 
						[arr[i]["SoutheastLat"], arr[i]["SoutheastLon"]], 
						[arr[i]["NortheastLat"], arr[i]["NortheastLon"]], 
						[arr[i]["NorthwestLat"], arr[i]["NorthwestLon"]]
					],
					{
						color:toColor(col),
						weight:2,
						fillOpacity:0.8
					}).addTo(that.features);
				}	
				that.mapObj.fitBounds(that.features.getBounds());
			},
			error: function(x,y,z) {
				console.log("Error");
			}
		});
	};
	that.changeColor = function(newColor){
		that.polygonColor=newColor;
		that.features.setStyle({color:newColor});
	};
}

