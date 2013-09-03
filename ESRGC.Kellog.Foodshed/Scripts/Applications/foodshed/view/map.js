/*
Author: Tu Hoang
Aug 2013

Map View 
map.js

Handles map view initialization
*/

dx.defineView('Map', {
    name: 'Map',
    initialize: function () {
        $('#opacitySlider').slider({
            formater: function (e) {
                return 'Opacity: ' + e/100;
            }
        });
        dx.log('map view initialized');
    }
});