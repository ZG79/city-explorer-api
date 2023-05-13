'use strict';

const axios = require('axios');

function getMovie (req,res,next){
  const {query} = req.query;
  const movieApi = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&query=${query}`;
  axios.get(movieApi)
    .then(response => response.data.results.map(element=>new MyMovie(element)).slice(0,5))
    .then(formatted =>res.status(200).send(formatted))
    .catch(err=>next(err));
}

class MyMovie {
  constructor(movieObj){
    this.name = movieObj.original_title;
    this.overview = movieObj.overview;
    this.popularity = movieObj.popularity;
    this.release_date = movieObj.release_date;
  }
}

module.exports = getMovie;

