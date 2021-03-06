const { getRandomMockedMovie } = require('./test-utils');
const { get } = require('./get');

it('get - should get a movie', async () => {
  const movie = getRandomMockedMovie();
  const event = {
    pathParameters: {
      title: movie.title
    }
  };
  const res = await get(event);

  expect(res.statusCode).toBe(200);
  expect(JSON.parse(res.body)).toEqual(movie);
});

it('get - should return a 404 if no movie is found', async () => {
  const event = {
    pathParameters: {
      title: 'foobar'
    }
  };
  const res = await get(event);

  expect(res.statusCode).toBe(404);
  expect(res.body).toBe('Movie not found.');
});

it('get - should fail on a DynamoDB error', async () => {
  const oldMoviesTable = process.env.DYNAMODB_MOVIES_TABLE;

  process.env.DYNAMODB_MOVIES_TABLE = 'error';
  
  const event = {
    pathParameters: {
      title: 'foobar'
    }
  };
  const res = await get(event);

  expect(res.statusCode).toBe(501);
  expect(res.body).toBe('Couldn\'t fetch the movie.');

  process.env.DYNAMODB_MOVIES_TABLE = oldMoviesTable;
});
