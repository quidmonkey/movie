const Joi = require('joi');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const ddb = require('serverless-dynamodb-client');
const dynamoDb = ddb.doc;

const config = require('./config');
const schema = Joi.object().keys(config.schemas.user);

module.exports.user = (event, context, callback) => {
  const timestamp = Date.now();
  const data = JSON.parse(event.body);
  const certificate = Joi.validate(data, schema);

  if (certificate.error) {
    console.error('~~~ Validation Failed', certificate.error);
    callback(null, {
      statusCode: 400,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Incorrect User Data - POST Body requires a username & password.',
    });
  }

  const hash = bcrypt.hashSync(data.password, config.auth.saltRounds);
  const params = {
    TableName: process.env.DYNAMODB_USER_TABLE,
    Item: {
      id: uuid.v1(),
      createdAt: timestamp,
      updatedAt: timestamp,

      username: data.username,
      password: hash,
      scopes: data.scopes || ['*']  // default to access all
    },
  };

  dynamoDb.put(params, (error) => {
    // handle potential errors
    if (error) {
      console.error('~~~ DynamoDB User PUT error', error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t create user.',
      });
      return;
    }

    const response = {
      statusCode: 200,
      body: JSON.stringify('User created successfully.')
    };
    callback(null, response);
  });
};
