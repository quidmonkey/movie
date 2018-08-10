const ddb = require('serverless-dynamodb-client');

jest.mock('serverless-dynamodb-client');

const del = require('./delete').delete;

process.env.DYNAMODB_TABLE = 'foo';

const dynamoDb = ddb.doc;
const mockMovieTitle = 'foo';
const mockEvent = {
  pathParameters: {
    title: mockMovieTitle
  }
};

it('delete: should delete a DynamoDb entry', () => {
  const mockRes = {};
  const mockCallback = jest.fn().mockImplementation((err, res) => {
    const expectedRes = {
      statusCode: 200,
      body: JSON.stringify(mockRes)
    };
    
    expect(err).toBeNull();
    expect(res).toEqual(expectedRes);
  });

  jest.fn(dynamoDb.delete).mockImplementation((params, callback) => {
    const expectedParams = {
      TableName: 'foo',
      Key: {
        title: mockMovieTitle
      }
    };

    expect(params).toEqual(expectedParams);

    callback(null, mockRes);
  });

  del(mockEvent, {}, mockCallback);
});

it('delete: should handle DynamoDb delete entry failures', () => {
  const mockErr = new Error('foo');
  const mockCallback = jest.fn().mockImplementation((err, res) => {
    const expectedRes = {
      statusCode: 501,
      body: 'Couldn\'t remove the movie.'
    };

    expect(err).toBeNull();
    expect(res).toEqual(expectedRes);
  });

  jest.fn(dynamoDb.delete).mockImplementation((params, callback) => {
    callback(mockErr, null);
  });

  del(mockEvent, {}, mockCallback);
});
