queue()
    .defer(d3.json, "/stats/dump")
    .await(makeGraphs);

function makeGraphs(error, stats) {
    if (error) {
        console.error("makeGraphs error on receiving dataset:", error.statusText);
        throw error;
    }

    //Create a Crossfilter instance
    var ndx = crossfilter(stats);

    //Define Dimensions
    var individualPassingDim = ndx.dimension(function (d) {
        return d["passing"];
    });
    var individualRushingDim = ndx.dimension(function (d) {
        return d["rushing"];
    });
    var individualReceivingDim = ndx.dimension(function (d) {
        return d["receiving"];
    });
    var individualInterceptionsDim = ndx.dimension(function (d) {
        return d["interceptions"];
    });
    var individualSacksDim = ndx.dimension(function (d) {
        return d["sacks"];
    });
    var individualTacklesDim = ndx.dimension(function (d) {
        return d["tackles"];
    });



    var topPassers = individualPassingDim.top(5);
    var topRushers = individualRushingDim.top(5);
    var topReceivers = individualReceivingDim.top(5);
    var topInterceptions = individualInterceptionsDim.top(5);
    var topSacks = individualSacksDim.top(5);
    var topTackles = individualTacklesDim.top(5);

    var width = 500;
    var height = 500;

    drawChart(topTackles, "tackles", "#tackles-chart", "2017 Season Tackles", width, height);
    drawChart(topSacks, "sacks", "#sacks-chart", "2017 Season Sacks", width, height);
    drawChart(topInterceptions, "interceptions", "#interceptions-chart", "2017 Season Interceptions", width, height);
    drawChart(topRushers, "rushing", "#rushing-chart", "2017 Season Rushing Yards", width, height);
    drawChart(topReceivers, "receiving", "#receiving-chart", "2017 Season Receiving Yards", width, height);
    drawChart(topPassers, "passing", "#chart", "2017 Season Passing Yards", width, height);
}//end make graphs function



function drawChart(dataArray, field, chartName, chartTitle, width, height){

    // Dimensions
    var margin = {
        top: 20,
        right: 20,
        bottom: 20,
        left: 100
    },
        width = width,
        height = height - margin.top - margin.bottom,
        barHeight = 40,
        percent = d3.format('%');

    // Create the scale for the axis
    var xScale = d3.scale.linear()
        .range([0, width]); // the pixel range to map to

    var yScale = d3.scale.ordinal()
        .rangeRoundBands([190, height]);

    // Create the axis
    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient('bottom')
        .ticks(5);

    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient('left');


    xScale.domain([0, dataArray[0][field]]);
    yScale.domain(dataArray.map(function (d) {
        return d.name;
    }));

    // Render the SVG
    svg = d3.select(chartName)
        .append('svg')
        .attr('height', height + margin.top + margin.bottom)
        .attr('width', 650)
        .append('g') // Group the content and add margin
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    // Render the axis
    svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .selectAll(".tick text")
        .call(wrap, yScale.rangeBand());

    // Render the bars
    rect = svg.selectAll('rect')
        .data(dataArray)
        .enter();

        rect.append('rect')
        .attr('y', function (d) {
        return yScale(d.name);})
        .attr('width', function (d) {
        return xScale(d[field]);})
        .attr('height', barHeight);


    //place stats in rect
    rect.append("text")
        .style("fill", "white")
        .style("font-size", "14px")
        .attr("dy", ".35em")
        .attr("x",  function (d) {
         return  xScale(d[field])-58;})
        .attr("y", function (d) {
        return  yScale(d.name)+20;})
        .style("style", "label")
        .text(function(d) {
        return d[field]; });

    svg.append("text")
        .attr("x", (width / 2))
        .attr("y", (margin.top *4))
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("text-decoration", "underline")
        .text(chartTitle);
}



//wrap label function from this blogpost: https://bl.ocks.org/mbostock/7555321
function wrap(text, width) {
  text.each(function() {
    var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, // ems
        y = text.attr("y"),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("x", -10).attr("y", y).attr("dy", dy + "em");
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan").attr("x", -5).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
      }
    }
  })};