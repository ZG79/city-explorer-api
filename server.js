"use strict";
//this package reads env files,config methos is to process the file and adds them to the process.evc obj
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const weatherData = require("./data.json");
const axios = require("axios");

//initialize express
const app = express();
//middleware to allow open access with cors. It will be executed for each incoming request to the application
app.use(cors());
const PORT = process.env.PORT;
app.get("/", (req, res) => res.status(200).send("Default route is working"));

app.get('/weather', getWeather);

async function getWeather(req, res, next) {
  try {
    const { lat, lon } = req.query;
    const urlApi = `http://api.weatherbit.io/v2.0/forecast/daily/?lat=${lat}&key=${process.env.WEATHER_API_KEY}&lon=${lon}`;
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

app.get('/movie', getMovie);

async function getMovie (req,res){
  const {query} = req.query;
  const movieApi = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&query=${query}`;
  const movieResponse = await axios.get(movieApi);
  let formatted = movieResponse.data.results.map(element=> new MyMovie (element));
  res.status(200).send(formatted);
}

class MyMovie {
  constructor(movieObj){
    this.name = movieObj.original_title;
    this.overview = movieObj.overview;
    this.popularity = movieObj.popularity;
    this.release_date = movieObj.release_date;
  }
}




//http://localhost:3001/weatherData
// app.get("/weatherData", (req, res, next) => {
//   try {
//     let { searchQuery } = req.query;
//     const cityData = weatherData.find((city) => city.city_name === searchQuery);
//     const formattedData = cityData.data.map((obj) => {
//       return new Forecast(obj);
//     });

//     res.status(200).send(formattedData);
//   } catch (error) {
//     next(error);
//   }
// });
// class Forecast {
//   constructor(obj) {
//     this.date = obj.valid_date;
//     this.description = obj.weather.description;
//     this.highTemp = obj.high_temp;
//     // this.icon = obj.weather.icon;
//   }
// }

app.get("*", (req, res) => {
  res.status(404).send("Something went wrong");
});

app.use((error, req, res, next) => {
  res.status(500).send(error.message);
});

app.listen(PORT, () => console.log(`listening on ${PORT}`));
