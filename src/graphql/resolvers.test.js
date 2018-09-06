const aws = require('aws-sdk-mock');
const faker = require('faker');

process.env.DYNAMODB_MOVIES_TABLE = 'foobar';

const mockFormatTypes = ['BLURAY', 'DVD', 'STREAMING'];
const getMockFormat = (index) => mockFormatTypes[index];
const getMockMovie = () => {
  return {
    format: getMockFormat(Math.round(Math.random() * mockFormatTypes.length)),
    length: `${Math.round(Math.random() * 300)} mins`,
    releaseYear: 1900 + Math.round(Math.random() * 200),
    rating: Math.round(Math.random() * 5)
  };
};

const mockMovieOne = getMockMovie();
const mockMovieTwo = getMockMovie();

mockMovieOne.title = faker.random.word();
mockMovieTwo.title = faker.random.word();

// needs to be mocked out prior to serverless-dynamodb-client being required
aws.mock('DynamoDB.DocumentClient', 'put', 'Success');
aws.mock('DynamoDB.DocumentClient', 'get', async (params) => {
  return {
    Item: params.Key.title === mockMovieOne.title ? mockMovieOne : mockMovieTwo
  };
});
aws.mock('DynamoDB.DocumentClient', 'scan', { Items: [mockMovieOne, mockMovieTwo] });
aws.mock('DynamoDB.DocumentClient', 'update', async (params) => {
  const keys = Object.values(params.ExpressionAttributeNames);
  const values = Object.values(params.ExpressionAttributeValues);

  const Attributes = keys.reduce((hash, key, index) => {
    hash[key] = values[index];
    return hash;
  }, {});

  return { Attributes };
});

const {
  createMovie,
  getMovie,
  getMovies,
  getMovieExpressionAttributeNames,
  getMovieExpressionAttributeValues,
  getMovieUpdateExpression,
  updateMovie
} = require('./resolvers');

it('createMovie - should create a new movie DynamoDb entry', async () => {
  const movie = getMockMovie();

  movie.title = faker.random.word();

  const res = await createMovie({ movie });

  expect(res).toEqual(movie);
});

it('getMovie - should get a movie by its title', async () => {
  const movie = Math.random() > 0.5 ? mockMovieOne : mockMovieTwo;
  const res = await getMovie(movie);

  expect(res).toEqual(movie);
  expect(true).toBeTruthy();
});

it('getMovies - should get a list of movies', async () => {
  const res = await getMovies();

  expect(res).toEqual([mockMovieOne, mockMovieTwo]);
});

it('getMovieExpressionAttributeNames - should get the Dynamo ExpressionAttributeNames', () => {
  const movie = getMockMovie();
  const expected = {
    '#movie_format': 'format',
    '#movie_length': 'length',
    '#movie_releaseYear': 'releaseYear',
    '#movie_rating': 'rating'
  };
  const actual = getMovieExpressionAttributeNames(movie);

  expect(actual).toEqual(expected);  
});

it('getMovieExpressionAttributeValues - should get the DynamoDb ExpressionAttributeValues', () => {
  const movie = getMockMovie();
  const expected = {
    ':format': movie.format,
    ':length': movie.length,
    ':releaseYear': movie.releaseYear,
    ':rating': movie.rating
  };
  const actual = getMovieExpressionAttributeValues(movie);

  expect(actual).toEqual(expected);
});

it('getMovieUpdateExpression - should get the DynamoDb UpdateExpression', () => {
  const movie = getMockMovie();
  const expected = 'SET #movie_format = :format, #movie_length = :length, #movie_releaseYear = :releaseYear, #movie_rating = :rating';
  const actual = getMovieUpdateExpression(movie);

  expect(actual).toBe(expected);
});

it('updateMovie - should update a movie entry', async () => {
  const title = faker.random.word();
  const movie = getMockMovie();

  const res = await updateMovie({ title, movie });

  expect(res).toEqual(movie);
});
