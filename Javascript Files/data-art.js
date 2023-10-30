//Data-Art Section

    // set the dimensions and margins of the graph
    var margin = { top: 100, right: 100, bottom: 100, left: 350 },
    width = 1100 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;
    
    
    
    // append the svg object to the body of the page
    var svg = d3.select("#svg-container")
    .append("svg")
    .attr("width", "100%")
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");
    


        // Show Loading message
        document.getElementById('loading-message').style.display = 'block';

    // Fetch Data
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
                  magnitude: asteroid.absolute_magnitude_h,
                }))
              );
            }
          }
    
       
    
    
    
    
    
    
    
        // Add a scale for bubble size
        var radiusScale = d3.scaleSqrt()
        .domain([0, d3.max(asteroids, d => d.size)])
        .range([10, 66]);
    
        //Scale for colour
        var colorScale = d3.scaleSequential(d3.interpolateTurbo) // You can choose any other color scale
        .domain([d3.min(asteroids, d => d.magnitude), d3.max(asteroids, d => d.magnitude)]);
    
    
        // Add simulations
        var simulation = d3.forceSimulation()
        .force("x", d3.forceX(width / 2).strength(0.05))
        .force("y", d3.forceY(height / 2).strength(0.05))
        .force("collide", d3.forceCollide(function(d) {
            return radiusScale(d.size) + 3;
        }))
    
    
    // -1- Create a tooltip div that is hidden by default:
    var tooltip = d3.select("#bubbles-container")
    .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip2")
      .style("background-color", "white")
      .style("border-radius", "20px")
      .style("padding", "10px")
      .style("color", "black")
    
    // -2- Create 3 functions to show / update (when mouse move but stay on same circle) / hide the tooltip
    var showTooltip = function(event, d) {
    tooltip
      // .transition()
      // .duration(200)
      .style("opacity", 2)
      d3.select(this)
      .style("stroke", "red")
      .style("opacity", 5)
      .style("cursor", "pointer")
    
      // .html("Asteroid Name: " + d.name)
      // .style("left",(event.pageX + 10)  + "px")
      // .style("top", (event.pageY + 10) + "px")
    }
    var moveTooltip = function(event, d) {
      tooltip
      .html("<div><strong>Asteroid Name:</strong> " + d.name + "</div></div>" +
                  "<div><strong>Absolute Magnitude:</strong> " + d.magnitude + "</div>" + "<div><strong>Speed(km/h):</strong> " + d.speed)
    
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
      
      // // Check if the tooltip goes beyond the bottom edge of the window
      // if (yPos + tooltipHeight > window.innerHeight) {
      //     yPos = window.innerHeight - tooltipHeight - 10;
      // }
    
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
          .style("opacity", 0.9)
    
    }
    
        // Add bubbles
       var circles = svg.selectAll("dot")
            .data(asteroids)
            .enter()
            .append("circle")
            .attr("class", "bubbles")
            // .attr("cx", function (d) { return x(d.speed); })
            // .attr("cy", function (d) { return y(d.distance); })
            .attr("r", function (d) { return radiusScale(d.size) })
            .style("fill", function(d) { return colorScale(d.magnitude); })
            .style("stroke", "black")
            // -3- Trigger the functions
        .on("mouseover", showTooltip )
        .on("mousemove", moveTooltip )
        .on("mouseleave", hideTooltip )
            
    
         simulation.nodes(asteroids)
        .on('tick', ticked)
    
        function ticked() {
            circles
            .attr("cx", function(d) {
                return d.x
            })
            .attr("cy", function(d) {
                return d.y
            })
        }
    
// Animation for bubbles
svg.selectAll("circle.bubbles")
    .transition()
    .duration(3000) // Animation duration in milliseconds
    .delay(function(d, i) { return i * 10; }) // Delay between each bubble animation
    .attr("r", function(d) { return radiusScale(d.size); });

// Particle effect
var particleContainer = document.getElementById('particle-container');

function createParticle() {
    var particle = document.createElement('div');
    particle.className = 'particle';
    var randomX = Math.random() * window.innerWidth;
    var randomY = Math.random() * window.innerHeight;
    particle.style.left = randomX + 'px';
    particle.style.top = randomY + 'px';
    particleContainer.appendChild(particle);
    setTimeout(function() {
        particle.remove();
    }, 3000); // Remove particle after 3 seconds
}

setInterval(createParticle, 100);

document.getElementById('loading-message').style.display = 'none';

    
    })
    
    
    
            .catch(error => {
                console.error('Error fetching data from the NASA API:', error);


                document.getElementById('loading-message').style.display = 'none';

            });
          
    
        };
      
        
    // Date Range
    const startDate = '2023-09-05';
    const endDate = '2023-09-12';
    const apiKey = 'bJPqEWO96h6ZUyZIgrkCv5NQ2fevLHQzOcCpguV4';
    
    // Call fetchData function with specified parameters
    fetchData(startDate, endDate, apiKey);