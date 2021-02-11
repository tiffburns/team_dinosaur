// data from data.js
var tableData = data;

// Get a reference to the table body
var tbody = d3.select("tbody");

// Create table
ufoData(data);

// Select filter button and event handler
let filterButton = d3.select('#filter-btn').on('click', runClick);

// Create function to run when user inputs date
function runClick(){
    let input = d3.select('#datetime');
    let value = input.property('value');

    // Empty table
    tbody.html('')

    // Filter for date the user inputs
    let filterResult = data.filter((item) => item.datetime === value);

    // Insert filtered data into table
    ufoData(filterResult);
}

// Loop through data and console.log each ufo sighting object
function ufoData(data) {
    data.forEach((item) => {
        let row = tbody.append('tr');
        let datetime = row.append('td');
        let city = row.append('td');
        let state = row.append('td');
        let country = row.append('td');
        let shape = row.append('td');
        let duration = row.append('td');
        let comments = row.append('td');
        datetime.text(item.datetime);
        city.text(item.city);
        state.text(item.state);
        country.text(item.country);
        shape.text(item.shape);
        duration.text(item.duration);
        comments.text(item.comments);
    })   
}