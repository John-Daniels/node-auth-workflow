const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, unique: true },
    password: String,
    email: {
      type: String,
      unique: true,
    },
    tokens: [
      {
        token: String,
      },
    ],
  },
  {
    timestamps: true,
    toJSON: true,
  }
);

userSchema.methods.toJSON = function () {
  const user = this;
  const userObj = user.toObject();

  delete userObj.password;
  delete userObj.tokens;

  return userObj;
};

userSchema.methods.generateAuthToken = async function () {
  const user = this;

  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

  user.tokens = user.tokens.concat({ token });
  await user.save();

  return token;
};

userSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

userSchema.statics.login = async (email, password) => {
  return new Promise(async (res, rej) => {
    const user = await User.findOne({ email });
    if (!user) return rej({ error: "Provide valid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return rej({ error: "Provide valid credentials" });

    const token = await user.generateAuthToken();
    const obscuredUser = user.toJSON();

    res({ ...obscuredUser, token });
  });
};

userSchema.methods.logout = async function (token) {
  const user = this;
  const currentToken = token;

  user.tokens = user.tokens.filter((token) => token.token !== currentToken);
  await user.save();

  return user;
};

const User = mongoose.model("users", userSchema);

module.exports = User;
