queue()
    .defer(d3.json, "/stats/dump")
    .await(makeGraphs);

function makeGraphs(error, stats) {
    console.log(stats);
    if (error) {
        console.error("makeGraphs error on receiving dataset:", error.statusText);
        throw error;
    }

    /*var myData = [ 10, 15, 20, 30, 50 ];
    var svg = d3.select("#stats-row-chart")
                .append("svg")
                .attr("width",750)
                .attr("height",500)
                .attr("style", "background-color:#ddd");

    svg.selectAll("rect")
        .data(myData)
        .enter()
        .append("rect")
        .attr("x", function(d,i){return i*(50+ 10)})
        .attr("y", function(d){return 500- d * 5;})//height is 500
        .attr("width", 50)
        .attr("height", function(d){return d * 5;})
        .attr("fill", "#30C5C7"); */



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




    //Calculate metrics
    var numByIndividualPassing = individualPassingDim.group();
    var numByIndividualRushing = individualRushingDim.group();
    var numByIndividualReceiving = individualReceivingDim.group();
    var numByIndividualInterceptions = individualInterceptionsDim.group();
    var numByIndividualSacks = individualSacksDim.group();
    var numByIndividualTackles = individualTacklesDim.group();




    var topPassers = individualPassingDim.top(5);
    var topRushers = individualRushingDim.top(5);
    var topReceivers = individualReceivingDim.top(5);
    var topInterceptions = individualInterceptionsDim.top(5);
    var topSacks = individualSacksDim.top(5);
    var topTackles = individualTacklesDim.top(5);

    //var width = 700,   // width of svg
      //  height = 400;  // height of svg


    /////////////////////////

////////////////////////////////////////////////////////////////


//passing chart
// Dimensions
var margin = {
    top: 20,
    right: 20,
    bottom: 20,
    left: 100
},
//width = parseInt(d3.select('#chart').style('width'), 10),
    width = 500,
    height = 500 - margin.top - margin.bottom,
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



//passing chart
xScale.domain([0, topPassers[0].passing]); // min/max extent of your data (this is usually dynamic e.g. max)
//yScale.domain(stats.map(function (d) {
yScale.domain(topPassers.map(function (d) {
    console.log("name: " + d.name);
    return d.name;
}));

// Render the SVG
var svg = d3.select('#chart')
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
var rect = svg.selectAll('rect')
    .data(topPassers)
    .enter();

    rect.append('rect')
    .attr('y', function (d) {
    return yScale(d.name);})
    .attr('width', function (d) {
    return xScale(d.passing);})
    .attr('height', barHeight);

//place stats in rect
rect.append("text")
    .style("fill", "white")
    .style("font-size", "14px")
    .attr("dy", ".35em")
    .attr("x",  function (d) {
     return  xScale(d.passing)-40;})
    .attr("y", function (d) {
    return  yScale(d.name)+20;})
    .style("style", "label")
    .text(function(d) {
    console.log("passing in rect: " +d.passing);
    return d.passing; });

svg.append("text")
    .attr("x", (width / 2))
    .attr("y", (margin.top *4))
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .style("text-decoration", "underline")
    .text("Season Passing Yards");
//end passing chart


//start rushing chart
xScale.domain([0, topRushers[0].rushing]); // min/max extent of your data (this is usually dynamic e.g. max)
yScale.domain(topRushers.map(function (d) {
    return d.name;
}));

// Render the SVG
svg = d3.select('#rushing-chart')
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
    .data(topRushers)
    .enter();

    rect.append('rect')
    .attr('y', function (d) {
    return yScale(d.name);})
    .attr('width', function (d) {
    return xScale(d.rushing);})
    .attr('height', barHeight);

//place stats in rect
rect.append("text")
    .style("fill", "white")
    .style("font-size", "14px")
    .attr("dy", ".35em")
    .attr("x",  function (d) {
     return  xScale(d.rushing)-40;})
    .attr("y", function (d) {
    return  yScale(d.name)+20;})
    .style("style", "label")
    .text(function(d) {
    console.log(d.rushing);
    return d.rushing; });

svg.append("text")
    .attr("x", (width / 2))
    .attr("y", (margin.top *4))
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .style("text-decoration", "underline")
    .text("Season Rushing Yards");

//end rushing chart



//receiving chart
xScale.domain([0, topReceivers[0].receiving]); // min/max extent of your data (this is usually dynamic e.g. max)
//yScale.domain(stats.map(function (d) {
yScale.domain(topReceivers.map(function (d) {
    console.log("name: " + d.name);
    return d.name;
}));

// Render the SVG
svg = d3.select('#receiving-chart')
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
    .data(topReceivers)
    .enter();

    rect.append('rect')
    .attr('y', function (d) {
    return yScale(d.name);})
    .attr('width', function (d) {
    return xScale(d.receiving);})
    .attr('height', barHeight);

//place stats in rect
rect.append("text")
    .style("fill", "white")
    .style("font-size", "14px")
    .attr("dy", ".35em")
    .attr("x",  function (d) {
     return  xScale(d.receiving)-40;})
    .attr("y", function (d) {
    return  yScale(d.name)+20;})
    .style("style", "label")
    .text(function(d) {
    console.log("receiving in rect: " +d.receiving);
    return d.receiving; });

svg.append("text")
    .attr("x", (width / 2))
    .attr("y", (margin.top *4))
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .style("text-decoration", "underline")
    .text("Season Receiving Yards");
//end receiving chart


//interceptions chart
xScale.domain([0, topInterceptions[0].interceptions]); // min/max extent of your data (this is usually dynamic e.g. max)
//yScale.domain(stats.map(function (d) {
yScale.domain(topInterceptions.map(function (d) {
    console.log("name: " + d.name);
    return d.name;
}));

// Render the SVG
svg = d3.select('#interceptions-chart')
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
    .data(topInterceptions)
    .enter();

    rect.append('rect')
    .attr('y', function (d) {
    return yScale(d.name);})
    .attr('width', function (d) {
    return xScale(d.interceptions);})
    .attr('height', barHeight);

//place stats in rect
rect.append("text")
    .style("fill", "white")
    .style("font-size", "14px")
    .attr("dy", ".35em")
    .attr("x",  function (d) {
     return  xScale(d.interceptions)-40;})
    .attr("y", function (d) {
    return  yScale(d.name)+20;})
    .style("style", "label")
    .text(function(d) {
    console.log("interceptions in rect: " +d.interceptions);
    return d.interceptions; });

svg.append("text")
    .attr("x", (width / 2))
    .attr("y", (margin.top *4))
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .style("text-decoration", "underline")
    .text("Season Interceptions");
//end interceptions chart

//sacks chart
xScale.domain([0, topSacks[0].sacks]); // min/max extent of your data (this is usually dynamic e.g. max)
//yScale.domain(stats.map(function (d) {
yScale.domain(topSacks.map(function (d) {
    console.log("name: " + d.name);
    return d.name;
}));

// Render the SVG
svg = d3.select('#sacks-chart')
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
    .data(topSacks)
    .enter();

    rect.append('rect')
    .attr('y', function (d) {
    return yScale(d.name);})
    .attr('width', function (d) {
    return xScale(d.sacks);})
    .attr('height', barHeight);

//place stats in rect
rect.append("text")
    .style("fill", "white")
    .style("font-size", "14px")
    .attr("dy", ".35em")
    .attr("x",  function (d) {
     return  xScale(d.sacks)-40;})
    .attr("y", function (d) {
    return  yScale(d.name)+20;})
    .style("style", "label")
    .text(function(d) {
    console.log("sacks in rect: " +d.sacks);
    return d.sacks; });

svg.append("text")
    .attr("x", (width / 2))
    .attr("y", (margin.top *4))
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .style("text-decoration", "underline")
    .text("Season Sacks");
//end sacks chart


//tackles chart
xScale.domain([0, topTackles[0].tackles]); // min/max extent of your data (this is usually dynamic e.g. max)
//yScale.domain(stats.map(function (d) {
yScale.domain(topTackles.map(function (d) {
    console.log("name: " + d.name);
    return d.name;
}));

// Render the SVG
svg = d3.select('#tackles-chart')
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
    .data(topTackles)
    .enter();

    rect.append('rect')
    .attr('y', function (d) {
    return yScale(d.name);})
    .attr('width', function (d) {
    return xScale(d.tackles);})
    .attr('height', barHeight);

//place stats in rect
rect.append("text")
    .style("fill", "white")
    .style("font-size", "14px")
    .attr("dy", ".35em")
    .attr("x",  function (d) {
     return  xScale(d.tackles)-40;})
    .attr("y", function (d) {
    return  yScale(d.name)+20;})
    .style("style", "label")
    .text(function(d) {
    console.log("tackles in rect: " +d.tackles);
    return d.tackles; });

svg.append("text")
    .attr("x", (width / 2))
    .attr("y", (margin.top *4))
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .style("text-decoration", "underline")
    .text("Season Tackles");
//end interceptions chart

}//end make graphs function


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