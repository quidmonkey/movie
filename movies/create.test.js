const Joi = require('joi');
const uuid = require('uuid');
const ddb = require('serverless-dynamodb-client');

jest.mock('uuid');
jest.mock('serverless-dynamodb-client');

const { create } = require('./create');

const validate = jest.fn(Joi.validate);

process.env.DYNAMODB_TABLE = 'foo';

const dynamoDb = ddb.doc;
const mockData = {
  title: 'foo',
  format: 'DVD',
  length: '300 min',
  releaseYear: new Date().getFullYear(),
  rating: 1
};
const mockEvent = {
  body: JSON.stringify(mockData)
};
const now = Date.now();

jest.fn(uuid.v1).mockImplementation(() => 1);
jest.fn(Date.now).mockImplementation(() => now);

it('create: should create a DynamoDb movie entry', () => {
  const mockRes = 'foo';
  const mockCallback = jest.fn().mockImplementation((err, res) => {
    const expectedRes = {
      statusCode: 200,
      body: mockRes
    };
    
    expect(err).toBeNull();
    expect(res).toEqual(expectedRes);

    expect(validate).toHaveBeenCalled();
  });
  
  jest.fn(dynamoDb.put).mockImplementation((params, callback) => {
    const expectedParams = {
      TableName: 'foo',
      Item: {
        id: 1,
        createdAt: now,
        updatedAt: now,

        title: mockData.title,
        format: mockData.format,
        length: mockData.length,
        releaseYear: mockData.releaseYear,
        rating: mockData.rating
      }
    };

    expect(params).toEqual(expectedParams);

    callback(null, mockRes);
  });

  create(mockEvent, {}, mockCallback);
});

it('create: should handle DynamoDb create entry errors', () => {
  const mockErr = new Error('foo');
  const mockCallback = jest.fn().mockImplementation((err, res) => {
    const expectedRes = {
      statusCode: 501,
      body: 'Couldn\'t create the movie.'
    };

    expect(err).toBeNull();
    expect(res).toEqual(expectedRes);
  });

  jest.fn(dynamoDb.put).mockImplementation((params, callback) => {
    callback(mockErr, null);
  });

  create(mockEvent, {}, mockCallback);
});
