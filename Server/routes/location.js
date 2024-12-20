// Import the express module to create a new express app and handle routing
const express = require("express");

// Create a new router instance to define routes
const router = express.Router();

// Import the controller function to handle adding or updating shipment location
const {
  addOrUpdateShipmentLocation,
} = require("../controllers/location/location");

// Import the middleware function that will verify the JWT token for authorization
const { verifyToken } = require("../middleware/verifyToken");

// Define a POST route for adding or updating a shipment location
// The route is dynamic, using ":id" to capture the shipment ID
router.post(
  "/api/shipping/:id/location", // URL pattern where ":id" is a placeholder for the shipment ID
  verifyToken, // Middleware function that verifies the JWT token to ensure the user is authorized
  addOrUpdateShipmentLocation // The controller function that handles the logic for adding or updating the shipment location
);

// Export the router so it can be used in the main app file
module.exports = router;
