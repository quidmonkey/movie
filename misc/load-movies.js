const {
  getMovie,
  getToken,
  getURL
} = require('./misc-utils');

const { req } = require('../src/utils');

const loadMovies = async () => {
  const token = await getToken();
  const url = getURL('/movies');

  for (let i = 0; i < 5; i++) {
    const movie = getMovie();
    const opts = {
      method: 'POST',
      body: JSON.stringify(movie),
      headers: {
        Authorization: token
      }
    };
    
    const res = await req(url, opts);

    console.log('~~~ res', JSON.stringify(res, null, 2));
  }
};
module.exports.loadMovies = loadMovies;

if (!module.parent) {
  loadMovies();
}
