const fetch = require('node-fetch');
const fs = require('fs');
const https = require('https');

const main = () => {
  const agent = new https.Agent({
    rejectUnauthorized: false
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

main();
