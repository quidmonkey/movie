const Joi = require('joi');
const jwt = require('jsonwebtoken');

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

  const user = {};

  const token = jwt.sign(
    { user },
    process.env.JWT_SECRET,
    { expiresIn: config.auth.jwt.expiresIn }
  );

  const response = {
    statusCode: 200,
    body: JSON.stringify(token)
  };

  callback(null, response);
};
