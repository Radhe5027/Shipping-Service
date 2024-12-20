// Import Sequelize to access Sequelize functionality and DataTypes
const Sequelize = require("sequelize");

// Export a function that defines the "shipments" model in Sequelize
module.exports = function (sequelize, DataTypes) {
  // Define the "shipments" model
  return sequelize.define(
    "shipments", // Model name
    {
      // Define the 'id' field for the 'shipments' table
      id: {
        autoIncrement: true, // Automatically increments the 'id' value for each new shipment
        type: DataTypes.INTEGER, // The 'id' will be an integer
        allowNull: false, // The 'id' cannot be NULL
        primaryKey: true, // This field will be the primary key for the table
      },
      // Define the 'tracking_id' field, which is unique for each shipment
      tracking_id: {
        type: DataTypes.STRING(100), // The 'tracking_id' will be a string of up to 100 characters
        allowNull: false, // The 'tracking_id' cannot be NULL
        unique: "shipments_tracking_id_key", // The 'tracking_id' must be unique across the table
      },
      // Define the 'sender_id' field, which is a foreign key referencing the 'users' table
      sender_id: {
        type: DataTypes.INTEGER, // The 'sender_id' will be an integer
        allowNull: true, // The 'sender_id' can be NULL (for cases where it's not specified)
        references: {
          model: "users", // This field refers to the 'users' table
          key: "id", // It references the 'id' field of the 'users' model
        },
      },
      // Define the 'sender_address' field for the sender's address
      sender_address: {
        type: DataTypes.TEXT, // The 'sender_address' will be a text field (can hold long text)
        allowNull: false, // The 'sender_address' cannot be NULL
      },
      // Define the 'sender_latitude' field for the sender's latitude
      sender_latitude: {
        type: DataTypes.DECIMAL, // The 'sender_latitude' will be a DECIMAL type for precision
        allowNull: false, // The 'sender_latitude' cannot be NULL
      },
      // Define the 'sender_longitude' field for the sender's longitude
      sender_longitude: {
        type: DataTypes.DECIMAL, // The 'sender_longitude' will be a DECIMAL type for precision
        allowNull: false, // The 'sender_longitude' cannot be NULL
      },
      // Define the 'reciver_name' field for the recipient's name
      reciver_name: {
        type: DataTypes.STRING(100), // The 'reciver_name' will be a string of up to 100 characters
        allowNull: false, // The 'reciver_name' cannot be NULL
      },
      // Define the 'reciver_address' field for the recipient's address
      reciver_address: {
        type: DataTypes.TEXT, // The 'reciver_address' will be a text field (can hold long text)
        allowNull: false, // The 'reciver_address' cannot be NULL
      },
      // Define the 'status' field for the shipment's current status
      status: {
        type: DataTypes.ENUM("Placed", "In Transit", "Delivered"), // The status can only be one of the three values
        allowNull: false, // The 'status' cannot be NULL
        defaultValue: "Placed", // The default value for the status is "Placed"
      },
    },
    {
      sequelize, // The Sequelize instance associated with this model
      tableName: "shipments", // The name of the table in the database
      schema: "public", // The schema where the table is located (for PostgreSQL)
      timestamps: true, // Automatically manage 'createdAt' and 'updatedAt' fields
      createdAt: "created_at", // Custom name for the 'createdAt' column
      updatedAt: "updated_at", // Custom name for the 'updatedAt' column
      indexes: [
        {
          name: "shipments_pkey", // The name of the index
          unique: true, // The index will be unique, ensuring no duplicate values in the 'id' column
          fields: [{ name: "id" }], // The 'id' field will be indexed
        },
        {
          name: "shipments_tracking_id_key", // The name of the index for 'tracking_id'
          unique: true, // The index will enforce uniqueness of the 'tracking_id'
          fields: [{ name: "tracking_id" }], // The 'tracking_id' field will be indexed
        },
      ],
    }
  );
};
