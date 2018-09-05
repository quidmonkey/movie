const { gql } = require('apollo-server-lambda');

module.exports = gql`
  enum Formats {
    BLURAY
    DVD
    STREAMING
  }

  input CreateMovieInput {
    title: String!
    format: Formats!
    length: String!
    releaseYear: String!
    rating: Int!
  }

  input UpdateMovieInput {
    format: Formats
    length: String
    releaseYear: String
    rating: Int
  }

  type Movie {
    title: String
    format: Formats
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
