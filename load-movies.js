const fetch = require('node-fetch');
const fs = require('fs');

const main = () => {
  const file = fs.readFileSync('movies.json', 'utf8')
  const { movies } = JSON.parse(file);

  movies.forEach(async (movie) => {
    const opts = {
      method: 'POST',
      body: JSON.stringify(movie)
    };
    
    await fetch('http://localhost:3000/movies', opts);
  });
};

main();
