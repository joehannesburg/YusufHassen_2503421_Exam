//Data-Art Section
(function (d3) {
  'use strict';

    // set the dimensions and margins of the graph
    const margin = { top: 100, right: 100, bottom: 100, left: 350 },
    width = 1100 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;
    
    
    
    // append the svg object to the body of the page
    const svg = d3.select("#svg-container")
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
        const radiusScale = d3.scaleSqrt()
        .domain([0, d3.max(asteroids, d => d.size)])
        .range([10, 66]);
    
        //Scale for colour
        const colorScale = d3.scaleSequential(d3.interpolateTurbo) // You can choose any other color scale
        .domain([d3.min(asteroids, d => d.magnitude), d3.max(asteroids, d => d.magnitude)]);
    
    
        // Add simulations
        const simulation = d3.forceSimulation()
        .force("x", d3.forceX(width / 2).strength(0.05))
        .force("y", d3.forceY(height / 2).strength(0.05))
        .force("collide", d3.forceCollide(function(d) {
            return radiusScale(d.size) + 3;
        }))
    
    
    // -1- Create a tooltip div that is hidden by default:
    const tooltip = d3.select("#bubbles-container")
    .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip2")
      .style("background-color", "white")
      .style("border-radius", "20px")
      .style("padding", "10px")
      .style("color", "black")
    
    // -2- Create 3 functions to show / update (when mouse move but stay on same circle) / hide the tooltip
    const showTooltip = function(event, d) {
    tooltip
    
      .style("opacity", 2)
      d3.select(this)
      .style("stroke", "red")
      .style("opacity", 5)
      .style("cursor", "pointer")
    
      
    }
    const moveTooltip = function(event, d) {
      tooltip
      .html("<div><strong>Asteroid Name:</strong> " + d.name + "</div></div>" +
                  "<div><strong>Absolute Magnitude:</strong> " + d.magnitude + "</div>" + "<div><strong>Speed(km/h):</strong> " + d.speed)
    
      // .style("left",(event.pageX + 10)  + "px")
      // .style("top", (event.pageY + 10) + "px")
      const tooltipWidth = tooltip.node().offsetWidth;
      const tooltipHeight = tooltip.node().offsetHeight;
      const xPos = event.pageX + 10; // Offset the tooltip to the right of the cursor
      const yPos = event.pageY + 10; // Offset the tooltip below the cursor
      
      // Check if the tooltip goes beyond the right edge of the window
      if (xPos + tooltipWidth > window.innerWidth) {
          xPos = window.innerWidth - tooltipWidth - 10;
      }
      
    
      tooltip.style("left", xPos + "px")
             .style("top", yPos + "px");
    }
    const hideTooltip = function(event, d) {
    tooltip
      // .transition()
      // .duration(200)
      .style("opacity", 0)
      d3.select(this)
          .style("stroke", "white")
          .style("opacity", 0.9)
    
    }
    
        // Add bubbles
       const circles = svg.selectAll("dot")
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
const particleContainer = document.getElementById('particle-container');

function createParticle() {
    const particle = document.createElement('div');
    particle.className = 'particle';
    const randomX = Math.random() * window.innerWidth;
    const randomY = Math.random() * window.innerHeight;
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
  }(d3));





(function (d3) {
  // 'use strict';
//Data-Art Section

      // set the dimensions and margins of the graph
      const margin = { top: 200, right: 100, bottom: 200, left: 350 },
      width = 1100 - margin.left - margin.right,
      height = 900 - margin.top - margin.bottom;
      
      
      
      // append the svg object to the body of the page
      const svg = d3.select("#exam-svg")
      .append("svg")
      .attr("width", "100%")
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");
      
  
  
          // Show Loading message
          document.getElementById('loading-message').style.display = 'block';

  
      // Fetch Data
      function updateDateRange() {
        const startDateValue = document.getElementById('start-date').value;
        const endDateValue = document.getElementById('end-date').value;
        const apiKey = 'bJPqEWO96h6ZUyZIgrkCv5NQ2fevLHQzOcCpguV4';
        const errorMessage = document.getElementById('error-message');
        const startDate = new Date(startDateValue);
  const endDate = new Date(endDateValue);

  const oneDay = 24 * 60 * 60 * 1000; // Calculate the duration of one day in milliseconds
  const dayDifference = Math.round(Math.abs((endDate - startDate) / oneDay)); // Calculate difference in days

  if (startDate === '' || endDate === '' || startDate > endDate || dayDifference > 7) {
    errorMessage.style.display = 'block'; // Show error message
    return; // Stop execution if the date range is invalid
  }

  errorMessage.style.display = 'none'; // Hide error message if date range is valid

      
  getData(startDateValue, endDateValue, apiKey);
        // Clear existing bubbles
  svg.selectAll('.bubbless').remove();
          // document.getElementById('date-button').onclick = updateDateRange();

  
      }
                // document.getElementById('date-button').onclick = updateDateRange;

    //   window.addEventListener('error', function (event) {
    //     const errorMessage = document.getElementById('error-message');
    //     errorMessage.style.display = 'block'; // Show error message for console errors
    //   });
      
      
      const getData = (startDates, endDates, apiKeys) => {
        const baseUrl = 'https://api.nasa.gov/neo/rest/v1/feed';
        const apiUrl = `${baseUrl}?start_date=${startDates}&end_date=${endDates}&api_key=${apiKeys}`;
      
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
          const radiusScale = d3.scaleSqrt()
          .domain([0, d3.max(asteroids, d => d.size)])
          .range([9, 50]);
      
          //Scale for colour
          const colorScale = d3.scaleSequential(d3.interpolateCividis) // You can choose any other color scale
          .domain([d3.min(asteroids, d => d.magnitude), d3.max(asteroids, d => d.magnitude)]);
      
      
          // Add simulations
          const simulation = d3.forceSimulation()
          
          .force("orbit", d3.forceRadial(320, width / 2, height / 2).strength(0.07)) // Circular orbit
          .force("collide", d3.forceCollide().radius(d => radiusScale(d.size) + 2))
          .alphaDecay(0)
          .on('tick', ticked);
        
      
      // -1- Create a tooltip div that is hidden by default:
      const tooltip = d3.select("#exam-bubbles")
      .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip2")
        .style("background-color", "white")
        .style("border-radius", "20px")
        .style("padding", "10px")
        .style("color", "black")
      
      // -2- Create 3 functions to show / update (when mouse move but stay on same circle) / hide the tooltip
      const showTooltip = function(event, d) {
      tooltip
        
        .style("opacity", 2)
        d3.select(this)
        .style("stroke", "red")
        .style("opacity", 5)
        .style("cursor", "pointer")
        .attr("r", function (d) { return radiusScale(d.size) + 7})      
       
      }
      const moveTooltip = function(event, d) {
        tooltip
        .html("<div><strong>Asteroid Name:</strong> " + d.name + "</div></div>" +
                    "<div><strong>Absolute Magnitude:</strong> " + d.magnitude + "</div>" + "<div><strong>Speed(km/h):</strong> " + d.speed + "<div><strong>Size(m):</strong> " + d.size)
      
       
        const tooltipWidth = tooltip.node().offsetWidth;
        const tooltipHeight = tooltip.node().offsetHeight;
        const xPos = event.pageX + 10; // Offset the tooltip to the right of the cursor
        const yPos = event.pageY + 10; // Offset the tooltip below the cursor
        
        // Check if the tooltip goes beyond the right edge of the window
        if (xPos + tooltipWidth > window.innerWidth) {
            xPos = window.innerWidth - tooltipWidth - 10;
        }
        
     
        tooltip.style("left", xPos + "px")
               .style("top", yPos + "px");
      }
      const hideTooltip = function(event, d) {
      tooltip
       
        .style("opacity", 0)
        d3.select(this)
            .style("stroke", "white")
            .style("opacity", 0.9)
            .attr("r", function (d) { return radiusScale(d.size)})      

      
      }

  
      
    svg.append("image")
  .attr("class", "earth")
  .attr("x", width / 2 - 150) // Set the x-coordinate for the image (adjust as needed)
  .attr("y", height / 2 - 150) // Set the y-coordinate for the image (adjust as needed)
  .attr("width", 300) // Set the width of the image
  .attr("height", 300) // Set the height of the image
  .attr("transform", "rotate(0 " + (width / 2) + " " + (height / 2) + ")") // Rotate around its center initially

  .attr("xlink:href", "../Images/pngwing.com (4).png"); // Set the path to your image

          // Add bubbles
         const circles = svg.selectAll("dots")
              .data(asteroids)
              .enter()
              .append("circle")
              .attr("class", "bubbless")
              
              .attr("r", function (d) { return radiusScale(d.size) })
              .style("fill", function(d) { return colorScale(d.magnitude); })
              .style("stroke", "black")
              // -3- Trigger the functions
          .on("mouseover", showTooltip )
          .on("mousemove", moveTooltip )
          .on("mouseleave", hideTooltip )
              
      
           simulation.nodes(asteroids)
          .on('tick', ticked)
      

            const orbitRadius = 250; // Adjust the orbit radius
          const orbitSpeed = 0.5; // Adjust the orbit speed
          function ticked() {
            
  circles.attr("cx", function(d) { return d.x; })
         .attr("cy", function(d) { return d.y; });
          }
      
          // Define the drag behavior
const drag = d3.drag()
.on('start', dragstarted)
.on('drag', dragged)
.on('end', dragended);

// Apply the drag behavior to the circles
circles.call(drag);

// Functions to handle drag events
function dragstarted(event, d) {
if (!event.active) simulation.alphaTarget(0.3).restart();
d.fx = d.x;
d.fy = d.y;
}

function dragged(event, d) {
d.fx = event.x;
d.fy = event.y;
}

function dragended(event, d) {
if (!event.active) simulation.alphaTarget(0);
d.fx = null;
d.fy = null;
}
  // Animation for bubbles
  svg.selectAll("circle.bubbless")
      .transition()
      .duration(5000) // Animation duration in milliseconds
      .delay(function(d, i) { return i * 10; }) // Delay between each bubble animation
      .attr("r", function(d) { return radiusScale(d.size); })
      .attrTween("cx", function(d, i, nodes) {
        return function(t) {
          const angle = (i / nodes.length) * Math.PI * 2 + t * orbitSpeed; // Adjust the orbit speed here
          d.x = width / 2 + orbitRadius * Math.cos(angle);
          return width / 2 + orbitRadius * Math.cos(angle);
        };
      })
      .attrTween("cy", function(d, i, nodes) {
        return function(t) {
          const angle = (i / nodes.length) * Math.PI * 2 + t * orbitSpeed; // Adjust the orbit speed here
          d.y = height / 2 + orbitRadius * Math.sin(angle);
          return height / 2 + orbitRadius * Math.sin(angle);
        };
      });
  
  // Particle effect
  const particleContainer = document.getElementById('particle-container');
  
  function createParticle() {
      const particle = document.createElement('div');
      particle.className = 'particle';
      const randomX = Math.random() * window.innerWidth;
      const randomY = Math.random() * window.innerHeight;
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
      const startDates = '2023-09-05';
      const endDates = '2023-09-12';
      const apiKeys = 'bJPqEWO96h6ZUyZIgrkCv5NQ2fevLHQzOcCpguV4';
      
      // Call fetchData function with specified parameters
      getData(startDates, endDates, apiKeys);
  

}(d3));











    