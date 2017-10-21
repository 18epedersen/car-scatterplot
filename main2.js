// set up chart area
var margin = { top: 20, right: 30, bottom: 30, left: 120 };
var width = 800 - margin.left - margin.right;
var height = 600 - margin.top - margin.bottom;

var car_data = null

d3.csv("data/data.csv", function(data) {
  car_data = data
  // draw the initial axises
  drawAxis(car_data)
});

function drawAxis(car_data) {
  var maxMPG = d3.max(car_data, function(d) { return d.mpg; });

  // years of the car will be the first x-axis
  var years = car_data.reduce(function(acc, cur) {
    if (acc.indexOf(cur.year) === -1) {
      acc.push(cur.year);
    }

    return acc;
  }, []);
  console.log(years)

  //horsepower will be the first y-axis
  var cylinders = car_data.reduce(function(acc, cur) {
    if (acc.indexOf(cur.cylinders) === -1) {
      acc.push(cur.cylinders);
    }

    return acc;
  }, []);
  console.log(cylinders)

  // origins of the cars will encode color first
  var originTypes = car_data.reduce(function(acc, cur) {
    if (acc.indexOf(cur.origin) === -1) {
      acc.push(cur.origin);
    }

    return acc;
  }, []);
  console.log(originTypes)

  //setting up the scales
  var xScale = d3.scalePoint().padding(0.3);
  var yScale = d3.scalePoint().padding(0.1);
  var radius = d3.scaleSqrt();
  var color = d3.scaleOrdinal();

  //setting up the ranges
  xScale.range([0, width]).domain(years);
  yScale.range([0, height]).domain(cylinders);
  color.range(d3.schemeCategory20).domain(originTypes);
  radius.range([0, 15]).domain([0, maxMPG]);

  //setting up the axises
  var yAxis = d3.axisLeft().scale(yScale);
  var xAxis = d3.axisBottom()
    .tickFormat(function(d) { return d; })
    .scale(xScale);

  //adding svg
  var svg = d3.select('body').append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom);

  //adding g
  var g = svg.append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top +  ')');

  //adding y axix
  g.append('g')
    .attr('class', 'y axis')
    .call(yAxis);

  //adding x axis
  g.append('g')
    .attr('class', 'x axis')
      .attr('transform', 'translate(0, ' + height + ')')
      .call(xAxis);

  // adding x label
  svg.append("text")
     .attr("transform",
          "translate(" + (width/1.5) + " ," +
                         (height + margin.top + 30) + ")")
     .style("text-anchor", "middle")
     .text("Car Year");

  //adding y label
  svg.append("text")
      .attr("class", "y label")
      .attr("text-anchor", "end")
      .attr("y", 6)
      .attr("dy", "5em")
      .attr("transform", "rotate(-90)")
      .text("cylinders");

  updateChart()
}

function updateChart() {

}
