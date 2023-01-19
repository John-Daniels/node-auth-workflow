const { Router } = require("express");

const userRouter = require("./users.route");
const router = Router();

router.use("/users", userRouter);

module.exports = router;
