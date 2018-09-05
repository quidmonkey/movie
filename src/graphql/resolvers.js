const ddb = require('serverless-dynamodb-client');
const dynamoDb = ddb.doc;

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

const getUser = async ({ username }) => {
  const user = await new Promise.resolve(username);
  return user;
};

module.exports = {
  Query: {
    movie: async (root, args) => await getMovie(args),
    movies: async (root, args) => await getMovies(),
    user: async (root, args) => await getUser(args)
  }
};
