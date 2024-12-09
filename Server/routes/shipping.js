const verifyAdmin = require("../middleware/verifyAdmin");
const verifyToken = require("../middleware/verifyToken");

const express = require("express");
const router = express.Router();
const {
  createShipment,
  getAllShipments,
  getShipmentByTrackingId,
  updateShipmentStatus,
  deleteShipment,
} = require("../controllers/shipment/shipment");

// Routes
router.post("/api/shipments", verifyToken, createShipment);
router.get("/api/shipments", verifyToken, getAllShipments);
router.get("/api/shipments/:tracking_id", verifyToken, getShipmentByTrackingId);
router.put(
  "/api/shipments/:id/status",
  verifyToken,
  verifyAdmin,
  updateShipmentStatus
);
router.delete("/api/shipments/:id", verifyToken, deleteShipment);
module.exports = router;
