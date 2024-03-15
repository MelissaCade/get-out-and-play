//curl -X GET
// "https://developer.nps.gov/api/v1/parks?stateCode=CO&api_key=CIOhNHwWVZAX8YbB1U7TJWA0Q8aazIZthMXdZLmY"
// -H "accept: application/json"
//here we see that the key is a part of the url. I used a stateCode of "CO" here to test, but that can be exchanged for any two-character state code
//we can use "fullName" to get the name of the park
//we can use "description" for the description
//"latitude" and "longitude" can be used with the weather API to get local weather data
//alternately, "addresses.postalCode" can be used to get a five-digit postal code
//"images.url" will give a lovely .jpg of the park

//Code from jQueryUI to create a combobox to search through a dropdown menu
$(function () {
  $.widget("custom.combobox", {
    _create: function () {
      this.wrapper = $("<span>")
        .addClass("custom-combobox")
        .insertAfter(this.element);

      this.element.hide();
      this._createAutocomplete();
      this._createShowAllButton();
    },

    _createAutocomplete: function () {
      var selected = this.element.children(":selected"),
        value = selected.val() ? selected.text() : "";

      this.input = $("<input>")
        .appendTo(this.wrapper)
        .val(value)
        .attr("title", "")
        .addClass(
          "custom-combobox-input ui-widget ui-widget-content ui-state-default ui-corner-left"
        )
        .autocomplete({
          delay: 0,
          minLength: 0,
          source: this._source.bind(this),
        })
        .tooltip({
          classes: {
            "ui-tooltip": "ui-state-highlight",
          },
        });

      this._on(this.input, {
        autocompleteselect: function (event, ui) {
          ui.item.option.selected = true;
          this._trigger("select", event, {
            item: ui.item.option,
          });
        },

        autocompletechange: "_removeIfInvalid",
      });
    },

    _createShowAllButton: function () {
      var input = this.input,
        wasOpen = false;

      $("<a>")
        .attr("tabIndex", -1)
        .tooltip()
        .appendTo(this.wrapper)
        .button({
          icons: {
            primary: "ui-icon-triangle-1-s",
          },
          text: false,
        })
        .removeClass("ui-corner-all")
        .addClass("custom-combobox-toggle ui-corner-right")
        .on("mousedown", function () {
          wasOpen = input.autocomplete("widget").is(":visible");
        })
        .on("click", function () {
          input.trigger("focus");

          // Close if already visible
          if (wasOpen) {
            return;
          }

          // Pass empty string as value to search for, displaying all results
          input.autocomplete("search", "");
        });
    },

    _source: function (request, response) {
      var matcher = new RegExp(
        $.ui.autocomplete.escapeRegex(request.term),
        "i"
      );
      response(
        this.element.children("option").map(function () {
          var text = $(this).text();
          if (this.value && (!request.term || matcher.test(text)))
            return {
              label: text,
              value: text,
              option: this,
            };
        })
      );
    },

    _removeIfInvalid: function (event, ui) {
      // Selected an item, nothing to do
      if (ui.item) {
        return;
      }

      // Search for a match (case-insensitive)
      var value = this.input.val(),
        valueLowerCase = value.toLowerCase(),
        valid = false;
      this.element.children("option").each(function () {
        if ($(this).text().toLowerCase() === valueLowerCase) {
          this.selected = valid = true;
          return false;
        }
      });

      // Found a match, nothing to do
      if (valid) {
        return;
      }

      // Remove invalid value
      this.input
        .val("")
        .attr("title", value + " didn't match any item")
        .tooltip("open");
      this.element.val("");
      this._delay(function () {
        this.input.tooltip("close").attr("title", "");
      }, 2500);
      this.input.autocomplete("instance").term = "";
    },

    _destroy: function () {
      this.wrapper.remove();
      this.element.show();
    },
  });

  $("#combobox").combobox();
  $("#toggle").on("click", function () {
    $("#combobox").toggle();
  });
});

