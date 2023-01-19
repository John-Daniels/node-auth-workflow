const { Router } = require("express");
const {
  getAllUsers,
  createUser,
  login,
  logout,
  getUserProfile,
} = require("../controllers/users.controller");
const { verifyAuthToken } = require("../middlewares/auth.middleware");

const router = Router();

router.get("/", getAllUsers);
router.get("/profile", verifyAuthToken, getUserProfile);
router.post("/signup", createUser);
router.post("/login", login);
router.post("/logout", verifyAuthToken, logout);
module.exports = router;
