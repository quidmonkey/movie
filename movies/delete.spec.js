const { createMovie, getMovieModel, getToken, getURL } = require('./test-utils');
const { req, RequestError } = require('./utils');

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

  const expected = {};
  const actual = await req(url, opts);

  expect(actual).toEqual(expected);
});

it('/delete - should fail on a non-existant movie', async () => {
  const token = await getToken();
  const title = 'foobarbaz';
  const url = getURL(`/movies/${title}`);
  const opts = {
    method: 'DELETE',
    headers: {
      Authorization: token
    }
  };

  try {
    await req(url, opts);
  } catch(err) {
    expect(err).toBeInstanceOf(RequestError);
    expect(err.statusCode).toBe(501);
    expect(err.message).toBe('Couldn\'t remove the movie.');
  }
});
