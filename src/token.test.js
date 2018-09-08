const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

const { getMockUser } = require('./test-utils');
const { token } = require('./token');

it('token - should get a token', async () => {
  const mockTokenRes = 'foobar';
  
  bcrypt.compareSync.mockImplementationOnce((...args) => {
    return true;
  });

  jwt.sign.mockImplementationOnce((...args) => {
    return mockTokenRes;
  });
  
  const user = getMockUser();
  const event = {
    body: JSON.stringify(user)
  };
  const res = await token(event);

  expect(res.statusCode).toBe(200);

  const expected = {
    token: mockTokenRes
  };
  const actual = JSON.parse(res.body);

  expect(actual).toEqual(expected);
});

it('token - should fail on an invalid request', async () => {
  const user = {};
  const event = {
    body: JSON.stringify(user)
  };
  const res = await token(event);

  expect(res.statusCode).toBe(400);
  expect(res.body).toBe('Incorrect User Data - POST Body requires a username & an alphanumeric password of at least 8 characters.');
});

it('token - should fail on incorrect credentials', async () => {
  bcrypt.compareSync.mockImplementationOnce((...args) => {
    return false;
  });

  const user = getMockUser();
  const event = {
    body: JSON.stringify(user)
  };
  const res = await token(event);

  expect(res.statusCode).toBe(403);
  expect(res.body).toEqual('Unable to serve token - incorrect username or password.');
});

it('token - should fail on a bad DynamoDB request', async () => {
  const oldUserTable = process.env.DYNAMODB_USER_TABLE;

  process.env.DYNAMODB_USER_TABLE = 'error';
  
  const user = getMockUser();
  const event = {
    body: JSON.stringify(user)
  };
  const res = await token(event);

  expect(res.statusCode).toBe(501);
  expect(res.body).toBe('Unable to serve token - unable to fetch user.');

  process.env.DYNAMODB_USER_TABLE = oldUserTable;
});
