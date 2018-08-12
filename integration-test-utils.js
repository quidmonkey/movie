const fs = require('fs');

const { req } = require('./movies/utils');

const origin = 'https://localhost:3000';
module.exports.origin = origin;

const file = fs.readFileSync('movies.json', 'utf8');
const { movies } = JSON.parse(file);
module.exports.movies = movies;

const createMovie = async (movieModel) => {
  const token = await getToken();
  const url = getURL('/movies');
  const opts = {
    method: 'POST',
    body: JSON.stringify(movieModel),
    headers: {
      Authorization: token
    }
  };

  const movie = await req(url, opts);

  return { movie, token };
};
module.exports.createMovie = createMovie;

const getMovieModel = () => {
  const i = Math.floor(Math.random() * movies.length);
  return {...movies[i]};  // clone
};
module.exports.getMovieModel = getMovieModel;

const getToken = async () => {
  const { user } = await getUser();
  const url = getURL('/movies/token');
  const opts = {
    method: 'POST',
    body: JSON.stringify(user)
  };
  const { token } = await req(url, opts);

  return token;
};
module.exports.getToken = getToken;

const getURL = (uri) => {
  return `${origin}${uri}`;
};
module.exports.getURL = getURL;

const getUser = async () => {
  const user = {
    username: Date.now().toString(),
    password: Date.now().toString()
  };
  const url = getURL('/movies/user');
  const opts = {
    method: 'POST',
    body: JSON.stringify(user)
  };
  const res = await req(url, opts);

  return { res, user };
};
module.exports.getUser = getUser;
