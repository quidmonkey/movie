const { ApolloServer } = require('apollo-server-lambda');

const resolvers = require('./resolvers');
const typeDefs = require('./typeDefs');

const server = new ApolloServer({
  resolvers,
  typeDefs,
  context: ({ event, context }) => ({
    headers: event.headers,
    functionName: context.functionName,
    event,
    context
  })
});

module.exports.graphql = server.createHandler();
