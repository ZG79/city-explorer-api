'use strict';

const axios = require('axios');
let cache = require('./cache');



function getWeather(res, req, next) {
  const { lat, lon } = req.query;
  const key = 'weather-' + lat + lon;

  const urlApi = `http://api.weatherbit.io/v2.0/forecast/daily/?lat=${lat}&key=${process.env.WEATHER_API_KEY}&lon=${lon}&days=5`;

  // Create an empty object to store the cache data
  cache[key] = {};

  try {
    if (cache[key] && (Date.now() - cache[key].timestamp < 50000)) {
      console.log('Cache hit');
      res.status(200).send(cache[key].data);
    } else {
      console.log('Cache miss');
      const formattedData = axios.get(urlApi).then(response => response.data.data.map(element => new MyWeather(element)));
      // Creating an object to save it in the cache.
      cache[key].timestamp = Date.now();
      cache[key].data = formattedData;
      res.status(200).send(formattedData);
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
}

// function getWeather(res, req, next) {
//   const { lat, lon } = req.query;
//   const key = 'weather-' + lat + lon;

//   const urlApi = `http://api.weatherbit.io/v2.0/forecast/daily/?lat=${lat}&key=${process.env.WEATHER_API_KEY}&lon=${lon}&days=5`;

//   if (cache[key]&&(Date.now() - cache[key].timestamp<50000)){
//     console.log('Cache hit');
//     res.status(200).send(cache[key].data);
//   }else{
//     console.log('Cache miss');
//     const formattedData = axios.get(urlApi).then(response => response.data.data.map(element => new MyWeather(element)));
//     //Creating an object to save it in the cache.
//     cache[key]={};
//     cache[key].timestamp = Date.now();
//     cache[key].data = formattedData;
//     res.status(200).send(formattedData);
//   }
//   .catch((err) => next(err));
// }

class MyWeather {
  constructor(weatherObj) {
    this.date = weatherObj.valid_date;
    this.description = weatherObj.weather.description;
    this.highTemp = weatherObj.high_temp;
    this.icon = weatherObj.weather.icon;
  }
}

module.exports = getWeather;
