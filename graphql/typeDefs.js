const { gql } = require("apollo-server-core");

module.exports = gql`
  type Query {
    "A simple type for getting started!"
    hello: String
  }
`;
