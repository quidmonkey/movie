const Joi = require('joi');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const ddb = require('serverless-dynamodb-client');
const dynamoDb = ddb.doc;

const config = require('./config');
const schema = Joi.object().keys(config.schemas.user);

module.exports.token = async (event) => {
  const data = JSON.parse(event.body);
  const certificate = Joi.validate(data, schema);

  if (certificate.error) {
    console.error('~~~ Validation Failed', certificate.error);
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Incorrect User Data - POST Body requires a username & an alphanumeric password of at least 8 characters.'
    };
  }

  const params = {
    TableName: process.env.DYNAMODB_USER_TABLE,
    Key: {
      username: decodeURIComponent(data.username)
    },
  };

  try {
    const res = await dynamoDb.get(params).promise();
    const user = res.Item;

    if (!user) {
      return {
        statusCode: 409,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Unable to serve token - user does not exist.'
      };
    }

    if (bcrypt.compareSync(data.password, user.password)) {
      const token = jwt.sign(
        { user },
        process.env.JWT_SECRET,
        { expiresIn: config.auth.jwt.expiresIn }
      );

      return {
        statusCode: 200,
        body: JSON.stringify({ token })
      };
    } else {
      return {
        statusCode: 403,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Unable to serve token - incorrect username or password.',
      };
    }
  } catch(err) {
    console.error('~~~ DynamoDB GET User error', err);
    return {
      statusCode: err.statusCode || 501,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Unable to serve token - unable to fetch user.',
    };
  }
};
