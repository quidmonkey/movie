const fetch = require('jest-fetch-mock');
const https = require('https');

jest.setMock('node-fetch', fetch);

const { getMovieModel, movies } = require('./test-utils');

const {
  getIAMPolicy,
  getNoCacheUrl,
  getHTTPSOpts,
  HTTPSAgent,
  isAuthorized,
  merge,
  req,
  RequestError,
  sortMovies
} = require('./utils');

it('getIAMPolicy - should define an AWS IAM policy for Resource Access', () => {
  const user = {
    username: 'mrfoobar',
    password: Date.now().toString()
  };
  const expected = {
    principalId: user.username,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: 'Allow',
          Resource: 'ARN::FooBar'
        }
      ]
    },
    context: JSON.stringify(user)
  };

  const actual = getIAMPolicy(
    user.username,
    'Allow',
    'ARN::FooBar',
    JSON.stringify(user)
  );

  expect(actual).toEqual(expected);
});

it('getNoCacheUrl - should get a url with no query string that cannot be cached', () => {
  const url = '/foobar';
  const actual = getNoCacheUrl(url);

  expect(actual).toMatch(/^\/foobar\?\d+$/);
});

it('getNoCacheUrl - should get a url with a query string that cannot be cached', () => {
  const url = '/foobar?test=true';
  const actual = getNoCacheUrl(url);

  expect(actual).toMatch(/^\/foobar\?test=true&\d+$/);
});

it('getHTTPSOpts - should get a fetch request options that are HTTPS ready', () => {
  const opts = {
    method: 'POST',
    body: 'foobar'
  };
  
  const expected = merge({
    method: opts.method,
    body: opts.body
  }, HTTPSAgent);
  const actual = getHTTPSOpts(opts);

  expect(actual).toEqual(expected);
});

it('HTTPSAgent - should be an instanceof https.Agent object', () => {
  const { agent } = HTTPSAgent;
  expect(agent).toBeInstanceOf(https.Agent);
});

it('isAuthorized - should authorize a user against all app scopes', () => {
  const userScopes = ['*'];
  const arn = 'ARN::movies-create';

  const actual = isAuthorized(userScopes, arn);

  expect(actual).toBe(true);
});

it('isAuthorized - should authorize a user against specific app scopes', () => {
  const userScopes = ['create', 'get', 'list'];
  const arn = 'ARN::movies-create';

  const actual = isAuthorized(userScopes, arn);

  expect(actual).toBe(true);
});

it('isAuthorized - should not authorize a user if user is missing required scopes', () => {
  const allScopes = ['get', 'list'];
  const arn = 'ARN::movies-create';

  const actual = isAuthorized(allScopes, arn);

  expect(actual).toBe(false);
});

it('merge - should merge together objects', () => {
  const foo = { x: 1, y: 3 };
  const bar = { x: 5, z: 8 };
  const baz = { a: 88, b: 7, z: 23 };

  const expected = {
    a: 88,
    b: 7,
    x: 5,
    y: 3,
    z: 23
  };
  const actual = merge(foo, bar, baz);

  expect(actual).toEqual(expected);
});

it('req - should make an http fetch request', async () => {
  const expected = { foo: 'bar' };
  
  const url = 'http://www.foobar.com';
  const opts = {
    method: 'POST',
    body: 'foobar'
  };
  
  fetch.mockResponse(JSON.stringify(expected));

  const actual = await req(url, opts);

  expect(actual).toEqual(expected);
});

it('req - should make an https fetch request', async () => {
  const expected = { foo: 'bar' };
  
  const url = 'https://www.foobar.com';
  const opts = {
    method: 'POST',
    body: 'foobar'
  };
  
  fetch.mockResponse(JSON.stringify(expected));

  const actual = await req(url, opts);

  expect(actual).toEqual(expected);
});

it('req - should throw an error on a 400 or 500 level fetch response', async () => {
  const url = 'http://www.foobar.com';
  const opts = {
    method: 'POST',
    body: 'foobar'
  };
  
  fetch.mockResponse(
    'Ruh Roh',
    { status: 400 }
  );

  try {
    await req(url, opts);
  } catch(err) {
    expect(err).toBeInstanceOf(RequestError);
    expect(err.statusCode).toBe(400);
    expect(err.message).toBe('Ruh Roh');
  }
});

it('RequestError - should be an instance of Error that contains a statusCode property', () => {
  const err = new RequestError(200, 'foobar');

  expect(err).toBeInstanceOf(Error);
  expect(err).toBeInstanceOf(RequestError);
  expect(err.statusCode).toBe(200);
  expect(err.message).toBe('foobar');
});

it('sortMovies - should sort a list of movie models by a given attribute', () => {
  const movie = getMovieModel();
  
  for (const attr of Object.keys(movie)) {
    const expected = [...movies].sort((a, b) => {
      if (a[attr] < b[attr]) {
        return -1;
      } else if (a[attr] > b[attr]) {
        return 1;
      }

      return 0;
    });
    const actual = sortMovies(movies, attr);

    expect(actual).not.toBe(movies);
    expect(JSON.stringify(actual)).toBe(JSON.stringify(expected));
  }
});
