'use strict';

const Joi = require('joi');
const uuid = require('uuid');
const ddb = require('serverless-dynamodb-client');
const dynamoDb = ddb.doc;

const config = require('./config');

const schema = Joi.object().keys(config.schemas.movie);

module.exports.create = async (event) => {
  const timestamp = Date.now();
  const data = JSON.parse(event.body);
  const certificate = Joi.validate(data, schema);

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
    Item: {
      id: uuid.v1(),
      createdAt: timestamp,
      updatedAt: timestamp,

      title: data.title,
      format: data.format,
      length: data.length,
      releaseYear: data.releaseYear,
      rating: data.rating
    },
  };

  try {
    await dynamoDb.put(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify(params.Item),
    };
  } catch(err) {
    console.error('~~~ DynamoDb Create Movie error', err);
    return {
      statusCode: err.statusCode || 501,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Couldn\'t create the movie.',
    };
  }
};
