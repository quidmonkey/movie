const fetch = require('node-fetch');
const fs = require('fs');
const https = require('https');

const loadMovies = () => {
  const agent = new https.Agent({
    ca: fs.readFileSync('auth/cert.pem'), 
  });
  const file = fs.readFileSync('movies.json', 'utf8');
  const { movies } = JSON.parse(file);

  movies.forEach(async (movie) => {
    const opts = {
      method: 'POST',
      body: JSON.stringify(movie),
      agent
    };
    
    await fetch('https://localhost:3000/movies', opts);
  });
};
module.exports.loadMovies = loadMovies;

if (!module.parent) {
  loadMovies();
}
