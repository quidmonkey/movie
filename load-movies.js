const { argv } = require('yargs');
const fetch = require('node-fetch');
const fs = require('fs');
const https = require('https');

const { merge } = require('./movies/utils');

const { domain } = argv;

const getURL = (uri) => {
  const origin = domain || 'https://localhost:3000';
  return `${origin}${uri}`;
};

const loadMovies = async () => {
  const agent = new https.Agent({
    ca: fs.readFileSync('auth/cert.pem'), 
  });
  const httpsOpts = domain ? {} : { agent };
  const file = fs.readFileSync('movies.json', 'utf8');
  const { movies } = JSON.parse(file);
  const user = {
    username: Date.now().toString(),
    password: Date.now().toString()
  };
  const opts = merge({
    method: 'POST',
    body: JSON.stringify(user)
  }, httpsOpts);

  await fetch(getURL('/movies/user'), opts);

  const tokenRes = await fetch(getURL('/movies/token'), opts);
  const { token } = await tokenRes.json();

  movies.forEach(async (movie) => {
    const opts = {
      method: 'POST',
      body: JSON.stringify(movie),
      agent,
      headers: {
        Authorization: token
      }
    };
    
    await fetch(getURL('/movies'), opts);
  });
};
module.exports.loadMovies = loadMovies;

if (!module.parent) {
  loadMovies();
}
