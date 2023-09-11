(function (d3) {
    'use strict';
  
  const svgWidth = 1100; 
  const svgHeight = 600;

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
      const imageSize = 35;
      const yAxisLabel = 'Distance from Earth (kilometers)';
  
      const margin = { top: 80, right: 20, bottom: 80, left: 400 };
      const innerWidth = width - margin.left - margin.right;
      const innerHeight = height - margin.top - margin.bottom;
  
      const xScale = d3.scaleLinear()
        .domain(d3.extent(data, xValue))
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
        .attr('class', 'axis-label')
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
        .attr('class', 'axis-label')
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
        .attr('xlink:href' ,'./Images/pngwing.com (1).png');

      g.append('text')
        .attr('class', 'title')
        .attr('y', -28)
        .attr('x', innerWidth/12)
        .text(title);

        
    };

    
  
//     fetch('https://api.nasa.gov/neo/rest/v1/neo/browse?api_key=bJPqEWO96h6ZUyZIgrkCv5NQ2fevLHQzOcCpguV4')
//     .then(response => response.json())
//     .then(data => {
//       // Extracting the relevant asteroid data from the API response
//       const asteroids = data.near_earth_objects.map(asteroid => ({
//         estimated_diameter: asteroid.estimated_diameter,
//         close_approach_data: asteroid.close_approach_data,
//       }));
  
//         render(asteroids);
//       })
//       .catch(error => {
//         console.error('Error fetching data from the NASA API:', error);
//       });
  
//   }(d3));


  
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
  
    const svgWidth = 1100;
    const svgHeight = 600;
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
