/*
Author: Tu Hoang
Aug 2013

Stats store
stats.js

Store that handles loading foodshed statistics
*/

dx.defineStore('Stats', {
    name: 'Stats',
    url: 'foodshed/getStats',
    initialize: function () {
        dx.data.store.Stats.parent.initialize.apply(this, arguments);
    }
});