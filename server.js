
'use strict';
//this package reads env files,config methos is to process the file and adds them to the process.evc obj
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const weatherData = require('./data.json');
//initialize express
const app = express();
//middleware to allow open access with cors. It will be executed for each incoming request to the application
app.use(cors());
const PORT = process.env.PORT;
app.get('/', (req,res)=>(
  res.status(200).send('Default route is working')
));
//http://localhost:3001/weatherData
app.get('/weatherData',(req,res, next)=>{

  try{
    const {searchQuery} = req.query;
    const cityData = weatherData.find(city=>city.city_name===searchQuery);
    const formattedData = cityData.data.map(obj=>{
      return new Forecast(obj);
    });

    res.status(200).send(formattedData);
  } catch (error){
    next(error);
  }
  // if (searchQuery === 'Seattle'){
  //   const formattedData = weatherData[0].data.map(obj=>{
  //     return new Forecast(obj);
  //   });
  //   console.log(formattedData);
  //   res.status(200).send(formattedData);
  // }
  // else if (searchQuery === 'Paris'){
  //   res.status(200).send(weatherData[1]);
  // }
  // else if (searchQuery === 'Amman'){
  //   res.status(200).send(weatherData[2]);
  //   console.log(weatherData[2].city_name);
  // }
});
class Forecast {
  constructor(obj){
    this.date = obj.valid_date;
    this.description=obj.weather.description;
  }
}

app.get('*',(req,res)=>{
  res.status(404).send('Something went wrong');
});

app.use((error,req,res,next)=>{
  res.status(500).send(error.message);
});

app.listen(PORT, ()=>console.log(`listening on ${PORT}`));
