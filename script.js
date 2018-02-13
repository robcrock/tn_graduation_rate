const width = 650,
      height = 400,
      margin = { top: 0, right: 0, bottom: 0, left: 0 };

const innerWidth = width - (margin.right + margin.left),
      innerHeight = height - (margin.top + margin.bottom);

const svg = d3.select('#chart').append('svg')
    .attr('width', width)
    .attr('height', height);

const plot = svg.append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`)

const allRaceAbbrs = ['Ai','A','B','H','W'],
      allRaces = ['American Indian', 'Asian', 'Black', 'Hispanic', 'White'],
      barKeys = ['perc_grad_in_4', 'perc_diff'];


const xScale = d3.scaleLinear()
    .range([0, innerWidth]),
  yScale = d3.scaleBand()
    .rangeRound([0, innerHeight])
    .paddingInner(0.05),
  zScale = d3.scaleOrdinal()
    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00", "#ff8c00"]);

d3.csv('tn_four_year_bach.csv', function(error, raw) {
  if (error) throw error;

  // clean up the originmal data
  let data = raw.map(function(row) {
    return {
      year: +row.year,
      institution_type: row.control,
      gender: row.gender,
      race_abbr: row.race,
      race: '',
      perc_grad_in_4: +row.perc_grad_in_4,
      perc_grad_in_6: +row.perc_grad_in_6,
      perc_diff: +row.perc_grad_in_6 - +row.perc_grad_in_4 
    }
  })

  // extend the abbreviation
  data.forEach( (row) => {
    switch (row.race_abbr) {
      case 'Ai': row.race = 'American Indian';
        break;
      case 'A': row.race = 'Asian';
        break;
      case 'B': row.race = 'Black';
        break;
      case 'H': row.race = 'Hispanic';
        break;
      case 'W': row.race = 'White';
        break;
    }
  });


  zScale
    .domain(allRaces);

  xScale
    .domain([0, d3.max(data, d => d.perc_grad_in_6)]);

  yScale
    .domain(data.map(d => d.race));

  data = data.filter(function(row) {
    return row.year === 2012 &&
      row.institution_type === 'Private for-profit' &&
      row.gender === 'M' &&
      row.race === 'White';
  });

  const stack = d3.stack();

  stack.keys(['perc_grad_in_4', 'perc_diff']);

  const stacked = stack(data);

  const barG = plot.selectAll('.barG')
    .data(stacked)
    .enter().append('g')
    .attr('class', 'barG')
    .attr('fill', d => zScale(d.key));

  barG.selectAll('rect')
    .data(function(d) { return d; })
    .enter().append('rect')
      .attr('x', d => xScale(d[0]))
      .attr('y', d => yScale(d.data.race))
      .attr('width', d => xScale(d[1] - d[0]))
      .attr('height', yScale.bandwidth());

})
