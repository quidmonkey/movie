const ddb = require('serverless-dynamodb-client');
const dynamoDb = ddb.raw;

const { schema } = require('./schema');

process.env.DYNAMODB_TABLE = 'foo';

it('schema: should request a DynamoDb table schema', () => {
  const mockRes = 'foo';
  const mockCallback = jest.fn().mockImplementation((err, res) => {
    const expectedRes = {
      statusCode: 200,
      body: JSON.stringify(mockRes)
    };
    
    expect(err).toBeNull();
    expect(res).toEqual(expectedRes);
  });

  dynamoDb.describeTable = jest.fn(dynamoDb.describeTable).mockImplementation((params, callback) => {
    const expectedParams = {
      TableName: 'foo'
    };
    expect(params).toEqual(expectedParams);

    callback(null, mockRes);
  });

  schema({}, {}, mockCallback);
});

it('schema: should handle DynamoDb table schema fetch errors', () => {
  const mockErr = new Error('foo');
  const mockCallback = jest.fn().mockImplementation((err, res) => {
    const expectedRes = {
      statusCode: 501,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Couldn\'t fetch table schema.'
    };
    
    expect(err).toBeNull();
    expect(res).toEqual(expectedRes);
  });

  dynamoDb.describeTable = jest.fn(dynamoDb.describeTable).mockImplementation((params, callback) => {
    callback(mockErr, null);
  });

  schema({}, {}, mockCallback);
});
