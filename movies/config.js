const Joi = require('joi');

const movie = {
  title: Joi.string().min(1).max(50).required(),
  format: Joi.string().valid('VHS', 'DVD', 'Streaming').required(),
  length: Joi.string().regex(/[0-9]{1,3} min/).required(),
  releaseYear: Joi.number().min(1800).max(2100).required(),
  rating: Joi.number().min(1).max(5).required()
};

const user = {
  username: Joi.string().alphanum().required(),
  password: Joi.string().min(8).required(),
  scopes: Joi.array().items(Joi.string().valid('*', 'create', 'delete', 'get', 'list', 'schema', 'update'))
};

module.exports = {
  auth: {
    saltRounds: 10,
    jwt: {
      expiresIn: 86400  // one day in secs
    },
  },
  schemas: {
    movie,
    user
  }
};
