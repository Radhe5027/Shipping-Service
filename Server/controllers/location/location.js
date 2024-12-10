const { shipments, users, shipment_locations } =
  require("../../database/db").models;
const bcrypt = require("bcryptjs"); // For password hashing
const jwt = require("jsonwebtoken");

exports.addOrUpdateShipmentLocation = async (req, res) => {
  try {
    const { id } = req.params; // Shipment ID from URL
    const { latitude, longitude } = req.body; // Data from request body

    // Validate input
    if (!id || !latitude || !longitude) {
      return res
        .status(400)
        .json({ error: "Missing required fields (id, latitude, longitude)" });
    }

    // Check if the shipment location already exists
    const existingLocation = await shipment_locations.findOne({
      where: { shipment_id: id },
    });

    if (existingLocation) {
      // Update the existing location
      existingLocation.latitude = latitude;
      existingLocation.longitude = longitude;
      existingLocation.timestamp = new Date(); // Update timestamp

      await existingLocation.save(); // Save updated location
      return res.status(200).json({
        message: "Shipment location updated successfully",
        location: existingLocation,
      });
    }

    // Add a new location
    const newLocation = await shipment_locations.create({
      shipment_id: id,
      latitude,
      longitude,
      timestamp: new Date(),
    });

    return res.status(201).json({
      message: "Shipment location added successfully",
      location: newLocation,
    });
  } catch (error) {
    console.error("Error in addOrUpdateShipmentLocation:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
