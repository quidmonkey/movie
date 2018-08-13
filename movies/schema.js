'use strict';

const ddb = require('serverless-dynamodb-client');
const dynamoDb = ddb.raw;

module.exports.schema = async (event) => {
  const params = {
    TableName: process.env.DYNAMODB_MOVIES_TABLE,
  };

  try {
    const res = await dynamoDb.describeTable(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify(res),
    };
  } catch(err) {
    console.error('~~~ DynamoDb Describe error', err);
    return {
      statusCode: err.statusCode || 501,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Couldn\'t fetch table schema.',
    };
  }
};
