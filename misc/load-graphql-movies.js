const { argv } = require('yargs');
const faker = require('faker');
const fetch = require('node-fetch');
const fs = require('fs');
const https = require('https');

const { merge } = require('../src/utils');

const { domain } = argv;
const FORMATS = ['BLURAY', 'DVD', 'STREAMING'];

const getFormat = () => {
  const index = Math.floor(Math.random() * FORMATS.length);
  return FORMATS[index];
};
const getMovie = () => {
  return {
    title: faker.random.word(),
    format: getFormat(),
    length: `${Math.round(Math.random() * 999)} min`,
    releaseYear: 1900 + Math.round(Math.random() * 200),
    rating: 1 + Math.round(Math.random() * 4)
  };
};
const getOpts = (opts) => {
  const agent = new https.Agent({
    ca: fs.readFileSync('auth/cert.pem'), 
  });
  const httpsOpts = domain ? {} : { agent };

  return merge(opts, httpsOpts);
};
const getURL = (uri) => {
  const origin = domain || 'https://localhost:3000';
  return `${origin}${uri}`;
};

const loadGraphQLMovies = async () => {
  const user = {
    username: Date.now().toString(),
    password: Date.now().toString()
  };
  const opts = getOpts({
    method: 'POST',
    body: JSON.stringify(user)
  });

  const userRes = await fetch(getURL('/movies/user'), opts);
  console.log('~~~ userRes', await userRes.json());

  const tokenRes = await fetch(getURL('/movies/token'), opts);
  const { token } = await tokenRes.json();
  console.log('~~~ token', token);

  for (let i = 0; i < 5; i++) {
    const movie = getMovie();
    const query = `mutation CreateMovie($movie: CreateMovieInput) {
      createMovie(movie: $movie) {
        title
      }
    }`;
    const opts = getOpts({
      method: 'POST',
      body: JSON.stringify({
        query,
        variables: {
          movie
        }
      }),
      headers: {
        Authorization: token
      }
    });

    const movieRes = await fetch(getURL('/movies/graphql'), opts);
    console.log('~~~ movieRes', await movieRes.json());
  }
};
module.exports.loadGraphQLMovies = loadGraphQLMovies;

if (!module.parent) {
  loadGraphQLMovies();
}

