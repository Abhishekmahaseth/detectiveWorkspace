var NAMES = [];

//credits: d3noob’s Block bdf28027e0ce70bd132edc64f1dd7ea4
$('#names_chart').on('click', function(){

  // set the dimensions and margins of the graph
  var margin = {top: 20, right: 20, bottom: 30, left: 40},
      width = 700 - margin.left - margin.right,
      height = 350 - margin.top - margin.bottom;

  // set the ranges
  var x = d3.scaleBand()
            .range([0, width])
            .padding(0.1);
  var y = d3.scaleLinear()
            .range([height, 0]);

  // append the svg object to the body of the page
  // append a 'group' element to 'svg'
  // moves the 'group' element to the top left margin
  var biggerSVG = d3.select('#svgCanvas');
  var svg = biggerSVG.append('svg')
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .call(d3.drag()
      .on("start", started))
    .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

  // get the data
  d3.csv("preProcess/peopleNames_data.csv", function(error, data) {
    if (error) throw error;

    // format the data
    data.forEach(function(d) {
      d.count = +d.count;
      NAMES.push(d.name);
    });

    // Scale the range of the data in the domains
    x.domain(data.map(function(d) { return d.name; }));
    y.domain([0, d3.max(data, function(d) { return d.count; })]);

    // append the rectangles for the bar chart
    svg.selectAll(".bar")
        .data(data)
      .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.name); })
        .attr("width", x.bandwidth())
        .attr("y", function(d) { return y(d.count); })
        .attr("height", function(d) { return height - y(d.count); })
        .attr("fill", 'rgba(8,48,107,0.85)');

    // add the x Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // add the y Axis
    svg.append("g")
        .call(d3.axisLeft(y));

  });

});





//makes the bar chart draggable
function started() {
  var rect = d3.select(this).classed("dragging", true);
  d3.event.on("drag", dragged).on("end", ended);

  function dragged(d) {
    var x_pos = parseFloat(d3.event.x) - 175;
    var y_pos = parseFloat(d3.event.y) - 175;

    rect.attr('x', x_pos)
       .attr('y', y_pos);

    // for(var i = 0; i < drawnLines.length; i++)
    // {
    //   drawLines( drawnLines[i] );
    // }
  }

  function ended() {
    rect.classed("dragging", false);
  }
}
