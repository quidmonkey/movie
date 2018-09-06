const ddb = require('serverless-dynamodb-client');
const dynamoDb = ddb.doc;

const uuid = require('uuid');

/**
 * Create a movie mutation
 * @param {*} args  GraphQL mutation args
 * @return {Object} Created movie
 */
const createMovie = async({ movie }) => {
  const { title, format, length, releaseYear, rating } = movie;
  const timestamp = Date.now();
  const params = {
    TableName: process.env.DYNAMODB_MOVIES_TABLE,
    Item: {
      id: uuid.v1(),
      createdAt: timestamp,
      updatedAt: timestamp,

      title,
      format,
      length,
      releaseYear,
      rating
    }
  };

  await dynamoDb.put(params).promise();

  return movie;
};
module.exports.createMovie = createMovie;

/**
 * Get a movie query
 * @param {*} args  GraphQL mutation args
 * @return {Object} Fetched movie
 */
const getMovie = async ({ title }) => {
  const params = {
    TableName: process.env.DYNAMODB_MOVIES_TABLE,
    Key: {
      title: decodeURIComponent(title)
    },
  };
  const res = await dynamoDb.get(params).promise();

  return res.Item;
};
module.exports.getMovie = getMovie;

/**
 * Get a list of movies query
 * @return {Array<Object>} Fetched movies
 */
const getMovies = async () => {
  const params = {
    TableName: process.env.DYNAMODB_MOVIES_TABLE
  };

  const res = await dynamoDb.scan(params).promise();

  return res.Items;
};
module.exports.getMovies = getMovies;

/**
 * Get the DynamoDb ExpressionAttributeNames to mutate a Movie object
 * @param {Object} movie  Movie object
 * @return {Object}       ExpressionAttributeNames
 */
const getMovieExpressionAttributeNames = (movie) => {
  return Object.keys(movie)
    .reduce((hash, key) => {
      const expressionKey = `#movie_${key}`;

      hash[expressionKey] = key;

      return hash;
    }, {});
};
module.exports.getMovieExpressionAttributeNames = getMovieExpressionAttributeNames;

/**
 * Get the DynamoDb ExpressionAttributeValues to mutate a Movie object
 * @param {Object} movie  Movie object
 * @return {Object}       ExpressionAttributeValues
 */
const getMovieExpressionAttributeValues = (movie) => {
  return Object.entries(movie)
    .reduce((hash, [key, val]) => {
      const expressionKey = `:${key}`;

      hash[expressionKey] = val;

      return hash;
    }, {});
};
module.exports.getMovieExpressionAttributeValues = getMovieExpressionAttributeValues;

/**
 * Get the DynamoDb UpdateExpression to mutate a Movie object
 * @param {Object} movie  Movie object
 * @return {string}       UpdateExpression
 */
const getMovieUpdateExpression = (movie) => {
  return Object.keys(movie)
    .reduce((str, key, index, arr) => {
      const s = `${str}#movie_${key} = :${key}`;

      return index < arr.length - 1 ? `${s}, ` : s;
    }, 'SET ');
};
module.exports.getMovieUpdateExpression = getMovieUpdateExpression;

/**
 * Create a movie mutation
 * @param {*} args  GraphQL mutation args
 * @return {Object} Mutated movie args
 */
const updateMovie = async ({ title, movie }) => {
  const ExpressionAttributeNames = getMovieExpressionAttributeNames(movie);
  const ExpressionAttributeValues = getMovieExpressionAttributeValues(movie);
  const UpdateExpression = getMovieUpdateExpression(movie);

  const params = {
    TableName: process.env.DYNAMODB_MOVIES_TABLE,
    Key: {
      title: title,
    },
    ExpressionAttributeNames,
    ExpressionAttributeValues,
    UpdateExpression,
    ReturnValues: 'UPDATED_NEW',
  };

  const res = await dynamoDb.update(params).promise();

  return res.Attributes;
};
module.exports.updateMovie = updateMovie;

/**
 * GraphQL Resolvers
 * @type {Object} resolvers
 */
module.exports.resolvers = {
  Formats: {
    BLURAY: 'Blu-Ray',
    DVD: 'DVD',
    STREAMING: 'Streaming'
  },
  Mutation: {
    createMovie: async (root, args) => await createMovie(args),
    updateMovie: async (root, args) => await updateMovie(args)
  },
  Query: {
    movie: async (root, args) => await getMovie(args),
    movies: async (root, args) => await getMovies()
  }
};
