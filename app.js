require("appdynamics").profile({
    controllerHostName: 'marilyn202102100247234.saas.appdynamics.com',
    controllerPort: 443,
    
    // If SSL, be sure to enable the next line
    controllerSslEnabled: true,
    accountName: 'marilyn202102100247234',
    accountAccessKey: '061a0z4u9bkf',
    applicationName: 'weather',
    tierName: 'weathertier',
    nodeName: 'process' // The controller will automatically append the node name with a unique number
   });

require('dotenv').config();
const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");


const app = express();
//In order to get inputs from post methods
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
 res.sendFile(__dirname + "/index.html");
});

app.post("/", function (req, res) {
 const query = req.body.cityName;
 const unit = "metric";
 const apikey = process.env.API_KEY;
 const options = {
  "method": "GET",
  "hostname": "community-open-weather-map.p.rapidapi.com",
  "port": null,
  "path": "/weather?id=2172797&units=" + unit + "&q=" + query,
  "headers": {
   "x-rapidapi-host": "community-open-weather-map.p.rapidapi.com",
   "x-rapidapi-key": apikey
  }
 };
 https.get(options, function (response) {
  //console.log(response);
  console.log(response.statusCode);
  response.on("data", function (data) {
   //converts string objects into javascript objects
   const weatherData = JSON.parse(data)
   //console.log(weatherData);
   const temp = weatherData.main.temp
   const weatherDescription = weatherData.weather[0].description
   const icon = weatherData.weather[0].icon
   //https://openweathermap.org/weather-conditions
   const imageUrl = "http://openweathermap.org/img/wn/" + icon + "@2x.png"
   res.write("<p>The weather is currently " + weatherDescription + "</p>");
   res.write("<h1>The Temperature in " + query + "is " + temp + "degree celsius.</h1>");
   res.write("<img src=" + imageUrl + ">");
   res.send();
  });
 });
});

app.listen(3000, function () {
 console.log("server is running on port 3000");
});





