const express = require("express");
const router = express.Router();
const {
  signupUsers,
  signinUsers,
} = require("../controllers/authenticate/users");

router.post("/api/signup", signupUsers);
router.post("/api/login", signinUsers);

module.exports = router;
