(function (d3) {
    'use strict';


  const svgWidth = 1000; 
  const svgHeight = 700;

  const svg = d3.select('#svg1')
    .attr('width', svgWidth)
    .attr('height', svgHeight);

  const width = svgWidth;
  const height = svgHeight;
  
    const render = data => {
      const title = 'Asteroids: Size vs. Distance from Earth';
  
      const xValue = d => d.size; // Size of the asteroid
      const xAxisLabel = 'Asteroid Size (meters)';
  
      const yValue = d => d.distance; // Distance from Earth
      const imageSize = 30;
      const yAxisLabel = 'Distance from Earth (kilometers)';
  
      const margin = { top: 100, right: 20, bottom: 80, left: 400 };
      const innerWidth = width - margin.left - margin.right;
      const innerHeight = height - margin.top - margin.bottom;
  
      const xScale = d3.scaleLinear()
        .domain([0, 850])
        .range([0, innerWidth])
        .nice();
  
      const yScale = d3.scaleLinear()
        .domain([0, 100000000])
        .range([innerHeight, 0])
        .nice();
  
      const g = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);
  
      const xAxis = d3.axisBottom(xScale)
        .tickSize(-innerHeight)
        .tickPadding(10);
  
      const yAxis = d3.axisLeft(yScale)
        .tickSize(-innerWidth)
        .tickPadding(10);
  
      const yAxisG = g.append('g').call(yAxis);
      yAxisG.selectAll('.domain').remove();
  
      yAxisG.append('text')
        .attr('id', 'axis-label')
        .attr('y', -120)
        .attr('x', -innerHeight / 2)
        .attr('fill', 'white')
        .attr('transform', `rotate(-90)`)
        .attr('text-anchor', 'middle')
        .text(yAxisLabel);
  
      const xAxisG = g.append('g').call(xAxis)
        .attr('transform', `translate(0,${innerHeight})`);
  
      xAxisG.select('.domain').remove();
  
      xAxisG.append('text')
        .attr('id', 'axis-label')
        .attr('y', 65)
        .attr('x', innerWidth / 2)
        .attr('fill', 'white')
        .text(xAxisLabel);
  
      g.selectAll('image').data(data)
        .enter().append('image')
        .attr('y', d => yScale(yValue(d)) - imageSize / 2)
        .attr('x', d => xScale(xValue(d)) - imageSize / 2)
        .attr('width', imageSize)
        .attr('height', imageSize)
        .style("opacity", 0.8)
        .attr('xlink:href' ,'../Images/pngwing.com (1).png');

      g.append('text')
        .attr('class', 'title')
        .attr('y', -28)
        .attr('x', innerWidth/12)
        .text(title);

        
    };

    
  


  
const fetchData = (startDate, endDate, apiKey) => {
    const baseUrl = 'https://api.nasa.gov/neo/rest/v1/feed';
    const apiUrl = `${baseUrl}?start_date=${startDate}&end_date=${endDate}&api_key=${apiKey}`;

    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        const asteroids = [];

        for (const date in data.near_earth_objects) {
          if (data.near_earth_objects.hasOwnProperty(date)) {
            asteroids.push(
              ...data.near_earth_objects[date].map(asteroid => ({
                size: asteroid.estimated_diameter.meters.estimated_diameter_max,
                distance: asteroid.close_approach_data[0].miss_distance.kilometers,
              }))
            );
          }
        }

        render(asteroids);
      })
      .catch(error => {
        console.error('Error fetching data from the NASA API:', error);
      });
  };

  // Date Range
  const startDate = '2023-09-05';
  const endDate = '2023-09-11';
  const apiKey = 'bJPqEWO96h6ZUyZIgrkCv5NQ2fevLHQzOcCpguV4';

  // Fetch data
  fetchData(startDate, endDate, apiKey);

}(d3));






