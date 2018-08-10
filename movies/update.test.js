const Joi = require('joi');
const ddb = require('serverless-dynamodb-client');

const { update } = require('./update');

process.env.DYNAMODB_MOVIES_TABLE = 'foo';

const dynamoDb = ddb.doc;
const mockMovieTitle = 'foo';
const mockData = {
  format: 'DVD',
  length: '300 min',
  releaseYear: new Date().getFullYear(),
  rating: 1
};
const mockEvent = {
  pathParameters: {
    title: mockMovieTitle
  },
  body: JSON.stringify(mockData)
};
const now = Date.now();

Date.now = jest.fn(Date.now).mockImplementation(() => now);
Joi.validate = jest.fn(Joi.validate);

it('update: should update a DynamoDb entry', () => {
  const mockRes = {
    Attributes: 'foo'
  };
  const mockCallback = jest.fn().mockImplementation((err, res) => {
    const expectedRes = {
      statusCode: 200,
      body: JSON.stringify('foo')
    };
    
    expect(err).toBeNull();
    expect(res).toEqual(expectedRes);

    expect(Joi.validate).toHaveBeenCalled();
  });
  
  dynamoDb.update = jest.fn(dynamoDb.update).mockImplementation((params, callback) => {
    const expectedParams = {
      TableName: 'foo',
      Key: {
        title: mockMovieTitle,
      },
      // Need to define these as format and length are DynamoDb keywords
      ExpressionAttributeNames: {
        '#movie_format': 'format',
        '#movie_length': 'length'
      },
      ExpressionAttributeValues: {
        ':format': mockData.format,
        ':length': mockData.length,
        ':releaseYear': mockData.releaseYear,
        ':rating': mockData.rating,
        ':updatedAt': now
      },
      UpdateExpression: 'SET #movie_format = :format, #movie_length = :length, releaseYear = :releaseYear, rating = :rating, updatedAt = :updatedAt',
      ReturnValues: 'ALL_NEW',
    };

    expect(params).toEqual(expectedParams);

    callback(null, mockRes);
  });

  update(mockEvent, {}, mockCallback);
});

it('update: should handle DynamoDb update entry errors', () => {
  const mockErr = new Error('foo');
  const mockCallback = jest.fn().mockImplementation((err, res) => {
    const expectedRes = {
      statusCode: 501,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Couldn\'t update the movie.'
    };

    expect(err).toBeNull();
    expect(res).toEqual(expectedRes);
  });

  dynamoDb.update = jest.fn(dynamoDb.update).mockImplementation((params, callback) => {
    callback(mockErr, null);
  });

  update(mockEvent, {}, mockCallback);
});

it('update: should handle malformed DynamoDb update entry requests', () => {
  Joi.validate = jest.fn(Joi.validate).mockImplementation(() => ({ error: 'foo' }));

  const mockCallback = jest.fn().mockImplementation((err, res) => {
    const expectedRes = {
      statusCode: 400,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Couldn\'t update the movie.',
    };
    
    expect(err).toBeNull();
    expect(res).toEqual(expectedRes);

    expect(Joi.validate).toHaveBeenCalled();
  });

  update(mockEvent, {}, mockCallback);
});
