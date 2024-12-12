const express = require("express");
const router = express.Router();
const {
  addOrUpdateShipmentLocation,
} = require("../controllers/location/location");

const { verifyToken } = require("../middleware/verifyToken");

// Add or update shipment location
router.post(
  "/api/shipping/:id/location",
  verifyToken,
  addOrUpdateShipmentLocation
);

module.exports = router;
