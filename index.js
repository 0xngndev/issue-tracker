const express = require("express");
const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers/");
const connectToDB = require("./db");
const { ApolloServer } = require("apollo-server-express");
const server = new ApolloServer({ typeDefs, resolvers });
require("dotenv").config();

connectToDB();

const app = express();
server.applyMiddleware({ app });

app.listen({ port: process.env.PORT }, () =>
  console.log(
    `🚀 Server ready at http://localhost:${process.env.PORT}${server.graphqlPath}`
  )
);
