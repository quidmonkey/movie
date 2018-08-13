const { getUser, getURL } = require('./test-utils');
const { req, RequestError } = require('./utils');

require('./user');

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
    throw new Error('Ruh Roh. This should never execute');
  } catch(err) {
    expect(err).toBeInstanceOf(RequestError);
    expect(err.statusCode).toBe(400);
    expect(err.message).toBe('Incorrect User Data - POST Body requires a username & an alphanumeric password of at least 8 characters.');
  }
});
