const { verify } = require("jsonwebtoken");
const User = require("../models/User.model");

const verifyAuthToken = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    if (!token) return res.status(401).send({ message: "unauthenticated" });

    const decoded = verify(token, process.env.JWT_SECRET);
    if (!decoded) return res.status(401).send({ message: "unauthenticated" });

    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });

    if (!user) return res.status(401).send({ message: "unauthenticated" });

    req.user = user;
    req.token = token;

    next();
  } catch (e) {
    res.status(401).send({ message: "unauthenticated" });
  }
};

module.exports = {
  verifyAuthToken,
};
