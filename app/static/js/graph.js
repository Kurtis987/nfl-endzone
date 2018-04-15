queue()
    .defer(d3.json, "/stats/dump")
    .await(makeGraphs);

function makeGraphs(error, stats) {
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
    var individualReceivingDim = ndx.dimension(function (d) {
        return d["receiving"];
    });
    var individualRushingDim = ndx.dimension(function (d) {
        return d["rushing"];
    });
    var individualSacksDim = ndx.dimension(function (d) {
        return d["sacks"];
    });
    var individualTacklesDim = ndx.dimension(function (d) {
        return d["tackles"];
    });
    var individualInterceptionsDim = ndx.dimension(function (d) {
        return d["interceptions"];
    });



    //Calculate metrics
    var numProjectsByIndividualPassing = individualPassingDim.group();
    var numProjectsByIndividualReceiving = individualReceivingDim.group();
    var numProjectsByIndividualRushing = individualRushingDim.group();
    var numProjectsByIndividualSacks = individualSacksDim.group();
    var numProjectsByIndividualTackles = individualTacklesDim.group();
    var numProjectsByIndividualInterceptions = individualInterceptionsDim.group();




    //Charts
    var individualPassingChart = dc.rowChart("#individual-passing-row-chart");
    var individualReceivingChart = dc.rowChart("#individual-receiving-row-chart");
    var individualRushingChart = dc.rowChart("#individual-rushing-row-chart");
    var individualSacksChart = dc.rowChart("#individual-sacks-row-chart");
    var individualTacklesChart = dc.rowChart("#individual-tackles-row-chart");
    var individualInterceptionsChart = dc.rowChart("#individual-interceptions-row-chart");
    //var fundingStatusChart = dc.pieChart("#funding-chart");



    individualPassingChart
        .ordinalColors(["#79CED7", "#66AFB2", "#C96A23", "#D3D1C5", "#F5821F"])
        .width(600)
        .height(300)
        .dimension(individualPassingDim)
        .group(numProjectsByIndividualPassing)
        .xAxis().ticks(4);

    individualReceivingChart
        .ordinalColors(["#79CED7", "#66AFB2", "#C96A23", "#D3D1C5", "#F5821F"])
        .width(1200)
        .height(300)
        .dimension(individualReceivingDim)
        .group(numProjectsByIndividualReceiving)
        .xAxis().ticks(4);

    individualRushingChart
        .ordinalColors(["#79CED7", "#66AFB2", "#C96A23", "#D3D1C5", "#F5821F"])
        .width(1200)
        .height(300)
        .dimension(individualRushingDim)
        .group(numProjectsByIndividualRushing)
        .xAxis().ticks(4);

    individualSacksChart
        .ordinalColors(["#79CED7", "#66AFB2", "#C96A23", "#D3D1C5", "#F5821F"])
        .width(600)
        .height(300)
        .dimension(individualSacksDim)
        .group(numProjectsByIndividualSacks)
        .xAxis().ticks(4);

    individualTacklesChart
        .ordinalColors(["#79CED7", "#66AFB2", "#C96A23", "#D3D1C5", "#F5821F"])
        .width(1200)
        .height(300)
        .dimension(individualTacklesDim)
        .group(numProjectsByIndividualTackles)
        .xAxis().ticks(4);

    individualInterceptionsChart
        .ordinalColors(["#79CED7", "#66AFB2", "#C96A23", "#D3D1C5", "#F5821F"])
        .width(1200)
        .height(300)
        .dimension(individualInterceptionsDim)
        .group(numProjectsByIndividualInterceptions)
        .xAxis().ticks(4);

    dc.renderAll();
}