const fetch = require('node-fetch');

const {
  getMovie,
  getOpts,
  getToken,
  getURL
} = require('./misc-utils');

const loadMovies = async () => {
  const token = await getToken();

  for (let i = 0; i < 5; i++) {
    const movie = getMovie();
    const opts = getOpts({
      method: 'POST',
      body: JSON.stringify(movie),
      headers: {
        Authorization: token
      }
    });
    
    const movieRes = await fetch(getURL('/movies'), opts);
    console.log('~~~ movieRes', await movieRes.json());
  }
};
module.exports.loadMovies = loadMovies;

if (!module.parent) {
  loadMovies();
}
