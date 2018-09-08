const fetch = require('node-fetch');

const {
  getMovie,
  getOpts,
  getToken,
  getURL
} = require('./misc-utils');

const loadGraphQLMovies = async () => {
  const token = await getToken();

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

