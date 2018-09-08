const { mockTableSchema } = require('./test-utils');
const { schema } = require('./schema');

it('schema - should get the movies table schema', async () => {
  const res = await schema();

  expect(res.statusCode).toBe(200);
  
  const expected = mockTableSchema;
  const actual = JSON.parse(res.body);

  expect(actual).toEqual(expected);
});

it('schema - should fail on a DynamoDB error', async () => {
  const oldMoviesTable = process.env.DYNAMODB_MOVIES_TABLE;
  
  process.env.DYNAMODB_MOVIES_TABLE = 'error';

  const res = await schema();

  expect(res.statusCode).toBe(501);
  expect(res.body).toEqual('Couldn\'t fetch table schema.');

  process.env.DYNAMODB_MOVIES_TABLE = oldMoviesTable;
});
