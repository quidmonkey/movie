const fetch = require('node-fetch');
const fs = require('fs');
const https = require('https');

const loadMovies = async () => {
  const agent = new https.Agent({
    ca: fs.readFileSync('auth/cert.pem'), 
  });
  const file = fs.readFileSync('movies.json', 'utf8');
  const { movies } = JSON.parse(file);
  const user = {
    username: Date.now().toString(),
    password: Date.now().toString()
  };
  const opts = {
    method: 'POST',
    body: JSON.stringify(user),
    agent
  };

  await fetch('https://localhost:3000/movies/user', opts);

  const tokenRes = await fetch('https://localhost:3000/movies/token', opts);
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
    
    await fetch('https://localhost:3000/movies', opts);
  });
};
module.exports.loadMovies = loadMovies;

if (!module.parent) {
  loadMovies();
}
