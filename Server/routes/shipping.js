// Import the express module to create a new express app and handle routing
const express = require("express");

// Create a new router instance to define routes
const router = express.Router();

// Import the controller functions for handling shipment-related operations
const {
  createShipment, // Function to create a new shipment
  getAllShipments, // Function to retrieve all shipments
  getShipmentByTrackingId, // Function to get a shipment by its tracking ID
  updateShipmentStatus, // Function to update the status of a shipment
  deleteShipment, // Function to delete a shipment
} = require("../controllers/shipment/shipment");

// Import the middleware functions for verifying tokens and admin roles
const { verifyToken } = require("../middleware/verifyToken"); // Middleware to verify if the user is authenticated
const { verifyAdmin } = require("../middleware/verifyAdmin"); // Middleware to check if the user is an admin

// Define the routes for shipment operations:

// POST route to create a new shipment, with token verification for authentication
router.post("/api/shipping", verifyToken, createShipment); // POST /api/shipments

// GET route to retrieve all shipments, with token verification for authentication
router.get("/api/shipping", verifyToken, getAllShipments); // GET /api/shipments

// GET route to retrieve a specific shipment by its tracking ID, with token verification for authentication
router.get("/api/shipping/:tracking_id", verifyToken, getShipmentByTrackingId); // GET /api/shipments/:tracking_id

// PUT route to update the status of a specific shipment by its ID, with token and admin verification
router.put(
  "/api/shipping/:id/status", // URL with the shipment ID and the status path
  verifyToken, // Verify the user's authentication
  verifyAdmin, // Verify the user's admin role for authorization
  updateShipmentStatus // Controller function to handle status update
); // PUT /api/shipments/:id/status

// DELETE route to delete a specific shipment by its ID, with token verification for authentication
router.delete("/api/shipping/:id", verifyToken, deleteShipment); // DELETE /api/shipments/:id

// Export the router so it can be used in the main app file for routing
module.exports = router;
