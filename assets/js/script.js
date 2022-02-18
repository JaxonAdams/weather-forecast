var welcomeEl = document.querySelector("#welcome");
var currentWeatherEl = document.querySelector("#current-weather");
var citySearchedEl = document.querySelector("#city-searched");
var tempEl = document.querySelector("#temp");
var windEl = document.querySelector("#wind");
var humidityEl = document.querySelector("#humidity");
var uvIndexEl = document.querySelector("#uv-index");
var cityFormEl = document.querySelector("#city-form");
var searchbar = document.querySelector("#searchbar");
var searchHistoryEl = document.querySelector("#search-history");

// Set up storage obj
var searchHistory = {cityOne: []};

// Display welcome in header
var displayHeaders = function() {
    welcomeEl.textContent = "Welcome! Today is " + getCurrentDate() + ".";

    document.querySelector("#day-one-header").textContent = moment().add(1, "d").format("dddd");
    document.querySelector("#day-two-header").textContent = moment().add(2, "d").format("dddd");
    document.querySelector("#day-three-header").textContent = moment().add(3, "d").format("dddd");
    document.querySelector("#day-four-header").textContent = moment().add(4, "d").format("dddd");
    document.querySelector("#day-five-header").textContent = moment().add(5, "d").format("dddd");
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
        addSearchHistory(zipCode);
        loadSearchHistory();
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

    // Current Weather Data
    var currentTemp = data.current.temp;
    var currentWind = data.current.wind_speed;
    var currentHumidity = data.current.humidity;
    var currentUV = data.current.uvi;

    tempEl.textContent = "Temperature: " + currentTemp + "°F";
    windEl.textContent = "Wind Speed: " + currentWind + " MPH";
    humidityEl.textContent = "Humidity: " + currentHumidity + "%";
    uvIndexEl.textContent = "UV Index: " + currentUV;

    // UV Index Color
    if (currentUV >= 0 && currentUV < 2) {
        uvIndexEl.classList.add("uv-good");
    } else if (currentUV > 2 && currentUV <5 ) {
        uvIndexEl.classList.add("uv-meh");
    } else if (currentUV > 5) {
        uvIndexEl.classList.add("uv-bad");
    }

    // Five Day Forecast
    
    // Temp
    for (let i = 1; i < 6; i++) {
        document.querySelector("#temp-"+i).textContent = "Temp: " + data.daily[i].temp.day + "°F";
    }

    // Wind
    for (let i = 1; i < 6; i++) {
        document.querySelector("#wind-"+i).textContent = "Wind: " + data.daily[i].wind_speed + " MPH";
    }

    // Humidity
    for (let i = 1; i < 6; i++) {
        document.querySelector("#humidity-"+i).textContent = "Humidity: " + data.daily[i].humidity + "%";
    }

    // Icon
    for (let i = 1; i < 6; i++) {
        var thunderImgSrc = "./assets/images/thunderstorm.png";
        var rainImgSrc = "./assets/images/rain.png";
        var snowImgSrc = "./assets/images/snow.png";
        var clearImgSrc = "./assets/images/favicon.png";
        var cloudImgSrc = "./assets/images/cloud.png";

        if (data.daily[i].weather[0].main === "Clear") {
            document.querySelector("#icon-"+i).classList.remove("hide");
            document.querySelector("#icon-"+i).src = clearImgSrc;
        } else if (data.daily[i].weather[0].main === "Thunderstorm") {
            document.querySelector("#icon-"+i).classList.remove("hide");
            document.querySelector("#icon-"+i).src = thunderImgSrc;
        } else if (data.daily[i].weather[0].main === "Drizzle") {
            document.querySelector("#icon-"+i).classList.remove("hide");
            document.querySelector("#icon-"+i).src = rainImgSrc;
        } else if (data.daily[i].weather[0].main === "Snow") {
            document.querySelector("#icon-"+i).classList.remove("hide");
            document.querySelector("#icon-"+i).src = snowImgSrc;
        } else if (data.daily[i].weather[0].main === "Rain") {
            document.querySelector("#icon-"+i).classList.remove("hide");
            document.querySelector("#icon-"+i).src = rainImgSrc;
        } else if (data.daily[i].weather[0].main === "Clouds") {
            document.querySelector("#icon-"+i).classList.remove("hide");
            document.querySelector("#icon-"+i).src = cloudImgSrc;
        }
    }
}

// Local storage
var addSearchHistory = function(zipCode) {
    searchHistory.cityOne.push(zipCode);
    localStorage.setItem("history", JSON.stringify(searchHistory));
}

var loadSearchHistory = function() {
    if (localStorage.getItem("history")) {
        searchHistory = JSON.parse(localStorage.getItem("history"));

        while (searchHistory.cityOne.length > 5) {
            searchHistory.cityOne.shift();
        }

        var historyToBeDisplayed = searchHistory.cityOne.reverse();
        displaySearchHistory(historyToBeDisplayed);
    }
}

// Display search history
var displaySearchHistory = function(history) {
    for (let i = 0; i < history.length; i++) {

        var historyButtonOne = document.querySelector("#history-btn-one");
        var historyButtonTwo = document.querySelector("#history-btn-two");
        var historyButtonThree = document.querySelector("#history-btn-three");
        var historyButtonFour = document.querySelector("#history-btn-four");
        var historyButtonFive = document.querySelector("#history-btn-five");

        var historyButtonArr = [historyButtonOne, historyButtonTwo, historyButtonThree, historyButtonFour, historyButtonFive];

        historyButtonArr[i].textContent = history[i];

    }
} 

// Listen for form submission
cityFormEl.addEventListener("submit", captureForm);

// Listen for history btn click
searchHistoryEl.addEventListener("click", function(event) {
    getLatAndLon(event.target.textContent)
});

displayHeaders();
loadSearchHistory();

// Update current date every half hour
setInterval(function() {
    getCurrentDate();
    displayHeaders();
}, (1000 * 60) * 30)