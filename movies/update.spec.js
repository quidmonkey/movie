const { createMovie, getMovieModel, getToken, getURL } = require('./test-utils');
const { merge, req, RequestError } = require('./utils');

require('./update');

it('/update - should update a movie record', async () => {
  const movieModel = getMovieModel();
  const { title } = movieModel;

  const { token } = await createMovie(movieModel);
  const url = getURL(`/movies/${title}`);
  const updatedMovieModel = merge(movieModel, { 
    rating: Math.ceil(Math.random() * 5)
  });
  delete updatedMovieModel.title;
  const opts = {
    method: 'PUT',
    body: JSON.stringify(updatedMovieModel),
    headers: {
      Authorization: token
    }
  };
  const res = await req(url, opts);

  Object.entries(updatedMovieModel)
    .forEach(([key, value]) => {
      const expected = value;
      const actual = res[key];

      expect(actual).toEqual(expected);
    });
});

it('/update - should fail on a bad movie model', async () => {
  const title = 'bazqux';
  const token = await getToken();
  const url = getURL(`/movies/${title}`);
  const opts = {
    method: 'PUT',
    body: '',
    headers: {
      Authorization: token
    }
  };
  try {
    await req(url, opts);
  } catch(err) {
    expect(err).toBeInstanceOf(RequestError);
    expect(err.statusCode).toBe(400);
    expect(err.message).toBe('Validation Failed - Incorrect Movie Data Model.');
  }
});

it('/update - should fail on an incorrect DynamoDb call', async () => {
  process.env.DYNAMODB_MOVIES_TABLE = 'foobar';

  const movieModel = getMovieModel();
  const { title } = movieModel;

  const { token } = await createMovie(movieModel);
  const url = getURL(`/movies/${title}`);
  const updatedMovieModel = merge(movieModel, { 
    rating: Math.ceil(Math.random() * 5)
  });
  delete updatedMovieModel.title;
  const opts = {
    method: 'PUT',
    body: JSON.stringify(updatedMovieModel),
    headers: {
      Authorization: token
    }
  };
  
  try {
    await req(url, opts);
  } catch(err) {
    expect(err).toBeInstanceOf(RequestError);
    expect(err.statusCode).toBe(501);
    expect(err.message).toBe('Couldn\'t update the movie.');
  }
});
