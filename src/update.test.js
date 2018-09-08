const faker = require('faker');

const { getMockMovie } = require('./test-utils');
const { update } = require('./update');

it('update - should update a movie record', async () => {
  const movie = getMockMovie();
  const title = faker.random.word();
  const event = {
    body: JSON.stringify(movie),
    pathParameters: {
      title
    }
  };
  const res = await update(event);

  expect(res.statusCode).toBe(200);

  const expected = Object.keys(movie).concat('updatedAt').sort();
  const actual = Object.keys(JSON.parse(res.body)).sort();

  expect(actual).toEqual(expected);
});

it('update - should fail on an invalid request', async () => {
  const movie = {};
  const title = faker.random.word();
  const event = {
    body: JSON.stringify(movie),
    pathParameters: {
      title
    }
  };
  const res = await update(event);

  expect(res.statusCode).toBe(400);
  expect(res.body).toEqual('Validation Failed - Incorrect Movie Data Model.');
});

it('update - should fail on a DynamoDB error', async () => {
  const movie = getMockMovie();
  console.log('~~~ movie', movie);
  const title = 'error';
  const event = {
    body: JSON.stringify(movie),
    pathParameters: {
      title
    }
  };
  const res = await update(event);

  expect(res.statusCode).toBe(501);
  expect(res.body).toEqual('Couldn\'t update the movie.');
});
