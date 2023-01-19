const User = require("../models/User.model");

const getAllUsers = async (req, res) => {
  const users = await User.find();
  res.send(users);
};

const getUserProfile = async (req, res) => {
  res.send(req.user);
};

const createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    await user.save();

    const token = await user.generateAuthToken();
    const obscuredUser = user.toJSON();

    res.status(201).send({ ...obscuredUser, token });
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    res.status(200).send(user);
  } catch (e) {
    if (e.error) return res.status(400).send(e);
    res.status(500).send({ message: "Something went wrong" });
  }
};

const logout = async (req, res) => {
  try {
    await req.user.logout(req.token);
    res.status(200).send({ message: "succesfully logged out!" });
  } catch (e) {
    console.log(e);
    res.status(500).send({ message: "Something went wrong" });
  }
};

module.exports = {
  getAllUsers,
  getUserProfile,
  createUser,
  login,
  logout,
};
