'use strict'

const axios = require('axios');

async function getWeather(req, res, next) {
  try {
    const { lat, lon } = req.query;
    const urlApi = `http://api.weatherbit.io/v2.0/forecast/daily/?lat=${lat}&key=${process.env.WEATHER_API_KEY}&lon=${lon}&days=5`;
    const apiResponse = await axios.get(urlApi);
    const format = apiResponse.data.data.map(
      (element) => new MyWeather(element)
    );
    console.log(apiResponse.data);
    res.status(200).send(format);
  } catch (error) {
    next(error);
  }
}

class MyWeather {
  constructor(weatherObj) {
    this.date = weatherObj.valid_date;
    this.description = weatherObj.weather.description;
    this.highTemp = weatherObj.high_temp;
  }
}

module.export = getWeather;
