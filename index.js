const express = require("express");
const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers/");
const connectToDB = require("./db");
const { ApolloServer } = require("apollo-server-express");
const { generateNewToken } = require("./helper/auth");
const User = require("./models/User");
require("dotenv").config();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req, res }) => {
    let user;

    if (req.headers["x-auth-token"] && req.headers["x-refresh-token"]) {
      try {
        const accessToken = req.headers["x-auth-token"];
        const { id } = await jwt.verify(accessToken, process.env.ACCESS_KEY);
        user = await User.findById(id);
      } catch (e) {
        const refreshToken = req.headers["x-refresh-token"];
        const newToken = await generateNewToken(refreshToken);
        if (newToken.accessToken && newToken.refreshToken) {
          res.set("Access-Control-Expose-Headers", "x-auth-token");
          res.set("x-auth-token", newToken.accessToken);

          return {
            me: newToken.user,
            req,
            res,
          };
        }
      }
    }

    return {
      me: user,
      req,
      res,
    };
  },
});

connectToDB();

const app = express();
server.applyMiddleware({ app });

app.listen({ port: process.env.PORT }, () =>
  console.log(
    `🚀 Server ready at http://localhost:${process.env.PORT}${server.graphqlPath}`
  )
);
