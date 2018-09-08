/**
 * This file needs to be required prior to serverless-dynamodb-client
 * being required in order to mock out the aws-sdk
 */
const aws = require('aws-sdk-mock');
const faker = require('faker');

process.env.DYNAMODB_MOVIES_TABLE = 'foobar';

const MOCK_FORMAT_TYPES = ['BLURAY', 'DVD', 'STREAMING'];
const getMockFormat = (index) => MOCK_FORMAT_TYPES[index];
const getMockMovie = () => {
  return {
    format: getMockFormat(Math.round(Math.random() * MOCK_FORMAT_TYPES.length)),
    length: `${Math.round(Math.random() * 300)} min`,
    releaseYear: 1900 + Math.round(Math.random() * 200),
    rating: 1 + Math.round(Math.random() * 4)
  };
};
module.exports.getMockMovie = getMockMovie;

const mockMovieOne = getMockMovie();
const mockMovieTwo = getMockMovie();

mockMovieOne.title = faker.random.word();
mockMovieTwo.title = faker.random.word();

module.exports.mockMovieOne = mockMovieOne;
module.exports.mockMovieTwo = mockMovieTwo;

aws.mock('DynamoDB.DocumentClient', 'put', 'Success');
aws.mock('DynamoDB.DocumentClient', 'get', async (params) => {
  return {
    Item: params.Key.title === mockMovieOne.title ? mockMovieOne : mockMovieTwo
  };
});
aws.mock('DynamoDB.DocumentClient', 'scan', { Items: [mockMovieOne, mockMovieTwo] });
aws.mock('DynamoDB.DocumentClient', 'update', async (params) => {
  const keys = Object.values(params.ExpressionAttributeNames);
  const values = Object.values(params.ExpressionAttributeValues);

  const Attributes = keys.reduce((hash, key, index) => {
    hash[key] = values[index];
    return hash;
  }, {});

  return { Attributes };
});
