const { gql } = require('apollo-server-lambda');

module.exports = gql`
  input MovieInput {
    title: String
    format: String
    length: String
    releaseYear: String
    rating: Int
  }

  type Movie {
    title: String!
    format: String!
    length: String!
    releaseYear: String!
    rating: Int!
  }

  type Mutation {
    createMovie(movie: MovieInput!): Movie
  }

  type Query {
    movie(title: String!): Movie
    movies: [Movie]
  }
`;
