const { models } = require("../../database/db"); // Import database models
const { shipment_locations } = models; // Extract 'shipment_locations' model

// Function to handle adding or updating a shipment location
exports.addOrUpdateShipmentLocation = async (req, res) => {
  try {
    const { id } = req.params; // Extract shipment ID from the URL
    const { latitude, longitude } = req.body; // Extract latitude and longitude from the request body

    // Validate input to ensure all required fields are provided
    if (!id || !latitude || !longitude) {
      return res
        .status(400)
        .json({ error: "Missing required fields (id, latitude, longitude)" });
    }

    // Check if a shipment location already exists for the given shipment ID
    const existingLocation = await shipment_locations.findOne({
      where: { shipment_id: id }, // Match based on shipment ID
    });

    if (existingLocation) {
      // Update the existing shipment location record
      existingLocation.latitude = latitude; // Update latitude
      existingLocation.longitude = longitude; // Update longitude
      existingLocation.timestamp = new Date(); // Update timestamp to current time

      await existingLocation.save(); // Save the updated location to the database

      // Respond with a success message and the updated location
      return res.status(200).json({
        message: "Shipment location updated successfully",
        location: existingLocation,
      });
    }

    // If no existing location, create a new record
    const newLocation = await shipment_locations.create({
      shipment_id: id, // Set shipment ID
      latitude, // Set latitude
      longitude, // Set longitude
      timestamp: new Date(), // Set the current time as the timestamp
    });

    // Respond with a success message and the newly created location
    return res.status(201).json({
      message: "Shipment location added successfully",
      location: newLocation,
    });
  } catch (error) {
    // Log any errors to the console for debugging
    console.error("Error in addOrUpdateShipmentLocation:", error.message);

    // Respond with a generic error message in case of server failure
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