(function (d3) {
    'use strict';

    const containerWidth = document.getElementById('svg2').clientWidth;
    const containerHeight = document.getElementById('svg2').clientHeight;
    
    const svgWidth = containerWidth;
    const svgHeight = containerHeight;
  
    // const svgWidth = 1000;
    // const svgHeight = 600;
    const margin = { top: 50, right: 30, bottom: 70, left: 400 };
  
    const svg = d3.select('#svg2')
      .attr('width', svgWidth)
      .attr('height', svgHeight);
  
    const width = svgWidth - margin.left - margin.right;
    const height = svgHeight - margin.top - margin.bottom;
  
    const render = data => {
      // x-scale for asteroid sizes
      const xScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.x1)])
        .range([0, width]);
  
      //histogram generator
      const histogram = d3.histogram()
        .value(d => d.x1) // Accessor function for size data
        .domain(xScale.domain()) // Same domain as xScale
        .thresholds(xScale.ticks(20)); // Number of bins
  
      //histogram data
      const bins = histogram(data);
  
      // y-scale for frequency/count
      const yScale = d3.scaleLinear()
        .domain([0, d3.max(bins, d => d.length)])
        .range([height, 0]);
  
      // SVG group for the histogram
      const g = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);
  
      // style histogram bars
      g.selectAll('rect')
        .data(bins)
        .enter().append('rect')
        .attr('x', d => xScale(d.x0))
        .attr('y', d => yScale(d.length))
        .attr('width', d => xScale(d.x1) - xScale(d.x0) - 1) //
        .attr('height', d => height - yScale(d.length))
        .attr('fill', 'steelblue');
  
      // x-axis
      const xAxis = d3.axisBottom(xScale);
      g.append('g')
        .attr('class', 'x-axis')
        .attr('transform', `translate(0,${height})`)
        .call(xAxis);
  
      // y-axis
      const yAxis = d3.axisLeft(yScale);
      g.append('g')
        .attr('class', 'y-axis')
        .call(yAxis);
  
      // axis labels and title
      g.append('text')
        .attr('class', 'axis-label')
        .attr('x', width / 2)
        .attr('y', height + margin.bottom - 15)
        .attr('text-anchor', 'middle')
        .style('font-size', '20px') 
        .text('Asteroid Size (meters)');
  
      g.append('text')
        .attr('class', 'axis-label')
        .attr('transform', 'rotate(-90)')
        .attr('x', -height / 2)
        .attr('y', -margin.left + 350)
        .attr('text-anchor', 'middle')
        .style('font-size', '20px') 
        .text('Frequency/Count');
  
      g.append('text')
        .attr('class', 'title')
        .attr('x', width / 2)
        .attr('y', -margin.top + 25)
        .attr('text-anchor', 'middle')
        .style('font-size', '35px') 
        .text('Asteroid Size Distribution Histogram');
    };
  
    // 
    const fetchData = (startDate, endDate, apiKey) => {
        const baseUrl = 'https://api.nasa.gov/neo/rest/v1/feed';
        const apiUrl = `${baseUrl}?start_date=${startDate}&end_date=${endDate}&api_key=${apiKey}`;
    
        fetch(apiUrl)
          .then(response => response.json())
          .then(data => {
            const asteroids = [];
    
            for (const date in data.near_earth_objects) {
              if (data.near_earth_objects.hasOwnProperty(date)) {
                asteroids.push(
                  ...data.near_earth_objects[date].map(asteroid => ({
                    size: asteroid.estimated_diameter.meters.estimated_diameter_max,
                    distance: asteroid.close_approach_data[0].miss_distance.kilometers,
                    x1: asteroid.estimated_diameter.meters.estimated_diameter_max,

                  }))
                );
              }
            }
    
            render(asteroids);
          })
          .catch(error => {
            console.error('Error fetching data from the NASA API:', error);
          });
      };
    
      // Date Range
      const startDate = '2023-09-05';
      const endDate = '2023-09-11';
      const apiKey = 'bJPqEWO96h6ZUyZIgrkCv5NQ2fevLHQzOcCpguV4';
    
      // Fetch data
      fetchData(startDate, endDate, apiKey);

    }(d3));


   






    // set the dimensions and margins of the graph
var margin = { top: 30, right: 20, bottom: 80, left: 400 },
width = 1000 - margin.left - margin.right,
height = 700 - margin.top - margin.bottom;



// append the svg object to the body of the page
var svg = d3.select("#svg3")
.append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform",
    "translate(" + margin.left + "," + margin.top + ")");



