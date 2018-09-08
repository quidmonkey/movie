'use strict';

const Joi = require('joi');
const ddb = require('serverless-dynamodb-client');
const dynamoDb = ddb.doc;

const config = require('./config');

const { format, length, releaseYear, rating } = config.schemas.movie;
const schema = Joi.object().keys({ format, length, releaseYear, rating });

module.exports.update = async (event) => {
  const timestamp = Date.now();
  const data = JSON.parse(event.body);
  const certificate = Joi.validate(data, schema);

  // validation
  if (certificate.error) {
    console.error('~~~ Validation Failed', certificate.error);
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Validation Failed - Incorrect Movie Data Model.',
    };
  }

  const params = {
    TableName: process.env.DYNAMODB_MOVIES_TABLE,
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

  try {
    const res = await dynamoDb.update(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify(res.Attributes)
    };
  } catch(err) {
    console.error('~~~ DynamoDb Update error', err);
    return {
      statusCode: err.statusCode || 501,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Couldn\'t update the movie.'
    };
  }
};
