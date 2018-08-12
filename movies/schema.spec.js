const { getToken, getURL } = require('./test-utils');
const { req, RequestError } = require('./utils');

require('./schema');

it('/schema - should get the movies table schema', async () => {
  const token = await getToken();
  const url = getURL('/movies/schema');
  const opts = {
    headers: {
      Authorization: token
    }
  };
  const res = await req(url, opts);

  expect(res.table).toBeDefined();
  expect(res.table.tableName).toMatch('movies');
});

it('/schema - should fail on an incorrect DynamoDb call', async () => {
  process.env.DYNAMODB_MOVIES_TABLE = 'foobar';

  const token = await getToken();
  const url = getURL('/movies/schema');
  const opts = {
    headers: {
      Authorization: token
    }
  };

  try {
    await req(url, opts);
  } catch(err) {
    expect(err).toBe(RequestError);
    expect(err.statusCode).toBe(501);
    expect(err.message).toBe('Couldn\'t fetch table schema.');
  }
});