const fetchData = (startDate, endDate, apiKey) => {
  const baseUrl = 'https://api.nasa.gov/neo/rest/v1/feed';
  const apiUrl = `${baseUrl}?start_date=${startDate}&end_date=${endDate}&api_key=${apiKey}`;

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      const asteroids = [];

      for (const date in data.near_earth_objects) {
        if (data.near_earth_objects.hasOwnProperty(date)) {
          asteroids.push(
            ...data.near_earth_objects[date].map(asteroid => ({
              name: asteroid.name,
              size: asteroid.estimated_diameter.meters.estimated_diameter_max,
              distance: asteroid.close_approach_data[0].miss_distance.kilometers,
              speed: asteroid.close_approach_data[0].relative_velocity.kilometers_per_hour,
              date: asteroid.close_approach_data[0].close_approach_date,
              orbit: asteroid.close_approach_data[0].orbiting_body,
            }))
          );
        }
      }

   
    // Add X axis
    var x = d3.scaleLinear()
        .domain([0, 150000])
        .range([0, width]);
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // Add Y axis
    var y = d3.scaleLinear()
        .domain([0, 80000000])
        .range([height, 0]);
    svg.append("g")
        .call(d3.axisLeft(y));

        // ... (your existing code)

// Append X axis label
svg.append("text")
.attr("class", "axis-label")
.attr("text-anchor", "middle")
.attr("x", width / 2)
.attr("y", height + margin.top + 40) // Adjust the position based on your design
.text("Asteroid Speed (km/h)");

// Append Y axis label
svg.append("text")
.attr("class", "axis-label")
.attr("text-anchor", "middle")
.attr("transform", "rotate(-90)")
.attr("x", -height / 2)
.attr("y", -margin.left + 270) // Adjust the position based on your design
.text("Asteroid Distance from Earth (km)");

// Append title
svg.append("text")
.attr("class", "title")
.attr("text-anchor", "middle")
.attr("x", width / 2)
.attr("y", -margin.top + 30) // Adjust the position based on your design
.text("Asteroids: Size vs speed vs Distance");



    // Add a scale for bubble size
    var z = d3.scaleLinear()
    .domain([0, d3.max(asteroids, d => d.size)])
    .range([4, 50]);


// -1- Create a tooltip div that is hidden by default:
var tooltip = d3.select("#bubblechart")
.append("div")
  .style("opacity", 0)
  .attr("class", "tooltip")
  .style("background-color", "white")
  .style("border-radius", "5px")
  .style("padding", "10px")
  .style("color", "black")

// -2- Create 3 functions to show / update (when mouse move but stay on same circle) / hide the tooltip
var showTooltip = function(event, d) {
tooltip
  // .transition()
  // .duration(200)
  .style("opacity", 1)
  d3.select(this)
  .style("stroke", "red")
  .style("opacity", 1)
  .style("cursor", "pointer")

  // .html("Asteroid Name: " + d.name)
  // .style("left",(event.pageX + 10)  + "px")
  // .style("top", (event.pageY + 10) + "px")
}
var moveTooltip = function(event, d) {
  tooltip
  .html("<div><strong>Asteroid Name:</strong> " + d.name + "</div></div>" +
              "<div><strong>Close Approach Date:</strong> " + d.date + "</div>" + "<div><strong>Orbiting Body:</strong> " + d.orbit)

  // .style("left",(event.pageX + 10)  + "px")
  // .style("top", (event.pageY + 10) + "px")
  var tooltipWidth = tooltip.node().offsetWidth;
  var tooltipHeight = tooltip.node().offsetHeight;
  var xPos = event.pageX + 10; // Offset the tooltip to the right of the cursor
  var yPos = event.pageY + 10; // Offset the tooltip below the cursor
  
  // Check if the tooltip goes beyond the right edge of the window
  if (xPos + tooltipWidth > window.innerWidth) {
      xPos = window.innerWidth - tooltipWidth - 10;
  }
  


  tooltip.style("left", xPos + "px")
         .style("top", yPos + "px");
}
var hideTooltip = function(event, d) {
tooltip
  // .transition()
  // .duration(200)
  .style("opacity", 0)
  d3.select(this)
      .style("stroke", "white")
      .style("opacity", 0.8)

}

    // Add bubbles
    svg.selectAll("dot")
        .data(asteroids)
        .enter()
        .append("circle")
        .attr("class", "bubbles")
        .attr("cx", function (d) { return x(d.speed); })
        .attr("cy", function (d) { return y(d.distance); })
        .attr("r", function (d) { return z(d.size); })
        .style("fill", "#7b7b7b")
        .style("stroke", "white")
        // -3- Trigger the functions
    .on("mouseover", showTooltip )
    .on("mousemove", moveTooltip )
    .on("mouseleave", hideTooltip )
        


})



        .catch(error => {
            console.error('Error fetching data from the NASA API:', error);
        });
      

    };
  
    
// Date Range
const startDate = '2023-09-05';
const endDate = '2023-09-11';
const apiKey = 'bJPqEWO96h6ZUyZIgrkCv5NQ2fevLHQzOcCpguV4';

// Call fetchData function with specified parameters
fetchData(startDate, endDate, apiKey);
    



