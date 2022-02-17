var welcomeEl = document.querySelector("#welcome");

// Display welcome in header
var displayHeader = function() {
    // Get date
    var currentDate = moment().format("dddd, MMMM Do YYYY");

    welcomeEl.textContent = "Welcome! Today is " + currentDate + ".";
};

displayHeader();