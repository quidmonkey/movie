const ddb = require('serverless-dynamodb-client');
const dynamoDb = ddb.doc;

const uuid = require('uuid');

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

const getMovies = async () => {
  const params = {
    TableName: process.env.DYNAMODB_MOVIES_TABLE
  };

  const res = await dynamoDb.scan(params).promise();

  return res.Items;
};

const updateMovie = async ({ title, movie }) => {
  const ExpressionAttributeNames = Object.keys(movie)
    .reduce((hash, key) => {
      const expressionKey = `#movie_${key}`;

      hash[expressionKey] = key;

      return hash;
    }, {});
  const ExpressionAttributeValues = Object.entries(movie)
    .reduce((hash, [key, val]) => {
      const expressionKey = `:${key}`;

      hash[expressionKey] = val;

      return hash;
    }, {});
  const UpdateExpression = Object.keys(movie)
    .reduce((str, key, index, arr) => {
      const s = `${str}#movie_${key} = :${key}`;

      return index < arr.length - 1 ? `${s}, ` : s;
    }, 'SET ');

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

module.exports = {
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
