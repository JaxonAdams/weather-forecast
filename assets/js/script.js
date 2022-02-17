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
var displayHeaders = function() {
    welcomeEl.textContent = "Welcome! Today is " + getCurrentDate() + ".";

    document.querySelector("#day-one-header").textContent = moment().add(1, "d").format("M/D/YYYY");
    document.querySelector("#day-two-header").textContent = moment().add(2, "d").format("M/D/YYYY");
    document.querySelector("#day-three-header").textContent = moment().add(3, "d").format("M/D/YYYY");
    document.querySelector("#day-four-header").textContent = moment().add(4, "d").format("M/D/YYYY");
    document.querySelector("#day-five-header").textContent = moment().add(5, "d").format("M/D/YYYY");
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

    var zipCode = searchbar.value.trim();
    
    if (zipCode) {
        getLatAndLon(zipCode);
        searchbar.value = "";
    } else {
        alert("Please enter a valid zip code.");
    }
}

var getLatAndLon = function(location) {
    console.log("Getting weather for " + location)
    var geoUrl = "https://api.openweathermap.org/geo/1.0/zip?zip=" + location + "&appid=67c682bdeb2484022f2478f1c184a2f6";

    fetch(geoUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                var lat = getLat(data);
                var lon = getLon(data);
                var cityName = getCityName(data);

                getWeather(lat, lon, cityName);
            });
        } else {
            alert("There was an error with the provided zip code. Please ensure you have entered a valid code.");
        }
    })
    .catch(function(error) {
        alert("Unable to connect to our weather API.");
    });
}

var getLat = function(zip) {
    return zip.lat;
}

var getLon = function(zip) {
    return zip.lon;
}

var getCityName = function(zip) {
    return zip.name;
}

// Get Weather using Lat and Lon Provided
var getWeather = function(lat, lon, city) {
    console.log(lat, lon, city);

    var weatherUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly,alerts&units=imperial&appid=67c682bdeb2484022f2478f1c184a2f6";

    fetch(weatherUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                console.log(data);

                displayWeatherData(data, city);
            });
        } else {
            alert("Sorry, there was an error processing your request.");
        }
    })
    .catch(function(error) {
        alert("Unable to connect to our weather API.");
    });
}

// Display Weather Data
var displayWeatherData = function(data, city) {
    citySearchedEl.textContent = "City: " + city;

    var currentTemp = data.current.temp;
    var currentWind = data.current.wind_speed;
    var currentHumidity = data.current.humidity;
    var currentUV = data.current.uvi;

    console.log(currentTemp, currentWind, currentHumidity, currentUV);

    tempEl.textContent = "Temperature: " + currentTemp + " Degrees Fahrenheit";
    windEl.textContent = "Wind Speed: " + currentWind + " MPH";
    humidityEl.textContent = "Humidity: " + currentHumidity + "%";
    uvIndexEl.textContent = "UV Index: " + currentUV;
}

// Listen for form submission
cityFormEl.addEventListener("submit", captureForm);

displayHeaders();

// Update current date every half hour
setInterval(function() {
    getCurrentDate();
    displayHeaders();
}, (1000 * 60) * 30)