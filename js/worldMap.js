var margin = {  top:50, left:50, right:50, bottom:50 };
var w = 350,
    h = 350;

var isMapOpen = false;
var LOCATIONS = [];
var clickedList = [];
var drawnLines = [];


$('#world_map').on('click', function(){

  isMapOpen = true;

  /* the map will be drawn inside this svg */
  var biggerSVG = d3.select('#svgCanvas');
  var svg = biggerSVG.append('svg')
            .attr('id', 'mapsvg')
            .attr('height', h)
            .attr('width', w)
            .call(d3.drag()
            .on("start", started))
            .append('g')
              .attr( 'transform', 'translate(' + 0 +  ',' + 20 + ')' );

  //std way to create maps in d3 (read the documentation for more info)
  var projection = d3.geoMercator()
                     .translate([w/2, h/2])
                     .scale(60);

  var path = d3.geoPath()
               .projection(projection);
  d3.json("https://unpkg.com/world-atlas@1/world/110m.json", function(error, world) {
    if (error) throw error;

    svg.selectAll(".countries")
       .data(topojson.feature(world,world.objects.countries).features)
       .enter().append("path")
       .attr('class', 'countries')
       .attr("d", path);
  });

  setTimeout(function(){
    //location_data has name of cities with its longitude and latitude
    d3.csv('preProcess/location_data.csv', function(error, data) {
    if (error) throw error;

    //list of locations will be used to modify the text
    var x;
    for (x in data)
    {
      LOCATIONS.push(data[x].name);
    }

    //display will be toggled when user hovers over the cities
    var hoverText = svg.append('g')
                     .style('display', 'none');

    hoverText.append('text')
           .attr('x', 10)
           .attr('y', h/2 - 50)
           .attr('font-weight', 'bold')
           .attr('stroke', 'white')
           .attr('stroke-width', 0.5);

    //use circles to show the cities
    //using d.lang, d.lang, the projection() -> returns (x,y)
    svg.selectAll('.cities')
       .data(data)
       .enter().append('circle')
       .attr('r', 5)
       .attr('cx', function(d){
         var coords = projection([d.long, d.lat])
         return coords[0];
       })
       .attr('cy', function(d){
         var coords = projection([d.long, d.lat])
         return coords[1];
       })
       .attr('class', 'cities')
       .attr('id', function(d){
         return d.name + '_city';
       })
       .attr("fill", 'rgba(8,48,107,0.35)')
       .on('mouseover', function(d){
         hoverText.style('display', null);
         hoverText.select('text').text(d.name + '   |   No. of Appearances: ' + d.count)
       })
       .on('mouseout', function(){
         hoverText.style('display', 'none');
       });

       /*******************************************************************
       * Following code figures out which files are open then shows       *
       * the cities within those files, makes those cities clickable      *
       * and adds the functonality to draw lines when clicked.            *
       * NOTE: this only works for already open files. Clicability will   *
       *       need to be added to that separately                        *
       *******************************************************************/

     //regular js code. select the divClass -> returns list of element
     var openTextCont = document.getElementsByClassName('textContainer');
     //read the csv file -> get the list of locations
     //loop thru the elememts -> get the innerHTML -> see if there is any locations
     for(var i = 0; i < openTextCont.length; i++)
     {
       var textContId = $(openTextCont[i]).attr('id');
       var nodes = openTextCont[i].childNodes;
       var text = nodes[1].textContent;
       //loops thru each text and puts each city inside a span
       for(var j = 0; j < LOCATIONS.length-1; j++)
       {
         var replace = LOCATIONS[j];
         var re = new RegExp(replace,"g");

         text = text.replace(re, '<span class=\'' + LOCATIONS[j] + '_' + textContId + '\'>' + LOCATIONS[j] + '</span>');
       }
       nodes[1].innerHTML = text;
     }


     //when the span is selected, change its color and draw line to the city
     $('span').on('click', function(){
       var className = $(this).attr('class');
       $('.' + className).css('color', 'white');

       drawnLines.push(className);
       drawLines(className);

       //when the container is closed, also closes the lines
       $('.textContainerClose').on('click', function(){
         var elementId = $(this).attr('id');
         var indexOf_ = elementId.indexOf('_');
         var filename = elementId.substring(indexOf_+1, elementId.length);
         var containerId = 'rect' + filename;

         for(var i = 0; i < drawnLines.length; i++)
         {
           var str = drawnLines[i];
           var indexOf_ = str.indexOf('_');
           var id = str.substring(indexOf_+1, str.length);

           if(id == containerId)
           {
             //remove the city feom drawnLines so when it is clicked again, it can be added
             drawnLines[i] = 'empty';

             var selector = ".path" + str.substring(0, indexOf_);
             d3.select("#svgCanvas").selectAll(selector).remove();
             $('.' + className).css('color', '');
           }
         }
       });
     });
    });
  }, 500); //rest of timeout code



  //handles drag
  function started() {
    var rect = d3.select(this).classed("dragging", true);
    d3.event.on("drag", dragged).on("end", ended);

    function dragged(d) {
      var x_pos = parseFloat(d3.event.x) - 175;
      var y_pos = parseFloat(d3.event.y) - 175;

      rect.attr('x', x_pos)
         .attr('y', y_pos);

      for(var i = 0; i < drawnLines.length; i++)
      {
        drawLines( drawnLines[i] );
      }
    }

    function ended() {
      rect.classed("dragging", false);
    }
  }

});

