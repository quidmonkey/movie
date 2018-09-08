const { getMockMovie, mockMovieOne } = require('./test-utils');
const { create } = require('./create');

it('create - should create a movie', async () => {
  const event = {
    body: JSON.stringify(mockMovieOne)
  };
  const res = await create(event);

  expect(res.statusCode).toBe(200);

  const expected = Object.keys(mockMovieOne).concat(['id', 'createdAt', 'updatedAt']).sort();
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
  const movie = getMockMovie();
  movie.title = 'error';
  const event = {
    body: JSON.stringify(movie)
  };
  const res = await create(event);

  expect(res.statusCode).toBe(501);
  expect(res.body).toBe('Couldn\'t create the movie.');
});
