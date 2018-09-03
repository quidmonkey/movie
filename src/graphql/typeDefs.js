const { gql } = require('apollo-server-lambda');

module.exports = gql`
  type Movie {
    title: String!
    format: String!
    length: String!
    releaseYear: String!
    rating: Int!
  }

  type Query {
    getMovie(title: String!): Movie!

    getUser(username: String!): User!
  }

  type User {
    username: String!
    password: String!
    scopes: [String!]
  }
`;
