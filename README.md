Foodshed
========

This application uses NGINX to serve JSON files if the program is being run locally.


How to add a state's data to the application
--------------------------------------------
This assumes that the data is being stored in Manifold.
* First, open the state's data table and export it to CSV.
* In the CSV file, delete entire columns so that the only ones remaining are "P_(CITY NAME)", "C_(CITY NAME)", and "prodzone"
* Rename "P_(CITY NAME)" and "C_(CITY NAME)" to "P_(City name)" and "C_(City name)"
* Now, in Manifold, run the following script, substituting your table name in:

```sql
	OPTIONS COORDSYS("Drawing as COMPONENT");
	SELECT [ID], [Point],
		CentroidX([Point]) as [Longitude].
		CentroidY([Point]) as [Latitude]
	FROM
		(Select [ID], Project([Vertex], COORDSYS("Latitude / Longitude")) as [Point]
		FROM [ YOUR TABLE NAME HERE ] 
		WHERE IsArea([ID])
		SPLIT BY Coords([Geom (I)] as [Vertex]
	))
'''

* Take the generated table and export it to another CSV file. Open it in Excel.
* Delete the first row (the one that contains column titles)
* In the blank column next to your final column, click on the top cell. Type "=mod(row(), 4)" and hit enter
* Apply that formula to the rest of the column (use control-enter to apply a formula to many cells at once)
* Highlight the column you just created and then click Data->Filter
* On the top of your column there should be a drop down. Click it and then uncheck the boxes so the only value selected is 1
* In the other CSV file, add the columns "NorthwestLat" and "NorthwestLon" (or SoutheastLon/SoutheastLat or whatever direction this point corrosponds to. You may have to draw a chart.) Make sure the column names are right, they're parsed by that name in the application
* Copy paste the lat/lon data into your newly created column
* Chnage the filters and do this until all of the lat/lon data is in the first CSV file for all four corners of the grid
* Copy all of the cells in the first CSV file and paste them into the box at www.convertcsv.com/csv-to-json.htm
* Using the defaults, click "Convert CSV to JSON"
* Copy paste the generated JSON into a new Notepad++ document
* Hit "Control-F" and then click "Mark"
* Type ":0 (with the one quote) and click the checkbox "Bookmark line". Then click "Mark All"
* After it completes, click "Search->Bookmark->Remove Bookmarked Lines"
* Wait for it to finish, it will take a long time
* Save this document as, for example "NYData.json", with NY replaced with the new state's code
* Place the json file in the data folder of the application
* In the data folder of the application, open Cities.json
* Add the state abbreviation and the city names in the pattern evident in the file
* In panel.js, in the line that begins with:

'''javascript
	$('#dropdown-options-state').html('
'''

, add the new state in the list with the format

'''html
	<li><a id="STATE ABBREVIATION" href="#">STATE NAME</a></li>
'''