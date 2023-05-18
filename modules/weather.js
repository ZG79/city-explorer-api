'use strict';

const axios = require('axios');
let cache = require('./cache');

function getWeather(req, res, next) {
  const key = 'weather-' + lat + lon;
  const { lat, lon } = req.query;
  const urlApi = `http://api.weatherbit.io/v2.0/forecast/daily/?lat=${lat}&key=${process.env.WEATHER_API_KEY}&lon=${lon}&days=5`;

  if (cache[key]&&(Date.now() - cache[key].timestamp<50000)){
    console.log('Cache hit');
  }else{
    console.log('Cache miss');
    cache[key]={};
    cache[key].timestamp = Date.now();
    cache[key].data = 
    axios.get(urlApi)
      .then(response => response.data.data.map(element => new MyWeather(element)))
    //add local json instead of API (8-12)
      .then(data => res.status(200).send(data))
      .catch(err => next(err));
  }
}

class MyWeather {
  constructor(weatherObj) {
    this.date = weatherObj.valid_date;
    this.description = weatherObj.weather.description;
    this.highTemp = weatherObj.high_temp;
    this.icon = weatherObj.weather.icon;
  }
}

module.exports = getWeather;
