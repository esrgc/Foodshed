/*
Author: Tu Hoang
Aug 2013

map controller
map.js

This controller handles map operations
*/

dx.defineController('Map', {
    refs: {
        stateDropdown: '#states',
        cityDropdown: '#cities',
        colorPicker: '#colorPicker',
        classification: '#classification',
        slider: '.slider',
        legendContainer: '#legendContainer',
        chartContainer: '#chartContainer'
    },
    control: {
        stateDropdown: {
            change: 'onStateDropdownChange'
        },
        cityDropdown: {
            change: 'onCityDropdownChange'
        },
        colorPicker: {
            change: 'onColorChange'
        },
        classification: {
            change: 'onClassChange'
        },
        slider: {
            slideStop: 'onSliderStop'
        }
    },
    initialize: function () {
        //call base controller constructor
        dx.app.controller.Map.parent.initialize.apply(this, arguments);
        //wire City store for loading city
        var store = dx.getStore('City');
        if (typeof store != 'undefined') {
            store.on('load', this.onCityStoreLoad);
        }
        //wire foodshed store event for loading foodshed
        var fsStore = dx.getStore('Foodshed');
        if (typeof fsStore != 'undefined') {
            fsStore.on('load', this.onFoodshedStoreLoad);
        }
        //wire foodshed store event for loading foodshed
        var statsStore = dx.getStore('Stats');
        if (typeof fsStore != 'undefined') {
            statsStore.on('load', this.onStatsStoreLoad);
        }
        //initialize thematic object
        var app = dx.getApp();
        app.appData.renderer = new dx.app.ThematicRenderer({ fieldName: 'HNE' });
        app.getRenderer = function () {
            return dx.getApp().appData.renderer;
        };
    },
    onStateDropdownChange: function (event, object) {
        event.preventDefault();
        var value = $(object).val();
        dx.log(value);
        var store = dx.getStore('City');
        if (typeof store != 'undefined') {
            store.setParams({ state: value })
            store.loadJson();
        }
    },
    onCityDropdownChange: function (event, object) {
        event.preventDefault();
        var value = $(object).val();
        dx.log('city = ' + value);

        var state = this.getStateDropdown().val();
        dx.log('state = ' + state);

        var store = dx.getStore('Foodshed');
        var statsStore = dx.getStore('Stats');
        //load foodsheds
        if (typeof store != 'undefined') {
            var params = {
                state: state,
                city: value
            };
            store.setParams(params);
            store.loadJson();
            //load stats
            if (typeof statsStore != 'undefined') {
                statsStore.setParams(params);
                statsStore.loadJson();
            }
        }
    },
    onSliderStop: function (event, object) {
        var value = event.value / 100;
        var renderer = foodshed.getRenderer();
        renderer.setOpacity(value);
        this.drawFoodshed();
    },
    onColorChange: function (event, object) {
        var color = $(object).val();
        if (typeof color == 'undefined')
            return;
        var renderer = foodshed.getRenderer();
        renderer.setColorTheme(color);
        this.drawFoodshed();
    },
    onClassChange: function (event, object) {
        var classification = $(object).val();
        if (typeof classification == 'undefined')
            return;
        var renderer = foodshed.getRenderer();
        renderer.setClassification(classification);
        this.drawFoodshed();
    },
    ///Store events
    onCityStoreLoad: function (store, data) {
        var scope = dx.getController('Map');
        dx.log('in store 1: ' + store.name + ' load handler');
        //dx.log(data);
        var dropdown = scope.getCityDropdown();
        var inner = "<option value='null'>Select a city<option/>";
        for (var i in data) {
            var entry = data[i];
            if (entry.City != "")
                inner += "<option value='" + entry.Zone + "'>" + entry.City + "</option>";
        }
        dropdown.html(inner);
        dx.log('End store: ' + store.name + ' handler')
    },
    onFoodshedStoreLoad: function (store, data) {
        var scope = dx.getController('Map');
        var app = dx.getApp();
        app.appData.currentFoodshedData = data; //store for redrawing
        dx.log('in store: ' + store.name + ' load handler');
        //dx.log(data);
        var viewer = foodshed.getMapViewer();
        var renderer = foodshed.getRenderer();
        //calculate thematic values
        var calculated = renderer.calculateThematicRanges(data);
        //draw features
        viewer.clearFeatures(); //clear current features
        scope.drawFoodshed();
        viewer.zoomToFeatures();
        dx.log('End store: ' + store.name + ' handler')
    },
    onStatsStoreLoad: function (store, data) {
        var scope = dx.getController('Map');
        scope.drawChart(data);
    },
    ///////private helpers////////////
    renderLegends: function () {
        var thematicObj = foodshed.getRenderer().thematicObj;
        if (typeof thematicObj.calculated === "undefined")
            return;
        var legendContainer = this.getLegendContainer();
        var legendHtml = '';
        var classification = thematicObj.currentClassification;
        var ranges = thematicObj.classRanges[classification];
        var classes = ranges.length < thematicObj.numClasses ? ranges.length : thematicObj.numClasses;
        var colorTheme = thematicObj.currentTheme;
        var opacity = thematicObj.opacity;
        var msg = "";
        for (i = 0; i < classes; i++) {
            if (i == (classes - 1)) msg = 'Greater than ' + ranges[i];
            else msg = ranges[i] + ' to ' + ranges[i + 1];

            legendHtml += '<li>' +
                        '<span class="swatch" style="background-color:' + colorTheme[i] +
                        '; filter: alpha(opacity=' + opacity * 100 + ');' +
	                    'opacity: ' + opacity + ';"></span>';
            legendHtml += '<span class="legLabel">' + msg + '</span></li>';
        }
        legendContainer.html(legendHtml);
    },
    drawFoodshed: function () {
        var app = dx.getApp();
        var data = null;
        var viewer = app.getMapViewer();
        var renderer = app.getRenderer();
        if (typeof app.appData.currentFoodshedData == 'undefined')
            return;
        else
            data = app.appData.currentFoodshedData;
        //redraw
        viewer.clearFeatures();
        for (var i in data) {
            var entry = data[i];
            var geometry = viewer.createPolygon(entry);
            //dx.log(geometry);
            var color = renderer.getColorString(entry.HNE);
            var opacity = renderer.getOpacity();
            var style = {
                color: color,
                opacity: opacity,
                fillColor: color,
                fillOpacity: opacity,
                weight: 2
            };
            geometry.setStyle(style);
            //dx.log(obj.HNE);
            var rangeVal = Math.round(entry.HNE * 100) / 100;
            geometry.bindPopup('<span>Zone: '
                + entry.ProductionZone
                + '</span><br/><span>HNE: '
                + rangeVal + '</span>');
            viewer.addPolygonToFeatureGroup(geometry);
        }
        //render legends
        this.renderLegends();
    },
    drawChart: function (data) {
        if (typeof data == 'undefined') {
            dx.log('invalid data');
            return;
        }
        //always the first element
        data = data[0];
        dx.log(data);
        if (typeof data.need == 'undefined') {
            dx.log('invalid data (no "need" value found)');
            return;
        }
        if (typeof data.current == 'undefined') {
            dx.log('invalid data (no "current" value found)');
            return;
        }
        var chartContainer = this.getChartContainer();
        var chartHtml = ['<div class="piechart">',
                            '<div class="hoverbox"></div>',
                         '</div>'];
        chartContainer.html(chartHtml);
        var current = Math.round(data.current * 100) / 100;
        var need = Math.round(data.need * 100) / 100;
        var met = current;
        var unmet = (need > current) ? (need - current) : 1;
        var chartData = [{
            source: 'Met',
            value: current
        }, {
            source: 'Unmet',
            value: unmet
        }];
        var piechart = new GeoDash.PieChart('.piechart', {
            label: 'source',
            value: 'value',
            colors: ['#00FF00', "#e60000"],
            opacity: 0.7,
            hover: true,
            innerRadius: 10,
            title: ''
        });

        piechart.update(chartData);
    }

});