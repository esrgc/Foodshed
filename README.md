Foodshed
========

This application uses NGINX to serve JSON files if the program is being run locally.


How to add a state's data to the application
--------------------------------------------
This assumes that the data is being stored in Manifold.
* First, open the state's data table and export it to CSV.
* In the CSV file, delete entire columns so that the only one remaining is "P_(CITY NAME)"
* Get rid of the "P_" so only "(CITY NAME)" remains
* On the row below it, type out the actual, nonabreviated, regular case city name
* Add the state and city names to data/Cities.json in the format of the other data in the file using "Convert CSV to JSON" on the tool at www.convertcsv.com/csv-to-json.htm
* Export the data in Manifold as a shapefile and import it into QGIS
* Export the data from QGIS as GeoJSON
* Copy paste the generated JSON into a new Notepad++ document
* Replace ":0}" with ":0\n}" (don't include the quotes on either)
* Hit "Control-F" and then click "Mark"
* Type ":0 (with the one quote) and click the checkbox "Bookmark line". Then click "Mark All"
* After it completes, click "Search->Bookmark->Remove Bookmarked Lines"
* Wait for it to finish, it will take a long time
* Minify the file as much as possible while still keeping the JSON structure. You can remove blank lines, remove spaces, that sort of thing.
* Save this document as, for example "NYData.json", with NY replaced with the new state's code
* Place the JSON file in the data folder of the application
* In panel.js, on the line that begins with:

```javascript
	$('#dropdown-options-state').html('
```
, add the new state in the list with the format
```html
	<li><a id="STATE ABBREVIATION" href="#">STATE NAME</a></li>
```