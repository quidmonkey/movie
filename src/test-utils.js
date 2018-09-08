/**
 * This file needs to be required prior to serverless-dynamodb-client
 * being required in order to mock out the aws-sdk
 */
const aws = require('aws-sdk-mock');
const faker = require('faker');

process.env.DYNAMODB_MOVIES_TABLE = faker.random.word();

// mock getters
const FORMAT_TYPES = ['Blu-Ray', 'DVD', 'Streaming'];
const getMockFormat = () => {
  const index = Math.floor(Math.random() * FORMAT_TYPES.length);
  return FORMAT_TYPES[index];
}
const getMockMovie = () => {
  return {
    format: getMockFormat(),
    length: `${Math.round(Math.random() * 300)} min`,
    releaseYear: 1900 + Math.round(Math.random() * 200),
    rating: 1 + Math.round(Math.random() * 4)
  };
};
module.exports.getMockMovie = getMockMovie;

// created mocks
const mockMovieOne = getMockMovie();
const mockMovieTwo = getMockMovie();

mockMovieOne.title = faker.random.word();
mockMovieTwo.title = faker.random.word();

const mockMovieList = [mockMovieOne, mockMovieTwo];

module.exports.mockMovieOne = mockMovieOne;
module.exports.mockMovieTwo = mockMovieTwo;
module.exports.mockMovieList = mockMovieList;

const getRandomMockedMovie = () => {
  return Math.random() > 0.5 ? mockMovieOne : mockMovieTwo;
};
module.exports.getRandomMockedMovie = getRandomMockedMovie;

const mockTableSchema = {
  table: {
    tableName: process.env.DYNAMODB_MOVIES_TABLE
  }
};
module.exports.mockTableSchema = mockTableSchema;

// aws mocks
aws.mock('DynamoDB', 'describeTable', async (params) => {
  if (process.env.DYNAMODB_MOVIES_TABLE === 'error') {
    throw new Error('Internal Server Error');
  }

  return mockTableSchema;
});

aws.mock('DynamoDB.DocumentClient', 'delete', async (params) => {
  if (params.Key.title === 'error') {
    throw new Error('Internal Server Error');
  }

  return 'Success';
});

aws.mock('DynamoDB.DocumentClient', 'get', async (params) => {
  const { title } = params.Key;
  const res = {};
  
  if (title === 'error') {
    throw new Error('Internal Server Error');
  }
  
  if (title === mockMovieOne.title) {
    res.Item = mockMovieOne;
  } else if (title === mockMovieTwo.title) {
    res.Item = mockMovieTwo;
  }

  return res;
});

aws.mock('DynamoDB.DocumentClient', 'put', async (params) => {
  if (params.Item.title === 'error') {
    throw new Error('Internal Server Error');
  }

  return 'Success';
});

aws.mock('DynamoDB.DocumentClient', 'scan', async (params) => {
  if (process.env.DYNAMODB_MOVIES_TABLE === 'error') {
    throw new Error('Internal Server Error');
  }

  return { Items: mockMovieList };
});

aws.mock('DynamoDB.DocumentClient', 'update', async (params) => {
  if (params.Key.title === 'error') {
    throw new Error('Internal Server Error');
  }

  const keys = Object.keys(params.ExpressionAttributeValues);
  const values = Object.values(params.ExpressionAttributeValues);

  const Attributes = keys.reduce((hash, key, index) => {
    const correctedKey = key.replace(':', '');
    hash[correctedKey] = values[index];
    return hash;
  }, {});

  return { Attributes };
});
