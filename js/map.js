function MapPane(){
	var that=this;

	that.mapObj;

	that.loadedFilename = null;

	that.geoJSONLayer;

	that.polygonColor="0xff5555";

	that.legend;

	that.classification = 'Quantile';

	that.opacity = 0.8;

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

	that.selectCity = function(loadedFilename, unformattedCity, formattedCity){
		that.loadedFilename = loadedFilename;

		if(typeof(that.geoJSONLayer)!="undefined"){
			that.mapObj.removeLayer(that.geoJSONLayer);
		}

		$.ajax({
			url: "data/"+that.loadedFilename+"Data.geojson",
			processData: true,
			data: {},
			dataType: "json",
			success: function(data) {
				var shortenedKey = '';
				var geojsonData = {
					"type": "FeatureCollection",
                    "features": []
				};
				for(var i=0;i<data.features.length;i++){
		          	if((data.features[i].properties["P_"+unformattedCity]!=undefined)||(data.features[i].properties["C_"+unformattedCity]!=undefined)){
		          		geojsonData.features.push(data.features[i]);
		          	}
		        }

				var numDivisions;
				var divisionLength=1;
				var remainder=0;
				if(geojsonData.features.length<5){
					numDivisions=geojsonData.features.length;
				}
				else{
					numDivisions=5;
					divisionLength=parseInt(geojsonData.features.length/5);
					remainder=geojsonData.features.length%5;
				}
				var divisionNum=1;
				var divisionCount=0;
				geojsonData.features.sort(function(a,b){
					var aP_ = 0, aC_ = 0, bP_ = 0, bC_ = 0;
				    if(a.properties["P_"+unformattedCity] != undefined){
				    	aP_ = parseInt(a.properties["P_"+unformattedCity]);
				    }
				    if(a.properties["C_"+unformattedCity] != undefined){
				    	aC_ = parseInt(a.properties["C_"+unformattedCity]);
				    }
				    if(b.properties["P_"+unformattedCity] != undefined){
				    	bP_ = parseInt(b.properties["P_"+unformattedCity]);
				    }
				    if(b.properties["C_"+unformattedCity] != undefined){
				    	bC_ = parseInt(b.properties["C_"+unformattedCity]);
				    }

				    if((aP_+aC_)<(bP_+bC_)){
				    	return -1;
				    }
				    return 1;
				});

				var toColor = function ( d ) {
		     		  var c = Number(d).toString(16);
		       		return "#" + ( "000000".substr( 0, 6 - c.length ) + c.toUpperCase() );
		    	}

		    	if(typeof(that.legend)!="undefined"){
		    		that.mapObj.removeControl(that.legend);
		    	}

				that.legend = L.control({position: 'bottomleft'});

				var col=that.polygonColor;

				var equalIntervalUpperBounds = new Array(numDivisions);

				that.legend.onAdd = function (map) {


				    var div = L.DomUtil.create('div', 'info legend'),
			        labels = [];

			        div.innerHTML += '<center>Legend (HNE)</center><hr>'

			        if(that.classification == 'Quantile'){
					    // loop through our density intervals and generate a label with a colored square for each interval
					    for (var i = 1; i <= numDivisions; i++) {
					    	var P_ = 0, C_ = 0, oldP_ = 0, oldC_ = 0;




					    	//To Do - fix so that it works when there's a remainder. See NY - Akron for an example.

					    	if(i!=numDivisions){
					    		if((geojsonData.features[(divisionLength*i)-1].properties["P_"+unformattedCity]) != undefined){
							    	P_ = parseInt(geojsonData.features[(divisionLength*i)-1].properties["P_"+unformattedCity]);
							    }
							    if((geojsonData.features[(divisionLength*i)-1].properties["C_"+unformattedCity]) != undefined){
							    	C_ = parseInt(geojsonData.features[(divisionLength*i)-1].properties["C_"+unformattedCity]);
							    }
					    	}
					    	//We get the last value in the array if we're generating the largest legend key to account for the remainder of 
					    	//geojsonData.features.length%divisionLength. This means that there will sometimes be more dark boxes on the map.
					    	else{
					    		if((geojsonData.features[geojsonData.features.length-1].properties["P_"+unformattedCity]) != undefined){
						    		P_ = parseInt(geojsonData.features[geojsonData.features.length-1].properties["P_"+unformattedCity]);
						    	}
						    	if((geojsonData.features[geojsonData.features.length-1].properties["C_"+unformattedCity]) != undefined){
						    		C_ = parseInt(geojsonData.features[geojsonData.features.length-1].properties["C_"+unformattedCity]);
						    	}
					    	}
					    	//This makes it so we don't access geojsonData.features[-1]. We set the previous interval value unless it's the first loop, then we just let
					    	//oldP_ and oldC_ be geojsonData.features[0]
					    	if(i!=1){
					    		if((geojsonData.features[(divisionLength*(i-1))-1].properties["P_"+unformattedCity]) != undefined){
								    oldP_ = parseInt(geojsonData.features[(divisionLength*(i-1))-1].properties["P_"+unformattedCity]);
								}
								if((geojsonData.features[(divisionLength*(i-1))-1].properties["C_"+unformattedCity]) != undefined){
								    oldC_ = parseInt(geojsonData.features[(divisionLength*(i-1))-1].properties["C_"+unformattedCity]);
								}
					    	}
					    	else{
					    		if((geojsonData.features[0]["P_"+unformattedCity]) != undefined){
								    oldP_ = parseInt(geojsonData.features[0].properties["P_"+unformattedCity]);
								}
								if((geojsonData.features[0]["C_"+unformattedCity]) != undefined){
								    oldC_ = parseInt(geojsonData.features[0].properties["C_"+unformattedCity]);
								}
					    	}

					    	col=(col-0x111111);

					    	if((oldC_+oldP_)!=(C_+P_)){
					        	div.innerHTML += '<i style="background:' + toColor(col) + '"></i> ' + (oldC_ + oldP_+1) + ' - ' + (C_ + P_) + '<br><br>';
					        }
					        else{
					        	div.innerHTML += '<i style="background:' + toColor(col) + '"></i> ' + (C_ + P_) + '<br><br>';
					        }
					    }
					}
					else if(that.classification == 'Equal Interval'){
						var smallP_=0, smallC_=0, bigP_=0, bigC_=0;

						if((geojsonData.features[0].properties["P_"+unformattedCity]) != undefined){
						    smallP_ = parseInt(geojsonData.features[0].properties["P_"+unformattedCity]);
						}
						if((geojsonData.features[0].properties["C_"+unformattedCity]) != undefined){
						    smallC_ = parseInt(geojsonData.features[0].properties["C_"+unformattedCity]);
						}
						if((geojsonData.features[geojsonData.features.length-1].properties["P_"+unformattedCity]) != undefined){
				    		bigP_ = parseInt(geojsonData.features[geojsonData.features.length-1].properties["P_"+unformattedCity]);
				    	}
				    	if((geojsonData.features[geojsonData.features.length-1].properties["C_"+unformattedCity]) != undefined){
				    		bigC_ = parseInt(geojsonData.features[geojsonData.features.length-1].properties["C_"+unformattedCity]);
				    	}

				    	var range = (bigP_ + bigC_) - 1;
				    	var intervalLength = parseInt(parseInt(range/numDivisions)-((range%numDivisions)/numDivisions));

				    	var old = (smallP_+smallC_);
				    	var current = old;

				    	for(var i = 0; i<numDivisions; i++){
				    		if(i==0){
				    			old=0;
				    		}
				    		col=(col-0x111111);
				    		current+=intervalLength;
				    		equalIntervalUpperBounds[i] = current;

				    		if(i==(numDivisions-1)){
				    			current = bigP_+bigC_;
				    		}

							if((oldC_+oldP_)!=(C_+P_)){
					        	div.innerHTML += '<i style="background:' + toColor(col) + '"></i> ' + (old+1) + ' - ' + current + '<br><br>';
					        }
					        else{
					        	div.innerHTML += '<i style="background:' + toColor(col) + '"></i> ' + (C_ + P_) + '<br><br>';
					        }
					        old+=intervalLength;
				    	}
					}

				    return div;
				};

				that.legend.addTo(that.mapObj);
				col=that.polygonColor;
				var equalIntervalCurrentIndex = 0;
				var C_=0, P_=0;

				that.geoJSONLayer = L.geoJson(geojsonData,{
					onEachFeature: function (feature, layer) {
						//These values are used both for the equal interval calculation and pop up creation
						if((feature.properties["P_"+unformattedCity]) != undefined){
						    P_ = feature.properties["P_"+unformattedCity];
						}
						if((feature.properties["C_"+unformattedCity]) != undefined){
						    C_ = feature.properties["C_"+unformattedCity];
						}

				        layer.bindPopup(new L.popup().setContent('<center>Production Zone #' + feature.properties['prodzone'] + ' and ' + formattedCity + '</center><hr><center>All values are in Human Nutritional Equivalents (HNE), or the amount of food that meets the nutritional requirments for one person for one year.</center><br><table class="table"><tr><td>Perennial Crops</td><td>' + P_ + '</td></tr><tr><td>Cover Crops</td><td>' + C_ + "</td></tr</table>"));
				    },
				    style: function (feature) {
						if(that.classification == 'Quantile'){
							divisionCount++;		
							if(divisionCount>=divisionLength){
								if(divisionNum!=numDivisions){
									divisionCount=0;
									col=(col-0x111111);
									divisionNum++;
								}						
							}
						}

						if((feature.properties["P_"+unformattedCity]) != undefined){
						    P_ = feature.properties["P_"+unformattedCity];
						}
						if((feature.properties["C_"+unformattedCity]) != undefined){
						    C_ = feature.properties["C_"+unformattedCity];
						}
		
						if (that.classification == 'Equal Interval'){
							console.log((C_ + P_)+">"+equalIntervalUpperBounds[equalIntervalCurrentIndex]);
							while((C_ + P_)>equalIntervalUpperBounds[equalIntervalCurrentIndex]){
								col=(col-0x111111);
								equalIntervalCurrentIndex++;
							}
							console.log("being set as "+toColor(col));
						}

				        return {
				        	color: toColor(col),
						    weight:1,
							fillOpacity:that.opacity
				        };
				    }
				}).addTo(that.mapObj);
				that.mapObj.fitBounds(that.geoJSONLayer.getBounds());
			},
			error: function(a, b, c) {
				console.log(b.parsererror);
			}
		});
	};
	that.changeColor = function(newColor){
		that.polygonColor=newColor;
		//that.features.setStyle({color:newColor});
	};
}

