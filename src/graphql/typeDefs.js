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
    movie(title: String!): Movie!
    movies: [Movie],
    user(username: String!): User!
  }
`;
