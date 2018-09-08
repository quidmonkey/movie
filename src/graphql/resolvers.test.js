const faker = require('faker');

const {
  getMockMovie,
  mockMovieOne,
  mockMovieTwo
} = require('../mock-dynamodb-utils');

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
