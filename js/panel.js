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

        that.loadedFilename = $(this).find('a').attr("id")+"data";

        var cityHTML = that.setCities(that.loadedFilename);
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

  that.setCities = function(filename){
    $.ajax({
      url: "data/"+filename+".json",
      processData: true,
      data: {},
      dataType: "json",
      success: function(data) {
        var cityHTML=""
        for(var i=0;i<data.length;i++){
          var obj = data[i];
          for(var key in obj){
            if(key=="ID"){
              $('#dropdown-options-city').html(cityHTML);
              $('#dropdown-options-city li').on('click', function() {
                that.city = $(this).find('a').html();

                $('#dropdown-title-city').html(that.city);

                that.mapPanel.selectCity(that.loadedFilename, that.city);
              });
              return;
            }
            cityHTML+='<li><a href="#">'+key+'</a></li>'
          }
        }
      },
      error: function(x,y,z) {
        console.log("Error");
      }
    });
  }
}