require("dotenv").config();
const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const _ = require("lodash");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded( {extended: true} ));

// Allow server to use public CSS stylesheet
app.use(express.static("public"));

app.get("/", function(req,res) {
  res.render("index", {
    page: "index"
  });
});

app.get("/contact", function(req, res) {
  res.render("contact", {
    page: "contact"
  });
})

app.post("/", function(req,res){
  const apiKey = process.env.API_KEY;
  const query = req.body.cityName;
  console.log(query);
  const url = "https://api.openweathermap.org/data/2.5/weather?appid=" + apiKey + "&q=" + query + "&units=metric";
  https.get(url, function(response) {
    if (response.statusCode !== 200) {
      // res.sendStatus(response.statusCode)
      res.render("error", {
        page: "error"
      });
    } else {
      response.on("data", function(data) {
        const weatherData = JSON.parse(data);
        console.log(weatherData);
        const location = weatherData.name + ", " + weatherData.sys.country;
        const weatherDescription = weatherData.weather[0].description;  /* Lodash this for Capital Letters */
        const localTemp = weatherData.main.temp;
        const localTempFeelsLike = weatherData.main.feels_like;
        const windSpeed = weatherData.wind.speed;
        const weatherIcon = weatherData.weather[0].icon;
        const weatherIconUrl = "http://openweathermap.org/img/wn/" + weatherIcon + "@2x.png";

        res.render("result", {
          weatherDescription: _.startCase(weatherDescription),
          localTemp: localTemp,
          localTempFeelsLike: localTempFeelsLike,
          windSpeed: Math.round(windSpeed * 3.6),/* meters/second -> km/hour*/
          weatherIconUrl: weatherIconUrl,
          location: location,
          page: "result"
        });
      });
    };
  });
});

app.listen(3000, function() {
  console.log("Server is running on port 3000")
});
