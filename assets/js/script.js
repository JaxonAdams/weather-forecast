var welcomeEl = document.querySelector("#welcome");
var currentWeatherEl = document.querySelector("#current-weather");
var citySearchedEl = document.querySelector("#city-searched");
var tempEl = document.querySelector("#temp");
var windEl = document.querySelector("#wind");
var humidityEl = document.querySelector("#humidity");
var uvIndexEl = document.querySelector("#uv-index");
var cityFormEl = document.querySelector("#city-form");
var searchbar = document.querySelector("#searchbar");

// Build Out Current Weather Section
var displayCurrentWeather = function() {

}

// Display welcome in header
var displayHeader = function() {
    welcomeEl.textContent = "Welcome! Today is " + getCurrentDate() + ".";
};

// Get current date
var getCurrentDate = function() {
    // Get date
    var currentDate = moment().format("dddd, MMMM Do YYYY");
    return currentDate;
}

// Store submitted data
var captureForm = function(event) {
    event.preventDefault();

    var city = searchbar.value.trim();
    
    if (city) {
        getWeather(city);
        searchbar.value = "";
    } else {
        alert("Please enter a city.");
    }
}

var getWeather = function(location) {
    console.log("Getting weather for " + location)
}

// Listen for form submission
cityFormEl.addEventListener("submit", captureForm);

displayHeader();

// Update current date every half hour
setInterval(function() {
    getCurrentDate();
    displayHeader();
}, (1000 * 60) * 30)