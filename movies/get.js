'use strict';

const ddb = require('serverless-dynamodb-client');
const dynamoDb = ddb.doc;

module.exports.get = async (event) => {
  const params = {
    TableName: process.env.DYNAMODB_MOVIES_TABLE,
    Key: {
      title: decodeURIComponent(event.pathParameters.title)
    },
  };

  try {
    const res = await dynamoDb.get(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify(res.Item),
    };
  } catch(err) {
    console.error('~~~ DynamoDb Get error', err);
    return {
      statusCode: err.statusCode || 501,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Couldn\'t fetch the movie.',
    };
  }
};
