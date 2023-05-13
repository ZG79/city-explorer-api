'use strict';

const axios = require('axios');

function getWeather(req, res, next) {
  const { lat, lon } = req.query;
  const urlApi = `http://api.weatherbit.io/v2.0/forecast/daily/?lat=${lat}&key=${process.env.WEATHER_API_KEY}&lon=${lon}&days=5`;
  axios.get(urlApi)
    .then(response=>response.data.data.map(element => new MyWeather(element))
      .then(format => res.status(200).send(format))
      .catch(err=>next(err))
    );
}

class MyWeather {
  constructor(weatherObj) {
    this.date = weatherObj.valid_date;
    this.description = weatherObj.weather.description;
    this.highTemp = weatherObj.high_temp;
  }
}

module.exports = getWeather;
