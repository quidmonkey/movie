const {
  createMovie,
  getMovieModel,
  getToken,
  getURL,
  movies
} = require('./test-utils');
const { req, RequestError, sortMovies } = require('./utils');

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

it('/list - should get all movies and sort them based on a given attribute', async () => {
  // set longer jest timeout for this test
  // as 5000 ms is the default
  jest.setTimeout(10000);

  for (const movie of movies) {
    await createMovie(movie);
  }

  const token = await getToken();
  const sortAttr = 'title';
  const url = getURL(`/movies?sort=${sortAttr}`);
  const opts = {
    headers: {
      Authorization: token
    }
  };

  const expected = sortMovies(movies, sortAttr);
  const actual = await req(url, opts);

  for (let i = 0; i < movies.length; i++) {
    expect(actual[i].title).toBe(expected[i].title);
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
