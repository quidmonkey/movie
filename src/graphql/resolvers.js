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

const getUser = async ({ username }) => {
  const user = await new Promise.resolve(username);
  return user;
};

module.exports = {
  Query: {
    getMovie: async (root, args) => await getMovie(args),
    getUser: async (root, args) => await getUser(args)
  }
};
