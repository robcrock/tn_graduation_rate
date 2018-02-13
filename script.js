const width = 650,
      height = 400,
      margin = { top: 0, right: 0, bottom: 0, left: 0 };

const innerWidth = width - (margin.right + margin.left),
      innerHeight = height - (margin.top + margin.bottom);

const svg = d3.select('#chart').append('svg')
    .attr('width', width)
    .attr('height', height);