const { getMockMovie, getRandomMockedMovie } = require('./test-utils');
const { create } = require('./create');

it('create - should create a movie', async () => {
  const movie = getRandomMockedMovie();
  const event = {
    body: JSON.stringify(movie)
  };
  const res = await create(event);

  expect(res.statusCode).toBe(200);

  const expected = Object.keys(movie).concat(['id', 'createdAt', 'updatedAt']).sort();
  const actual = Object.keys(JSON.parse(res.body)).sort();

  expect(actual).toEqual(expected);
});

it('create - should fail on an invalid request', async () => {
  const movie = getMockMovie();
  const event = {
    body: JSON.stringify(movie)
  };
  const res = await create(event);

  expect(res.statusCode).toBe(400);
  expect(res.body).toBe('Validation Failed - Incorrect Movie Data Model.');
});

it('create - should fail on a DynamoDB error', async () => {
  const oldMoviesTable = process.env.DYNAMODB_MOVIES_TABLE;

  process.env.DYNAMODB_MOVIES_TABLE = 'error';
  
  const movie = getRandomMockedMovie();
  const event = {
    body: JSON.stringify(movie)
  };
  const res = await create(event);

  expect(res.statusCode).toBe(501);
  expect(res.body).toBe('Couldn\'t create the movie.');

  process.env.DYNAMODB_MOVIES_TABLE = oldMoviesTable;
});
