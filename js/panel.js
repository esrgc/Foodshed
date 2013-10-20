$('.dropdown-toggle').dropdown();
$('#slider').slider()
  .on('slide', function(ev){

  });


$('#dropdown-options-data-classification li').on('click', function() {
    $('#dropdown-title-data-classification').html($(this).find('a').html());
});

$('#dropdown-options-state li').on('click', function() {
    $('#dropdown-title-state').html($(this).find('a').html());
});

$('#dropdown-options-city li').on('click', function() {
    $('#dropdown-title-city').html($(this).find('a').html());
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