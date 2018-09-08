const faker = require('faker');

const del = require('./delete');

it('delete - should delete a movie', async () => {
  const event = {
    pathParameters: {
      title: faker.random.word()
    }
  };

  const res = await del.delete(event);

  expect(res.statusCode).toBe(200);
  expect(JSON.parse(res.body)).toBe('Delete successful.');
});

it('delete - should fail on a DynamoDB error', async () => {
  const event = {
    pathParameters: {
      title: 'error'
    }
  };

  const res = await del.delete(event);

  expect(res.statusCode).toBe(501);
  expect(res.body).toBe('Couldn\'t remove the movie.');
});
