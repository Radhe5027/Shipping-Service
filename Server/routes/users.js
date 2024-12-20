// Import the express module to create a new express app and handle routing
const express = require("express");

// Create a new router instance to define routes
const router = express.Router();

// Import the controller functions for handling user authentication operations
const {
  signupUsers, // Function to handle user signup
  signinUsers, // Function to handle user login
} = require("../controllers/authenticate/users");

// Define the routes for user authentication:

// POST route to handle user signup
router.post("/api/signup", signupUsers); // POST /api/signup

// POST route to handle user login
router.post("/api/login", signinUsers); // POST /api/login

// Export the router so it can be used in the main app file for routing
module.exports = router;
