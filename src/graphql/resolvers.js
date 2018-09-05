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

module.exports = {
  Mutation: {
    createMovie: async (root, args) => await createMovie(args)
  },
  Query: {
    movie: async (root, args) => await getMovie(args),
    movies: async (root, args) => await getMovies()
  }
};
