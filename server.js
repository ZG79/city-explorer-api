'use strict';
//this package reads env files,config methos is to process the file and adds them to the process.evc obj
require('dotenv').config();
const express = require('express');
const cors = require('cors');
// const weatherData = require("./data.json");

const getMovie = require('./modules/movies');
const getWeather = require('./modules/weather');
//initialize express
const app = express();
//middleware to allow open access with cors. It will be executed for each incoming request to the application
app.use(cors());
const PORT = process.env.PORT;

//check if the server is working
app.get('/', (req, res) => res.status(200).send('Default route is working'));

app.get('/weather', getWeather);

app.get('/movie', getMovie);

app.get('*', (req, res) => {
  res.status(404).send('Something went wrong');
});

app.use((error, req, res) => {
  res.status(500).send(error.message);
});

app.listen(PORT, () => console.log(`listening on ${PORT}`));
