const { createMovie, getMovieModel, getURL } = require('./test-utils');
const { req } = require('./utils');

require('./delete');

it('/delete - should delete a movie', async () => {
  const movieModel = getMovieModel();
  const { token } = await createMovie(movieModel);

  const { title } = movieModel;
  const url = getURL(`/movies/${title}`);
  const opts = {
    method: 'DELETE',
    headers: {
      Authorization: token
    }
  };

  const expected = 'Delete successful.';
  const actual = await req(url, opts);

  expect(actual).toEqual(expected);
});
