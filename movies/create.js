'use strict';

const Joi = require('joi');
const uuid = require('uuid');
const ddb = require('serverless-dynamodb-client');
const dynamoDb = ddb.doc;

const config = require('./config');

const schema = Joi.object().keys(config.schema);

module.exports.create = (event, context, callback) => {
    const timestamp = Date.now();
    const data = JSON.parse(event.body);
    const certificate = Joi.validate(data, schema);

    if (certificate.error) {
        console.error('~~~ Validation Failed', certificate.error);
        callback(null, {
            statusCode: 400,
            headers: { 'Content-Type': 'text/plain' },
            body: 'Couldn\'t create the movie.',
        });
        return;
    }

    const params = {
        TableName: process.env.DYNAMODB_TABLE,
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

    // write the todo to the database
    dynamoDb.put(params, (error) => {
    // handle potential errors
        if (error) {
            console.error('~~~', error);
            callback(null, {
                statusCode: error.statusCode || 501,
                headers: { 'Content-Type': 'text/plain' },
                body: 'Couldn\'t create the movie.',
            });
            return;
        }

        // create a response
        const response = {
            statusCode: 200,
            body: JSON.stringify(params.Item),
        };
        callback(null, response);
    });
};
