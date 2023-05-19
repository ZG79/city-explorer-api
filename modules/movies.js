'use strict';

const axios = require('axios');
let cache = require('./cache');

async function getMovie (req, res, next){
  const {query} = req.query;
  // console.log('query===', query);
  const key = 'movie-' + query;
  // console.log('key====', key);
  const movieApi = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&query=${query}`;

  if (cache[key] && (Date.now() - cache[key].timestamp<50000)){
    console.log('Cache hit');
  }else{
    console.log('Cache miss');
    cache[key]={};
    cache[key].timestamp=Date.now();
    let result = await axios.get(movieApi);
    console.log(result.data.results);

    try {
      cache[key].data = result.data.results.filter(element=>element.popularity > 8 && (element.poster_path));
      let movieData = cache[key].data;

      let dataToSend = movieData.map(element => new MyMovie(element)).slice(0,5);
      res.status(200).send(dataToSend);
    } catch (err) {
      next(err);
    }
    //   .then(response => {
    //     const movies = response.data.results.filter(element=>element.popularity > 8 && (element.poster_path));
    //     console.log('movies-', movies);
    //     return movies;
    //   });
    // cache[key]={};
    // cache[key].timestamp=Date.now();
    // cache[key].data = axios.get(movieApi).then(response =>response.data.results.map(element=>new MyMovie(element)).slice(0,5));
  }
}

// return cache[key].data;


// axios.get(movieApi)
//   .then(response => {
//     const movies = response.data.results.filter(element=>element.popularity > 8&&(element.poster_path));
//     console.log(movies);
//     return movies;
//   })
//   .then(movies=>movies.map(element=>new MyMovie(element)).slice(0,5))
//   .then(formatted =>res.status(200).send(formatted))
//   .catch(err=>next(err));


class MyMovie {
  constructor(movieObj){
    this.name = movieObj.original_title;
    this.overview = movieObj.overview;
    this.popularity = movieObj.popularity;
    this.release_date = movieObj.release_date;
    this.poster = movieObj.poster_path;
  }
}

module.exports = getMovie;

