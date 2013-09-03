/*
Author: Tu Hoang
Aug 2013

City store
city.js

Store that handles loading city list
*/

dx.defineStore('City', {
    name: 'City',
    url: 'foodshed/getcitiesbystate',
    initialize: function () {
        dx.data.store.City.parent.initialize.apply(this, arguments);
    }
});