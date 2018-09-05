const { gql } = require('apollo-server-lambda');

module.exports = gql`
  input CreateMovieInput {
    title: String!
    format: String!
    length: String!
    releaseYear: String!
    rating: Int!
  }

  input UpdateMovieInput {
    format: String
    length: String
    releaseYear: String
    rating: Int
  }

  type Movie {
    title: String
    format: String
    length: String
    releaseYear: String
    rating: Int
  }

  type Mutation {
    createMovie(movie: CreateMovieInput): Movie,
    updateMovie(title: String!, movie: UpdateMovieInput): Movie
  }

  type Query {
    movie(title: String): Movie,
    movies: [Movie]
  }
`;
