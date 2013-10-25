function SidePanel(mapPanel){
  var that=this;

  var loadedFilename = null;

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

        that.loadedFilename = $(this).find('a').attr("id")+"data";

        var cityHTML = that.setCities(that.loadedFilename);
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
                $('#dropdown-title-city').html($(this).find('a').html());

                that.mapPanel.selectCity(that.loadedFilename, $(this).find('a').html());
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