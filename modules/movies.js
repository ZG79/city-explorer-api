"use strict";

const axios = require('axios');
let cache = require('./cache');

async function getMovie(req, res, next) {
  const { query } = req.query;
  // console.log('query===', query);
  const key = 'movie-' + query;
  // console.log('key====', key);
  const movieApi = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&query=${query}`;
  if (cache[key] && Date.now() - cache[key].timestamp < 50000) {
    console.log('Cache hit');
    res.status(200).send(cache[key].data);
  } else {
    console.log('Cache miss');
    axios
      .get(movieApi)
      .then((response) => {
        const movies = response.data.results.filter(
          (element) => element.popularity > 8 && element.poster
        ).then(movies=>movies.map(element=>new MyMovie(element)));
        cache[key] = {};
        cache[key].timestamp = Date.now();
        cache[key].data = movies;
        res.status(200).send(movies);
      })
      .catch((err) => next(err));
  }
}

class MyMovie {
  constructor(movieObj) {
    this.name = movieObj.original_title;
    this.overview = movieObj.overview;
    this.popularity = movieObj.popularity;
    this.release_date = movieObj.release_date;
    this.poster = movieObj.poster_path;
  }
}

module.exports = getMovie;
