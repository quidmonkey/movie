const ddb = require('serverless-dynamodb-client');

const { get } = require('./get');

process.env.DYNAMODB_TABLE = 'foo';

const dynamoDb = ddb.doc;
const mockMovieTitle = 'foo';
const mockEvent = {
  pathParameters: {
    title: mockMovieTitle
  }
};

it('get: should get a DynamoDb entry', () => {
  const mockRes = 'foo';
  const mockCallback = jest.fn().mockImplementation((err, res) => {
    const expectedRes = {
      statusCode: 200,
      body: JSON.stringify(mockRes)
    };
    
    expect(err).toBeNull();
    expect(res).toEqual(expectedRes);
  });

  dynamoDb.get = jest.fn(dynamoDb.get).mockImplementation((params, callback) => {
    const expectedParams = {
      TableName: 'foo',
      Key: {
        title: mockMovieTitle
      }
    };

    expect(params).toEqual(expectedParams);

    callback(null, {
      Item: mockRes
    });
  });

  get(mockEvent, {}, mockCallback);
});

it('get: should handle a DynamoDb get entry error', () => {
  const mockErr = new Error('foo');
  const mockCallback = jest.fn().mockImplementation((err, res) => {
    const expectedRes = {
      statusCode: 501,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Couldn\'t fetch the movie.'
    };

    expect(err).toBeNull();
    expect(res).toEqual(expectedRes);
  });

  dynamoDb.get = jest.fn(dynamoDb.get).mockImplementation((params, callback) => {
    callback(mockErr, null);
  });

  get(mockEvent, {}, mockCallback);
});
