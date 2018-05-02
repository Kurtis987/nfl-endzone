queue()
    .defer(d3.json, "/team/dump")
    .await(makeTeamGraphs);

//this function is from stackoverflow
//https://stackoverflow.com/questions/21114336/how-to-add-axis-labels-for-row-chart-using-dc-js-or-d3-js
function AddXAxis(chartToUpdate, displayText) {
            chartToUpdate.svg()
                .append("text")
                .attr("class", "x-axis-label")
                .attr("text-anchor", "middle")
                .attr("x", chartToUpdate.width() / 2)
                .attr("y", chartToUpdate.height())
                .text(displayText);
}

function makeTeamGraphs(error, stats) {
    if (error) {
        console.error("makeGraphs error on receiving dataset:", error.statusText);
        throw error;
    }

    console.log("stats: ");
    console.log(stats);
    console.log("end stats");


    //Create a Crossfilter instance
    var ndx = crossfilter(stats);
    var all = ndx.groupAll();

    var winsDim = ndx.dimension(function (d) {return d["wins"]})
    var offenseDim = ndx.dimension(function (d) {return d["offenseTotal"]});
    var defenseDim = ndx.dimension(function (d) {return d["defenseTotal"]});
    var stadiumDim = ndx.dimension(function(d){ return d["stadium-roof"]});

    var winsDimGroup = winsDim.group();
    var offenseDimGroup = offenseDim.group();
    var defenseDimGroup = defenseDim.group();
    var stadiumGroup = stadiumDim.group();

    var winsChart = dc.rowChart("#wins-chart")
        .height(400)
        .width(300)
        .dimension(winsDim)
        .group(winsDimGroup);



    var stadiumPieChart = dc.pieChart("#stadium-pie")
        .height(300)
        .width(300)
        .dimension(stadiumDim)
        .group(stadiumGroup);

    dc.renderAll();
    AddXAxis(winsChart, "Number of Teams")
}