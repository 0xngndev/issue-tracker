const { attemptLogin } = require("../../helper/auth");
const { create } = require("../../models/User");
const User = require("../../models/User");

module.exports = {
  Query: {
    me: async (_, args, context) => {
      console.log(context.me);
      return User.findById(context.me.id);
    },
  },
  Mutation: {
    register: async (_, args, context) => {
      try {
        const user = await User.create({ ...args });
        return {
          status: true,
          user,
          errors: [],
        };
      } catch (error) {
        console.log(error);
      }
    },
    login: async (_, args, context) => {
      return {
        ...(await attemptLogin({ ...args })),
      };
    },
  },
};
