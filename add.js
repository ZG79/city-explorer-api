function getWeather(req, res, next) {
  const { lat, lon } = req.query;
  const urlApi = `http://api.weatherbit.io/v2.0/forecast/daily/?lat=${lat}&key=${process.env.WEATHER_API_KEY}&lon=${lon}&days=5`;
  axios.get(urlApi)
    .then(response => response.data.data.map(element => new MyWeather(element)))
    .then(data => res.status(200).send(data))
    .catch(err => next(err));
}