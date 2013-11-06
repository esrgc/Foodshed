function SidePanel(mapPanel){
  var that=this;

  var loadedFilename = null;

  that.city = null;

  that.mapPanel = mapPanel;

  that.init = function(){
    $('.dropdown-toggle').dropdown();
    $('#slider').slider()
      .on('slide', function(ev){

      }
    );

    $('#dropdown-options-state').html('<li><a id="NY" href="#">New York</a></li><li><a id="MI" href="#">Michigan</a></li>');


    $('#dropdown-options-data-classification li').on('click', function() {
        $('#dropdown-title-data-classification').html($(this).find('a').html());
    });

    $('#dropdown-options-state li').on('click', function() {
        $('#dropdown-title-state').html($(this).find('a').html());
        $('#dropdown-title-city').html("Select a City");

        that.loadedFilename = $(this).find('a').attr("id")+"Data";

        that.setCities($(this).find('a').attr("id"));
    });

    $('#button-green').on('click', function() {
        that.mapPanel.changeColor("0x55ff55");
        that.mapPanel.selectCity(that.loadedFilename, that.city);
    });

    $('#button-red').on('click', function() {
        that.mapPanel.changeColor("0xff5555");
        that.mapPanel.selectCity(that.loadedFilename, that.city);
    });

    $('#button-blue').on('click', function() {
        that.mapPanel.changeColor("0x5555ff");
        that.mapPanel.selectCity(that.loadedFilename, that.city);
    });

    $('#button-orange').on('click', function() {
        that.mapPanel.changeColor("0xff9955");
        that.mapPanel.selectCity(that.loadedFilename, that.city);
    });

    var piechart = new GeoDash.PieChart('.piechart', {
      label: 'source',
      value: 'percent',
      colors: ["#0B6909", "#d80000"],
      innerRadius: 10,
      hover:true
    });

    var data = [{
        "source":"Met",
        "percent":68
      },{
        "source":"Unmet",
        "percent":32
      }];

    piechart.update(data);
  };

  that.setCities = function(state){
    $.ajax({
      url: "data/Cities.json",
      processData: true,
      data: {},
      dataType: "json",
      success: function(data) {
        var cityHTML="";
        var cityList = data[state];
        for(var key in data[state]){
          cityHTML+='<li><a href="#">'+data[state][key]+'</a></li>'
        }
        $('#dropdown-options-city').html(cityHTML);
        $('#dropdown-options-city li').on('click', function() {
          that.city = $(this).find('a').html();

          $('#dropdown-title-city').html(that.city);

          that.mapPanel.selectCity(that.loadedFilename, that.city);
        });
        return;
      },
      error: function(x,y,z) {
        console.log("Error");
      }
    });
  }
}