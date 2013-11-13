function MapPane(){
	var that=this;

	that.mapObj;

	that.loadedFilename = null;

	that.features;

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
				var shortenedKey = '';
				for(var i=0;i<data.length;i++){
		          	if((data[i]["P_"+city]!=null)||(data[i]["C_"+city]!=null)){
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
				arr.sort(function(a,b){
					var aP_ = 0, aC_ = 0, bP_ = 0, bC_ = 0;
				    if(a["P_"+city] != undefined){
				    	aP_ = parseInt(a["P_"+city]);
				    }
				    if(a["C_"+city] != undefined){
				    	aC_ = parseInt(a["C_"+city]);
				    }
				    if(b["P_"+city] != undefined){
				    	bP_ = parseInt(b["P_"+city]);
				    }
				    if(b["C_"+city] != undefined){
				    	bC_ = parseInt(b["C_"+city]);
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
					    		if((arr[(divisionLength*i)-1]["P_"+city]) != undefined){
							    	P_ = parseInt(arr[(divisionLength*i)-1]["P_"+city]);
							    }
							    if((arr[(divisionLength*i)-1]["C_"+city]) != undefined){
							    	C_ = parseInt(arr[(divisionLength*i)-1]["C_"+city]);
							    }
					    	}
					    	//We get the last value in the array if we're generating the largest legend key to account for the remainder of 
					    	//arr.length%divisionLength. This means that there will sometimes be more dark boxes on the map.
					    	else{
					    		if((arr[arr.length-1]["P_"+city]) != undefined){
						    		P_ = parseInt(arr[arr.length-1]["P_"+city]);
						    	}
						    	if((arr[arr.length-1]["C_"+city]) != undefined){
						    		C_ = parseInt(arr[arr.length-1]["C_"+city]);
						    	}
					    	}
					    	//This makes it so we don't access arr[-1]. We set the previous interval value unless it's the first loop, then we just let
					    	//oldP_ and oldC_ be arr[0]
					    	if(i!=1){
					    		if((arr[(divisionLength*(i-1))-1]["P_"+city]) != undefined){
								    oldP_ = parseInt(arr[(divisionLength*(i-1))-1]["P_"+city]);
								}
								if((arr[(divisionLength*(i-1))-1]["C_"+city]) != undefined){
								    oldC_ = parseInt(arr[(divisionLength*(i-1))-1]["C_"+city]);
								}
					    	}
					    	else{
					    		if((arr[0]["P_"+city]) != undefined){
								    oldP_ = parseInt(arr[0]["P_"+city]);
								}
								if((arr[0]["C_"+city]) != undefined){
								    oldC_ = parseInt(arr[0]["C_"+city]);
								}
					    	}

					    	col=(col-0x111111);

					    	if((oldC_+oldP_)!=(C_+P_)){
					        	div.innerHTML += '<i style="background:' + toColor(col) + '"></i> ' + (oldC_ + oldP_) + ' - ' + (C_ + P_) + '<br><br>';
					        }
					        else{
					        	div.innerHTML += '<i style="background:' + toColor(col) + '"></i> ' + (C_ + P_) + '<br><br>';
					        }
					    }
					}
					else if(that.classification == 'Equal Interval'){
						var smallP_=0, smallC_=0, bigP_=0, bigC_=0;

						if((arr[0]["P_"+city]) != undefined){
						    smallP_ = parseInt(arr[0]["P_"+city]);
						}
						if((arr[0]["C_"+city]) != undefined){
						    smallC_ = parseInt(arr[0]["C_"+city]);
						}
						if((arr[arr.length-1]["P_"+city]) != undefined){
				    		bigP_ = parseInt(arr[arr.length-1]["P_"+city]);
				    	}
				    	if((arr[arr.length-1]["C_"+city]) != undefined){
				    		bigC_ = parseInt(arr[arr.length-1]["C_"+city]);
				    	}

				    	var range = (bigP_ + bigC_) - (smallP_ + smallC_);
				    	var intervalLength = parseInt(range/numDivisions);

				    	var old = (smallP_+smallC_);
				    	var current = old;

				    	for(var i = 0; i<numDivisions; i++){
				    		col=(col-0x111111);
				    		current+=intervalLength;
				    		equalIntervalUpperBounds[i] = current;

							if((oldC_+oldP_)!=(C_+P_)){
					        	div.innerHTML += '<i style="background:' + toColor(col) + '"></i> ' + old + ' - ' + current + '<br><br>';
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

				for(var i=0;i<arr.length;i++){
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

					//These values are used both for the equal interval calculation and pop up creation
					var C_=0, P_=0;
					if((arr[i]["P_"+city]) != undefined){
					    P_ = parseInt(arr[i]["P_"+city]);
					}
					if((arr[i]["C_"+city]) != undefined){
					    C_ = parseInt(arr[i]["C_"+city]);
					}
					
					if (that.classification == 'Equal Interval'){
						
						if((C_ + P_)>equalIntervalUpperBounds[equalIntervalCurrentIndex]){
							col=(col-0x111111);
							equalIntervalCurrentIndex++;
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
						weight:1,
						fillOpacity:that.opacity
					}).bindPopup(new L.popup().setContent('<center>Production Zone #' + arr[i]['prodzone'] + ' and ' + city + '</center><hr><center>All values are in Human Nutritional Equivalents (HNE), or the amount of food that meets the nutritional requirments for one person for one year.</center><br><table class="table"><tr><td>Perennial Crops</td><td>' + P_ + '</td></tr><tr><td>Cover Crops</td><td>' + C_ + "</td></tr</table>")).addTo(that.features);
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

