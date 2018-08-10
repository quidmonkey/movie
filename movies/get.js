'use strict';

const ddb = require('serverless-dynamodb-client');
const dynamoDb = ddb.doc;

module.exports.get = (event, context, callback) => {
    const params = {
        TableName: process.env.DYNAMODB_TABLE,
        Key: {
            title: decodeURIComponent(event.pathParameters.title)
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
                body: 'Couldn\'t fetch the movie.',
            });
            return;
        }

        // create a response
        const response = {
            statusCode: 200,
            body: JSON.stringify(result.Item),
        };
        callback(null, response);
    });
};
