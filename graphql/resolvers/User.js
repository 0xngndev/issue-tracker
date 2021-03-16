const { create } = require("../../models/User");
const User = require("../../models/User");

module.exports = {
  Query: {
    me: async (_, args, context) => {},
  },
  Mutation: {
    register: async (_, args, context) => {
      try {
        const user = await create({ ...args });
        return {
          status: true,
          user,
          errors: [],
        };
      } catch (error) {
        console.log(error);
      }
    },
    login: async (_, args, context) => {},
  },
};
