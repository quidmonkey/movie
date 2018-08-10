const ddb = require('serverless-dynamodb-client');

const { list } = require('./list');

process.env.DYNAMODB_TABLE = 'foo';

const dynamoDb = ddb.doc;

it('list: should get all DynamoDb entries', () => {
  const mockRes = 'foo';
  const mockCallback = jest.fn().mockImplementation((err, res) => {
    const expectedRes = {
      statusCode: 200,
      body: JSON.stringify([mockRes])
    };
    
    expect(err).toBeNull();
    expect(res).toEqual(expectedRes);
  });

  dynamoDb.scan = jest.fn(dynamoDb.scan).mockImplementation((params, callback) => {
    const expectedParams = {
      TableName: 'foo'
    };

    expect(params).toEqual(expectedParams);

    callback(null, {
      Items: [mockRes]
    });
  });

  list({}, {}, mockCallback);
});

it('list: should handle DynamoDb get all entries error', () => {
  const mockErr = new Error('foo');
  const mockCallback = jest.fn().mockImplementation((err, res) => {
    const expectedRes = {
      statusCode: 501,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Couldn\'t fetch any movies.'
    };

    expect(err).toBeNull();
    expect(res).toEqual(expectedRes);
  });

  dynamoDb.scan = jest.fn(dynamoDb.scan).mockImplementation((params, callback) => {
    callback(mockErr, null);
  });

  list({}, {}, mockCallback);
});
