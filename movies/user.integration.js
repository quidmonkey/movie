const { getUser, getURL } = require('./test-utils');
const { req, RequestError } = require('./utils');

it('/user - should create a user', async () => {
  const { res } = await getUser();

  const expected = 'User created successfully.';
  const actual = res;

  expect(actual).toBe(expected);
});

it('/user - should fail on bad user data', async () => {
  const user = {
    username: 'foo'
  };
  const url = getURL('/movies/user');
  const opts = {
    method: 'POST',
    body: JSON.stringify(user)
  };
  try {
    await req(url, opts);
  } catch(err) {
    expect(err).toBeInstanceOf(RequestError);
    expect(err.statusCode).toBe(400);
    expect(err.message).toBe('Incorrect User Data - POST Body requires a username & an alphanumeric password of at least 8 characters.');
  }
});

it('/user - should fail on an incorrect DynamoDb call', async () => {
  process.env.DYNAMODB_USER_TABLE = 'foobar';

  try {
    await getUser();
  } catch(err) {
    expect(err).toBeInstanceOf(RequestError);
    expect(err.statusCode).toBe(501);
    expect(err.message).toBe('Couldn\'t create user.');
  }
});
