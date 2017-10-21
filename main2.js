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

  var h3 = d3.select('body').append('h3').text('Hey!');

  var nested = d3.nest()
    .key(function(d) { return d.name; })
    .key(function(d) { return d.origin; })
    .entries(car_data);

  console.log("nested", nested)

  var map = d3.map(nested, function(d) { return d.key; });

  console.log("map", map)

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
  yScale.range([0, height]).round(true);

  // yScale.range([0, height]).domain(cylinders);
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
      .text("Origin");

  updateChart(map.get("chevrolet chevelle malibu"), g, yAxis, yScale, xScale, radius, color, h3)
  cycle(nested, map, g, yAxis, yScale, xScale, radius, color, h3)
}

function updateChart(car, g, yAxis, yScale, xScale, radius, color, h3) {
  var t = g.transition().duration(750);

  yScale.domain(
    car.values.map(function (d) {
      return d.key;
    })
    .sort()
  );

  // reset the x axis yscale
  yAxis.scale(yScale);

  // redraw the y axis
  t.select("g.y.axis").call(yAxis);

  // binding the outer most values array to the main svg group element
  g.datum(car.values);

  //this logic first selects all existing svg groups, binds datas and sets the key for the data join
  var gens = g.selectAll('g.car')
    .data(
      function(d) { return d; },
      function(d) { return d.key; } // "key" here represents barely genetic variety
    );

  //General update pattern
  // First remove
  gens.exit().remove();

  // 2. update existing groups left over from the previous data
  gens
    .transition(t)
    .attr('transform', function(d) {
      return 'translate(0, ' + yScale(d.key) + ')';
    });

  // 3. create new groups if our new data has more elements then our old data
  gens.enter().append('g')
    .attr('class', 'car')
    .transition(t)
    .attr('transform', function(d) {
      return 'translate(0, ' + yScale(d.key) + ')';
    });

  // 4. reselect our svg .site groups to make sure our "gens" variable contains new elements
  gens = g.selectAll('g.car');

  // select cirles within each group
  var circles = gens.selectAll('circle')
    .data(
      function(d) { return d.values; }, // represents our actual data
      function(d) { return d.year; } // data join key, this time using the "year" attribute of the data
    );

  // enter general update pattern again
  // 1. exit & remove circles that no longer need to exist in each svg .site group
  circles.exit()
    .transition(t)
    .attr('r', 0)
    .style('fill', 'rgba(255, 255, 255, 0)')
    .remove();

  // 2. update any existing circles in each svg .site group
  circles
    .attr('cy', 0)
    .attr('cx', function(d) { return xScale(d.year); })
    .transition(t)
    .attr('r', function(d) { return radius(d.mpg); })
    .attr('fill', function(d) { return color(d.origin); });

  // 3. create new circles in each svg .site group
  circles
    .enter().append('circle')
    .attr('cy', 0)
    .attr('cx', function(d) { return xScale(d.year); })
    .transition(t)
    .attr('r', function(d) { return radius(d.mpg); })
    .attr('fill', function(d) { return color(d.origin); });

  // update the title to show what site we are looking at
  h3.text(car.key);

}

function cycle(nested, map, g, yAxis, yScale, xScale, radius, color, h3) {
  nested.forEach(function(car, i) {
    console.log("car", car)
    d3.timeout(function(elapsed) {
      updateChart(map.get(car.key), g, yAxis, yScale, xScale, radius, color, h3);

      // check it out: our chart is updating about 1x every 3000 milliseconds
      // console.log(elapsed);

      if (elapsed > 3000 * nested.length) {
        // recursively call cycle once we've reached the last chart update
        cycle();
      }
    }, 3000 * (i + 1));
  });
}
