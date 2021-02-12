$(document).ready(function() {

    $('#decade').change(function() {
        doWork(false);
    });

    doWork(true);
});

function doWork(isInit) {
    d3.csv("static/data/kaggle.csv").then(function(data) {
        if (isInit)
            makeFilters(data);
        var filteredData = makeStackedAreaChart(data);
        makePlot(filteredData);
    });
}

//poplulate the drop down list

function makeFilters(data) {
    var dropDownList = [];
    //only push the first value of the decades to dropdown list to avoid duplicate
    data.map(x => x["Ref Pubyr"]).forEach(function(val) {
        //get the decade years
        if (dropDownList.find(element => element == parseInt(val / 10) * 10) == undefined) {
            dropDownList.push(parseInt(val / 10) * 10);
        }
    });
    // sort and loop thru each object
    dropDownList.sort((a, b) => b - a);
    $('#decade').html('');
    $('#decade').append(`<option value="all">All</option>`);
    dropDownList.forEach(function(val) {
        //append the option
        var newOption = `<option>${val}</option>`;
        $('#decade').append(newOption);
    });
}
//set the  filter value
function makeStackedAreaChart(data) {
    var filter = $("#decade").val();
    if (filter !== "all") {
        data = data.filter(x => (x["Ref Pubyr"] >= parseInt(filter)) & (x["Ref Pubyr"] < parseInt(filter + 10)));

    }
    return data;
}
//make plot

function makePlot(data) {
    //create a set and occur only once for x axis
    var xdata = [...new Set(data.map(x => x["Geological Time Period"]))]
        //creat list for y axis
    var ycarn = [];
    var ypisc = [];
    var yherb = [];
    var yomni = [];
    var ymixed1 = [];
    var ymixed2 = [];

    xdata.forEach(thing => {
        var group = data.filter(x => x["Geological Time Period"] === thing);
        ycarn.push(group.filter(x => x.Diet === "carnivore").length);
        ypisc.push(group.filter(x => x.Diet === "piscivore").length);
        yherb.push(group.filter(x => x.Diet === "herbivore").length);
        yomni.push(group.filter(x => x.Diet === "omnivore").length);
        ymixed1.push(group.filter(x => x.Diet === "carnivore, omnivore").length);
        ymixed2.push(group.filter(x => x.Diet === "herbivore, omnivore").length);
    });

    var trace1 = {
        x: xdata,
        y: ycarn,
        name: 'Carnivore',
        type: 'bar',
        marker: {
            color: 'rgb(158,202,225)',
            opacity: 0.6,
            line: {
                color: 'rgb(8,48,107)',
                width: 1.5
            }
        }
    };

    var trace2 = {
        x: xdata,
        y: yherb,
        name: 'Herbivore',
        type: 'bar',
        marker: {
            color: 'rgba(219, 200, 82, 0.7)',
            opacity: 0.6,
            line: {
                color: 'rgb(8,48,107)',
                width: 1.5
            }
        }
    };

    var trace3 = {
        x: xdata,
        y: ypisc,
        name: 'Piscivore',
        type: 'bar',
        marker: {
            color: 'rgba(50,171, 96, 0.7)',
            opacity: 0.6,
            line: {
                color: 'rgb(8,48,107)',
                width: 1.5
            }
        }
    };


    var trace4 = {
        x: xdata,
        y: yomni,
        name: 'Omnivore',
        type: 'bar',
        marker: {
            color: 'rgba(222,45,38,0.8)',
            opacity: 0.6,
            line: {
                color: 'rgb(8,48,107)',
                width: 1.5
            }
        }
    };

    var trace5 = {
        x: xdata,
        y: ymixed2,
        name: 'Herbivore & Omnivore',
        type: 'bar',
        marker: {
            color: 'rgb(113,18,187)',
            opacity: 0.6,
            line: {
                color: 'rgb(8,48,107)',
                width: 1.5
            }
        }
    };

    var trace6 = {
        x: xdata,
        y: ymixed1,
        name: 'Carnivore & Omnivore',
        type: 'bar',
        marker: {
            color: 'rgb(142,124,195)',
            opacity: 0.6,
            line: {
                color: 'rgb(8,48,107)',
                width: 1.5
            }
        }
    };

    var layout = {
        title: "Change of Dinosaur Diet and Era",
        barmode: 'stack',
        titlefont: {
            size: 20,
            color: 'rgb(107, 107, 107)'
        },
        paper_bgcolor: 'rgba(245,246,249,1)',
        plot_bgcolor: 'rgba(245,246,249,1)',
        xaxis: {
            title: 'Geological Time Period',
        },
        yaxis: {
            title: 'Numer of Dinosaur  Diet',
        },
        bargap: 0.1
    };



    var traces = [trace1, trace2, trace3, trace4, trace5, trace6];


    Plotly.newPlot("bar-plot", traces, layout);
};