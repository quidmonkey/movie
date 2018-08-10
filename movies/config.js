const Joi = require('joi');

const schema = {
    title: Joi.string().min(1).max(50).required(),
    format: Joi.string().valid('VHS', 'DVD', 'Streaming').required(),
    length: Joi.string().regex(/[0-9]{1,3} min/).required(),
    releaseYear: Joi.number().min(1800).max(2100).required(),
    rating: Joi.number().min(1).max(5).required()
};

module.exports = {
    schema
};
