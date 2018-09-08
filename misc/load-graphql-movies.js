const {
  getGraphQLMovie,
  getToken,
  getURL
} = require('./misc-utils');
const { graphqlReq } = require('../src/utils');

const loadGraphQLMovies = async () => {
  const url = getURL('/movies/graphql');
  const token = await getToken();

  for (let i = 0; i < 5; i++) {
    const movie = getGraphQLMovie();
    const query = `mutation CreateMovie($movie: CreateMovieInput) {
      createMovie(movie: $movie) {
        title
      }
    }`;
    const document = {
      query,
      variables: {
        movie
      }
    };
    const opts = {
      headers: {
        Authorization: token
      }
    };
    const res = await graphqlReq(url, document, opts);

    console.log('~~~ res', JSON.stringify(res, null, 2));
  }
};
module.exports.loadGraphQLMovies = loadGraphQLMovies;

if (!module.parent) {
  loadGraphQLMovies();
}

