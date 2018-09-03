const server = require('apollo-server-lambda');

module.exports.graphiql = server.graphiqlLambda({
  endpointURL: '/graphql'
});
