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
        console.error("makeTeamGraphs error on receiving dataset:", error.statusText);
        throw error;
    }


    //Create a Crossfilter instance
    var ndx = crossfilter(stats);
    var all = ndx.groupAll();

    var winsDim = ndx.dimension(function (d) {return d["wins"]});
    var stadiumDim = ndx.dimension(function(d){ return d["stadium-roof"]});

    var offenseDim = ndx.dimension(function (d) {return d["offenseTotal"]});
    var offensePassingDim = ndx.dimension(function (d) {return d["offensePassing"]});
    var offenseRushingDim = ndx.dimension(function (d) {return d["offenseRushing"]});
    var offenseReceivingDim = ndx.dimension(function (d) {return d["offenseReceiving"]});
    var defenseDim = ndx.dimension(function (d) {return d["defenseTotal"]});
    var defensePassingDim = ndx.dimension(function (d) {return d["defensePassing"]});
    var defenseRushingDim = ndx.dimension(function (d) {return d["defenseRushing"]});
    var defenseReceivingDim = ndx.dimension(function (d) {return d["defenseReceiving"]});
    var fansAvgPerGameDim = ndx.dimension(function (d) {return d["fansAvgPerGame"]});
    var fansSeasonTotalDim = ndx.dimension(function (d) {return d["fansSeasonTotal"]});

    //the two reactive graphs
    var winsDimGroup = winsDim.group();
    var stadiumGroup = stadiumDim.group();

    var topOffenseTotal = offenseDim.top(10);
    var topOffensePassing = offensePassingDim.top(10);
    var topOffenseRushing = offenseRushingDim.top(10);
    var topOffenseReceiving = offenseReceivingDim.top(10);
    var topFansAvgPerGame = fansAvgPerGameDim.top(10);
    var topFansSeasonTotalDim = fansSeasonTotalDim.top(10);


    var bottomDefenseTotal = defenseDim.top(Infinity);
    var bottomDefensePassing = defensePassingDim.top(Infinity);
    var bottomDefenseRushing = defenseRushingDim.top(Infinity);
    var bottomDefenseReceiving = defenseReceivingDim.top(Infinity);

    //lower is better; so we have to splice the last 10 off the list for defensive stats
    var topDefenseTotal = bottomDefenseTotal.splice(22,10);
    var topDefensePassing = bottomDefensePassing.splice(22,10);
    var topDefenseRushing = bottomDefenseRushing.splice(22,10);
    var topDefenseReceiving = bottomDefenseReceiving.splice(22,10);

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

    var width = 500;
    var height = 700;

    drawChart(topOffenseTotal, "offenseTotal", "#offense-team-total-chart", "2017 Top 10 Season Avg Yards Offense", width, height);
    drawChart(topOffensePassing, "offensePassing", "#offense-team-passing-chart", "2017 Top 10 Season Avg Yards Passing", width, height);
    drawChart(topOffenseRushing, "offenseRushing", "#offense-team-rushing-chart", "2017 Top 10 Season Avg Yards Rushing", width, height);
    drawChart(topOffenseReceiving, "offenseReceiving", "#offense-team-receiving-chart", "2017 Top 10 Season Avg Yards Receiving", width, height);

    drawChart(topDefenseTotal, "defenseTotal", "#defense-team-total-chart", "2017 Top 10 Season Avg Yards Against", width, height);
    drawChart(topDefensePassing, "defensePassing", "#defense-team-passing-chart", "2017 Top 10 Season Avg Passing Yards Against", width, height);
    drawChart(topDefenseRushing, "defenseRushing", "#defense-team-rushing-chart", "2017 Top 10 Season Avg Rushing Yards Against", width, height);
    drawChart(topDefenseReceiving, "defenseReceiving", "#defense-team-receiving-chart", "2017 Top 10 Season Avg Receiving Yards Against", width, height);
    drawChart(topFansAvgPerGame, "fansAvgPerGame", "#fans-avg-chart", "2017 Season Top 10 Avg Fans Per Game", width, height);
    drawChart(topFansSeasonTotalDim, "fansSeasonTotal", "#fans-total-chart", "2017 Top 10 Season Total Fans at Games", width, height);

    dc.renderAll();
    AddXAxis(winsChart, "Number of Teams")


}