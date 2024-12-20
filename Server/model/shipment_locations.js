// Import Sequelize to access Sequelize functionality and DataTypes
const Sequelize = require("sequelize");

// Export a function that defines the "shipment_locations" model in Sequelize
module.exports = function (sequelize, DataTypes) {
  // Define the "shipment_locations" model
  return sequelize.define(
    "shipment_locations",
    {
      // Define the 'id' field for the 'shipment_locations' table
      id: {
        autoIncrement: true, // This will automatically increment the id for each new record
        type: DataTypes.INTEGER, // The id will be of type INTEGER
        allowNull: false, // The id cannot be NULL
        primaryKey: true, // The id will be the primary key of the table
      },
      // Define the 'shipment_id' field, which is a foreign key referencing the 'shipments' table
      shipment_id: {
        type: DataTypes.INTEGER, // The 'shipment_id' will be an INTEGER
        allowNull: true, // The 'shipment_id' can be NULL
        references: {
          model: "shipments", // This field refers to the 'shipments' model
          key: "id", // It references the 'id' field of the 'shipments' model
        },
      },
      // Define the 'latitude' field for storing the location's latitude
      latitude: {
        type: DataTypes.DECIMAL, // The latitude will be of type DECIMAL
        allowNull: false, // The 'latitude' cannot be NULL
      },
      // Define the 'longitude' field for storing the location's longitude
      longitude: {
        type: DataTypes.DECIMAL, // The longitude will be of type DECIMAL
        allowNull: false, // The 'longitude' cannot be NULL
      },
      // Define the 'timestamp' field for storing the timestamp when the location is recorded
      timestamp: {
        type: DataTypes.DATE, // The 'timestamp' will be of type DATE
        allowNull: true, // The 'timestamp' can be NULL
        defaultValue: Sequelize.Sequelize.literal("CURRENT_TIMESTAMP"), // Default to the current timestamp if not provided
      },
    },
    {
      // Additional options for the 'shipment_locations' model
      sequelize, // The Sequelize instance associated with this model
      tableName: "shipment_locations", // The name of the table in the database
      schema: "public", // The schema where the table is located (for PostgreSQL)
      timestamps: false, // This tells Sequelize not to automatically add 'createdAt' and 'updatedAt' columns
      indexes: [
        {
          name: "shipment_locations_pkey", // The name of the index
          unique: true, // The index will be unique, ensuring no duplicate values in the 'id' column
          fields: [
            { name: "id" }, // The field (column) to apply the index on
          ],
        },
      ],
    }
  );
};
