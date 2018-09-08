const { getMockUser } = require('./test-utils');
const { user } = require('./user');

it('user - should create a user', async () => {
  const mockUser = getMockUser();
  const event = {
    body: JSON.stringify(mockUser)
  };
  const res = await user(event);

  expect(res.statusCode).toBe(200);
  expect(JSON.parse(res.body)).toBe('User created successfully.');
});

it('user - should fail on an invalid request', async () => {
  const mockUser = {};
  const event = {
    body: JSON.stringify(mockUser)
  };
  const res = await user(event);

  expect(res.statusCode).toBe(400);
  expect(res.body).toBe('Incorrect User Data - POST Body requires a username & an alphanumeric password of at least 8 characters.');
});

it('user - should fail on a bad DynamoDB request', async () => {
  const oldUserTable = process.env.DYNAMODB_USER_TABLE;

  process.env.DYNAMODB_USER_TABLE = 'error';

  const mockUser = getMockUser();
  const event = {
    body: JSON.stringify(mockUser)
  };
  const res = await user(event);

  expect(res.statusCode).toBe(501);
  expect(res.body).toBe('Couldn\'t create user.');

  process.env.DYNAMODB_USER_TABLE = oldUserTable;
});
