const { gql } = require("apollo-server-core");

module.exports = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    createdAt: String!
  }

  type Error {
    path: String!
    message: String!
  }

  type RegisterResponse {
    status: Boolean!
    user: User
    errors: [Error!]
  }

  type LoginResponse {
    status: Boolean!
    accessToken: String
    refreshToken: String
    errors: [Error!]
  }

  type Query {
    me: User!
  }

  type Mutation {
    register(
      username: String!
      password: String!
      email: String!
    ): RegisterResponse!
    login(email: String!, password: String!): LoginResponse
  }
`;
