const ddb = require('serverless-dynamodb-client');

jest.mock('serverless-dynamodb-client');

const { list } = require('./list');

process.env.DYNAMODB_TABLE = 'foo';

const dynamoDb = ddb.doc;

it('list: should get all DynamoDb entries', () => {
  const mockRes = 'foo';
  const mockCallback = jest.fn().mockImplementation((err, res) => {
    const expectedRes = {
      statusCode: 200,
      body: JSON.stringify(mockRes)
    };
    
    expect(err).toBeNull();
    expect(res).toEqual(expectedRes);
  });

  jest.fn(dynamoDb.get).mockImplementation((params, callback) => {
    const expectedParams = {
      TableName: 'foo'
    };

    expect(params).toEqual(expectedParams);

    callback(null, mockRes);
  });

  list({}, {}, mockCallback);
});

it('list: should handle DynamoDb get all entries error', () => {
  const mockErr = new Error('foo');
  const mockCallback = jest.fn().mockImplementation((err, res) => {
    const expectedRes = {
      statusCode: 501,
      body: 'Couldn\'t fetch any movies.'
    };

    expect(err).toBeNull();
    expect(res).toEqual(expectedRes);
  });

  jest.fn(dynamoDb.list).mockImplementation((params, callback) => {
    callback(mockErr, null);
  });

  list({}, {}, mockCallback);
});
