const { mockMovieList } = require('./test-utils');
const { list } = require('./list');

it('list - should get a list of movies', async () => {
  const event = {};
  const res = await list(event);

  expect(res.statusCode).toBe(200);
  expect(JSON.parse(res.body)).toEqual(mockMovieList);
});

it('list - should get a list of sorted movies', async () => {
  const event = {
    queryStringParameters: {
      sort: true
    }
  };
  const res = await list(event);

  expect(res.statusCode).toBe(200);

  const expected = mockMovieList.slice().sort();
  const actual = JSON.parse(res.body).sort();

  expect(actual).toEqual(expected);
});

it('list - should fail on a DynamoDB error', async () => {
  const oldMoviesTable = process.env.DYNAMODB_MOVIES_TABLE;
  
  process.env.DYNAMODB_MOVIES_TABLE = 'error';

  const event = {};
  const res = await list(event);

  expect(res.statusCode).toBe(501);
  expect(res.body).toEqual('Couldn\'t fetch any movies.');

  process.env.DYNAMODB_MOVIES_TABLE = oldMoviesTable;
});

