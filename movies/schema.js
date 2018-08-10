'use strict';

const ddb = require('serverless-dynamodb-client');
const dynamoDb = ddb.raw;

module.exports.schema = (event, context, callback) => {
  const params = {
    TableName: process.env.DYNAMODB_MOVIES_TABLE,
  };

  dynamoDb.describeTable(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error('~~~', error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t fetch table schema.',
      });
      return;
    };

    // create a response
    const response = {
      statusCode: 200,
      body: JSON.stringify(result),
    };
    callback(null, response);
  });
};
