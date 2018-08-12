const { createMovie, getMovieModel, getToken, getURL, movies } = require('./test-utils');
const { req, RequestError } = require('./utils');

require('./list');

it('/list - should get all movies', async () => {
  // set longer jest timeout for this test
  // as 5000 ms is the default
  jest.setTimeout(10000);

  for (const movie of movies) {
    await createMovie(movie);
  }

  const token = await getToken();
  const url = getURL('/movies');
  const opts = {
    headers: {
      Authorization: token
    }
  };

  const res = await req(url, opts);

  const expected = movies.length;
  const actual = res.length;

  expect(actual).toBe(expected);

  for (const record of res) {
    const match = movies.find((movie) => movie.title === record.title);

    expect(match).toBeDefined();
  }
});

it('/list - should fail on an incorrect DynamoDb call', async () => {
  process.env.DYNAMODB_MOVIES_TABLE = 'foobar';
  
  const movieModel = getMovieModel();
  const { token } = await createMovie(movieModel);
  const url = getURL('/movies');
  const opts = {
    headers: {
      Authorization: token
    }
  };

  try {
    await req(url, opts);
  } catch(err) {
    expect(err).toBeInstanceOf(RequestError);
    expect(err.statusCode).toBe(501);
    expect(err.message).toBe('Couldn\'t fetch any movies.');
  }
});
