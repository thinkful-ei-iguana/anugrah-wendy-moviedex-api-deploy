/* eslint-disable quotes */
require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const MOVIEDEX = require("./movies.js");
const app = express();
const morganSetting = process.env.NODE_ENV === 'production' ? 'tiny' : 'common'

app.use(morgan(morganSetting));
app.use(helmet());
app.use(cors());

app.use(function validateBearerToken(req, res, next) {
  const apiToken = process.env.API_TOKEN;
  const authToken = req.get("Authorization");

  if (!authToken || authToken.split(" ")[1] !== apiToken) {
    return res.status(401).json({ error: "DENIED!" });
  }
  next();
});

app.get("/movie", function handleGenreTypes(req, res) {
  const { genre, country, avg_vote } = req.query;
  let response = MOVIEDEX;

  if (genre) {
    response = response.filter(movie =>
      movie.genre.toLowerCase().includes(genre.toLowerCase())
    );
  }
  if (country) {
    response = response.filter(movie =>
      movie.country.toLowerCase().includes(country.toLowerCase())
    );
  }
  if (avg_vote) {
    response = response.filter(
      movie => Number(movie.avg_vote) >= Number(avg_vote)
    );
  }
  res.json(response);
});
const PORT = process.env.PORT || 8000;

app.listen(PORT);
