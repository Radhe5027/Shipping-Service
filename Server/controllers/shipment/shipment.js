const { shipments, users } = require("../../database/db").models;
const bcrypt = require("bcryptjs"); // For password hashing
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret"; // Replace with your secure key

exports.createShipment = async (req, res) => {
  try {
    console.log("Incoming request body:", req.body); // Debug the incoming request

    const { sender_id, reciver_name, reciver_address, status } = req.body;

    // Validate required fields
    if (!sender_id || !reciver_name || !reciver_address) {
      console.log("Validation failed: Missing fields");
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if the sender exists in the database
    const senderExists = await users.findByPk(sender_id);
    if (!senderExists) {
      console.log(`Sender with ID ${sender_id} not found`);
      return res.status(400).json({ error: "Sender ID does not exist" });
    }

    // Generate tracking ID
    const tracking_id = `SHIP-${Date.now()}`;
    console.log("Generated tracking ID:", tracking_id);

    // Create the shipment
    const shipment = await shipments.create({
      sender_id,
      reciver_name,
      reciver_address,
      status: status || "Placed", // Default to "Placed" if no status provided
      tracking_id,
    });

    // Respond with success message and shipment data
    console.log("Shipment created:", shipment);
    res.status(201).json({
      message: "Shipment created successfully",
      shipment,
    });
  } catch (error) {
    console.error("Error creating shipment:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getAllShipments = async (req, res) => {
  try {
    const shipmentsList = await shipments.findAll();
    res.status(200).json({ shipments: shipmentsList });
  } catch (error) {
    console.error("Error fetching shipments:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getShipmentByTrackingId = async (req, res) => {
  try {
    const { tracking_id } = req.params;

    const shipment = await shipments.findOne({
      where: { tracking_id },
    });

    if (!shipment) {
      return res.status(404).json({ error: "Shipment not found" });
    }

    res.status(200).json({ shipment });
  } catch (error) {
    console.error("Error fetching shipment by tracking ID:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateShipmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["Placed", "In Transit", "Delivered"].includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const updated = await shipments.update({ status }, { where: { id } });

    if (updated[0] === 0) {
      return res.status(404).json({ error: "Shipment not found" });
    }

    res.status(200).json({ message: "Shipment status updated successfully" });
  } catch (error) {
    console.error("Error updating shipment status:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.deleteShipment = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await shipments.destroy({
      where: { id },
    });

    if (!deleted) {
      return res.status(404).json({ error: "Shipment not found" });
    }

    res.status(200).json({ message: "Shipment deleted successfully" });
  } catch (error) {
    console.error("Error deleting shipment:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};