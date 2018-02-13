const width = 650,
      height = 400,
      margin = { top: 0, right: 0, bottom: 0, left: 0 };

const innerWidth = width - (margin.right + margin.left),
      innerHeight = height - (margin.top + margin.bottom);

const svg = d3.select('#chart').append('svg')
    .attr('width', width)
    .attr('height', height);

const xScale = d3.scaleLinear()
  .range([0, innerWidth]);

d3.csv('tn_four_year_bach.csv', function(error, data) {
  if (error) throw error;

  // console.log(data);

  const white = data.filter(function(row) {
    return row.year === '2012' &&
      row.gender === 'M' &&
      row.control === 'Private for-profit' &&
      row.race === 'W';
  });

  // console.log(white);

  const stack = d3.stack();

  stack.keys(['perc_grad_in_4', 'perc_grad_in_6']);

  const stacked = stack(white);
  console.log(JSON.stringify(stacked, null, 2))

  // Complete x-scale
  xScale.domain([0, d3.max(stacked, series => d3.max(series, d => d[1]))])

  console.log(xScale.domain());

})
