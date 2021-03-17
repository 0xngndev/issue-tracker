const jwt = require("jsonwebtoken");
const User = require("../models/User");

const createToken = async (user) => {
  const accessToken = await jwt.sign(
    {
      id: user.id,
    },
    process.env.ACCESS_KEY,
    { expiresIn: "10s" }
  );

  const refreshToken = await jwt.sign(
    { id: user.id },
    process.env.REFRESH_KEY,
    {
      expiresIn: "7d",
    }
  );

  return {
    accessToken,
    refreshToken,
  };
};

const generateNewToken = async (token) => {
  let userId = 0;

  try {
    const { id } = jwt.decode(token);
    userId = id;
  } catch (e) {
    return {};
  }

  if (!userId) {
    return {};
  }

  const user = await User.findById(userId);

  if (!user) {
    return {};
  }

  try {
    jwt.verify(token, process.env.REFRESH_KEY);
  } catch (e) {
    return {};
  }

  const { accessToken, refreshToken } = await createToken(user);
  return {
    accessToken,
    refreshToken,
    user,
  };
};

const attemptLogin = async ({ email, password }) => {
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return {
        ok: false,
        errors: [
          {
            path: "email",
            message: "Invalid email",
          },
        ],
      };
    }

    if (!(await user.comparePassword(password))) {
      return {
        ok: false,
        errors: [
          {
            path: "password",
            message: "Invalid password",
          },
        ],
      };
    }

    // # create our token
    const { accessToken, refreshToken } = await createToken(user);

    return {
      ok: true,
      accessToken,
      refreshToken,
    };
  } catch (e) {
    console.log(e);
  }
};

module.exports = {
  createToken,
  generateNewToken,
  attemptLogin,
};
