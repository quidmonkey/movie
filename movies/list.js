'use strict';

const ddb = require('serverless-dynamodb-client');
const dynamoDb = ddb.doc;

const { sortMovies } = require('./utils');

module.exports.list = async (event) => {
  const params = {
    TableName: process.env.DYNAMODB_MOVIES_TABLE,
  };
  
  try {
    const res = await dynamoDb.scan(params).promise();
    const sort  = event.queryStringParameters ? event.queryStringParameters.sort : false;
    const movies = sort ? sortMovies(res.Items, sort) : res.Items;

    return {
      statusCode: 200,
      body: JSON.stringify(movies),
    };
  } catch(err) {
    console.error('~~~ DynamoDb Scan error', err);
    return {
      statusCode: err.statusCode || 501,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Couldn\'t fetch any movies.',
    };
  }
};
