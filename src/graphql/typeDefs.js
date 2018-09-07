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
    length: String! @contraint(pattern: "/ min$/")
    releaseYear: Int! @constraint(min: 1900, max: 2100)
    rating: Int! @constraint(min: 1, max: 5)
  }

  input UpdateMovieInput {
    format: Formats
    length: String @contraint(pattern: "/ min$/")
    releaseYear: Int @constraint(min: 1900, max: 2100)
    rating: Int
  }

  type Movie {
    title: String
    format: Formats
    length: String @contraint(pattern: "/ min$/")
    releaseYear: Int @constraint(min: 1900, max: 2100)
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
