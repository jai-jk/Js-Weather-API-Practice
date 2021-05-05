const express = require('express');
const https = require('https');
require('dotenv').config();
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.post('/', function (req, res) {
  const weatherApiKey = process.env.WEATHER_API_KEY;
  const query = req.body.cityName;
  const unit = 'metric';
  const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${weatherApiKey}&units=${unit}"`;

  https.get(weatherApiUrl, function (response) {
    console.log(response.statusCode);

    response.on('data', function (data) {
      const weatherData = JSON.parse(data);
      const temp = weatherData.main.temp;
      const weatherDesc = weatherData.weather[0].description;
      const icon = weatherData.weather[0].icon;
      const imageURL = `https://openweathermap.org/img/wn/${icon}@2x.png`;
      res.write(
        `<h1>The temperature in ${query} is ${temp} degrees Celcius.</h1>`
      );
      res.write(`<p>The weather is currently ${weatherDesc}.</p>`);
      res.write('<img src=' + imageURL + '>');
      res.send();
    });
  });
});

app.listen(3000, function () {
  console.log('Server is running on port 3000.');
});