setTimeout(function(){
  $('.files').on('click', function(){

    //regular js code. select the divClass -> returns list of element
    var openTextCont = document.getElementsByClassName('textContainer');
    //read the csv file -> get the list of locations
    //loop thru the elememts -> get the innerHTML -> see if there is any locations
    for(var i = 0; i < openTextCont.length; i++)
    {
      var textContId = $(openTextCont[i]).attr('id');
      var nodes = openTextCont[i].childNodes;
      var text = nodes[1].textContent;
      //loops thru each text and puts each city inside a span
      for(var j = 0; j < LOCATIONS.length-1; j++)
      {
        var replace = LOCATIONS[j];
        var re = new RegExp(replace,"g");

        text = text.replace(re, '<span class=\'' + LOCATIONS[j] + '_' + textContId + '\'>' + LOCATIONS[j] + '</span>');
      }
      nodes[1].innerHTML = text;
    }


    //when the span is selected, change its color and draw line to the city
    $('span').on('click', function(){
      var className = $(this).attr('class');
      $('.' + className).css('color', 'white');

      drawnLines.push(className);
      drawLines(className);

        //when the container is closed, also closes the lines
        $('.textContainerClose').on('click', function(){
          var elementId = $(this).attr('id');
          var indexOf_ = elementId.indexOf('_');
          var filename = elementId.substring(indexOf_+1, elementId.length);
          var containerId = 'rect' + filename;

          for(var i = 0; i < drawnLines.length; i++)
          {
            var str = drawnLines[i];
            var indexOf_ = str.indexOf('_');
            var id = str.substring(indexOf_+1, str.length);

            if(id == containerId)
            {
              //remove the city feom drawnLines so when it is clicked again, it can be added
              drawnLines[i] = 'empty';

              var selector = ".path" + str.substring(0, indexOf_);
              d3.select("#svgCanvas").selectAll(selector).remove();
              $('.' + className).css('color', '');
            }
          }
        });
    });

  });
}, 2000); //rest of timeout code



function drawLines(className)
{
  //gives an array of elememts with this classname
  var spanElements = document.getElementsByClassName(className);

  //before getting (x,y) of each element, lets get (x,y) of circle in the map
  //  circleID = cityName_city      spanClassName = cityName_inText
  var indexOf_ = className.indexOf('_');
  var locationName = className.substring(0, indexOf_);
  var circleID = locationName + '_city';
  var circleElement = document.getElementById(circleID);

  //clickCounter is used to determine if the city has been clicked before
  var alreadyClicked = clickCounter(className);

  //if the city hasnt been clicked we create the line
  if(alreadyClicked == 0)
  {
    //get coordinates of the circleElement
    var position1 = circleElement.getBoundingClientRect();
    var extraHeight = parseFloat( $(".openMenuDiv").height() ) + parseFloat( $(".openMenuDiv").css('padding-top') );

    //loop thru each city that has this name, then draw a line from circle to that city in text
    for (var i = 0; i < spanElements.length; i++)
    {
        var position2 = spanElements[i].getBoundingClientRect();

        var x1 = (position1.left + position1.right) / 2,
            y1 = position1.top - extraHeight,
            x2 = position2.left,
            y2 = position2.top - extraHeight,
            piv_x = x2 - (x2/3);
            piv_y1 = y2 + (y2/4);
            piv_y2 = piv_y1 + 10;
        var curveString = "M " + x1.toFixed(3) + ", " + y1.toFixed(3) + "  C " + piv_x.toFixed(3) + ", " + piv_y1.toFixed(3) + "  " + piv_x.toFixed(3) + ", " + piv_y2.toFixed(3) + " " +  x2.toFixed(3) + ", " + y2.toFixed(3);

        mainsvg = d3.select('#svgCanvas');
        mainsvg.append("g")
                  .attr("class", "path" + locationName)
           .append("path").attr("d", curveString)
           .attr("fill", "none")
           .attr("stroke", "rgba(255, 0, 0, 0.45)")
           .attr("stroke-width", 5);
    }
  }
  //when the city is being clicked for another time, we remove the line
  else {
    //remove the city feom clickedList so when it is clicked again, it can be added
    for (x in drawnLines)
    {
      if(drawnLines[x] == className)
      {
        clickedList[x] = 'empty';
      }
    }
    var selector = ".path" + locationName;
    d3.select("#svgCanvas").selectAll(selector).remove();
    $('.' + className).css('color', '');
  }
}

//keeps track of what has been clicked
function clickCounter(name)
{
  var x;
  var changeFlag = 0;
  for (x in clickedList)
  {
    if(name == clickedList[x])
    {
      clickedList[x] = '';
      changeFlag = 1;
    }
  }
  if(changeFlag == 0)
  {
    clickedList.push(name);
  }

  return changeFlag;
}

//to move the lines with the div
function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "header")) {
    // if present, the header is where you move the DIV from:
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";

    for(var i = 0; i < drawnLines.length; i++)
    {
      var str = drawnLines[i];
      var indexOf_ = str.indexOf('_');
      var id = str.substring(indexOf_+1, str.length);

      if(id == elmnt.id)
      {
        drawLines( drawnLines[i] );
      }
    }
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}
