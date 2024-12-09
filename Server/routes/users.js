const express = require("express");
const router = express.Router();
const {
  signupUsers,
  signinUsers,
} = require("../controllers/authenticate/users");

router.post("/api/signup", signupUsers);
//router.delete("/api/user/:userId", deleteUser);
router.post("/api/login", signinUsers);
//router.post("/api/logout", logoutUsers);

module.exports = router;
