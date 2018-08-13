'use strict';

const ddb = require('serverless-dynamodb-client');
const dynamoDb = ddb.doc;

module.exports.delete = async (event) => {
  const params = {
    TableName: process.env.DYNAMODB_MOVIES_TABLE,
    Key: {
      title: event.pathParameters.title,
    },
  };

  try {
    await dynamoDb.delete(params).promise();
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify('Delete successful.')
    };
  } catch(err) {
    console.error('~~~ DynamoDb Delete error', err);
    return {
      statusCode: err.statusCode || 501,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Couldn\'t remove the movie.'
    };
  }
};
