const renderMeteoriteMap = (meteoriteData, geoData) => {
  // set up required dimensions
  const width = 1000;
  const height = 700;
  const margin = { top: 20, right: 20, bottom: 20, left: 20 };
  const legendRectHeight = 20;
  const legendRectWidth = 50;
  const legendX = 550;
  const legendTextX = legendX + legendRectWidth / 2;

  // set up tooltip div
  const tooltip = d3.select('body').append('div')
    .attr('class', 'tooltip')
    .style('position', 'absolute')
    .style('opacity', 0);

  // append svg to DOM
  const svg = d3.select('.svg-container')
    .append('svg')
    .attr('width', width)
    .attr('height', height);

  // set up zoom functionality
  const zoom = d3.zoom()
    .scaleExtent([1, 40])
    .translateExtent([[-100, -100], [width + 90, height + 100]])
    .on('zoom', zoomed);

  function zoomed() {
    countries.attr('transform', d3.event.transform);
    meteorites.attr('transform', d3.event.transform);
    tooltip.attr('transform', d3.event.transform);
  }

  svg.call(zoom);

  // add sea-coloured background
  svg.append('rect')
    .style('fill', '#a8d3f7')
    .attr('x', 0)
    .attr('y', 0)
    .attr('width', width)
    .attr('height', height);

  // set up path and projection
  const projection = d3.geoMercator()
    .scale(width / 2 / Math.PI)
    .translate([width / 2, height / 2]);

  const path = d3.geoPath()
    .projection(projection);

  // append countries to svg
  const countries = svg.append('path')
    .attr('d', path(geoData))
    .attr('class', 'country')
    .attr('stroke', 'black')
    .attr('stroke-width', '0.1')
    .style('fill', '#b7c19e');

  // append circles to svg to represent meteorites
  const meteorites = svg.append('g')
    .selectAll('circle')
    .data(meteoriteData.features.sort((a, b) => b.properties.mass - a.properties.mass))
    .enter()
    .append('circle')
    .attr('cx', d => projection([d.properties.reclong, d.properties.reclat])[0])
    .attr('cy', d => projection([d.properties.reclong, d.properties.reclat])[1])
    .attr('stroke', 'maroon')
    .attr('stroke-width', '0.3')
    .style('fill', '#db6f6f')
    .style('opacity', .7)
    .attr('r', d => (Math.sqrt(d.properties.mass) / 100))
    .style('z-index', d => - d.properties.mass)
    .on('mouseover', function(d) {
      const mouse = d3.mouse(this);
      let { name, year, mass } = d.properties;
      year = year.slice(0, 4);

      // show tooltip when user hovers over bar and dynamically allocate attributes
      tooltip
        .style('left', `${mouse[0] + 165}px`)
        .style('top', `${mouse[1] - 70}px`)
        .html(
          `<span class="tooltip-title">Name: </span>${name}<br>
          <span class="tooltip-title">Year: </span>${year}<br>
          <span class="tooltip-title">Mass: </span>${mass} kg
          `
        )
        .transition()
        .duration(200)
        .style('opacity', .9)
    })
    .on('mouseout', (d) => {
      tooltip.transition()
        .duration(500)
        .style('opacity', 0)
    });
};

const meteroriteUrl = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/meteorite-strike-data.json';
const geoUrl = 'http://enjalot.github.io/wwsd/data/world/world-110m.geojson';

$.getJSON(meteroriteUrl, meteoriteData => {
    $.getJSON(geoUrl, geoData => renderMeteoriteMap(meteoriteData, geoData));
});
