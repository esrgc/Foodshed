/*
Author: Tu Hoang
Aug 2013

foodshed store
foodshed.js

Store that handles loading foodshed polygons
*/

dx.defineStore('Foodshed', {
    name: 'Foodshed',
    url: 'foodshed/getFoodsheds',
    initialize: function () {
        dx.data.store.Foodshed.parent.initialize.apply(this, arguments);
    }
});