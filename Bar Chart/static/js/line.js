function makeStackedAreaChart(data) {
    var filter = $("#decade").val();
    if (filter != "All") {
        if (filter == "2010") {
            data = data.filter(x => (x["Ref Pubyr"] >= 2010) & (x["Ref Pubyr"] < 2020))
        } else if (filter == "2000") {
            data = data.filter(x => (x["Ref Pubyr"] >= 2000) & (x["Ref Pubyr"] < 2010))
        } else if (filter == "1990") {
            data = data.filter(x => (x["Ref Pubyr"] >= 1990) & (x["Ref Pubyr"] < 2000))
        }
    }​
    // STEP 1: SET UP THE CANVAS
    $("#chart").empty();​
    // var svgWidth = 960;
    var svgWidth = window.innerWidth;
    var svgHeight = 500;​
    var margin = {
        top: 20,
        right: 40,
        bottom: 60,
        left: 50
    };​
    var chart_width = svgWidth - margin.left - margin.right;
    var chart_height = svgHeight - margin.top - margin.bottom;​
    // STEP 2: CREATE THE SVG (if it doesn't exist already)
    // Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
    var svg = d3.select("#chart")
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight)
        .classed("chart", true);​
    var chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);​
    // STEP 3: PREPARE THE DATA
    var parseTime = d3.timeParse("%Y");
    data.forEach(function(row) {
        row["Ref Pubyr"] = parseTime(row["Ref Pubyr"]);​
    });​
    data = data.sort((a, b) => b["Ref Pubyr"] - a["Ref Pubyr"]);​
    var keys = Array.from(d3.group(data, d => d["Geological Time Period"]).keys());
    var valueTemp = Array.from(d3.rollup(data, (d) => d.length, d => d["Ref Pubyr"], d => d["Geological Time Period"]));​
    valueTemp.map(function(obj) {
        var tempKeys = Array.from(obj[1].keys());
        if (tempKeys.length === 1) {
            if (tempKeys[0] == "Jurassic") {
                obj[1].set("Triassic", 0);
                obj[1].set("Cretaceous", 0);
            } else if (tempKeys[0] == "Cretaceous") {
                obj[1].set("Triassic", 0);
                obj[1].set("Jurassic", 0);
            } else if (tempKeys[0] == "Triassic") {
                obj[1].set("Cretaceous", 0);
                obj[1].set("Jurassic", 0);
            }
        } else if (tempKeys.length === 2) {
            if ((tempKeys[0] == "Jurassic") & (tempKeys[1] == "Cretaceous")) {
                obj[1].set("Triassic", 0);
            } else if ((tempKeys[0] == "Jurassic") & (tempKeys[1] == "Triassic")) {
                obj[1].set("Cretaceous", 0);
            } else if ((tempKeys[0] == "Cretaceous") & (tempKeys[1] == "Jurassic")) {
                obj[1].set("Triassic", 0);
            } else if ((tempKeys[0] == "Cretaceous") & (tempKeys[1] == "Triassic")) {
                obj[1].set("Jurassic", 0);
            } else if ((tempKeys[0] == "Triassic") & (tempKeys[1] == "Jurassic")) {
                obj[1].set("Cretaceous", 0);
            } else if ((tempKeys[0] == "Triassic") & (tempKeys[1] == "Cretaceous")) {
                obj[1].set("Jurassic", 0);
            }
        }
        return obj;
    });
    console.log(valueTemp);
    var values = Array.from(valueTemp);​
    var order = d3.stackOrderNone;
    var series = d3.stack()
        .keys(keys)
        .value(([, values], key) => values.get(key))
        .order(order)
        (values);​
    console.log(values);
    console.log(series);​​
    // Create scaling functions
    var xTimeScale = d3.scaleTime()
        .domain(d3.extent(data, d => d["Ref Pubyr"]))
        .range([0, chart_width]);​
    var yScale = d3.scaleLinear()
        .domain([0, d3.max(series, d => d3.max(d, d => d[1]))]).nice()
        .range([chart_height, 0]);​
    var colorScale = d3.scaleOrdinal()
        .domain(keys)
        .range(d3.schemeCategory10);​
    var area = d3.area()
        .x(d => xTimeScale(d.data[0]))
        .y0(d => yScale(d[0]))
        .y1(d => yScale(d[1]));​​
    // STEP 5: CREATE THE AXES
    var leftAxis = d3.axisLeft(yScale);
    var bottomAxis = d3.axisBottom(xTimeScale);​
    chartGroup.append("g")
        .attr("transform", `translate(0, ${chart_height})`)
        .call(bottomAxis);​
    chartGroup.append("g")
        .call(leftAxis);​
    // STEP 6: CREATE THE GRAPH
    chartGroup.append("g")
        .selectAll("path")
        .data(series)
        .join("path")
        .attr("fill", ({ key }) => colorScale(key))
        .attr("d", area)
        .append("title")
        .text(({ key }) => key);​
    // STEP 7: Add Axes Labels
    // Create axes labels
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 0)
        .attr("x", 0 - (chart_height / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("# of Dinos");​
    chartGroup.append("text")
        .attr("transform", `translate(${chart_width / 2}, ${chart_height + margin.top + 30})`)
        .attr("class", "axisText")
        .text("Year of Discovery");​
}​​​​
// function makeStackedAreaChart2(data) {
//     chart = {
//         const svg = d3.create("svg").attr("viewBox", [0, 0, width, height]);
//         svg.append("g").selectAll("path").data(series).join("path").attr("fill", ({
//             key
//         }) => color(key)).attr("d", area).append("title").text(({
//             key
//         }) => key);
//         svg.append("g").call(xAxis);
//         svg.append("g").call(yAxis);
//         return svg.node();
//     }
//     keys = Array.from(d3.group(data2, d => d.key).keys());
//     values = Array.from(d3.rollup(data2, ([d]) => d.value, d => +d.date, d => d.key));
//     series = d3.stack()
//         .keys(keys)
//         .value(([, values], key) => values.get(key))
//         .order(order)
//         (values);
//     order = d3.stackOrderNone;
//     area = d3.area()
//         .x(d => x(d.data[0]))
//         .y0(d => y(d[0]))
//         .y1(d => y(d[1]));
//     x = d3.scaleUtc()
//         .domain(d3.extent(data, d => d.date))
//         .range([margin.left, width - margin.right]);
//     y = d3.scaleLinear()
//         .domain([0, d3.max(series, d => d3.max(d, d => d[1]))]).nice()
//         .range([height - margin.bottom, margin.top]);
//     xAxis = g => g
//         .attr("transform", `translate(0,${height - margin.bottom})`)
//         .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0));
//     yAxis = g => g
//         .attr("transform", `translate(${margin.left},0)`)
//         .call(d3.axisLeft(y))
//         .call(g => g.select(".domain").remove())
//         .call(g => g.select(".tick:last-of-type text").clone()
//             .attr("x", 3)
//             .attr("text-anchor", "start")
//             .attr("font-weight", "bold")
//             .text(data.y));
//     height = 500;
//     margin = ({ top: 20, right: 30, bottom: 30, left: 40 });
​​
// }