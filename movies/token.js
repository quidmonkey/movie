const Joi = require('joi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const ddb = require('serverless-dynamodb-client');
const dynamoDb = ddb.doc;

const config = require('./config');
const schema = Joi.object().keys(config.schemas.user);

module.exports.token = (event, context, callback) => {
  const data = JSON.parse(event.body);
  const certificate = Joi.validate(schema, data);

  if (certificate.error) {
    console.error('~~~ Validation Failed', certificate.error);
    callback(null, {
      statusCode: 400,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Incorrect User Data - POST Body requires a username & password.',
    });
  }

  const params = {
    TableName: process.env.DYNAMODB_USER_TABLE,
    Key: {
      username: decodeURIComponent(event.pathParameters.username)
    },
  };

  // fetch todo from the database
  dynamoDb.get(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error('~~~', error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t fetch user.',
      });
      return;
    }

    console.log('~~~ result', result);
    const user = result.Item;
    let response;

    if (bcrypt.compareSync(data.password, user.password)) {
      const token = jwt.sign(
        { user },
        process.env.JWT_SECRET,
        { expiresIn: config.auth.jwt.expiresIn }
      );

      response = {
        statusCode: 200,
        body: JSON.stringify(token)
      };
    } else {
      response = {
        statusCode: 400,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Unable to serve token - incorrect user password.',
      };
    }

    callback(null, response);
  });
};
