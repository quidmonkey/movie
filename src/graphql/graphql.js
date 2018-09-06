const { ApolloServer } = require('apollo-server-lambda');
const ConstraintDirective = require('graphql-constraint-directive');

const { resolvers } = require('./resolvers');
const typeDefs = require('./typeDefs');

const server = new ApolloServer({
  resolvers,
  typeDefs,
  schemaDirectives: {
    constraint: ConstraintDirective
  },
  context: ({ event, context }) => ({
    headers: event.headers,
    functionName: context.functionName,
    event,
    context
  })
});

module.exports.graphql = server.createHandler();
