//setting up margin, width, and height
var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// setting up x values
// x will initially be weight
var xValue = function(d) { return d.weight;},
    xScale = d3.scale.linear().range([0, width]),
    xMap = function(d) { return xScale(xValue(d));},
    xAxis = d3.svg.axis().scale(xScale).orient("bottom");

// setting up y values
// y will initially be horsepower
var yValue = function(d) { return d.horsepower;},
    yScale = d3.scale.linear().range([height, 0]),
    yMap = function(d) { return yScale(yValue(d));},
    yAxis = d3.svg.axis().scale(yScale).orient("left");

// setting up fill color to be origin of the cars
var cValue = function(d) { return d.origin;},
    color = d3.scale.category10();

// adding the canvas to the body
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// adding the tooltip area to the webpage
var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// loading the car data
d3.csv("data/data.csv", function(error, data) {
  data.forEach(function(d) {
    d.weight = +d.weight;
    d.horsepower = +d.horsepower;
    d.acceleration = +d.acceleration;
    d.mpg = +d.mpg
  });

  // The domain of x and y, and also adding a bit of buffer
  xScale.domain([d3.min(data, xValue)-1, d3.max(data, xValue)+1]);
  yScale.domain([d3.min(data, yValue)-1, d3.max(data, yValue)+1]);

  // x-axis
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .append("text")
      .attr("class", "x-label")
      .attr("x", width)
      .attr("y", -6)
      .style("text-anchor", "end")
      .text("Weight");

  // y-axis
  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("class", "y-label")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Horsepower");


  // drawing the scatterplot
  svg.selectAll(".dot")
      .data(data)
      .enter().append("circle")
      .attr("class", "dot")
      .attr("r", 3)
      .attr("cx", xMap)
      .attr("cy", yMap)
      .style("fill", function(d) { return color(cValue(d));})
      .on("mouseover", function(d) {
          tooltip.transition()
               .duration(200)
               .style("opacity", .9);
          tooltip.html(d.origin + "<br/> (" + xValue(d)
	        + ", " + yValue(d) + ")")
               .style("left", (d3.event.pageX + 5) + "px")
               .style("top", (d3.event.pageY - 28) + "px");
      })
      .on("mouseout", function(d) {
          tooltip.transition()
               .duration(500)
               .style("opacity", 0);
      });

  // the legend for origin
  var legend = svg.selectAll(".legend")
      .data(color.domain())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  // drawing legend colored rectangles
  legend.append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);

  // drawing legend text
  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d;})

  // the second y value is accelerations
  // also updating the yscale
  yValue = function(d) { return d.acceleration;}
  yScale.domain([d3.min(data, yValue)-1, d3.max(data, yValue)+1]);

  // selecting all the dots on the webpage and having them transition to new values
  svg.selectAll(".dot")
      .data(data)
      .on("mouseover", function(d) {
          tooltip.transition()
               .duration(200)
               .style("opacity", .9);
          tooltip.html(d.origin + "<br/> (" + xValue(d)
	        + ", " + yValue(d) + ")")
               .style("left", (d3.event.pageX + 5) + "px")
               .style("top", (d3.event.pageY - 28) + "px");
      })
      .on("mouseout", function(d) {
          tooltip.transition()
               .duration(500)
               .style("opacity", 0);
      })
      .transition()
      .delay(3000)
      .duration(5000)
      .attr("class", "dot")
      .attr("r", 3)
      .attr("cx", xMap)
      .attr("cy", yMap)
      .style("fill", function(d) { return color(cValue(d));});

  // updating the y axis
  svg.select(".y.axis")
      .transition()
      .delay(3000)
      .duration(5000)
      .call(yAxis)

  // updating the y label
  svg.select(".y-label")
      .transition()
      .delay(3000)
      .duration(5000)
      .text("Acceleration");

  // second value for x is the mpg
  xValue = function(d) { return d.mpg;}
  xScale.domain([d3.min(data, xValue)-1, d3.max(data, xValue)+1]);

  // selecting all the dots and updating them to new x values
  svg.selectAll(".dot")
      .data(data)
      .on("mouseover", function(d) {
          tooltip.transition()
               .duration(200)
               .style("opacity", .9);
          tooltip.html(d.origin + "<br/> (" + xValue(d)
	        + ", " + yValue(d) + ")")
               .style("left", (d3.event.pageX + 5) + "px")
               .style("top", (d3.event.pageY - 28) + "px");
      })
      .on("mouseout", function(d) {
          tooltip.transition()
               .duration(500)
               .style("opacity", 0);
      })
      .transition()
      .delay(6000)
      .duration(5000)
      .attr("class", "dot")
      .attr("r", 3)
      .attr("cx", xMap)
      .attr("cy", yMap)
      .style("fill", function(d) { return color(cValue(d));});

  // updating the x axis
  svg.select(".x.axis")
      .transition()
      .delay(6000)
      .duration(5000)
      .call(xAxis)

  // updating the x label
  svg.select(".x-label")
      .transition()
      .delay(6000)
      .duration(5000)
      .text("Mpg");
});
