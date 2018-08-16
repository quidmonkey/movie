const { getToken, getUser, getURL } = require('./test-utils');
const { req, RequestError } = require('./utils');

require('./token');

it('/token - should fetch a token', async () => {
  const res = await getToken();

  const expected = 'string';
  const actual = typeof res;

  expect(actual).toBe(expected);
});

it('/token - should fail on invalid user data', async () => {
  await getUser();
  const user = {
    username: 'foo'
  };
  const url = getURL('/movies/token');
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

it('/token - should fail on non-existant user', async () => {
  await getUser();
  const user = {
    username: 'mrfoobarbaz',
    password: Date.now().toString()
  };
  const url = getURL('/movies/token');
  const opts = {
    method: 'POST',
    body: JSON.stringify(user)
  };
  try {
    await req(url, opts);
    throw new Error('Ruh Roh. This should never execute');
  } catch(err) {
    expect(err).toBeInstanceOf(RequestError);
    expect(err.statusCode).toBe(409);
    expect(err.message).toBe('Unable to serve token - user does not exist.');
  }
});

it('/token - should fail on mismatched password', async () => {
  const { user } = await getUser();
  const newUser = {
    username: user.username,
    password: 'foobarbaz'
  };
  const url = getURL('/movies/token');
  const opts = {
    method: 'POST',
    body: JSON.stringify(newUser)
  };
  try {
    await req(url, opts);
    throw new Error('Ruh Roh. This should never execute');
  } catch(err) {
    expect(err).toBeInstanceOf(RequestError);
    expect(err.statusCode).toBe(403);
    expect(err.message).toBe('Unable to serve token - incorrect username or password.');
  }
});
