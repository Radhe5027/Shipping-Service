const { models } = require("../../database/db");
const { shipments, users, shipment_locations } = models;

exports.createShipment = async (req, res) => {
  try {
    console.log("Incoming request body:", req.body); // Debug the incoming request

    const {
      sender_id,
      reciver_name,
      reciver_address,
      status,
      sender_address,
      sender_latitude,
      sender_longitude,
      reciver_latitude,
      reciver_longitude,
    } = req.body;

    // Validate required fields
    if (
      !sender_id ||
      !reciver_name ||
      !reciver_address ||
      !sender_address ||
      !sender_latitude ||
      !sender_longitude ||
      !reciver_latitude ||
      !reciver_longitude
    ) {
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
      sender_address,
      sender_latitude,
      sender_longitude,
    });

    // Create only one location record for the receiver
    const receiverLocation = await shipment_locations.create({
      shipment_id: shipment.id, // Link to the created shipment
      latitude: reciver_latitude,
      longitude: reciver_longitude,
    });

    // Respond with success message and shipment and location data
    console.log("Shipment created:", shipment);
    console.log("Receiver location created:", receiverLocation);

    res.status(201).json({
      message: "Shipment created successfully",
      shipment,
      receiverLocation,
    });
  } catch (error) {
    console.error("Error creating shipment:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getAllShipments = async (req, res) => {
  try {
    const { id: userId, role_id } = req.user; // Assuming the user is attached to the request object after `verifyToken` middleware

    // If the user is an admin (role_id = 2), fetch all shipments with sender details
    if (role_id === 2) {
      const shipmentsList = await shipments.findAll({
        include: [
          {
            model: users, // Include the users model
            as: "sender", // Alias defined in init-models.js
            attributes: ["username"], // Fetch only the username from the users table
          },
        ],
      });
      return res.status(200).json({ shipments: shipmentsList });
    }

    // If the user is not an admin, fetch shipments specific to their `sender_id`
    const { sender_id } = req.query; // Get sender_id from the query parameter

    if (sender_id && sender_id != userId) {
      return res
        .status(403)
        .json({ error: "You can only view your own shipments." });
    }

    // Fetch shipments for the user with sender details
    const shipmentsList = await shipments.findAll({
      where: {
        sender_id: userId, // Only return shipments belonging to the logged-in user
      },
      include: [
        {
          model: users, // Include sender details
          as: "sender", // Alias defined in init-models.js
          attributes: ["username"], // Fetch only the username from the users table
        },
      ],
    });

    // Send the shipments data in the response
    if (shipmentsList.length === 0) {
      return res
        .status(404)
        .json({ message: "No shipments found. Please create a shipment!" });
    }

    res.status(200).json({ shipments: shipmentsList });
  } catch (error) {
    console.error("Error fetching shipments:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getShipmentByTrackingId = async (req, res) => {
  try {
    const { tracking_id } = req.params;

    // Fetch shipment details
    const shipment = await shipments.findOne({
      where: { tracking_id },
    });

    if (!shipment) {
      return res
        .status(404)
        .json({ error: "Kindly Enter Correct Shipping Id" });
    }

    // Fetch shipment locations
    const locations = await shipment_locations.findAll({
      where: { shipment_id: shipment.id }, // Use shipment.id as the foreign key
      attributes: ["latitude", "longitude"], // Only select required fields
    });

    // Format response
    res.status(200).json({
      shipment: {
        tracking_id: shipment.tracking_id,
        reciver_name: shipment.reciver_name,
        status: shipment.status,
        reciver_address: shipment.reciver_address,
        sender_address: shipment.sender_address,
        sender_latitude: shipment.sender_latitude,
        sender_longitude: shipment.sender_longitude,
      },
      locations: locations.map((location) => ({
        latitude: parseFloat(location.latitude),
        longitude: parseFloat(location.longitude),
      })),
    });
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
