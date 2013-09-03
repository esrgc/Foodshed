/*
Author: Tu Hoang
Aug 2013

Thematic renderer
thematicRenderer.js

this class handles thematic rendering
*/

dx.app.ThematicRenderer = dx.define({
    name: 'ThematicRenderer',
    _className: 'dx.app.ThematicRenderer',
    initialize: function (options) {
        var scope = this;
        this.setFieldName(options.fieldName);
        this.setColorTheme('green'); //default color theme
    },
    ///////////////////Thematic rendering////////////////////////////
    thematicObj: {
        fieldName: "", //attribute field used to calculate ranges
        currentClassification: "quantile",
        classRanges: {
            quantile: null,
            equalInterval: null
        },
        numClasses: 6, //default value
        themes: {
            green: ["#f4f8fa", "#dffbdb", "#c0fbbb", "#a1f69b", "#83f980", "#68f964"],
            red: ["#f5f7fa", "#f5dadd", "#f5bdc0", "#f5a1a4", "#f58487", "#f5686b"],
            blue: ["#f4f7fb", "#d7dafb", "#babdfb", "#9ea1fb", "#8184fb", "#6568fb"],
            yellow: ["#f5f8fa", "#f5f8dd", "#f5f8c0", "#f5f8a4", "#f5f887", "#f5f86b"]
        },
        currentTheme: null,
        opacity: 0.8
    },
    setOpacity: function (opacity) {
        this.thematicObj.opacity = opacity;
        //redraw
        this.redraw();
    },
    setFieldName: function (name) {
        this.thematicObj.fieldName = name;
    },
    setColorTheme: function (theme) {
        if (typeof theme !== "undefined") {
            this.thematicObj.currentTheme = this.thematicObj.themes[theme];
            //redraw
            this.redraw();
        }
    },
    setClassification: function (classification) {
        this.thematicObj.currentClassification = classification;
        //redraw
        this.redraw();
    },
    getColorIndex: function (value, ranges) {
        var index = this.thematicObj.numClasses - 1;
        for (var i = 0; i < this.thematicObj.numClasses - 1; i++) {
            if ((value >= ranges[i]) && (value < ranges[(i + 1)]))
                index = i;
        }
        return index;
    },
    getColorString: function (value) {
        var ranges = this.thematicObj.classRanges[this.thematicObj.currentClassification];
        if (typeof ranges != 'undefined') {
            var colorIndex = this.getColorIndex(value, ranges);
            return this.thematicObj.currentTheme[colorIndex];
        }
    },
    getOpacity: function () {
        return this.thematicObj.opacity;
    },
    /*
    Calculate thematic ranges 
    return true if succeed otherwise false
    data format: unwrapped
    */
    calculateThematicRanges: function (data) {
        if (typeof this.thematicObj == 'undefined')
            return false;

        var fieldName = this.thematicObj.fieldName;
        if (fieldName == "") {
            dx.log("CalculateThematicRanges: fieldName is required to calculate ranges");
            return false;
        }
        var valueArray = [];
        //put values to an array for calculation assuming data is already in ascending order
        for (var i in data) {
            var dataEntry = data[i];
            var value = Math.round(dataEntry[fieldName] * 100) / 100;
            valueArray.push(value);
        }
        if (valueArray.length < this.thematicObj.numClasses)
            this.thematicObj.numClasses = valueArray.length;
        else {
            this.thematicObj.numClasses = 6;
        }

        //max min and range
        var minVal = valueArray[0], maxVal = valueArray[valueArray.length - 1];
        var range = maxVal - minVal;

        //calculate quantile range
        var quantile = [];
        quantile.push(minVal);
        var increment = Math.ceil(valueArray.length / this.thematicObj.numClasses);
        for (var i = increment; i < valueArray.length; i += increment) {
            quantile.push(valueArray[i]);
        }
        //calculate equal interval range assuming valueArray is in ascending order
        var equalInterval = [];

        var step = Math.ceil(range / this.thematicObj.numClasses);
        var rangeStartVal = Math.ceil(minVal);
        equalInterval.push(rangeStartVal); //1st range start
        for (var i = 1; i < this.thematicObj.numClasses; i++) {
            rangeStartVal += step;
            equalInterval.push(Math.ceil(rangeStartVal));
        }

        this.thematicObj.classRanges.quantile = quantile;
        this.thematicObj.classRanges.equalInterval = equalInterval;
        this.thematicObj.calculated = true;
        return true;
    },
    redraw: function () {
        //        var mapViewer = foodshed.getMapViewer();
        //        if (typeof mapViewer !== "undefined")
        //            ;
        //render legend
    }

});