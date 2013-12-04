function SidePanel(mapPanel){
  var that=this;

  var loadedFilename = null;

  that.formattedCity = null;

  that.mapPanel = mapPanel;

  var piechart;

  that.init = function(){
    $('.dropdown-toggle').dropdown();

    $('#slider').slider()
      .on('slideStop', function(ev){
          
          that.mapPanel.opacity = ($('#slider').slider('getValue')[0].value)/100.0;
          that.mapPanel.selectCity(that.loadedFilename, that.formattedCity);
      }
    );

    $('#dropdown-options-state').html('<li><a id="NY" href="#">New York</a></li><!--<li><a id="MI" href="#">Michigan</a></li>-->');

    $('#dropdown-options-data-classification li').on('click', function() {
        $('#dropdown-title-data-classification').html($(this).find('a').html());
        if(($(this).find('a').html()) == 'Equal Interval'){
          that.mapPanel.classification = 'Equal Interval';
          that.mapPanel.selectCity(that.loadedFilename, that.formattedCity);
        }
        if(($(this).find('a').html()) == 'Quantile'){
          that.mapPanel.classification = 'Quantile';
          that.mapPanel.selectCity(that.loadedFilename, that.formattedCity);
        }
    });

    $('#dropdown-options-state li').on('click', function() {
        $('#dropdown-title-state').html($(this).find('a').html());
        $('#dropdown-title-city').html("Select a City");

        that.loadedFilename = $(this).find('a').attr("id");

        that.setCities($(this).find('a').attr("id"));
    });

    $('#button-green').on('click', function() {
        that.mapPanel.changeColor("0x55ff55");
        that.mapPanel.selectCity(that.loadedFilename, that.formattedCity);
    });

    $('#button-red').on('click', function() {
        that.mapPanel.changeColor("0xff5555");
        that.mapPanel.selectCity(that.loadedFilename, that.formattedCity);
    });

    $('#button-blue').on('click', function() {
        that.mapPanel.changeColor("0x5555ff");
        that.mapPanel.selectCity(that.loadedFilename, that.formattedCity);
    });

    $('#button-orange').on('click', function() {
        that.mapPanel.changeColor("0xff9955");
        that.mapPanel.selectCity(that.loadedFilename, that.formattedCity);
    });

  };

  that.updateStatistics = function(state, city){
    $.ajax({
      url: "data/"+state+"Needs.json",
      processData: true,
      data: {},
      dataType: "json",
      success: function(data) {
        for(var i=0; i<data.length; i++){
          if(data[i]['UAUC_NAME']==that.formattedCity){
            var needed = data[i]['FOODNEED_H'];
            var population = data[i]['POPULATION'];
            var neededPercent = (parseFloat(needed)/parseInt(population))*100;
            if(that.piechart==null){
              $('#instructions').html('');
              $('.piechart').css('height', $('.piechart').width()+'px');

              that.piechart = new GeoDash.PieChart('.piechart', {
                label: 'source',
                value: 'percent',
                colors: ["#0B6909", "#d80000"],
                innerRadius: 10,
                hover:true
              });
            }
            var data = [{
              "source": "Needs Met",
              "percent": 100-neededPercent
            },
            {
              "source":"Needs Unmet",
              "percent": neededPercent
            }];
            that.piechart.update(data);
            $('#produced').html('Food Produced (HNE): '+ that.addNumberCommas(population-needed));
            $('#population').html('Population : '+ that.addNumberCommas(population));
            return;
          }
        }
      }
    });
  }

  that.setCities = function(state){
    $.ajax({
      url: "data/Cities.json",
      processData: true,
      data: {},
      dataType: "json",
      success: function(data) {
        var cityHTML="";
        var cityList = data[state];
        for(var key in data[state]["Formatted to Unformatted"]){
          cityHTML+='<li><a href="#">'+data[state]["Formatted to Unformatted"][key][0]+'</a></li>'
        }
        $('#dropdown-options-city').html(cityHTML);
        $('#dropdown-options-city li').on('click', function() {

          that.formattedCity = $(this).find('a').html();

          $('#dropdown-title-city').html(that.formattedCity);

          var unformattedCity;
          for(var key in data[state]["Formatted to Unformatted"]){
            if(data[state]["Formatted to Unformatted"][key][0]==that.formattedCity){
              unformattedCity=data[state]["Formatted to Unformatted"][key][1];
              break;
            }
          }

          that.mapPanel.selectCity(that.loadedFilename, unformattedCity, that.formattedCity);
          that.updateStatistics(state, that.formattedCity);
        });
        return;
      },
      error: function(x,y,z) {
        console.log("Error");
      }
    });
  }

  that.addNumberCommas = function(num){
    var count = 0;
    num = num.toString();
    for(var i=num.length-1; i>0; i--){
      count++;
      if(count == 3){
        num = num.substring(0, i) + ',' + num.substring(i);
        count = 0; 
      }
    }
    return num;
  }
}