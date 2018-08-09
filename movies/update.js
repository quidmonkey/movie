'use strict';

const Joi = require('joi');
const ddb = require('serverless-dynamodb-client');
const dynamoDb = ddb.doc;

const config = require('./config');

module.exports.update = (event, context, callback) => {
  const timestamp = Date.now();
  const data = JSON.parse(event.body);
  const { format, length, releaseYear, rating } = config.schema;
  const schema = Joi.object().keys({ format, length, releaseYear, rating });
  const certificate = Joi.validate(data, schema);

  // validation
  if (certificate.error) {
    console.error('~~~ Validation Failed', certificate.error);
    callback(null, {
      statusCode: 400,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Couldn\'t update the movie.',
    });
    return;
  }

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      title: decodeURIComponent(event.pathParameters.title),
    },
    // Need to define these as format and length are DynamoDb keywords
    ExpressionAttributeNames: {
      '#movie_format': 'format',
      '#movie_length': 'length'
    },
    ExpressionAttributeValues: {
      ':format': data.format,
      ':length': data.length,
      ':releaseYear': data.releaseYear,
      ':rating': data.rating,
      ':updatedAt': timestamp
    },
    UpdateExpression: 'SET #movie_format = :format, #movie_length = :length, releaseYear = :releaseYear, rating = :rating, updatedAt = :updatedAt',
    ReturnValues: 'ALL_NEW',
  };

  // update the todo in the database
  dynamoDb.update(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t fetch the movie.',
      });
      return;
    }

    // create a response
    const response = {
      statusCode: 200,
      body: JSON.stringify(result.Attributes),
    };
    callback(null, response);
  });
};
