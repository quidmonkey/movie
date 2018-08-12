'use strict';

const ddb = require('serverless-dynamodb-client');
const dynamoDb = ddb.doc;

const { sortMovies } = require('./utils');

module.exports.list = (event, context, callback) => {
  const params = {
    TableName: process.env.DYNAMODB_MOVIES_TABLE,
  };
  
  // fetch all todos from the database
  dynamoDb.scan(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error('~~~', error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t fetch any movies.',
      });
      return;
    }

    const { sort } = event.queryStringParameters;
    const movies = sort ? sortMovies(result.Items, sort) : result.Items;

    // create a response
    const response = {
      statusCode: 200,
      body: JSON.stringify(movies),
    };
    callback(null, response);
  });
};
