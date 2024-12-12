const express = require("express");
const router = express.Router();
const {
  createShipment,
  getAllShipments,
  getShipmentByTrackingId,
  updateShipmentStatus,
  deleteShipment,
} = require("../controllers/shipment/shipment");
const { verifyToken } = require("../middleware/verifyToken");
const { verifyAdmin } = require("../middleware/verifyAdmin");

// Routes
router.post("/api/shipping", verifyToken, createShipment); // POST /api/shipments
router.get("/api/shipping", verifyToken, getAllShipments); // GET /api/shipments
router.get("/api/shipping/:tracking_id", verifyToken, getShipmentByTrackingId); // GET /api/shipments/:tracking_id
router.put(
  "/api/shipping/:id/status",
  verifyToken,
  verifyAdmin,
  updateShipmentStatus
); // PUT /api/shipments/:id/status
router.delete("/api/shipping/:id", verifyToken, deleteShipment); // DELETE /api/shipments/:id

module.exports = router;