//Function to get data for national parks
function getParks() {
  let state = $("#combobox").val();

  fetch(
    `https://developer.nps.gov/api/v1/parks?stateCode=${state}&api_key=CIOhNHwWVZAX8YbB1U7TJWA0Q8aazIZthMXdZLmY`
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response unsuccessful");
      }
      return response.json();
    })
    .then((data) => {
      // console.log(data);
      let parkInfoRaw = JSON.stringify(data);
      localStorage.setItem("parkData", parkInfoRaw);

      $(".parkResults").remove();

      let parkInfoString = localStorage.getItem("parkData");
      let parkInfo = JSON.parse(parkInfoString);
      const parkInformation = parkInfo.data;
      console.log(parkInfo.data);
      createParkCard(parkInformation);
      // return parkInformation;
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

//Function to get data for weather
function getWeather(latitude, longitude) {
  fetch(``)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response unsuccessful");
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
      let weatherInfoRaw = JSON.stringify(data);
      localStorage.setItem("weatherData", weatherInfoRaw);

      let weatherInfoString = localStorage.getItem("weatherData");
      let weatherInfo = JSON.parse(weatherInfoString);
      return weatherInfo;
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

//Creates cards with park info and buttons
function createParkCard(parkInfo) {
  //Iterate through park info in array to create cards
  for (i = 0; i < parkInfo.length; i++) {
    const parkCell = $("<div>").addClass("col parkResults");
    const parkCard = $("<div>").addClass("card h-100");
    const cardImage = $("<img>").addClass("card-img-top");
    const cardBody = $("<div>").addClass("card-body");
    const cardTitle = $("<h3>").addClass("card-title");
    const cardText = $("<p>").addClass("card-text");
    const cardLinkBtn = $("<a>").addClass("btn btn-success").text("Learn More");
    const cardWeatherBtn = $("<a>")
      .addClass("btn btn-success")
      .text("Forecast");

    //Image will be populated from ping to park API
    let parkImage = parkInfo[i].images[0].url;
    let imageAlt = parkInfo[i].images[0].altText;
    cardImage.attr("src", `${parkImage}`).attr("alt", `${imageAlt}`);

    //Update the title with the name of the park pulled from the API
    let parkName = parkInfo[i].fullName;
    cardTitle.text(`${parkName}`);

    //Update the text with a short description of the park that cuts off if it's too long
    let description = parkInfo[i].description;
    let maxLength = 200;

    if (description.length > maxLength) {
      description = description.substring(0, maxLength) + "...";
    }

    cardText.text(description);

    //Event listener for weather button press
    cardWeatherBtn.on("click");

    //Park info button
    let parkSite = parkInfo[i].url;

    cardLinkBtn.attr("href", `${parkSite}`);

    //Weather button
    let latitude = parkInfo[i].latitude;
    let longitude = parkInfo[i].longitude;
    //Call weatherModal function and pass latitude and longitude values into function for forecast ping
    // weatherModal(latitude, longitude);

    //Append the cards to the body
    cardBody.append(cardTitle, cardText, cardLinkBtn, cardWeatherBtn);
    parkCard.append(cardImage, cardBody);
    parkCell.append(parkCard);
    parkCell.appendTo($("#parkGrid"));
  }
}

function weatherModal(latitude, longitude) {
  //Call weather API function to pull weather
  let weatherInfo = getWeather(latitude, longitude);

  //Create modal pop-up to house weather card group
  const weatherModal = $("<div>").addClass("modal").attr("tabindex", "-1");
  const modalDialog = $("<div>").addClass("modal-dialog modal-dialog-centered");
  const modalContent = $("<div>").addClass("modal-content");
  const modalHeader = $("<div>").addClass("modal-header");
  const modalTitle = $("<h4>")
    .addClass("modal-title text-center")
    .text("5-Day Forecast");
  const modalClose = $("<button>")
    .addClass("btn-close")
    .attr("data-bs-dismiss", "modal")
    .attr("aria-label", "Close");
  const modalBody = $("<div>").addClass("modal-body");
  //Create card group for 5-day forecast
  const forecastGroup = $("<div>").addClass("card-group");
  const forecastCard = $("<div>").addClass("card");
  const forecastIcon = $("<img>").addClass("card-img-top");
  const forecastBody = $("<div>").addClass("card-body");
  const forecastDate = $("<h5>").addClass("card-title");
  const forecastTemp = $("<p>").addClass("card-text");
  const forecastWind = $("<p>").addClass("card-text");
  const forecastHumid = $("<p>").addClass("card-text");

  //Pull postal code/latitude and longitude from park API to ping weather API for forecast

  //Pull weather information from API (date, temperature, windspeed, humidity) and populate body of card with info

  //Will have to change default (K) to Farenheit for temperature

  //if statement most likely needed for weather condition

  //Assign image based on weather conditions pulled from API

  //Append modal to HTML
  weatherModal.append(modalDialog);
  modalDialog.append(modalContent);
  modalContent.append(modalHeader, modalBody);
  modalHeader.append(modalTitle, modalClose);
  modalBody.append(forecastGroup);
}

//Create initialization function when page fully loads
$(document).ready(function () {
  $(".selectButton").on("click", getParks);
});
