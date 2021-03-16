const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      minlength: 3,
      maxlength: 20,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      minlength: 6,
      required: true,
      trim: true,
      unique: true,
    },
  },
  { timestamps: true }
);

userSchema.plugin(uniqueValidator);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcryptjs.genSalt(10);
  const hash = await bcryptjs.hash(this.password, salt);
  this.password = hash;
  return next();
});

userSchema.methods.comparePassword = async function (password) {
  return await bcryptjs.compare(password, this.password);
};

module.exports = mongoose.model("user", userSchema);
