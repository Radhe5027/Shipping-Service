// Import necessary models from the database
const { models } = require("../../database/db");
const { shipments, users, shipment_locations } = models;

// Controller to handle the creation of a shipment
exports.createShipment = async (req, res) => {
  try {
    console.log("Incoming request body:", req.body); // Log the incoming request for debugging purposes

    // Destructure necessary fields from the request body
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

    // Validate that all required fields are provided
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
      return res.status(400).json({ error: "All fields are required" }); // Respond with error if validation fails
    }

    // Check if the sender exists in the database by their ID
    const senderExists = await users.findByPk(sender_id);
    if (!senderExists) {
      console.log(`Sender with ID ${sender_id} not found`);
      return res.status(400).json({ error: "Sender ID does not exist" }); // Respond with error if sender is not found
    }

    // Generate a unique tracking ID for the shipment
    const tracking_id = `SHIP-${Date.now()}`;
    console.log("Generated tracking ID:", tracking_id); // Log the generated tracking ID for debugging

    // Create a new shipment record in the database
    const shipment = await shipments.create({
      sender_id,
      reciver_name,
      reciver_address,
      status: status || "Placed", // Default status is "Placed" if not provided
      tracking_id,
      sender_address,
      sender_latitude,
      sender_longitude,
    });

    // Create a record for the receiver's location linked to the shipment
    const receiverLocation = await shipment_locations.create({
      shipment_id: shipment.id, // Link the location to the newly created shipment
      latitude: reciver_latitude,
      longitude: reciver_longitude,
    });

    console.log("Shipment created:", shipment); // Log the created shipment details
    console.log("Receiver location created:", receiverLocation); // Log the created receiver location details

    // Respond with success message and data
    res.status(201).json({
      message: "Shipment created successfully",
      shipment,
      receiverLocation,
    });
  } catch (error) {
    console.error("Error creating shipment:", error.message); // Log the error for debugging
    res.status(500).json({ error: "Internal Server Error" }); // Respond with a server error
  }
};

// Controller to fetch all shipments
exports.getAllShipments = async (req, res) => {
  try {
    const { id: userId, role_id } = req.user; // Extract user details from request object (added by middleware)

    // Admin users (role_id = 2) can fetch all shipments along with sender details
    if (role_id === 2) {
      const shipmentsList = await shipments.findAll({
        include: [
          {
            model: users, // Include user details (sender details)
            as: "sender", // Use the alias defined in the model association
            attributes: ["username"], // Fetch only the username of the sender
          },
        ],
      });
      return res.status(200).json({ shipments: shipmentsList }); // Respond with the list of all shipments
    }

    // Non-admin users can only fetch their own shipments
    const { sender_id } = req.query; // Extract sender_id from query parameters

    if (sender_id && sender_id != userId) {
      return res
        .status(403)
        .json({ error: "You can only view your own shipments." }); // Respond with forbidden error if user tries to access others' shipments
    }

    const shipmentsList = await shipments.findAll({
      where: {
        sender_id: userId, // Fetch shipments belonging to the logged-in user
      },
      include: [
        {
          model: users, // Include sender details
          as: "sender",
          attributes: ["username"],
        },
      ],
    });

    if (shipmentsList.length === 0) {
      return res
        .status(404)
        .json({ message: "No shipments found. Please create a shipment!" }); // Respond if no shipments are found
    }

    res.status(200).json({ shipments: shipmentsList }); // Respond with the list of shipments
  } catch (error) {
    console.error("Error fetching shipments:", error.message); // Log error for debugging
    res.status(500).json({ error: "Internal Server Error" }); // Respond with server error
  }
};

// Controller to fetch shipment details by tracking ID
exports.getShipmentByTrackingId = async (req, res) => {
  try {
    const { tracking_id } = req.params; // Extract tracking ID from URL parameters

    // Find the shipment with the provided tracking ID
    const shipment = await shipments.findOne({
      where: { tracking_id },
    });

    if (!shipment) {
      return res
        .status(404)
        .json({ error: "Kindly Enter Correct Shipping Id" }); // Respond if shipment not found
    }

    // Fetch associated locations for the shipment
    const locations = await shipment_locations.findAll({
      where: { shipment_id: shipment.id },
      attributes: ["latitude", "longitude"], // Fetch only the required fields
    });

    // Respond with shipment and location details
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

// Controller to update shipment status
exports.updateShipmentStatus = async (req, res) => {
  try {
    const { id } = req.params; // Extract shipment ID from URL parameters
    const { status } = req.body; // Extract status from request body

    // Validate that the status is one of the allowed values
    if (!["Placed", "In Transit", "Delivered"].includes(status)) {
      return res.status(400).json({ error: "Invalid status value" }); // Respond with error for invalid status
    }

    // Update the shipment status
    const updated = await shipments.update({ status }, { where: { id } });

    if (updated[0] === 0) {
      return res.status(404).json({ error: "Shipment not found" }); // Respond if shipment not found
    }

    res.status(200).json({ message: "Shipment status updated successfully" }); // Respond with success message
  } catch (error) {
    console.error("Error updating shipment status:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Controller to delete a shipment
exports.deleteShipment = async (req, res) => {
  try {
    const { id } = req.params; // Extract shipment ID from URL parameters

    // Delete the shipment
    const deleted = await shipments.destroy({
      where: { id },
    });

    if (!deleted) {
      return res.status(404).json({ error: "Shipment not found" }); // Respond if shipment not found
    }

    res.status(200).json({ message: "Shipment deleted successfully" }); // Respond with success message
  } catch (error) {
    console.error("Error deleting shipment:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
