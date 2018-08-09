// Test Script for DynamoDB JavaScript Shell (http://locahost:3000/shell)

var params = {
    TableName: 'movies',
    KeySchema: [ // The type of of schema.  Must start with a HASH type, with an optional second RANGE.
        { // Required HASH type attribute
            AttributeName: 'title',
            KeyType: 'HASH',
        }
    ],
    AttributeDefinitions: [ // The names and types of all primary and index key attributes only
        {
            AttributeName: 'title',
            AttributeType: 'S', // (S | N | B) for string, number, binary
        }
    ],
    ProvisionedThroughput: { // required provisioned throughput for the table
        ReadCapacityUnits: 1, 
        WriteCapacityUnits: 1, 
    }
};
dynamodb.createTable(params, function(err, data) {
    if (err) ppJson(err); // an error occurred
    else ppJson(data); // successful response
});

var timestamp = Date.now();
var params = {
    TableName: 'movies',
    Item: { // a map of attribute name to AttributeValue
      //id: uuid.v1(),
      createdAt: timestamp,
      updatedAt: timestamp,

      title: 'Star Wars: Episode IV - A New Hope',
      format: 'Streaming',
      length: '121 min',
      releaseYear: 1977,
      rating: 5
    }
};

docClient.put(params, function(err, data) {
    if (err) ppJson(err); // an error occurred
    else ppJson(data); // successful response
});

var readParams = {
    TableName: 'movies',
    Key: { // a map of attribute name to AttributeValue for all primary key attributes
        title: 'Star Wars: Episode IV - A New Hope'
    }
};
docClient.get(readParams, function(err, data) {
    if (err) ppJson(err); // an error occurred
    else ppJson(data); // successful response
});
