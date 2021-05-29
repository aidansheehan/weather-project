require("dotenv").config();
const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded( {extended: true} ));

// Allow server to use public CSS stylesheet
app.use(express.static("public"));

app.get("/", function(req,res) {
  res.render("index");
});

app.post("/", function(req,res){
  const apiKey = process.env.API_KEY;
  const query = req.body.cityName;
  console.log(query);
  const url = "https://api.openweathermap.org/data/2.5/weather?appid=" + apiKey + "&q=" + query + "&units=metric";
  https.get(url, function(response) {
    console.log(response.statusCode);
    response.on("data", function(data) {
      const weatherData = JSON.parse(data);
      const location = weatherData.name;
      const weatherDescription = weatherData.weather[0].description;
      const localTemp = weatherData.main.temp;
      const weatherIcon = weatherData.weather[0].icon;
      const weatherIconUrl = "http://openweathermap.org/img/wn/" + weatherIcon + "@2x.png";

      res.render("result", {
        weatherDescription: weatherDescription,
        localTemp: localTemp,
        weatherIconUrl: weatherIconUrl,
        location: location
      });
    })
  })
});


app.listen(3000, function() {
  console.log("Server is running on port 3000")
});
