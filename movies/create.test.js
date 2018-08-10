const Joi = require('joi');
const uuid = require('uuid');
const ddb = require('serverless-dynamodb-client');

const { create } = require('./create');

process.env.DYNAMODB_MOVIES_TABLE = 'foo';

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

uuid.v1 = jest.fn(uuid.v1).mockImplementation(() => 1);
Date.now = jest.fn(Date.now).mockImplementation(() => now);
Joi.validate = jest.fn(Joi.validate);

it('create: should create a DynamoDb movie entry', () => {
  const mockRes = {
    id: 1,
    createdAt: now,
    updatedAt: now,

    title: mockData.title,
    format: mockData.format,
    length: mockData.length,
    releaseYear: mockData.releaseYear,
    rating: mockData.rating
  };
  const mockCallback = jest.fn().mockImplementation((err, res) => {
    const expectedRes = {
      statusCode: 200,
      body: JSON.stringify(mockRes)
    };
    
    expect(err).toBeNull();
    expect(res).toEqual(expectedRes);

    expect(Joi.validate).toHaveBeenCalled();
  });
  
  dynamoDb.put = jest.fn(dynamoDb.put).mockImplementation((params, callback) => {
    const expectedParams = {
      TableName: 'foo',
      Item: mockRes
    };

    expect(params).toEqual(expectedParams);

    callback(null, {
      Item: mockRes
    });
  });

  create(mockEvent, {}, mockCallback);
});

it('create: should handle DynamoDb create entry errors', () => {
  const mockErr = new Error('foo');
  const mockCallback = jest.fn().mockImplementation((err, res) => {
    const expectedRes = {
      statusCode: 501,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Couldn\'t create the movie.'
    };

    expect(err).toBeNull();
    expect(res).toEqual(expectedRes);
  });

  dynamoDb.put = jest.fn(dynamoDb.put).mockImplementation((params, callback) => {
    callback(mockErr, null);
  });

  create(mockEvent, {}, mockCallback);
});

it('create: should handle malformed DynamoDb create entry requests', () => {
  Joi.validate = jest.fn(Joi.validate).mockImplementation(() => ({ error: 'foo' }));

  const mockCallback = jest.fn().mockImplementation((err, res) => {
    const expectedRes = {
      statusCode: 400,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Couldn\'t create the movie.',
    };
    
    expect(err).toBeNull();
    expect(res).toEqual(expectedRes);

    expect(Joi.validate).toHaveBeenCalled();
  });

  create(mockEvent, {}, mockCallback);
});

