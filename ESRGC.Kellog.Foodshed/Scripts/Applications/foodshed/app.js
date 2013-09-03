/*
Author: Tu Hoang
August 2013

Foodshed app
app.js
Application definition
*/

dx.application({
    name: 'foodshed',
    stores: ['City', 'Foodshed', 'Stats'],
    models: [],
    views: ['Map'],
    controllers: ['Map'],
    launch: function () {
        dx.log('Application initialized.');
        //initialize map viewer here
        foodshed.appData.mapViewer = new dx.app.LeafletViewer();
        foodshed.getMapViewer = function () {
            return foodshed.appData.mapViewer;
        };
    }

});